<?php

namespace App\Http\Controllers\API\Servicios;

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
use App\Models\ComisionEmpleado;
use App\Models\ComisionDetalle;
use App\Models\EmpleadoEscolaridadDetalle;
use App\Models\GrupoUnidades;

class EmpleadosServiceController extends Controller
{
    public function infoEmpleado($id){
        try{
            //$access = $this->getUserAccessData();

            $empleado = Empleado::with('turno','maxGradoEstudio','codigo.grupoFuncion','rama','tipoTrabajador','programa','ur','clues','cr','cluesAdscripcion','crAdscripcion','fuente')->where('id',$id)->first();

            if(!$empleado){
                throw new Exception("No se encontro al empleado buscado", 1);
            }

            $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);

            if($empleado->tipo_comision){
                $empleado->load('empleado_comision.detalle', 'empleado_comision.clues', 'empleado_comision.cr', 'empleado_comision.sindicato');
            }

            return response()->json(['data'=>$empleado],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function listadoEmpleados()
    {
        try{
            $access = $this->getUserAccessData();
            $parametros = Input::all();
            
            if(!$access->lista_cr){
                throw new \Exception("Error: Debe estar asignado a un grupo para poder acceder a esta información.", 1);
            }

            if(!isset($parametros['mode']) || !$parametros['mode']){
                $parametros['mode'] = 'grouped';
                $parametros['grouped_by'] = 'clues';
            }

            $empleados = Empleado::select('empleados.*','clues_fisica.nombre_unidad as unidad_fisica','cr_fisico.descripcion as cr_fisico','clues_adscripcion.nombre_unidad as unidad_adscripcion','cr_adscripcion.descripcion as cr_adscripcion')
                                    ->leftJoin('catalogo_clues as clues_fisica','empleados.clues','=','clues_fisica.clues')->leftJoin('catalogo_cr as cr_fisico','empleados.cr_id','=','cr_fisico.cr')
                                    ->leftJoin('catalogo_clues as clues_adscripcion','empleados.clues_adscripcion','=','clues_adscripcion.clues')->leftJoin('catalogo_cr as cr_adscripcion','empleados.cr_adscripcion_id','=','cr_adscripcion.cr');
        
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $empleados = $empleados->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                                ->orWhereRaw('concat(apellido_paterno, " ", apellido_materno, " ", nombre) like "%'.$parametros['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['clues']) && $parametros['clues']){
                $clues = explode('|',$parametros['clues']);
                $empleados = $empleados->whereIn('empleados.clues',$clues);
            }

            if(isset($parametros['cr']) && $parametros['cr']){
                $cr = explode('|',$parametros['cr']);
                $empleados = $empleados->where('empleados.cr_id',$cr);
            }

            if(isset($parametros['validado']) && $parametros['validado']){
                $empleados = $empleados->where('empleados.validado',1);
            }

            if(isset($parametros['estatus']) && $parametros['estatus']){
                $estatus = explode('|',$parametros['estatus']);
                $empleados = $empleados->whereIn('empleados.estatus',$estatus);
            }

            if(isset($parametros['order']) && $parametros['order']){
                $order_by = explode('|',$parametros['order']);
                $order_type = (isset($parametros['order_type']) && $parametros['order_type'])?explode('|',$parametros['order_type']):['ASC'];
                foreach ($order_by as $index => $order_field) {
                    if(count($order_type) > $index){
                        $asc_desc = $order_type[$index];
                    }else{
                        $asc_desc = $order_type[0];
                    }
                    $empleados = $empleados->orderBy($order_field,$asc_desc);
                }
            }

            /*if($access->is_admin){
                if(isset($parametros['grupos']) && $parametros['grupos']){
                    $grupos_id = explode('|',$parametros['grupos']);
                    $grupos = GrupoUnidades::with('listaCR')->whereIn('id',$grupos_id)->get();
                    $lista_cr = [];
                    foreach ($grupos as $grupo) {
                        $lista_cr += $lista_cr + $grupo->listaCR->pluck('cr')->toArray();
                    }
                    $empleados = $empleados->where(function($query)use($lista_cr){
                        $query->whereIn('empleados.cr_id',$lista_cr);
                    });
                }
            }else{*/
            //}

            $empleados = $empleados->where(function($query)use($access){
                $query->whereIn('empleados.clues',$access->lista_clues)->whereIn('empleados.cr_id',$access->lista_cr);
            });
            
            if($parametros['mode'] == 'plain-list'){
                $empleados = $empleados->get();
            }else if($parametros['mode'] == 'paginated'){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $empleados = $empleados->paginate($resultadosPorPagina);
            }else if($parametros['mode'] == 'grouped'){
                $grouped_by = explode('|',$parametros['grouped_by']);
                $empleados = $empleados->get();
                $empleados_collection = collect($empleados);
                $empleados = $empleados_collection->groupBy($grouped_by)->toArray();
            }
            
            return response()->json(['data'=>$empleados],HttpResponse::HTTP_OK);
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
        $lista_grupos = [];
        
        foreach ($loggedUser->gruposUnidades as $grupo) {
            $lista_unidades = $grupo->listaCR->pluck('clues','cr')->toArray();
            
            $lista_clues += $lista_clues + array_values($lista_unidades);
            $lista_cr += $lista_cr + array_keys($lista_unidades);

            $lista_grupos[$grupo->id] = $grupo->descripcion;
        }

        $accessData = (object)[];
        $accessData->lista_clues = $lista_clues;
        $accessData->lista_cr = $lista_cr;
        $accessData->lista_grupos = $lista_grupos;

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}