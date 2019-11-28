<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Empleado;
use App\Models\EmpleadoEscolaridad;
use App\Models\Clues;
use App\Models\Cr;
use App\Models\Profesion;
use App\Models\Rama;
use App\Models\PermutaAdscripcion;
use App\Models\CluesEmpleado;
use App\Models\User;

class EmpleadosController extends Controller
{
    public function index()
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $access = $this->getUserAccessData();
            
            $parametros = Input::all();
            $empleados = Empleado::select('empleados.*','permuta_adscripcion.clues_destino as permuta_activa_clues','permuta_adscripcion.cr_destino_id as permuta_activa_cr')
                            ->leftJoin('permuta_adscripcion',function($join)use($access){
                                $join = $join->on('permuta_adscripcion.empleado_id','=','empleados.id')->where('permuta_adscripcion.estatus',1);
                                if(!$access->is_admin){
                                    $join->whereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                                }
                            })->orderBy('nombre');

            //filtro de valores por permisos del usuario
            //$empleados = $empleados->->orWhereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
            if(!$access->is_admin){
                $empleados = $empleados->where('empleados.estatus','!=','3')->where(function($query)use($access){
                    $query->whereIn('empleados.clues',$access->lista_clues)->whereIn('empleados.cr_id',$access->lista_cr)
                        ->orWhere(function($query2)use($access){
                            $query2->whereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                        });
                });
    
                /*$empleados = $empleados->orWhere(function($query)use($access){
                    $query->orWhereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                });*/
            }
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $empleados = $empleados->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){
                if(isset($parametros['clues']) && $parametros['clues']){
                    $empleados = $empleados->where('clues',$parametros['clues']);
                }

                if(isset($parametros['cr']) && $parametros['cr']){
                    $empleados = $empleados->where('cr_id',$parametros['cr']);
                }

                if(isset($parametros['estatus']) && $parametros['estatus']){
                    $estatus = explode('-',$parametros['estatus']);
                    $empleados = $empleados->where('empleados.estatus',$estatus[0]);
                    if(isset($estatus[1])){
                        $empleados = $empleados->where('validado',$estatus[1]);
                    }
                }

                /*if(isset($parametros['profesion']) && $parametros['profesion']){
                    $empleados = $empleados->where('profesion_id',$parametros['profesion']);
                }*/

                if(isset($parametros['rama']) && $parametros['rama']){
                    $empleados = $empleados->where('rama_id',$parametros['rama']);
                }
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $empleados = $empleados->paginate($resultadosPorPagina);
            } else {

                $empleados = $empleados->get();
            }

            return response()->json(['data'=>$empleados,'params'=>$parametros,'access'=>$access],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show($id)
    {
        try{
            $access = $this->getUserAccessData();

            $params = Input::all();

            $empleado = Empleado::with('escolaridad', 'clues','codigo.grupoFuncion','profesion','permutaAdscripcionActiva.cluesDestino','permutaAdscripcionActiva.crDestino','adscripcionActiva.clues','adscripcionActiva.cr')->find($id);

            if($empleado){
                $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);
            }

            $returnData = ['data'=>$empleado];

            if(isset($params['selectedIndex'])){
                $per_page = $params['pageSize'];
                $page_index = $params['pageIndex'];
                $selected_index = $params['selectedIndex'];

                $real_index = ($per_page * $page_index) + $selected_index;
                $empleados = Empleado::select('empleados.id')->leftJoin('permuta_adscripcion',function($join)use($access){
                                            $join = $join->on('permuta_adscripcion.empleado_id','=','empleados.id')->where('permuta_adscripcion.estatus',1);
                                            if(!$access->is_admin){
                                                $join->whereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                                            }
                                        })->orderBy('nombre');

                //filtro de valores por permisos del usuario
                if(!$access->is_admin){
                    $empleados = $empleados->where('empleados.estatus','!=','3')->where(function($query)use($access){
                        $query->whereIn('empleados.clues',$access->lista_clues)->whereIn('empleados.cr_id',$access->lista_cr)
                                ->orWhere(function($query2)use($access){
                                    $query2->whereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                                });
                    });
                }

                if($real_index == 0){
                    $limit_index = 0;
                    $total_results = 2;
                }else{
                    $limit_index = $real_index-1;
                    $total_results = 3;
                }

                if(isset($params['query']) && $params['query']){
                    $empleados = $empleados->where(function($query)use($params){
                        return $query->where('nombre','LIKE','%'.$params['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$params['query'].'%')
                                    ->orWhere('rfc','LIKE','%'.$params['query'].'%');
                    });
                }

                if(isset($params['clues']) && $params['clues']){
                    $empleados = $empleados->where('clues',$params['clues']);
                }

                if(isset($params['cr']) && $params['cr']){
                    $empleados = $empleados->where('cr_id',$params['cr']);
                }

                if(isset($params['estatus']) && $params['estatus']){
                    $estatus = explode('-',$params['estatus']);
                    $empleados = $empleados->where('empleados.estatus',$estatus[0]);
                    if(isset($estatus[1])){
                        $empleados = $empleados->where('validado',$estatus[1]);
                    }
                }
                /*if(isset($params['profesion']) && $params['profesion']){
                    $empleados = $empleados->where('profesion_id',$params['profesion']);
                }*/

                if(isset($params['rama']) && $params['rama']){
                    $empleados = $empleados->where('rama_id',$params['rama']);
                }

                $total_empleados = clone $empleados;
                $total_empleados = $total_empleados->count();
                $empleados = $empleados->skip($limit_index)->take($total_results)->get();

                $mini_pagination = ['next_prev'=>$empleados,'total'=>$total_empleados];

                $returnData['pagination'] = $mini_pagination;
            }

            return response()->json($returnData,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * sTORE the specified resource in storage.
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
            'codigo_id'             => 'required',
            'comision_sindical_id'  => 'required',
            'cr_id'                 => 'required',
            'cr_adscripcion_id'     => 'required',
            'curp'                  => 'required|unique:empleados',
            'figf'                  => 'required',
            'fissa'                 => 'required',
            //'fuente_id'           => 'required',
            'nombre'                => 'required',
            'programa_id'           => 'required',
            'rama_id'               => 'required',
            'rfc'                   => 'required|unique:empleados',
            'tipo_nomina_id'        => 'required'
        ];

        $inputs = Input::all();
        $object = Empleado::where("rfc", "=", $inputs['rfc'])->first();
        if($object){
            throw new \Exception("Existe en empleado con el mismo rfc, por favor verificar", 1);
            //return response()->json(['error' => "Existe en empleado con el mismo rfc, por favor verificar"], HttpResponse::HTTP_CONFLICT);
        }
        
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
            //return response()->json(['error' => "Hace falta campos obligatorios."], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            
            $clues_fisico       = Cr::where("cr", "=", $inputs['cr_id'])->first();
            $clues_adscripcion  = Cr::where("cr", "=", $inputs['cr_adscripcion_id'])->first();
            
            $empleado  = new Empleado();
            $empleado->codigo_id              = $inputs['codigo_id'];
            $empleado->comision_sindical_id   = $inputs['comision_sindical_id'];
            $empleado->cr_id                  = $inputs['cr_id'];
            $empleado->clues                  = $clues_fisico->clues;
            $empleado->cr_adscripcion_id      = $inputs['cr_adscripcion_id'];
            $empleado->clues_adscripcion      = $clues_adscripcion->clues;
            $empleado->curp                   = $inputs['curp'];
            $empleado->figf                   = $inputs['figf'];
            $empleado->fissa                  = $inputs['fissa'];
            //$empleado->fuente_id              = $inputs['fuente_id'];
            $empleado->crespdes               = "";
            $empleado->hora_entrada           = $inputs['hora_entrada'];
            $empleado->hora_salida            = $inputs['hora_salida'];
            $empleado->turno_id               = $inputs['turno_id'];
            $empleado->nombre                 = $inputs['nombre'];
            $empleado->programa_id            = $inputs['programa_id'];
            $empleado->rama_id                = $inputs['rama_id'];
            $empleado->rfc                    = $inputs['rfc'];
            $empleado->ur                     = $inputs['ur'];
            $empleado->tipo_nomina_id         = $inputs['tipo_nomina_id'];
            $empleado->profesion_id           = $inputs['profesion_id'];
            $empleado->area_servicio          = $inputs['area_servicio'];
            $empleado->estatus                = 1;
            $empleado->proporcionado_por      = "SISTEMA";
            $empleado->observaciones          = $inputs['observaciones'];

            if(isset($inputs['validado']))
                $empleado->validado           = true;
            else    
                $empleado->validado           = false;

            $empleado->save();

            $escolaridad = json_decode($inputs['escolaridad_json']);

            $objeto_escolaridad = EmpleadoEscolaridad::where("empleado_id", "=", $empleado->id)->first();
            $arreglo_escolaridad = array("empleado_id" => $empleado->id, "secundaria"=>0, "preparatoria"=>0, "tecnica"=>0, "carrera"=>0, "titulo"=>0, "maestria"=>0, "doctorado"=>0, "cursos"=>0, "especialidad"=>0, "diplomado"=>0, "poliglota"=>0);
            foreach ($escolaridad as $key => $value) {
                $arreglo_escolaridad[$key] = 1;
            }
            
            if($objeto_escolaridad)
                $objeto_escolaridad->update($arreglo_escolaridad);
            else{
                EmpleadoEscolaridad::create($arreglo_escolaridad);
            } 
                
            DB::commit();
            
            return response()->json($empleado,HttpResponse::HTTP_OK);

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
            'codigo_id'                => 'required',
            'comision_sindical_id'                => 'required',
            'cr_id'             => 'required',
            'curp'              => 'required',
            'figf'            => 'required',
            'fissa'            => 'required',
            //'fuente_id'            => 'required',
            'nombre'            => 'required',
            //'programa_id'            => 'required',
            'rama_id'            => 'required',
            'rfc'            => 'required',
            //'tipo_nomina_id'            => 'required'
        ];

        
        $object = Empleado::find($id);
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
            
            $object->codigo_id              = $inputs['codigo_id'];
            $object->comision_sindical_id   = $inputs['comision_sindical_id'];
            $object->cr_id                  = $inputs['cr_id'];
            $object->curp                   = $inputs['curp'];
            $object->figf                   = $inputs['figf'];
            $object->fissa                  = $inputs['fissa'];
            //$object->fuente_id              = $inputs['fuente_id'];
            $object->hora_entrada           = $inputs['hora_entrada'];
            $object->hora_salida            = $inputs['hora_salida'];
            $object->turno_id               = $inputs['turno_id'];
            $object->nombre                 = $inputs['nombre'];
            //$object->programa_id            = $inputs['programa_id'];
            $object->profesion_id            = $inputs['profesion_id'];
            $object->rama_id                = $inputs['rama_id'];
            $object->rfc                    = $inputs['rfc'];
            //$object->tipo_nomina_id         = $inputs['tipo_nomina_id'];
            $object->area_servicio          = $inputs['area_servicio'];
            $object->observaciones          = $inputs['observaciones'];

            if(isset($inputs['validado']))
                $object->validado           = true;

            $object->save();

            $escolaridad = json_decode($inputs['escolaridad_json']);

            $objeto_escolaridad = EmpleadoEscolaridad::where("empleado_id", "=", $object->id)->first();
            $arreglo_escolaridad = array("empleado_id" => $object->id, "secundaria"=>0, "preparatoria"=>0, "tecnica"=>0, "carrera"=>0, "titulo"=>0, "maestria"=>0, "doctorado"=>0, "cursos"=>0, "especialidad"=>0, "diplomado"=>0, "poliglota"=>0);
            foreach ($escolaridad as $key => $value) {
                $arreglo_escolaridad[$key] = 1;
            }
            
            if($objeto_escolaridad)
                $objeto_escolaridad->update($arreglo_escolaridad);
            else{
                EmpleadoEscolaridad::create($arreglo_escolaridad);
            } 
                
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function transferEmployee($id){
        try{
            //['empleado_id', 'user_origen_id', 'clues_origen', 'user_destino_id', 'clues_destino', 'observacion', 'estatus', 'user_id']
            $parametros = Input::all();
            $empleado = Empleado::find($id);
            $loggedUser = auth()->userOrFail();

            $empleado->permutasAdscripcion()->create([
                'clues_origen'=>$empleado->clues,
                'cr_origen_id'=>$empleado->cr_id,
                'clues_destino'=>$parametros['clues'],
                'cr_destino_id'=>$parametros['cr'],
                'estatus' => 1,
                'user_origen_id'=>$loggedUser->id,
                'user_destino_id'=>$loggedUser->id,
                'user_id'=>$loggedUser->id,
                'observacion'=>$parametros['observaciones']
            ]);

            $empleado->estatus = 4;
            $empleado->save();

            return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getEmployeeTransferData($id){
        try{
            $parametros = Input::all();
            
            $datos_transferencia = PermutaAdscripcion::with('cluesOrigen','cluesDestino','crOrigen','crDestino')->where('empleado_id',$id)->where('estatus',1)->first();
            
            return response()->json(['data'=>$datos_transferencia],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function finishTransferEmployee($id){
        try{
            $parametros = Input::all();
            
            $datos_transferencia = PermutaAdscripcion::where('empleado_id',$id)->where('estatus',1)->first();
            $empleado = Empleado::find($id);

            DB::beginTransaction();

            if($parametros['estatus'] == 2){ //aceptado
                $datos_transferencia->estatus = 2;
                if($parametros['observaciones']){
                    $datos_transferencia->observacion .=  "\nACEPTADO: \n".$parametros['observaciones'];
                }
                $datos_transferencia->save();

                $clues_empleado = CluesEmpleado::where('empleado_id',$id)->where('clues',$datos_transferencia->clues_origen)->whereNull('fecha_fin')->first();

                if(!$clues_empleado){
                    throw new Exception("El empleado no tiene registro viable para realizar la transferencia", 1);
                }

                $clues_empleado->fecha_fin = $parametros['fecha_transferencia'];
                $clues_empleado->save();

                $empleado->adscripcionHistorial()->create(['clues'=>$datos_transferencia->clues_destino, 'cr'=>$datos_transferencia->cr_destino_id, 'fecha_inicio'=>$parametros['fecha_transferencia']]);

                $empleado->estatus = 1;
                $empleado->clues = $datos_transferencia->clues_destino;
                $empleado->cr_id = $datos_transferencia->cr_destino_id; 
                $empleado->save();

            }else{ //3 => cancelado
                $datos_transferencia->estatus = 3;
                if($parametros['observaciones']){
                    $datos_transferencia->observacion .=  "\nRECHAZADO: \n".$parametros['observaciones'];
                }
                $datos_transferencia->save();

                $empleado->estatus = 1;
                $empleado->save();
            }

            DB::commit();

            return response()->json(['data'=>$datos_transferencia],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function requestTransferEmployee($id){
        try{
            $parametros = Input::all();
            
            //$datos_transferencia = PermutaAdscripcion::where('empleado_id',$id)->first();
            $empleado = Empleado::find($id);

            $clues_origen = $empleado->clues;
            $cr_origen = $empleado->cr_id;
            $clues_destino = $parametros['clues'];
            $cr_destino = $parametros['cr'];
            $fecha_transferencia = date('Y-m-d');

            DB::beginTransaction();

            if(true){ //aceptado por ahora
                $loggedUser = auth()->userOrFail();

                $empleado->permutasAdscripcion()->create([
                    'clues_origen'=>$clues_origen,
                    'cr_origen_id'=>$cr_origen,
                    'clues_destino'=>$clues_destino,
                    'cr_destino_id'=>$cr_destino,
                    'estatus' => 2,
                    'user_origen_id'=>$loggedUser->id,
                    'user_destino_id'=>$loggedUser->id,
                    'user_id'=>$loggedUser->id
                    //'observacion'=>(isset($parametros['observaciones']))?$parametros['observaciones']:''
                ]);

                $clues_empleado = CluesEmpleado::where('empleado_id',$id)->where('clues',$clues_origen)->where('cr',$cr_origen)->whereNull('fecha_fin')->first();

                if($clues_empleado){
                    $clues_empleado->fecha_fin = $fecha_transferencia;
                    $clues_empleado->save();
                }

                $empleado->adscripcionHistorial()->create(['clues'=>$clues_destino, 'cr'=>$cr_destino, 'fecha_inicio'=>$fecha_transferencia]);

                $empleado->estatus = 1;
                $empleado->clues = $clues_destino;
                $empleado->cr_id = $cr_destino; 
                $empleado->save();

            }

            DB::commit();

            return response()->json(['data'=>$empleado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function unlinkEmployee($id){
        try{
            $empleado = Empleado::find($id);
            $loggedUser = auth()->userOrFail();

            $empleado->estatus = 3;
            //$empleado->clues = null;
            //$empleado->cr = null;
            $empleado->save();

            return response()->json(['data'=>$empleado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function activateEmployee($id){
        try{
            $empleado = Empleado::find($id);
            $loggedUser = auth()->userOrFail();

            $empleado->estatus = 1;
            //$empleado->clues = null;
            //$empleado->cr = null;
            $empleado->save();

            return response()->json(['data'=>$empleado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getFilterCatalogs(){
        try{
            $access = $this->getUserAccessData();
            
            /*
                $posts = App\Post::whereHas('comments', function (Builder $query) {
                    $query->where('content', 'like', 'foo%');
                })->get();
            */

            $catalogo_clues = Clues::orderBy('nombre_unidad');
            $catalogo_cr = Cr::orderBy("descripcion");

            if(!$access->is_admin){
                $catalogo_clues = $catalogo_clues->whereIn('clues',$access->lista_clues);
                $catalogo_cr = $catalogo_cr->whereIn('cr',$access->lista_cr);

                $catalogo_clues = $catalogo_clues->with(['cr'=>function($query)use($access){
                    $query->whereIn('cr',$access->lista_cr);
                }]);
            }else{
                $catalogo_clues = $catalogo_clues->with('cr');
            }

            $catalogos = [
                'clues'     => $catalogo_clues->get(),
                'cr'        => $catalogo_cr->get(),
                //'profesion' => Profesion::all(),
                'rama'      => Rama::all(),
                'estatus'   => [
                                    ['id'=>'1','descripcion'=>'Activos'],
                                    ['id'=>'1-0','descripcion'=>'Activos - Sin Validar'],
                                    ['id'=>'1-1','descripcion'=>'Activos - Validados'],
                                    ['id'=>'4','descripcion'=>'En Transferencia']
                                    //['id'=>'2','descripcion'=>'Baja'],
                                    //['id'=>'3','descripcion'=>'Indefinidos'],
                                    
                            ]
            ];

            if($access->is_admin){
                $catalogos['estatus'][] = ['id'=>'2','descripcion'=>'Baja'];
                $catalogos['estatus'][] = ['id'=>'3','descripcion'=>'Indefinidos'];
            }

            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        $loggedUser->load('perfilCr');

        $lista_relacion = $loggedUser->perfilCr->pluck('clues','cr')->toArray();

        $lista_clues = array_values($lista_relacion);
        $lista_cr = array_keys($lista_relacion);

        //dmcnXs5gK1qHzn30WvGXDzFimcrVJZ9Z

        $accessData = (object)[];
        $accessData->lista_clues = $lista_clues;
        $accessData->lista_cr = $lista_cr;

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
        //return ['userData'=>$loggedUser,'access'=>['clues'=>$lista_clues, 'cr'=>$lista_cr]];
    }

    public function getEmpleadosComplete()
    {
        try{
            $parametros = Input::all();

            $access = $this->getUserAccessData();
            
            $empleados = Empleado::with("clues", "cr")->where(function($query)use($parametros){
                return $query->where('nombre','LIKE','%'.$parametros['busqueda_empleado'].'%')
                            ->orWhere('rfc','LIKE','%'.$parametros['busqueda_empleado'].'%')
                            ->orWhere('curp','LIKE','%'.$parametros['busqueda_empleado'].'%');
            });

            if(!$access->is_admin){
                $empleados = $empleados->select('id','clues','cr_id','nombre','rfc','curp','estatus','validado',DB::raw('IF(cr_id IN ('.implode(',',$access->lista_cr).'),1,0) as empleado_propio'));
            }else{
                $empleados = $empleados->select('id','clues','cr_id','nombre','rfc','curp','estatus','validado',DB::raw('1 as empleado_propio'));
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $empleados = $empleados->paginate($resultadosPorPagina);
            } else {

                $empleados = $empleados->get();
            }

            $empleados->map(function($empleado){
                return $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);
            });

            return response()->json(['data'=>$empleados],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getCrComplete()
    {
        try{
            $parametros = Input::all();
            
            $access = $this->getUserAccessData();
            if($access->is_admin)
                $cr = Cr::with("clues")->where("descripcion", 'LIKE','%'.$parametros['query'].'%')->get();
            else
            {
                $cr = Cr::with("clues")->whereIn("cr", array_values($access->lista_cr))->where("descripcion", 'LIKE','%'.$parametros['query'].'%')->get();
            }    

            return response()->json(['data'=>$cr],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getCrAdscripcionComplete()
    {
        try{
            $parametros = Input::all();
            $cr = Cr::with("clues")->where("descripcion", 'LIKE','%'.$parametros['query'].'%')->get();
            return response()->json(['data'=>$cr],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function reporteValidados()
    {
        
        try{
            $loggedUser = auth()->userOrFail();
            $usuario = User::with(["relUsuarioCluesCr.clues", "relUsuarioCluesCr.empleados.profesion" ,"relUsuarioCluesCr.empleados.turno","relUsuarioCluesCr.empleados.codigo.grupoFuncion", "relUsuarioCluesCr.cr","relUsuarioCluesCr.empleados" => function($query)
            {
                $query->where('validado', 1)->where("estatus", 1)->orderBy("rfc", "asc");
            }])->find($loggedUser->id);
            return response()->json(['data'=>$usuario],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
