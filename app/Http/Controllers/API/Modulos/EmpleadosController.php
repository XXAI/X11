<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Empleados;
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
            $empleados = Empleados::getModel();
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $empleados = $empleados->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
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
        $empleado = Empleados::with("clues")->find($id);

        if($empleado){
            $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);
        }

        return response()->json(['data'=>$empleado],HttpResponse::HTTP_OK);
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
