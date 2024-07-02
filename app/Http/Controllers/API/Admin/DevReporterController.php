<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

use App\Exports\DevReportExport;

use Illuminate\Support\Facades\Input;

use \DB;
use App\Models\ImportacionNomina;
use Carbon\Carbon;

class DevReporterController extends Controller
{
    public function executeQuery(Request $request){
        ini_set('memory_limit', '-1');

        try{
            //$nombre_archivo = $request->get('nombre_archivo');
            DB::enableQueryLog();

            $query = $request->get('query');

            if (preg_match('/\b(DELETE|DROP|TRUNCATE|ALTER|UPDATE)\b/',strtoupper($query)) != 0){
                return response()->json(['error' => 'Solo se permiten SELECTs'], HttpResponse::HTTP_CONFLICT);
            }

            $limit = $request->get('limit');
            if(!$limit){
                $limit = 100;
            }

            $query .= ' limit '.$limit;

            $resultado = DB::select($query);

            $columnas = array_keys(collect($resultado[0])->toArray());

            $query_log = DB::getQueryLog();

            return response()->json(['data'=>$resultado, 'columns'=>$columnas, 'exec_time'=>$query_log[0]['time']],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function exportExcel(Request $request){
        ini_set('memory_limit', '-1');

        try{
            $query = $request->get('query');

            if (preg_match('/\b(DELETE|DROP|TRUNCATE|ALTER|UPDATE)\b/',strtoupper($query)) != 0){
                return response()->json(['error' => 'Solo se permiten SELECTs'], HttpResponse::HTTP_CONFLICT);
            }

            $resultado = DB::select($query);

            $columnas = array_keys(collect($resultado[0])->toArray());

            $filename = $request->get('nombre_archivo');
            if(!$filename){
                $filename = 'reporte';
            }
            
            return (new DevReportExport($resultado,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function importarNomina(Request $request)
    {
        try {
            $usuario = auth()->userOrFail();
            $inputs = $request->all();
            $inputs = $inputs['params'];
            DB::beginTransaction();
            //DB::statement("truncate table __tmp_nomina_".$usuario->id);
            
            DB::statement("CREATE TEMPORARY TABLE __tmp_nomina_".$usuario->id." ( 
            rfc_nomina VARCHAR(15), 
            curp_nomina VARCHAR(20), 
            nombre_nomina VARCHAR(150), 
            ur VARCHAR(50), 
            tipo_personal  VARCHAR(100), 
            programa  VARCHAR(150), 
            codigo_puesto_id  VARCHAR(50), 
            descripcion_puesto  VARCHAR(150), 
            rama  VARCHAR(50), 
            clave_presupuestal VARCHAR(100), 
            ze VARCHAR(10), 
            fecha_ingreso_federal date, 
            fecha_ingreso date, 
            cr_nomina_id varchar(20), 
            clues_adscripcion_nomina varchar(20), 
            quincena smallint unsigned, 
            anio smallint unsigned)");

            foreach ($inputs['datos'] as $key => $value) {
                DB::TABLE("__tmp_nomina_".$usuario->id)->insert($value);
            }
            
            $duplicados = DB::TABLE("__tmp_nomina_".$usuario->id)->groupBy("rfc_nomina")->havingRaw("count(*)>1")->get();
            if(count($duplicados) > 0){
                DB::rollback();
                return response()->json(['duplicado' => $duplicados], HttpResponse::HTTP_CONFLICT);    
            }

            //Empieza la actualización
            //actualizamos los que hacen match con la base que entra
            DB::statement("UPDATE `rel_trabajador_datos_laborales_nomina` r1, 
            __tmp_nomina_".$usuario->id." r2 
            SET 
            r1.`curp_nomina`=r2.`curp_nomina`,
            r1.`nombre_nomina`=r2.`nombre_nomina`,
            r1.`ur`=r2.`ur`,
            r1.`tipo_personal`=r2.`tipo_personal`,
            r1.`programa`=r2.`programa`,
            r1.`codigo_puesto_id`=r2.`codigo_puesto_id`,
            r1.`descripcion_puesto`=r2.`descripcion_puesto`,
            r1.`rama`=r2.`rama`,
            r1.`clave_presupuestal`=r2.`clave_presupuestal`,
            r1.`ze`=r2.`ze`,
            r1.`fecha_ingreso_federal`=r2.`fecha_ingreso_federal`,
            r1.`fecha_ingreso`=r2.`fecha_ingreso`,
            r1.`cr_nomina_id`=r2.`cr_nomina_id`, 
            r1.`clues_adscripcion_nomina`=r2.`clues_adscripcion_nomina`,
            r1.`quincena`=r2.`quincena`,
            r1.`anio`=r2.`anio` 
            WHERE r1.`rfc_nomina`=r2.`rfc_nomina`");

            //insertamos los que no hacen match con los datos que entran
            DB::statement("INSERT INTO rel_trabajador_datos_laborales_nomina (rfc_nomina, curp_nomina, nombre_nomina, ur, tipo_personal, programa, codigo_puesto_id, descripcion_puesto, rama, clave_presupuestal, ze, fecha_ingreso_federal, fecha_ingreso, cr_nomina_id, clues_adscripcion_nomina, quincena, anio)
            SELECT rfc_nomina, curp_nomina, nombre_nomina, ur, tipo_personal, programa, codigo_puesto_id, descripcion_puesto, rama, clave_presupuestal, ze, fecha_ingreso_federal, fecha_ingreso, cr_nomina_id, clues_adscripcion_nomina, quincena, anio FROM __tmp_nomina_".$usuario->id." WHERE rfc_nomina NOT IN 
            (SELECT rfc_nomina FROM rel_trabajador_datos_laborales_nomina)");

            //actualizamos el id de los nuevos trabajadores
            DB::statement("UPDATE `rel_trabajador_datos_laborales_nomina` r1, trabajador t SET r1.`trabajador_id`=t.`id` WHERE r1.`rfc_nomina`= t.`rfc`");

            //Insertamos en el registro principal
            ImportacionNomina::where("anio", $inputs['anio'])->where("quincena", $inputs['quincena'])->delete();
            $registro = new ImportacionNomina();
            $registro->archivo =$inputs['nombre'];
            $registro->peso = $inputs['peso'];
            $registro->registros = $inputs['registros'];
            $registro->anio = $inputs['anio'];
            $registro->quincena = $inputs['quincena'];
            $registro->fecha = new Carbon();
            $registro->user_id =$usuario->id;
            $registro->save();

            DB::commit();
            //DB::TABLE("__tmp_nomina_".$usuario->id)->insertOrIgnore($inputs['datos']);
           
            return response()->json(['data'=>$inputs['datos']],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function exportarNominaSistamtizacion(Request $request)
    {
        try{
            ini_set('memory_limit', '-1');
            
            $obj = DB::TABLE("reporte_sistematizacion")->get();
           
            $columnas = array_keys(collect($obj[0])->toArray());

            if(isset($parametros['nombre_archivo']) && $parametros['nombre_archivo']){
                $filename = $parametros['nombre_archivo'];
            }else{
                $filename = 'reporte-personal-activo';
            }
            //echo "hola";
            //exit;
            return (new DevReportExport($obj,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

}
