<?php

namespace App\Http\Controllers\API\Modulos\OPD;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\OPD\opd;
use Carbon\Carbon;

class OpdController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $clues = opd::getModel();
            if(!$access->is_admin){
                $clues = $clues->whereIn("clues",$access->lista_clues);
            }
            $clues = $clues->whereIn("jurisdiccion_id",[1,2,3,4,5,6,7,8,9,10]);
            
            if(isset($parametros['query'])){
                $clues = $clues->where(function($query)use($parametros){
                    return $query->where('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre_unidad','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('municipio','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('localidad','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $clues = $clues->orderBy('clues');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $clues = $clues->paginate($resultadosPorPagina);
            }
            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show($id, Request $request)
    {
        try{
            $obj = opd::find($id);          
            
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }


    public function update($id,Request $request)
    {
        
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'clues'                      => 'required',
            'municipio'                  => 'required',
            'localidad'                  => 'required',
            'jurisdiccion_id'            => 'required',
            'nivel_atencion'             => 'required',
            'tipo_establecimiento'       => 'required',
            'nombre_unidad'              => 'required',
            'vialidad'                   => 'required',
            'tipologia'                  => 'required',
            'responsable'                => 'required',
            
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $obj = opd::find($id);
            $obj = new Clues();
            $obj->clues                         = $inputs['clues'];
            $obj->municipio                     = $inputs['municipio'];
            $obj->localidad                     = $inputs['localidad'];
            $obj->jurisdiccion                  = $inputs['jurisdiccion'];
            $obj->nivel_atencion                = $inputs['nivel_atencion'];
            $obj->tipo_establecimiento          = $inputs['tipo_establecimiento'];
            $obj->nombre_unidad                 = $inputs['nombre_unidad'];
            $obj->vialidad                      = $inputs['vialidad'];
            $obj->tipologia                     = $inputs['tipologia'];
            $obj->responsable                   = $inputs['responsable'];
            $obj->save();
            
            $obj->save();
            
            //Crea el movimiento
            $fecha_actual = Carbon::now();
            $loggedUser = auth()->userOrFail();
            MovimientoCluesCr::create([
                'fecha_movimiento' => $fecha_actual->format("Y-m-d"),
                'user_id' => $loggedUser->id,
                'clues_before' => $inputs['clues'],
                'clues_after' => $inputs['clues'],
                'cr_before' => $inputs['cr'],
                'cr_after' => $inputs['cr'],
                'descripcion_before' => $inputs['descripcion'],
                'descripcion_after' => $inputs['descripcion'],
                'descripcion' => "creacion de nueva unidad"
            ]);
                    
               
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function destroy(Request $request, $id)
    {
        
        $obj_actual = Cr::find($id);
        
        //$object = Cr::find($id);
        if(!$obj_actual){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        
        DB::beginTransaction();
        try {
            
            $obj = opd::find($id);
            $obj->delete();
            DB::commit();
            
            return response()->json($obj_actual,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function RegistroImpreso(Request $request, $id)
    {
        $loggedUser = auth()->userOrFail();
        try{
            $parametros = $request->all();
            $carbon = Carbon::now();
            $obj = opd::find($id);
            if($parametros['params'] == 1)
            {
                $obj->impresion_anexo_1_2 = 1;
                $obj->fecha_impresion_anexo_1_2 = $carbon;    
            }else if($parametros['params'] == 2)
            {
                $obj->impresion_anexo_3 = 1;
                $obj->fecha_impresion_anexo_3 = $carbon;
            }
            $obj->save();
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        $loggedUser->load('gruposUnidades.listaCR');
        
        $lista_cr = [];
        $lista_clues = [];
        
        foreach ($loggedUser->gruposUnidades as $grupo) {
            $lista_unidades = $grupo->listaCR->pluck('clues','cr')->toArray();
            
            $lista_clues += $lista_clues + array_values($lista_unidades);
        }

        $accessData = (object)[];
        $accessData->lista_clues = $lista_clues;

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
