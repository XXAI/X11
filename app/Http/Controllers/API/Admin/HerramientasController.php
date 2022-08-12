<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use \Validator,\Hash, \Response, \DB, \Storage, \File;
use App\Models\importarDB;

class HerramientasController extends Controller
{
    public function UploadDB(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
      
        try{  
            $parametros = $request->all();
            $loggedUser = auth()->userOrFail();
            $folder = "DB";
            $archivo = "importar_DB_".$loggedUser->id.".csv";
            
            if($request->hasFile('archivo')) {
                $extension = $request->file('archivo')->getClientOriginalExtension();
                if($extension == "csv" || $extension == "CSV")
                {
                    Storage::disk('public')->put($folder."\\".$archivo , File::get($request->file("archivo")));
                }else{
                    return response()->json(['error' => "Formato de archivo incorrento,extensión csv requerida, favor de verificar" ], HttpResponse::HTTP_CONFLICT);
                }
                return response()->json(['data'=>''],HttpResponse::HTTP_OK);
            }else
            {
               return response()->json(['error'=>['message'=>"Error en archivo"]], HttpResponse::HTTP_CONFLICT);
            }
            //importarDB::forceDelete();
            
            return response()->json(['data'=>1],HttpResponse::HTTP_OK);
            
        }catch(\Exception $e){

            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function CargarBase(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
      
        try{  
            $parametros = $request->all();
            $loggedUser = auth()->userOrFail();
            $folder = "DB";
            $archivo = "importar_DB_".$loggedUser->id.".csv";
           
            //importarDB::forceDelete();
            
            
            //Importamos el archivo
            $archivo_csv = storage_path().'/app/public/'.$folder."\\".$archivo;
            $data = \Excel::toArray('', $archivo_csv, null, \Maatwebsite\Excel\Excel::TSV)[0];
            $registros = [];
            foreach ($data as $key => $value) {
                print_r($data);
                $indice = count($registros);
                $registros[$indice]['rfc_nomina']               = ($value[0] == null)?'':$value[0];
                $registros[$indice]['curp_nomina']              = ($value[1] == null)?'':$value[1];
                $registros[$indice]['nombre_nomina']            = ($value[2] == null)?'':$value[2];
                
                $registros[$indice]['fecha_ingreso']            = ($value[3] == null)?'':$value[3];
                $registros[$indice]['fecha_ingreso_federal']    = ($value[4] == null)?'':$value[4];
                $registros[$indice]['codigo_puesto_id']         = ($value[5] == null)?'':$value[5];
                $registros[$indice]['rama']                     = ($value[6] == null)?'':$value[6];
                $registros[$indice]['clave_presupuestal']       = ($value[7] == null)?'':$value[7];
                $registros[$indice]['fuente_financiamiento']    = ($value[8] == null)?'':$value[8];
                $registros[$indice]['clues_adscripcion_nomina'] = ($value[9] == null)?'':$value[9];
                $registros[$indice]['ur']                       = ($value[10] == null)?'':$value[10];
                $registros[$indice]['cr_nomina_id']             = ($value[11] == null)?'':$value[11];
                
            }
            unset($registros[0]); //Eliminamos la cabecera para que no se importe
            foreach ($registros as $key => $value) {
                importarDB::create($value);        
            }


            //Validamos fechas
/*            DB::statement("UPDATE `rel_trabajador_datos_laborales_nomina` r1, `importar_nomina` r2 
            SET r1.`clave_presupuestal`=r2.`clave_presupuestal`,
            r1.`codigo_puesto_id`=r2.`codigo_puesto_id`,
            r1.`rama`=r2.`rama`,
            r1.`fuente_financiamiento`=r2.`fuente_financiamiento`,
            r1.`clues_adscripcion_nomina`=r2.`clues_adscripcion_nomina` ,
            r1.`ur`=r2.`ur`,
            r1.`cr_nomina_id`=r2.`cr_nomina_id`,  
            r1.`curp_nomina`=r2.`curp_nomina`,
            r1.`nombre_nomina`=r2.`nombre_nomina`,
            WHERE r1.`rfc_nomina`=r2.`rfc_nomina`");
*/ 
            DB::statement("UPDATE `rel_trabajador_datos_laborales_nomina` r1, `importar_nomina` r2 
            SET r1.`clave_presupuestal`=r2.`clave_presupuestal`,
            r1.`codigo_puesto_id`=r2.`codigo_puesto_id`,
            r1.`clues_adscripcion_nomina`=r2.`clues_adscripcion_nomina` ,
            r1.`ur`=r2.`ur`,
            r1.`cr_nomina_id`=r2.`cr_nomina_id`,  
            r1.`curp_nomina`=r2.`curp_nomina`,
            r1.`nombre_nomina`=r2.`nombre_nomina`
            WHERE r1.`rfc_nomina`=r2.`rfc_nomina`");

            return response()->json(['data'=>$registros],HttpResponse::HTTP_OK);
            
        }catch(\Exception $e){

            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
