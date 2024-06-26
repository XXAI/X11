<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \File, \Store;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Facades\Storage;
use App\Models\Trabajador;
use App\Models\RelDocumentacion;
use App\Models\RelDocumentacionDetalles;
use Carbon\Carbon;

//Relacionales
use App\Models\User;


class TramiteDocumentacionController extends Controller
{
    public function index(Request $request)
    {
        $firmantes = array();
        $responsable_clues = array();
        $loggedUser = auth()->userOrFail();

        try{
            $access = $this->getUserAccessData();
            //return $access;
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            $parametros = $request->all();
            

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
            
            //return response()->json(['data'=>$access->is_admin, 'rh'=>$permison_rh, 'oficina'=>$permison_of_central],HttpResponse::HTTP_OK);
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
            }
            /*if($permison_rh || $access->is_admin){
                $trabajador = Trabajador::leftJoin("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                    ->with('rel_trabajador_documentos.detalles', "datoslaborales")
                                        ->where("trabajador.validado", 1)
                                        ->where("trabajador.estatus", 1);
                if(!$access->is_admin){
                    $trabajador = $trabajador->where(function($query)use($access){
                        $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                    });
                }
            }
            else if($permison_of_central == true)
            {
                
                $trabajador = Trabajador::leftJoin("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                        ->with('rel_trabajador_documentos.detalles',"datoslaborales")
                                        //->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus in (1,3)))"))
                                        ->where("trabajador.estatus", 1);
                if(!isset($parametros['estatus']))
                {
                    $trabajador = $trabajador->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus in (1,3)))")); 
                }

                                                              
            }*/ 
            //Filtros
            if(isset($parametros['enviado']))
            {
                if($parametros['enviado'] ==  1)
                {
                    $trabajador = $trabajador->whereRaw("( trabajador.id in (select trabajador_id from rel_trabajador_documentacion where deleted_at is null))");
                }else if($parametros['enviado'] == 2)
                {
                    $trabajador = $trabajador->whereRaw("( trabajador.id not in (select trabajador_id from rel_trabajador_documentacion where deleted_at is null))");
                }
            }

            if(isset($parametros['estatus']) && $parametros['estatus'] != 6)
            {
                $trabajador = $trabajador->whereRaw("(select trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus=".$parametros['estatus']."))");
                
            }
            
            if(isset($parametros['estatus']) && $parametros['estatus'] == 6)
            {
                $trabajador = $trabajador->whereRaw("(select trabajador.id not in (select trabajador_id from rel_trabajador_documentacion))");
                
            }
            
            /*$permison_individual = false;                
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        echo $value2->id."-- ";
                        if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg')
                        {
                            $trabajador = $trabajador->where("rfc", "=", $loggedUser->username);
                            $permison_individual = true;
                        }
                    }
                }
            }*/
            //return response()->json(['data'=>$trabajador->get()],HttpResponse::HTTP_CONFLICT);  
            
            //filtro de valores por permisos del usuario
            /*if(!$access->is_admin && $permison_individual == false){
                $trabajador = $trabajador->where(function($query)use($access){
                    $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                });
            }*/

            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
            

            

            return response()->json(['data'=>$trabajador, 'rh'=>$permison_rh, 'oficina'=>$permison_of_central, 'admin'=> $access->is_admin],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function update(Request $request, $id)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $reglas = ['estatus'=> 'required'];
        
        //return response()->json(['data'=>$request->all()],HttpResponse::HTTP_CONFLICT);    
            
        $object = RelDocumentacion::where("trabajador_id",$id)->first();
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            if($inputs['estatus'] == 4)
            {
                $object->observacion                       = $inputs['observacion'];       
            }

            
            $object->estatus                       = $inputs['estatus'];  
           
            if($inputs['estatus'] == 5 || $inputs['estatus'] == 4)
            {
                $loggedUser = auth()->userOrFail();
                $object->user_respuesta = $loggedUser->id;
                $carbon = Carbon::now();
                $object->fecha_respuesta = $carbon->format('Y-m-d');
            }
            $object->save();
            $arreglo = Array();
            if($inputs['estatus'] == 4)
            {
                $eliminar_historial = RelDocumentacionDetalles::whereRaw("(rel_trabajador_documentacion_id in (select id from rel_trabajador_documentacion where trabajador_id=".$id."))");
                $eliminar_historial->delete();
               foreach ($inputs['requerimientos'] as $key => $value) {
                    //array_push($arreglo, new RelDocumentacionDetalles(['tipo_id' => $value]));
                    $aux = new RelDocumentacionDetalles();
                    $aux->rel_trabajador_documentacion_id=$object->id;
                    $aux->tipo_id = $value;
                    $aux->save();
                }
            }
           
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function Upload(Request $request)
    {
        
        ini_set('memory_limit', '-1');
        
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();

        $reglas = [
            'trabajador_id'       => 'required',
            'rfc'                 => 'required',
            'tipo'                => 'required',  
        ];
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
      
        
     try{  
        $parametros = $request->all();
        $documentacion = RelDocumentacion::where("trabajador_id", $parametros['trabajador_id'])->first();
       
        if(!$documentacion)
        {
            $documentacion = new RelDocumentacion();
        }
        if($request->hasFile('archivo')) {
            
            //$fileName = $parametros['rfc'];
            $extension = $request->file('archivo')->getClientOriginalExtension();
            if($extension == "pdf")
            {
                //$name = $fileName.".".$extension;
                $name = $parametros['trabajador_id'].".".$extension;
                $request->file("archivo")->storeAs("public/documentacion", $name);
                
                $documentacion->trabajador_id = $parametros['trabajador_id']; 
                $documentacion->rfc = $parametros['rfc']; 
                if($parametros['tipo'] == 1)
                {
                    $documentacion->estatus = 1;
                    $documentacion->entrega_personal = 1;
                }else if($parametros['tipo'] == 2)
                {
                    $documentacion->estatus = 3;
                    $documentacion->entrega_personal = 0;
                }
                
                $documentacion->save();
            }else{
                return response()->json(['error' => "Formato de archivo incorrento,extensión pdf en minusculas, favor de verificar" ], HttpResponse::HTTP_CONFLICT);
            }
             
            DB::commit();
            return response()->json(['data'=>$documentacion],HttpResponse::HTTP_OK);
        }else
        {
            DB::rollback();
            return response()->json(['error'=>['message'=>"Error en archivo"]], HttpResponse::HTTP_CONFLICT);
        }
        
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Download(Request $request, $id)
    {
        /*$obj = Trabajador::where("id", $id)->first();
        return response()->file("public//documentacion//".$documentacion->rfc.".pdf");*/
        ini_set('memory_limit', '-1');
        
        
     try{  
       //$documentacion = RelDocumentacion::where("trabajador_id", $id)->first();
        return \Storage::download("public//documentacion//".$id.".pdf");
        //return response()->json(['data'=>$documentacion],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function aplicarFiltros($main_query, $parametros, $access){
        //Filtros, busquedas, ordenamiento
        if(isset($parametros['query']) && $parametros['query']){
            $main_query = $main_query->where(function($query)use($parametros){
                return $query//->where('nombre','LIKE','%'.$parametros['query'].'%')
                            ->whereRaw('concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                            ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                            ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
            });
        }
        
        if(isset($parametros['active_filter']) && $parametros['active_filter']){
            if(isset($parametros['clues']) && $parametros['clues']){
                if(isset($parametros['adscripcion']) && $parametros['adscripcion'] && $parametros['adscripcion'] == 'EOU'){
                    $main_query = $main_query->where('datos_nominales.clues_adscripcion_nomina',$parametros['clues']);
                }else{
                    $main_query = $main_query->where('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$parametros['clues']);
                }
            }

            if(isset($parametros['cr']) && $parametros['cr']){
                $main_query = $main_query->where('rel_trabajador_datos_laborales.cr_fisico_id',$parametros['cr']);
            }

            
        }
        return $main_query;
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
        /*if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }*/
        //return $loggedUser->is_superuser;
        return $accessData;
    }

    public function reporteDia()
    {
        try{
            $carbon = Carbon::now();
            $catalogo = Array(
                "1" => "SOLICITUD DE EMPLEO CON FOTOGRAFIA",
                "2" => "FOTOGRAFÍA TAMAÑO INFANTIL B/N O A COLOR EN PAPEL MATE, NO INSTANTÁNEA (1)",
                "3" => "CURRICULÚM VITAE DEBIDAMENTE FIRMADO",
                "4" => "CONSTANCIA DE NO INHABILITACIÓN (ACTUALIZADA 06 MESES)",
                "5" => "CONSTANCIA DE NO ANTECEDENTES PENALES (ACTUALIZADA 06 MESES)",
                "6" => "CERTIFICADO MÉDICO ACTUALIZADO (NO EXPEDIDA POR CRUZ ROJA MEXICANA, ISSSTE, PARTICULARES E IMSS)",
                "7" => "PROTESTA",
                "8" => "ACTA DE NACIMIENTO ACTUALIZADA, VIGENCIA MÍNIMA 2018",
                "9" => "CONSTANCIA DE SITUACIÓN FISCAL ACTUALIZADA (R.F.C.)",
                "10" => "PRE Y LIBERACIÓN DE LA CARTILLA MILITAR",
                "11" => "ÚLTIMO GRADO DE ESTUDIOS",
                "12" => "COMPROBANTE DE DOMICILIO (02 MESES)",
                "13" => "CURP ACTUALIZADA",
                "14" => "CREDENCIAL DE ELECTOR ACTUALIZADO",
                "15" => "CUENTA Y CLAVE INTERBANCARIA (BANORTE Y/O BANCOMER)",
            );
           
            $resumen = RelDocumentacion::where("fecha_respuesta", $carbon->format('Y-m-d'))
                                            ->groupBy('user_respuesta')
                                            ->select(DB::RAW("(select count(*) from rel_trabajador_documentacion r1 where r1.user_respuesta=user_respuesta and r1.estatus=4) as rechazados"),
                                                    DB::RAW("(select count(*) from rel_trabajador_documentacion r1 where r1.user_respuesta=user_respuesta and r1.estatus=5) as aceptados"),
                                                    DB::RAW("(select name from users where id=user_respuesta) as usuario"),
                                                    "user_respuesta",
                                                    "id")
                                            ->get();
            
            foreach ($resumen as $key => $value) {
                $detalles = RelDocumentacionDetalles::whereRaw("rel_trabajador_documentacion_id in (select id from rel_trabajador_documentacion where fecha_respuesta='".$carbon->format('Y-m-d')."' and user_respuesta=".$value->user_respuesta.")")
                            ->groupBy("tipo_id")
                            ->select("tipo_id",DB::RAW("count(*) as cantidad"))
                            ->get();
                $arreglo_detalles = Array();
                foreach ($detalles as $key2 => $value2) {
                    //$resumen[$key] = 
                    $indice = count($arreglo_detalles);
                    $arreglo_detalles[$indice]['tipo'] = $value2->tipo_id;
                    $arreglo_detalles[$indice]['descripcion'] = $catalogo[$value2->tipo_id];
                    $arreglo_detalles[$indice]['cantidad'] = $value2->cantidad;

                }
                $resumen[$key]['detalles'] = $arreglo_detalles;
            }
            return response()->json(['data'=>$resumen],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
