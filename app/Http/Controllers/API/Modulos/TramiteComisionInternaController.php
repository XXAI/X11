<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;
use App\Models\Directorio;

//Relacionales
use App\Models\User;

class TramiteComisionInternaController extends Controller
{
    public function index(Request $request)
    {
        $loggedUser = auth()->userOrFail();

        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            
            $trabajador = Trabajador::with("rel_datos_laborales_nomina", "rel_trabajador_comision_interna.cr_origen", "rel_trabajador_comision_interna.cr_destino")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1)");
            
            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access); 
            
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

    public function show(Request $request, $id)
    {
        try{
            $trabajador = Trabajador::with("rel_trabajador_comision_interna.cr_origen.directorioResponsable.responsable",
                                                "rel_trabajador_comision_interna.cr_origen.dependencia.directorioResponsable.responsable", 
                                                "rel_trabajador_comision_interna.cr_destino.directorioResponsable.responsable", 
                                                "rel_trabajador_comision_interna.cr_destino.dependencia.directorioResponsable.responsable", 
                                                "rel_datos_laborales_nomina")
                                                ->whereRaw(" trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales_nomina)")->find($id);
  
            //Copias y validaciones
            //Control del pago
            $control = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250010")->first();
            //sistematizacion
            $sistematizacion = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250008")->first();
            //subdireccion rh
            $subdireccion_rh = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250007")->first();
            //direccion de administracion y finanzas
            $direccion_admon_finanzas = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250001")->first();
            //departamento de rh
            $relaciones_laborales = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250009")->first();
            //secretario
            $secretario = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700200001")->first();

            //Elaboracion
            $loggedUser = auth()->userOrFail();
            $elaboracion = Trabajador::where("rfc", $loggedUser->username)->first();
            $nombres = ["control"=>$control, "sistematizacion" => $sistematizacion, "subdireccion_rh" => $subdireccion_rh, 
            "direccion_admon"=> $direccion_admon_finanzas, "relaciones_laborales"=>$relaciones_laborales, "elaboracion"=>$elaboracion, "secretario"=>$secretario];

            return response()->json(['data'=>$trabajador, "nombres"=>$nombres],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function ObtenerLote(Request $request)
    {
        try{
            $parametros = $request->all();

            $access = $this->getUserAccessData();

            $trabajador = Trabajador::with("rel_trabajador_comision_interna.cr_origen.directorioResponsable.responsable",
            "rel_trabajador_comision_interna.cr_origen.dependencia.directorioResponsable.responsable", 
            "rel_trabajador_comision_interna.cr_destino.directorioResponsable.responsable", 
            "rel_trabajador_comision_interna.cr_destino.dependencia.directorioResponsable.responsable", 
            "rel_datos_laborales_nomina")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1)")
            ->whereRaw(" trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales_nomina)");

            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access); 
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('apellido_paterno');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 1;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
                                    
            //Copias y validaciones
            //Control del pago
            $control = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250010")->first();
            //sistematizacion
            $sistematizacion = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250008")->first();
            //subdireccion rh
            $subdireccion_rh = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250007")->first();
            //direccion de administracion y finanzas
            $direccion_admon_finanzas = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250001")->first();
            //departamento de rh
            $relaciones_laborales = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250009")->first();
            //secretario
            $secretario = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700200001")->first();

            //Elaboracion
            $loggedUser = auth()->userOrFail();
            $elaboracion = Trabajador::where("rfc", $loggedUser->username)->first();
            $nombres = ["control"=>$control, "sistematizacion" => $sistematizacion, "subdireccion_rh" => $subdireccion_rh, 
            "direccion_admon"=> $direccion_admon_finanzas, "relaciones_laborales"=>$relaciones_laborales, "elaboracion"=>$elaboracion, "secretario"=>$secretario];

            return response()->json(['data'=>$trabajador, "nombres"=>$nombres],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        $loggedUser->load('gruposUnidades.listaCR', 'gruposUnidades.listaFirmantes');
        
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
        $accessData->is_admin = ($loggedUser->is_superuser == 0)?false:true;
       
        return $accessData;
    }

    private function aplicarFiltros($main_query, $parametros, $access){
        //Filtros, busquedas, ordenamiento
        if(isset($parametros['query']) && $parametros['query']){
            $main_query = $main_query->where(function($query)use($parametros){
                return $query
                            ->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                            ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
            });
        }
       
        if(isset($parametros['active_filter']) && $parametros['active_filter']){
            if(isset($parametros['clues']) && $parametros['clues']){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_interna where  activo=1 and cr_destino = (select cr from catalogo_cr where clues='".$parametros['clues']."'))");
            }

            if(isset($parametros['cr']) && $parametros['cr']){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_interna where activo=1 and cr_destino ='".$parametros['cr']."')");
            }

            if(isset($parametros['distrito']) && $parametros['distrito'] && $parametros['distrito'] != 0){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_interna where activo=1 and cr_destino in (select cr from catalogo_cr where clues in (select clues from catalogo_clues where cve_jurisdiccion='".$parametros['distrito']."')))");
            }

            if(isset($parametros['imprimible']) && $parametros['imprimible']){
                if($parametros['imprimible'] == 1)
                {
                    $main_query = $main_query
                            ->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_datos_laborales_nomina)")
                            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1  and cr_origen!='' and cr_destino!='')");
                }
                if($parametros['imprimible'] == 2)
                {
                    $main_query = $main_query->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_datos_laborales_nomina)");
                }
            }
        }
        return $main_query;
    }
}
