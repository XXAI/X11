<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Cr;
use App\Models\Clues;
use App\Models\RelDatosLaborales;
use App\Models\Catalogos\Clues\MovimientoCluesCr;
use Carbon\Carbon;

class CluesController extends Controller
{
    public function index(Request $request)
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $clues = Cr::with("clues")->whereNull("deleted_at");

            /*if(!$access->is_admin){
                $clues = $clues->whereIn('clues', $access->lista_clues);
            }*/
            
            if(isset($parametros['query'])){
                $clues = $clues->where(function($query)use($parametros){
                    return $query->where('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('cr','LIKE','%'.$parametros['query'].'%');
                });
            }
            
            if(isset($parametros['page'])){
                $clues = $clues->orderBy('cr');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $clues = $clues->paginate($resultadosPorPagina);
            }

            


            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function show($id)
    {
        try{
            $access = $this->getUserAccessData();
            $clues = Cr::with("clues", "dependencia")->find($id);
            
            return response()->json(['data'=>$clues],HttpResponse::HTTP_OK);
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
    public function store(Request $request)
    {
        
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'tipo_unidad'                => 'required',
            'cve_jurisdiccion'           => 'required',
            'clues'                      => 'required',
            'cr'                         => 'required',
            'descripcion'                => 'required',
            'ze'                         => 'required',
            'municipio'                  => 'required',
            'telefono'                   => 'required',
            'direccion'                  => 'required',
            'cr_dependencia'             => 'required',
            
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $clasificacion = Clues::where("clasificacion_descripcion", $inputs['clasificacion'])->first();
            $clasificacion_texto = "";
            if($clasificacion != null)
            {
                $clasificacion_texto = $clasificacion->clasificacion;
            }
            
            //Hacemos la actualizacion de la unidad
            $obj_nuevo_clues = new Clues();
            $obj_nuevo_clues->clues                         = $inputs['clues'];
            $obj_nuevo_clues->cve_jurisdiccion              = $inputs['tipo_unidad'];
            $obj_nuevo_clues->nombre_unidad                 = $inputs['descripcion'];
            $obj_nuevo_clues->clasificacion                 = $clasificacion_texto;
            $obj_nuevo_clues->clasificacion_descripcion     = $inputs['clasificacion'];

            $obj_nuevo = new Cr();
            $obj_nuevo->cr                         = $inputs['cr'];
            $obj_nuevo->descripcion                = $inputs['descripcion'];
            $obj_nuevo->clues                      = $inputs['clues'];
            $obj_nuevo->registrada                 = $inputs['tipo_unidad'];
            $obj_nuevo->area                       = "";
            $obj_nuevo->descripcion_actualizada    = $inputs['descripcion'];
            $obj_nuevo->ze                         = $inputs['ze'];
            $obj_nuevo->municipio                  = $inputs['municipio'];
            $obj_nuevo->telefono                   = $inputs['telefono'];
            $obj_nuevo->direccion                  = $inputs['direccion'];
            $obj_nuevo->cr_dependencia             = $inputs['cr_dependencia']['cr'];
            $obj_nuevo->save();
            
            
            
            $obj_nuevo_clues->save();
            
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
            
            return response()->json($obj_nuevo,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'tipo_unidad'                => 'required',
            'cve_jurisdiccion'           => 'required',
            'clues'                      => 'required',
            'cr'                         => 'required',
            'descripcion'                => 'required',
            'ze'                         => 'required',
            'municipio'                  => 'required',
            'telefono'                   => 'required',
            'direccion'                  => 'required',
            'cr_dependencia'             => 'required',
            
        ];

        $obj_actual = Cr::find($id);
        
        //$object = Cr::find($id);
        if(!$obj_actual){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        try {
            
            $clasificacion = Clues::where("clasificacion_descripcion", $inputs['clasificacion'])->first();
            $clasificacion_texto = "";
            if($clasificacion != null)
            {
                $clasificacion_texto = $clasificacion->clasificacion;
            }
            
            
            if($obj_actual['registrada'] != $inputs['tipo_unidad'] || $obj_actual['clues'] != $inputs['clues'] || $obj_actual['cr'] != $inputs['cr'])
            {
                
                if($obj_actual['registrada']== 1)
                {
                    //Primero Hacemos los movimientos necesarios
                    DB::Table("rel_clues_grupo_unidades")->where("clues",$obj_actual['clues'])->where("cr_id",$obj_actual['cr'])
                    ->update(array('clues' => $inputs['clues'], 'cr_id'=>$inputs['cr']));
                    
                    DB::Table("rel_trabajador_datos_laborales")->where("clues_adscripcion_fisica",$obj_actual['clues'])->where("cr_fisico_id",$obj_actual['cr'])
                    ->update(array('clues_adscripcion_fisica' => $inputs['clues'], 'cr_fisico_id'=>$inputs['cr']));
                    
                    DB::Table("rel_usuario_clues_cr")->where("clues",$obj_actual['clues'])->where("cr_id",$obj_actual['cr'])
                    ->update(array('clues' => $inputs['clues'], 'cr_id'=>$inputs['cr']));
                    
                    DB::Table("rel_trabajador_cr_responsables")->where("cr",$obj_actual['cr'])
                    ->update(array('cr'=>$inputs['cr']));
                    
                    $obj_clues = Clues::find($obj_actual['clues']);
                    $obj_clues->delete();
                    $obj_actual->delete();
                    //Hacemos la actualizacion de la unidad
                    $obj_nuevo = new Cr();
                    $obj_nuevo->cr                         = $inputs['cr'];
                    $obj_nuevo->descripcion                = $inputs['descripcion'];
                    $obj_nuevo->clues                      = $inputs['clues'];
                    $obj_nuevo->registrada                 = $inputs['tipo_unidad'];
                    $obj_nuevo->area                       = $obj_actual['area'];
                    $obj_nuevo->descripcion_actualizada    = $inputs['descripcion'];
                    $obj_nuevo->ze                         = $inputs['ze'];
                    $obj_nuevo->municipio                  = $inputs['municipio'];
                    $obj_nuevo->telefono                   = $inputs['telefono'];
                    $obj_nuevo->direccion                  = $inputs['direccion'];
                    $obj_nuevo->cr_dependencia             = $inputs['cr_dependencia']['cr'];
                    $obj_nuevo->save();
                    
                    $obj_nuevo_clues = new Clues();
                    $obj_nuevo_clues->clues                         = $inputs['clues'];
                    $obj_nuevo_clues->cve_jurisdiccion              = $inputs['tipo_unidad'];
                    $obj_nuevo_clues->nombre_unidad                 = $inputs['descripcion'];
                    $obj_nuevo_clues->clasificacion                 = $clasificacion_texto;
                    $obj_nuevo_clues->clasificacion_descripcion     = $inputs['clasificacion'];
                    
                    $obj_nuevo_clues->save();
                    
                    //Crea el movimiento
                    $fecha_actual = Carbon::now();
                    $loggedUser = auth()->userOrFail();
                    MovimientoCluesCr::create([
                        'fecha_movimiento' => $fecha_actual->format("Y-m-d"),
                        'user_id' => $loggedUser->id,
                        'clues_before' => $obj_actual['clues'],
                        'clues_after' => $inputs['clues'],
                        'cr_before' => $obj_actual['cr'],
                        'cr_after' => $inputs['cr'],
                        'descripcion_before' => $obj_actual['descripcion_actualizada'],
                        'descripcion_after' => $inputs['descripcion'],
                    ]);
                    
                }else{
                    return response()->json(['error' => "No se puede regresar una unidad a no registrada"], HttpResponse::HTTP_NOT_FOUND);
                }    
           }else
           {
            //obtenemos la clasificacion
            
                //Hacemos la actualizacion de la unidad
                $obj_actual->descripcion                = $inputs['descripcion'];
                $obj_actual->registrada                 = 1;
                $obj_actual->descripcion_actualizada    = $inputs['descripcion'];
                $obj_actual->ze                         = $inputs['ze'];
                $obj_actual->municipio                  = $inputs['municipio'];
                $obj_actual->telefono                   = $inputs['telefono'];
                $obj_actual->direccion                  = $inputs['direccion'];
                $obj_actual->cr_dependencia             = $inputs['cr_dependencia']['cr'];
                $obj_actual->save();
                
                $obj_nuevo_clues = Clues::find($inputs['clues']);
                $obj_nuevo_clues->cve_jurisdiccion              = $inputs['tipo_unidad'];
                $obj_nuevo_clues->nombre_unidad                 = $inputs['descripcion'];
                $obj_nuevo_clues->clasificacion                 = $clasificacion_texto;
                $obj_nuevo_clues->clasificacion_descripcion     = $inputs['clasificacion'];
                
                $obj_nuevo_clues->save();
           }

            //$object->update();
    
            DB::commit();
            
            return response()->json($obj_actual,HttpResponse::HTTP_OK);

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
            
            $unidad = Cr::find($id);
            $personal = RelDatosLaborales::where("cr_fisico_id",$id)->get();
            if(count($personal))
            {
                return response()->json(['error' => "No se puede eliminar, cuenta con personal asignado"], HttpResponse::HTTP_NOT_FOUND);
            }else{
               $unidades =  Cr::where("clues",$unidad['clues'])->get();
               if(count($unidades)>1)
               {
                    $unidad->delete();
               }else{
                    $clue = Clues::find($unidad['clues']);
                    $clue->delete();
                    $unidad->delete();
               }
            }
    
            DB::commit();
            
            return response()->json($obj_actual,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        //$loggedUser->load('perfilCr');
        $loggedUser->load('gruposUnidades.listaCR');
        
        $lista_cr = [];
        $lista_clues = [];
        
        foreach ($loggedUser->gruposUnidades as $grupo) {
            $lista_unidades = $grupo->listaCR->pluck('clues','cr')->toArray();
            
            $lista_clues += $lista_clues + array_values($lista_unidades);
            $lista_cr += $lista_cr + array_keys($lista_unidades);
        }

        $accessData = (object)[];
        $accessData->lista_clues = $lista_clues;
        $accessData->lista_cr = $lista_cr;

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
