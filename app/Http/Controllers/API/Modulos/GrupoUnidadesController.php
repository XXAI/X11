<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\GrupoUnidades;

class GrupoUnidadesController extends Controller
{
    public function index()
    {
        try{
            $parametros = Input::all();
            $grupos = GrupoUnidades::orderBy('descripcion');

            $elementos_por_grupo = DB::table('rel_clues_grupo_unidades')
                   ->select('*', DB::raw('count(distinct cr_id) as conteo_elementos'))
                   ->whereNull('deleted_at')
                   ->groupBy('grupo_unidades_id');

            $grupos = $grupos->leftJoinSub($elementos_por_grupo, 'clues_grupo_unidades', function ($join) {
                            $join->on('grupos_unidades.id', '=', 'clues_grupo_unidades.grupo_unidades_id');
                        })->select('grupos_unidades.*','clues_grupo_unidades.conteo_elementos');
            
            if(isset($parametros['query'])){
                $grupos = $grupos->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $grupos = $grupos->paginate($resultadosPorPagina);
            }else{
                $grupos = $grupos->get();
            }

            return response()->json(['data'=>$grupos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function show($id)
    {
        try{
            $profesion = GrupoUnidades::find($id);
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

        $inputs = Input::all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->descripcion            = $inputs['descripcion'];
            $object->tipo_profesion_id      = $inputs['tipo_profesion_id'];

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
        
        $inputs = Input::all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $object->descripcion            = $inputs['descripcion'];
            $object->tipo_profesion_id      = $inputs['tipo_profesion_id'];

            $object->save();
    
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function finalizarCaptura($grupoID = null){
        DB::beginTransaction();
        try {
            
            if(!$grupoID){
                $loggedUser = auth()->userOrFail();
                $loggedUser->load('gruposUnidades');
    
                foreach ($loggedUser->gruposUnidades as $grupo) {
                    $grupo->finalizado = 1;
                    $grupo->save();
                }
    
            }

            DB::commit();
            return response()->json(['finalizado'=>true,'grupos'=>$loggedUser->gruposUnidades],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
        }
    }
}
