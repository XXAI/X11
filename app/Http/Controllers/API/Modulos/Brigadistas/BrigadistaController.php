<?php

namespace App\Http\Controllers\API\Modulos\Brigadistas;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Brigadista\Brigadista;
use App\Models\Brigadista\RelBrigadistaMes;
use Carbon\Carbon;

class BrigadistaController extends Controller
{
    public function index(Request $request)
    {
        try{
            $parametros = $request->all();
            $fecha = Carbon::now();
            $obj = Brigadista::with(['mes'=>function($query) use ($fecha){
                $query->where('mes', $fecha->month);
            }]);
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $obj = $obj->paginate($resultadosPorPagina);
            }

            $totales = RelBrigadistaMes::whereNull("deleted_at")
                                    ->where("mes", $fecha->month)
                                    ->select(DB::RAW("sum(brigadista) as total_brigadista"),
                                    DB::RAW("sum(vacunador) as total_vacunador"),
                                    DB::RAW("sum(dengue) as total_dengue"))->get();


            return response()->json(['data'=>$obj, "totales"=> $totales],HttpResponse::HTTP_OK);
            
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            $parametros = $request->all();
            $fecha = Carbon::now();
            $obj = Brigadista::with('mes')->find($id);
            
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
            
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function store(Request $request)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        
        $reglas = [];

        $reglas = [
            'descripcion'           => 'required',
        ];
        
        DB::beginTransaction();
        $object = new Brigadista();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        try {
                $fecha_actual = Carbon::now();
                $object->descripcion    = $inputs['descripcion'];
                $object->anio           = $fecha_actual->year;
                $object->save();

                for ($i=1; $i <=12 ; $i++) { 
                    $object2 = new RelBrigadistaMes();
                    $object2->brigadista_id = $object->id;
                    $object2->mes           = $i;
                    $object2->brigadista    = $inputs['brigadista_'.$i];
                    $object2->vacunador     = $inputs['vacunacion_'.$i];
                    $object2->dengue        = $inputs['dengue_'.$i];
                    $object2->save();
                }
                
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function update(Request $request, $id)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        
        $reglas = [];

        $reglas = [
            'descripcion'           => 'required',
        ];
        
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        try {
            
            DB::beginTransaction();
            $object = Brigadista::find($id);
            $object->descripcion    = $inputs['descripcion'];
            $object->save();

            for ($i=1; $i <=12 ; $i++) { 
                $object2 = RelBrigadistaMes::where("brigadista_id", $id)->where("mes", $i)->first();
                $object2->brigadista    = $inputs['brigadista_'.$i];
                $object2->vacunador     = $inputs['vacunacion_'.$i];
                $object2->dengue        = $inputs['dengue_'.$i];
                $object2->save();
            }
                
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function destroy(Request $request, $id)
    {
        
        $obj_detalle    = RelBrigadistaMes::where("brigadista_id", $id)->delete();
        $obj            = Brigadista::find($id);
        
        //$object = Cr::find($id);
        if(!$obj){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        
        DB::beginTransaction();
        try {
            
            $obj->delete();
    
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }
}
