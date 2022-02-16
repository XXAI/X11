<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;
use App\Models\RelAdscripcion;
use App\Models\Directorio;
use App\Models\Cr;
//use App\Models\RelDocumentacionDetalles;

//Relacionales
use App\Models\User;

class TramiteAdscripcionController extends Controller
{
    public function index(Request $request)
    {
        $loggedUser = auth()->userOrFail();

        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            //return $access;
            /*$permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            
            
            $permison_rh = false;                
            $permison_of_central = false;                
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'EySO29UpzhUKu551egauF0V0gDk5Tqzd')
                        {
                            $permison_rh = true;
                        }
                        if($value2->id == 'KUeJRn2HvxMehoKDSyNTeiJX1Aax7tIh')
                        {
                            $permison_of_central = true;
                        }
                    }
                }
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'EySO29UpzhUKu551egauF0V0gDk5Tqzd')
                    {
                        $permison_rh = true;
                    }
                    if($value2->id == 'KUeJRn2HvxMehoKDSyNTeiJX1Aax7tIh')
                    {
                        $permison_of_central = true;
                    }
                }
            }else{
                //$permison_rh = true;
                //$permison_of_central = true;
            }

            //Sacamos totales para el estatus de las cantidades validadas
            
            if($permison_rh || $access->is_admin){
                $trabajador = Trabajador::Join("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                    ->with('rel_trabajador_documentos.detalles', "datoslaborales")
                                        ->where("trabajador.validado", 1)
                                        ->where("trabajador.estatus", 1)
                                        //->whereRaw(DB::RAW("(trabajador.id not in (select trabajador_id from rel_trabajador_documentacion))"))// or trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus  in (1,2,4,5)))"))
                                        ->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales))"))
                                        ->select("trabajador.id","trabajador.rfc","trabajador.nombre","trabajador.apellido_paterno","trabajador.apellido_materno",
                                                DB::Raw("(select estatus from rel_trabajador_documentacion where trabajador_id=trabajador.id) as estatus"),
                                                DB::Raw("(select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id) as cr"),
                                                DB::Raw("(select descripcion from  catalogo_cr where cr = (select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id)) as descripcion"));
                if(!$access->is_admin){
                    $trabajador = $trabajador->where(function($query)use($access){
                        $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                        
                    });
                }
            }else if($permison_of_central == true)
            {
                
                $trabajador = Trabajador::Join("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                        ->with('rel_trabajador_documentos.detalles',"datoslaborales")
                                        //->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus in (1,3)))"))
                                        ->where("trabajador.estatus", 1)
                                        ->select("trabajador.id","trabajador.rfc","trabajador.nombre","trabajador.apellido_paterno","trabajador.apellido_materno",
                                                DB::Raw("(select estatus from rel_trabajador_documentacion where trabajador_id=trabajador.id) as estatus"),
                                                DB::Raw("(select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id) as cr"),
                                                DB::Raw("(select descripcion from  catalogo_cr where cr = (select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id)) as descripcion"));
                if(!isset($parametros['estatus']))
                {
                    $trabajador = $trabajador->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus in (3,5)))")); 
                }

                                                              
            }*/

            //Filtros
            /*if(isset($parametros['enviado']))
            {
                if($parametros['enviado'] ==  1)
                {
                    $trabajador = $trabajador->whereRaw("( trabajador.id in (select trabajador_id from rel_trabajador_documentacion where deleted_at is null))");
                }else if($parametros['enviado'] == 2)
                {
                    $trabajador = $trabajador->whereRaw("( trabajador.id not in (select trabajador_id from rel_trabajador_documentacion where deleted_at is null))");
                }
            }

            if(isset($parametros['estatus']))
            {
                $trabajador = $trabajador->whereRaw("(select trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus=".$parametros['estatus']."))");
                
            }*/
            
            //$trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);
            $trabajador = RelAdscripcion::with("cr_origen", "cr_destino", "trabajador.rel_datos_laborales_nomina")->where("cr_origen", "!=", "");
                                    //->whereRaw("(trabajador_id in (select trabajador_id from rel_trabajador_adscripcion where deleted_at is null group by trabajador_id)");
                                   
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('fecha_cambio');

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
            $trabajador = RelAdscripcion::with("cr_origen.directorioResponsable.responsable",
            "cr_origen.dependencia.directorioResponsable.responsable", 
            "cr_destino.directorioResponsable.responsable", 
            "cr_destino.dependencia.directorioResponsable.responsable", 
            "trabajador.rel_datos_laborales_nomina")->find($id);
  
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

            $trabajador = RelAdscripcion::with("cr_origen.directorioResponsable.responsable",
                                                "cr_origen.dependencia.directorioResponsable.responsable", 
                                                "cr_destino.directorioResponsable.responsable", 
                                                "cr_destino.dependencia.directorioResponsable.responsable", 
                                                "trabajador.rel_datos_laborales_nomina")->where("cr_origen", "!=", "")
                                                ->whereRaw(" trabajador_id in (select trabajador_id from rel_trabajador_datos_laborales_nomina)");

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('fecha_cambio');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 1;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
            
            
           /*$jurisdicciones = Cr::where("tipo_unidad", 1)
                                        ->LeftJoin("catalogo_clues", "catalogo_clues.clues", "=", "catalogo_cr.clues")
                                        ->leftJoin("rel_trabajador_cr_responsables", "rel_trabajador_cr_responsables.cr", "catalogo_cr.cr")
                                        ->leftJoin("trabajador", "trabajador.id", "rel_trabajador_cr_responsables.trabajador_id")
                                        ->where("rel_trabajador_cr_responsables.tipo_responsable_id", "=", 1)
                                        ->whereNull("rel_trabajador_cr_responsables.deleted_at")
                                        ->whereNull("catalogo_clues.deleted_at")
                                        ->whereNull("catalogo_cr.deleted_at")
                                        ->whereNull("trabajador.deleted_at")
                                        ->select("trabajador.nombre", "trabajador.apellido_paterno", "trabajador.apellido_materno", "rel_trabajador_cr_responsables.cargo",
                                                "catalogo_clues.cve_jurisdiccion")
                                        ->get();*/
                                    
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
            "direccion_admon"=> $direccion_admon_finanzas, "relaciones_laborales"=>$relaciones_laborales, "elaboracion"=>$elaboracion, "secretario"=>$secretario,
        /*"jurisdicciones"=>$jurisdicciones*/];

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
}
