<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

//use App\Models\Empleado;
//use App\Models\EmpleadoEscolaridad;
use App\Models\Profesion;
/*use App\Models\Cr;
use App\Models\Rama;
use App\Models\PermutaAdscripcion;
use App\Models\CluesEmpleado;
use App\Models\User;*/

class ProfesionesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $parametros = $request->all();
            $profesiones = Profesion::with('tipoProfesion','rama')->orderBy('tipo_profesion_id')->orderBy('descripcion');
            
            if(isset($parametros['query'])){
                $profesiones = $profesiones->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $profesiones = $profesiones->paginate($resultadosPorPagina);
            }

            return response()->json(['data'=>$profesiones],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function show($id)
    {
        try{
            $profesion = Profesion::find($id);
            return response()->json(['data'=>$profesion],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $mensajes = [
            'required'           => "required",
        ];

        $reglas = [
            'descripcion'        => 'required',
            'tipo_profesion_id'  => 'required',
        ];

        $object = Profesion::find($id);
        //return response()->json($object,HttpResponse::HTTP_OK);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->descripcion            = $inputs['descripcion'];
            $object->tipo_profesion_id      = $inputs['tipo_profesion_id'];
            $object->rama_id                = $inputs['rama_id'];

            $object->save();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * sTORE the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $mensajes = [
            'required'           => "required",
        ];

        $reglas = [
            'descripcion'        => 'required',
            'tipo_profesion_id'  => 'required',
        ];

        $object = new Profesion();
        
        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->descripcion            = $inputs['descripcion'];
            $object->tipo_profesion_id      = $inputs['tipo_profesion_id'];
            $object->rama_id                = $inputs['rama_id'];

            $object->save();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
}
