<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DevReportExport;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Participante;
use App\Models\ParticipanteCuestionario;


class ParticipantesController extends Controller
{
    function saveParticipante()
    {
        $mensajes = [
            'required'           => "required",
        ];

        $reglas = [
            'rfc'        => 'required',
            'curp'  => 'required',
            'nombre'  => 'required',
            'celular'  => 'required',
            'correo'  => 'required',
            'distrito'  => 'required',
            'unidad_medica'  => 'required',
            'sector'  => 'required',
            'perfil'  => 'required',
        ];

        $object = new Participante();
        
        $inputs = Input::all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "Error al registrar los datos"], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->rfc            = $inputs['rfc'];
            $object->curp           = $inputs['curp'];
            $object->nombre         = $inputs['nombre'];
            $object->celular        = $inputs['celular'];
            $object->correo         = $inputs['correo'];
            $object->distrito_id    = $inputs['distrito'];
            $object->unidad_medica    = $inputs['unidad_medica'];
            $object->sector_salud_id    = $inputs['sector'];
            $object->perfil_id    = $inputs['perfil'];

            $object->save();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    function saveCuestionario()
    {
        $mensajes = [
            'required'           => "required",
        ];

        $reglas = [
            'pregunta1'        => 'required',
            'pregunta2'        => 'required',
            'pregunta3'        => 'required',
            'pregunta4'        => 'required',
            'pregunta5'        => 'required',
            'pregunta6'        => 'required',
            'pregunta7'        => 'required',
            'pregunta8'        => 'required',
            'pregunta9'        => 'required',
            'pregunta10'        => 'required'
        ];

        $object = new ParticipanteCuestionario();
        
        $inputs = Input::all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "Error al registrar los datos"], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->participante_id       = $inputs['participante_id'];
            $object->pregunta_1            = $inputs['pregunta1'];
            $object->pregunta_2            = $inputs['pregunta2'];
            $object->pregunta_3            = $inputs['pregunta3'];
            $object->pregunta_4            = $inputs['pregunta4'];
            $object->pregunta_5            = $inputs['pregunta5'];
            $object->pregunta_6            = $inputs['pregunta6'];
            $object->pregunta_7            = $inputs['pregunta7'];
            $object->pregunta_8            = $inputs['pregunta8'];
            $object->pregunta_9            = $inputs['pregunta9'];
            $object->pregunta_10            = $inputs['pregunta10'];

            $object->save();
            
            $correctas = 0;
            if($inputs['pregunta1'] == 3){ $correctas++; }
            if($inputs['pregunta2'] == 4){ $correctas++; }
            if($inputs['pregunta3'] == 3){ $correctas++; }
            if($inputs['pregunta4'] == 3){ $correctas++; }
            if($inputs['pregunta5'] == 3){ $correctas++; }
            if($inputs['pregunta6'] == 2){ $correctas++; }
            if($inputs['pregunta7'] == 3){ $correctas++; }
            if($inputs['pregunta8'] == 4){ $correctas++; }
            if($inputs['pregunta9'] == 4){ $correctas++; }
            if($inputs['pregunta10'] == 3){ $correctas++; }
            
            $actualizacion = Participante::find($inputs['participante_id']);
            $actualizacion->calificacion = $correctas;
            $actualizacion->save();

            DB::commit();
            
            return response()->json($correctas,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    function verificarCuestionario()
    {
        try{
            $inputs = Input::all();
            $participante = Participante::find($inputs['participante']);
            $resultado = $participante->realizado;
            $participante->realizado = 1;
            $participante->save();
            return response()->json(['data'=>$resultado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    function actualizarParticipante()
    {
        try{
            $inputs = Input::all();
            $participante = Participante::find($inputs['participante']);
            if($inputs['video'] == 1)
            {
                $participante->video1 = 1;
            }else if($inputs['video'] == 2)
            {
                $participante->video2 = 1;
            }else if($inputs['video'] == 3)
            {
                $participante->video3 = 1;
            }else if($inputs['video'] == 4)
            {
                $participante->video4 = 1;
            }else if($inputs['video'] == 5)
            {
                $participante->video5 = 1;
            }else if($inputs['video'] == 6)
            {
                $participante->video6 = 1;
            }
            
            $participante->save();
            return response()->json(['data'=>$participante],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    function verificarAvance()
    {
        try{
            $inputs = Input::all();
            $participante = Participante::where("rfc", "=", $inputs['rfc'])->first();
           
            if($participante)
            {
                if($participante->realizado == 1 && $participante->calificacion <=7)
                {
                    $participante->realizado = 0;
                    $participante->calificacion = 0;
                    $participante->save();
                    ParticipanteCuestionario::where("participante_id", "=", $participante->id)->delete();
                }
            }
            return response()->json(['data'=>$participante],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    function verConstancia()
    {
        try{

            $inputs = Input::all();
            $participante = Participante::find($inputs['participante']);
           
            return response()->json(['data'=>$participante],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function exportExcel(Request $request){
        ini_set('memory_limit', '-1');

        try{
            
            $resultado = Participante::select("rfc", 
                                                "curp", 
                                                "nombre", 
                                                DB::RAW("(((video1+video2+video3+video4+video5+video6) / 6) * 100) as porcentaje_videos"),
                                                DB::RAW("if(realizado = 1, 'SI', 'NO') as examen_realizado"),
                                                DB::RAW("if(calificacion >= 8, 'SI', 'NO') as aprobado"))
                                        ->get();
            
            //return array_keys(collect($resultado[0])->toArray());
            $columnas = array_keys(collect($resultado[0])->toArray());

            $filename = $request->get('nombre_archivo');
            if(!$filename){
                $filename = 'reporte-dengue';
            }
            
            return (new DevReportExport($resultado,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }
}
