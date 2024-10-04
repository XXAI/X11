<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;
use App\Models\RelComision;
use Carbon\Carbon;


class ComisionSindicalController extends Controller
{
    public function index(Request $request)
    {
        //$loggedUser = auth()->userOrFail();
        try{
            //$access = $this->getUserAccessData();
            $parametros = $request->all();
            
            $trabajador = Trabajador::with("rel_datos_laborales_nomina", "rel_datos_comision")
            ->where("trabajador.estatus",1)
            /*->Join("rel_trabajador_comision", "rel_trabajador_comision.trabajador_id", "trabajador.id")
            ->where("rel_trabajador_comision.comision_sindical_interna","A")
            
            ->whereNull("trabajador.deleted_at")
            ->whereNull("rel_trabajador_comision.deleted_at")
            ->where("rel_trabajador_comision.estatus", "A");*/
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision where deleted_at is null and comision_sindical_interna='A')");
            //$trabajador = $this->aplicarFiltros($trabajador, $parametros, $access); 
            
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('apellido_paterno');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
            
            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
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
            'fecha_fin'           => 'required',
            'fecha_inicio'           => 'required',
            'no_documento'           => 'required',
            'sindicato_id'           => 'required',
            'trabajador_id'           => 'required',
        ];
        
        DB::beginTransaction();
        $object = new RelComision();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        try {
                //Verificacion de usuario activo
                $trabajador = Trabajador::find($inputs['trabajador_id']);
                if($trabajador->estatus!=1)
                {
                    return Response::json(['error' => "El trabajador no aparece activo"], HttpResponse::HTTP_CONFLICT);
                }

                $fecha_actual = Carbon::now();
                $fecha_inicio = Carbon::parse($inputs['fecha_inicio']);
                $fecha_fin = Carbon::parse($inputs['fecha_fin']);
                //Actualizamos el estatus de comision
                $actualizacion = RelComision::where("trabajador_id",$inputs['trabajador_id'])->where("fecha_fin", "<=",$fecha_actual->toDateString())->where("estatus", "A");
                $actualizacion->update(['estatus'=> 'E']);
                //
                
                $diferencia = $fecha_inicio->diffInDays($fecha_fin, FALSE);  
                if($diferencia < 1)
                {
                    $fecha_pivote   = $fecha_fin;
                    $fecha_fin      = $fecha_inicio;
                    $fecha_inicio   = $fecha_pivote;
                    $diferencia = $fecha_inicio->diffInDays($fecha_fin, FALSE);   
                }

                $diferencia = $fecha_actual->diffInDays($fecha_fin, FALSE); 
                if($diferencia < 1)
                {
                    return Response::json(['error' => "El periodo de la comisión debe de ser mayor a la fecha actual"], HttpResponse::HTTP_CONFLICT);
                }

                /*$busqueda = RelComision::where("trabajador_id", $inputs['trabajador_id'])->where("fecha_fin", ">", $fecha_fin->toDateString())->where("estatus", "A")->get();

                if(count($busqueda) > 0)
                {
                    return Response::json(['error' => "Actualmente existe una comision sindical activa, verifique sus datos"], HttpResponse::HTTP_CONFLICT);
                }*/
                $object->trabajador_id              = $inputs['trabajador_id'];
                $object->fecha_inicio               = $inputs['fecha_inicio'];
                $object->fecha_fin                  = $inputs['fecha_fin'];
                
                $object->no_oficio                  = $inputs['no_documento'];
                $object->sindicato_id               = $inputs['sindicato_id'];
                $object->tipo_comision_id           = "CS";
                $object->estatus                    = "A";
                $object->comision_sindical_interna  = "A";
                
            $object->save();

            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function destroy($id)
    {
        
        try{
            $actualizacion = RelComision::where("trabajador_id",$id)->where("comision_sindical_interna", "A");
            $actualizacion->update(['estatus'=> 'E', 'comision_sindical_interna' => 'I']);
            $actualizacion->delete();

            return response()->json(['data'=>'Permiso eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
