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
            DB::statement("UPDATE rel_trabajador_datos_laborales_nomina r1, 
            __tmp_nomina_".$usuario->id." r2 
            SET 
            r1.curp_nomina=r2.curp_nomina,
            r1.nombre_nomina=r2.nombre_nomina,
            r1.ur=r2.ur,
            r1.tipo_personal=r2.tipo_personal,
            r1.programa=r2.programa,
            r1.codigo_puesto_id=r2.codigo_puesto_id,
            r1.descripcion_puesto=r2.descripcion_puesto,
            r1.rama=r2.rama,
            r1.clave_presupuestal=r2.clave_presupuestal,
            r1.ze=r2.ze,
            r1.fecha_ingreso_federal=r2.fecha_ingreso_federal,
            r1.fecha_ingreso=r2.fecha_ingreso,
            r1.cr_nomina_id=r2.cr_nomina_id, 
            r1.clues_adscripcion_nomina=r2.clues_adscripcion_nomina,
            r1.quincena=r2.quincena,
            r1.anio=r2.anio 
            WHERE r1.rfc_nomina=r2.rfc_nomina");

            //insertamos los que no hacen match con los datos que entran
            DB::statement("INSERT INTO rel_trabajador_datos_laborales_nomina (rfc_nomina, curp_nomina, nombre_nomina, ur, tipo_personal, programa, codigo_puesto_id, descripcion_puesto, rama, clave_presupuestal, ze, fecha_ingreso_federal, fecha_ingreso, cr_nomina_id, clues_adscripcion_nomina, quincena, anio)
            SELECT rfc_nomina, curp_nomina, nombre_nomina, ur, tipo_personal, programa, codigo_puesto_id, descripcion_puesto, rama, clave_presupuestal, ze, fecha_ingreso_federal, fecha_ingreso, cr_nomina_id, clues_adscripcion_nomina, quincena, anio FROM __tmp_nomina_".$usuario->id." WHERE rfc_nomina NOT IN 
            (SELECT rfc_nomina FROM rel_trabajador_datos_laborales_nomina)");

            //actualizamos el id de los nuevos trabajadores
            DB::statement("UPDATE rel_trabajador_datos_laborales_nomina r1, trabajador t SET r1.trabajador_id=t.id WHERE r1.rfc_nomina= t.rfc");

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
            
            $obj = DB::TABLE("trabajador as t")
                ->leftJoin("catalogo_sexo as cs", "t.sexo_id", "cs.id")
                ->leftJoin("catalogo_pais_nacimiento as cn", "t.pais_nacimiento_id", "cn.id")
                ->leftJoin("catalogo_entidad_nacimiento as cen", "t.entidad_nacimiento_id", "cen.id")
                ->leftJoin("rel_trabajador_datos_laborales as rdl", "t.id", "rdl.trabajador_id")
                ->leftJoin("catalogo_clues as cc", "cc.clues", "rdl.clues_adscripcion_fisica")
                ->leftJoin("catalogo_cr as ccr", "ccr.cr", "rdl.cr_fisico_id")
                ->leftJoin("rel_trabajador_datos_laborales_nomina as rdln", "t.id", "rdln.trabajador_id")
                ->leftJoin("catalogo_tipo_nomina as ctn", "ctn.id", "rdln.tipo_nomina_id")
                ->leftJoin("catalogo_tipo_contrato as ctc", "ctc.id", "rdln.tipo_contrato_id")
                ->leftJoin("catalogo_codigo as cco", "cco.codigo", "rdln.codigo_puesto_id")
                ->leftJoin("catalogo_area_trabajo as ca", "ca.id", "rdl.area_trabajo_id")
                ->leftJoin("catalogo_rama as cr", "cr.id", "rdl.rama_id")
                ->leftJoin("catalogo_grado_academico as cna", "cna.id", "t.nivel_maximo_id")
                ->leftJoin("catalogo_jornada as cj", "cj.id", "rdl.jornada_id")
                ->where("t.estatus", 1)
                ->where("t.validado", 1)
                ->where("t.actualizado", 1)
                ->whereNull("t.deleted_at")
                ->select(
                    "t.rfc",
                    "t.curp",
                    "t.nombre",
                    "t.apellido_paterno",
                    "t.apellido_materno",
                    "cs.descripcion as sexo",
                    "t.telefono_celular",
                    "t.correo_electronico",
                    DB::RAW("REPLACE(t.calle, '\"', '') AS calle"),
                    "t.no_exterior",
                    "t.no_interior",
                    DB::RAW("REPLACE(t.colonia, '\"', '') AS colonia"),
                    "t.cp",
                    "cn.descripcion as nacionalidad",
                    "cen.descripcion as estado_nacimiento",
                    "rdl.fecha_ingreso",
                    "rdl.fecha_ingreso_federal",
                    "rdln.ur",
                    DB::RAW("REPLACE(rdl.clues_adscripcion_fisica, '\"', '') AS clues_adscripcion_fisica"),
                    DB::RAW("REPLACE(cc.nombre_unidad, '\"', '') AS nombre_unidad"),
                    "rdl.cr_fisico_id as cr_fisico",
                    "rdln.clues_adscripcion_nomina as clues_nomina",
                    "rdln.cr_nomina_id as cr_nomina",
                    DB::RAW("(SELECT IF(Count(0) > 1, 'SI', 'N0') FROM rel_trabajador_comision xx WHERE  xx.trabajador_id = t.id AND xx.estatus = 'A') AS comision"),
                    DB::RAW(" (SELECT xx.tipo_comision_id FROM   rel_trabajador_comision xx WHERE  xx.trabajador_id = t.id AND xx.estatus = 'A' LIMIT  1) AS tipo_comision"),
                    DB::RAW("REPLACE(ccr.descripcion, '\"', '') AS cr"),
                    DB::RAW("REPLACE(ctn.descripcion, '\"', '')  AS nomina"),
                    "rdln.codigo_puesto_id",
                    DB::RAW("REPLACE(cco.descripcion, '\"', '')  AS codigo"),
                    DB::RAW("REPLACE(ca.descripcion, '\"', '')  AS area_trabajo"),
                    DB::RAW("REPLACE(rdl.actividades, '\"', '')  AS actividades"),
                    DB::RAW("REPLACE(cr.descripcion, '\"', '')  AS rama"),
                    DB::RAW("REPLACE(cna.descripcion, '\"', '')  AS nivel_academico"),
                    "cj.descripcion AS jornada",
                    DB::RAW("(SELECT `rel_trabajador_horario`.`entrada` FROM   `rel_trabajador_horario` WHERE  `rel_trabajador_horario`.`trabajador_id` = `t`.`id` AND `rel_trabajador_horario`.`deleted_at` IS NULL LIMIT  1) AS `entrada`"),
                    DB::RAW("(SELECT `rel_trabajador_horario`.`salida` FROM   `rel_trabajador_horario` WHERE  `rel_trabajador_horario`.`trabajador_id` = `t`.`id` AND `rel_trabajador_horario`.`deleted_at` IS NULL LIMIT  1) AS `salida`"),
                    DB::RAW("(SELECT IF(`catalogo_profesion`.`descripcion` <> '', `catalogo_profesion`.`descripcion`, (SELECT `rel_trabajador_escolaridad`.`otro_nombre_estudio` FROM `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039851 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) FROM   `catalogo_profesion` WHERE  `catalogo_profesion`.`clave_sinergias` = (SELECT `rel_trabajador_escolaridad`.`nombre_estudio_id`FROM `rel_trabajador_escolaridad` WHERE `rel_trabajador_escolaridad`.`grado_academico_id` = 2039851 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) AS `licenciatura`"),
                    DB::RAW("(SELECT `rel_trabajador_escolaridad`.`no_cedula` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039851 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1) AS `licenciatura_cedula`"),
                    DB::RAW("(SELECT IF(`catalogo_profesion`.`descripcion` <> '', `catalogo_profesion`.`descripcion`, (SELECT `rel_trabajador_escolaridad`.`otro_nombre_estudio` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039852 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) FROM   `catalogo_profesion` WHERE  `catalogo_profesion`.`clave_sinergias` = (SELECT `rel_trabajador_escolaridad`.`nombre_estudio_id` FROM `rel_trabajador_escolaridad` WHERE `rel_trabajador_escolaridad`.`grado_academico_id` = 2039852 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) AS `maestria`"),
                    DB::RAW("(SELECT `rel_trabajador_escolaridad`.`no_cedula` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039852 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1) AS `maestria_cedula`"),
                    DB::RAW("(SELECT IF(`catalogo_profesion`.`descripcion` <> '', `catalogo_profesion`.`descripcion`, (SELECT `rel_trabajador_escolaridad`.`otro_nombre_estudio` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039853 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) FROM   `catalogo_profesion` WHERE  `catalogo_profesion`.`clave_sinergias` = (SELECT `rel_trabajador_escolaridad`.`nombre_estudio_id` FROM `rel_trabajador_escolaridad` WHERE `rel_trabajador_escolaridad`.`grado_academico_id` = 2039853 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) AS `doctorado`"),
                    DB::RAW("(SELECT `rel_trabajador_escolaridad`.`no_cedula` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039853 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1) AS `doctorado_cedula`"),
                    DB::RAW("(SELECT IF(`catalogo_profesion`.`descripcion` <> '', `catalogo_profesion`.`descripcion`, (SELECT `rel_trabajador_escolaridad`.`otro_nombre_estudio` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` IN ( 2039854, 2039856 ) AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) FROM   `catalogo_profesion` WHERE  `catalogo_profesion`.`clave_sinergias` = (SELECT `rel_trabajador_escolaridad`.`nombre_estudio_id` FROM `rel_trabajador_escolaridad` WHERE `rel_trabajador_escolaridad`.`grado_academico_id` IN ( 2039854, 2039856 ) AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) AS `especialidad`"),
                    DB::RAW("(SELECT `rel_trabajador_escolaridad`.`no_cedula` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039853 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1) AS `especialidad_cedula`"),
                    DB::RAW("(SELECT IF(`catalogo_profesion`.`descripcion` <> '', `catalogo_profesion`.`descripcion`, (SELECT `rel_trabajador_escolaridad`.`otro_nombre_estudio` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` IN ( 2039849, 2039850 ) AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) FROM   `catalogo_profesion` WHERE  `catalogo_profesion`.`clave_sinergias` = (SELECT `rel_trabajador_escolaridad`.`nombre_estudio_id` FROM `rel_trabajador_escolaridad` WHERE `rel_trabajador_escolaridad`.`grado_academico_id` IN ( 2039849, 2039850 ) AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1)) AS `tecnica`"),
                    DB::RAW("(SELECT `rel_trabajador_escolaridad`.`no_cedula` FROM   `rel_trabajador_escolaridad` WHERE  `rel_trabajador_escolaridad`.`grado_academico_id` = 2039853 AND `rel_trabajador_escolaridad`.`trabajador_id` = `t`.`id` AND `rel_trabajador_escolaridad`.`deleted_at` IS NULL LIMIT  1) AS `tecnica_cedula`"),
                    DB::RAW("IF(`rdln`.`basificados` = 1, 'SI', IF(`rdln`.`ur` = '420_OPD','SI','NO')) AS `OPD`")
                    )
                ->get();

      
            // $columnas = array_keys(collect($obj[0])->toArray());

            // if(isset($parametros['nombre_archivo']) && $parametros['nombre_archivo']){
            //     $filename = $parametros['nombre_archivo'];
            // }else{
            //     $filename = 'reporte-personal-activo';
            // }
            //echo "hola";
            //exit;
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
            //return (new DevReportExport($obj,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }

}
