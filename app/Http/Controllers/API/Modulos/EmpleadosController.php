<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Empleado;
use App\Models\Clues;
use App\Models\Cr;
use App\Models\Profesion;
use App\Models\Rama;

class EmpleadosController extends Controller
{
    public function index()
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = Input::all();
            $empleados = Empleado::select('empleados.*','permuta_adscripcion.clues_destino as permuta_activa_clues')
                            ->leftJoin('permuta_adscripcion',function($join){
                                $join->on('permuta_adscripcion.empleado_id','=','empleados.id')
                                    ->where('permuta_adscripcion.estatus',1);
                            });

            $empleados = $empleados->where('empleados.estatus','!=','3');
            
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

                if(isset($parametros['profesion']) && $parametros['profesion']){
                    $empleados = $empleados->where('profesion_id',$parametros['profesion']);
                }

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

            return response()->json(['data'=>$empleados],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show($id)
    {
        try{
            $params = Input::all();

            $empleado = Empleado::with('clues','codigo','permutaAdscripcionActiva.cluesDestino','adscripcionActiva.clues')->find($id);

            if($empleado){
                $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);
            }

            $returnData = ['data'=>$empleado];

            if(isset($params['selectedIndex'])){
                $per_page = $params['pageSize'];
                $page_index = $params['pageIndex'];
                $selected_index = $params['selectedIndex'];

                $real_index = ($per_page * $page_index) + $selected_index;
                $empleados = Empleado::select('id')->where('estatus','!=','3');

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

                if(isset($params['profesion']) && $params['profesion']){
                    $empleados = $empleados->where('profesion_id',$params['profesion']);
                }

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

    public function transferEmployee($id){
        try{
            //['empleado_id', 'user_origen_id', 'clues_origen', 'user_destino_id', 'clues_destino', 'observacion', 'estatus', 'user_id']
            $parametros = Input::all();
            $empleado = Empleado::find($id);
            $loggedUser = auth()->userOrFail();

            $empleado->permutasAdscripcion()->create([
                'clues_origen'=>$empleado->clues,
                'clues_destino'=>$parametros['clues']['clues'],
                'estatus' => 1,
                'user_origen_id'=>$loggedUser->id,
                'user_destino_id'=>$loggedUser->id,
                'user_id'=>$loggedUser->id,
                'observacion'=>''
            ]);

            $empleado->estatus = 4;
            $empleado->save();

            return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
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

    public function getFilterCatalogs(){
        try{
            $catalogos = [
                'clues'     => Clues::all(),
                'cr'        => Cr::orderBy("descripcion")->get(),
                'profesion' => Profesion::all(),
                'rama'      => Rama::all(),
            ];

            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
