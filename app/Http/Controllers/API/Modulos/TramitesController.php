<?php


namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Database\Eloquent\Collection;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Carbon\Carbon;


use App\Models\Tramites;
use App\Models\Directorio;
use App\Models\Trabajador;
use App\Models\User;
use App\Models\Clues;
use App\Models\Cr;

class TramitesController extends Controller
{
    public function index(Request $request)
    {
        $firmantes = array();
        $responsable_clues = array();
        $loggedUser = auth()->userOrFail();
        try{
            $access = $this->getUserAccessData();
            
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
                $permison_rh = true;
                $permison_of_central = true;
            }

            $tramites = Tramites::select('rel_trabajador_tramites.*')
                                ->leftjoin('trabajador','trabajador.id','=','rel_trabajador_tramites.trabajador_id')
                                ->leftjoin('catalogo_cr as cr_origen_desc','cr_origen_desc.cr','=','rel_trabajador_tramites.cr_origen')
                                ->leftjoin('catalogo_cr as cr_destino_desc','cr_destino_desc.cr','=','rel_trabajador_tramites.cr_destino')
                                ->with('trabajador.datoslaborales', 'trabajador.datoslaboralesnomina');
            //
            if(isset($parametros['query']) && $parametros['query']){
                $tramites = $tramites->where(function ($query)use($parametros){
                                        $query->where('rel_trabajador_tramites.fecha_inicio','like','%'.$parametros['query'].'%')
                                        ->orWhere('rel_trabajador_tramites.fecha_final','like','%'.$parametros['query'].'%')
                                        ->orWhere('rel_trabajador_tramites.cr_origen','like','%'.$parametros['query'].'%')
                                        ->orWhere('rel_trabajador_tramites.cr_destino','like','%'.$parametros['query'].'%')
                                        ->orWhereRaw('concat(trabajador.nombre," ", trabajador.apellido_paterno, " ", trabajador.apellido_materno) like "%'.$parametros['query'].'%"' )
                                        ->orWhereRaw('concat(trabajador.apellido_paterno, " ", trabajador.apellido_materno, " ", trabajador.nombre) like "%'.$parametros['query'].'%"' )
                                        ->orWhere('trabajador.curp','LIKE','%'.$parametros['query'].'%')
                                        ->orWhere('trabajador.rfc','LIKE','%'.$parametros['query'].'%')
                                        ->orWhere('cr_origen_desc.descripcion','LIKE','%'.$parametros['query'].'%')
                                        ->orWhere('cr_origen_desc.clues','LIKE','%'.$parametros['query'].'%')
                                        ->orWhere('cr_destino_desc.descripcion','LIKE','%'.$parametros['query'].'%')
                                        ->orWhere('cr_destino_desc.clues','LIKE','%'.$parametros['query'].'%');
                                    });
            }

            //
            $tramites_origen = $tramites;
            $tramites_destino = clone $tramites;
            $tramites_validacion = clone $tramites;

            if($permison_rh == true && !$access->is_admin){
                $tramites_origen = $tramites_origen->whereIn('cr_origen',$access->lista_cr);
                $tramites_destino = $tramites_destino->whereIn('cr_destino',$access->lista_cr);
            }/*else if($permison_of_central == true)
            {*/
            $tramites_validacion = $tramites_validacion->where(function ($where){ $where->where('estatus_origen',1)->where('estatus_destino',1); });
            //}
            //filtro de valores por permisos del usuario
            
            if(isset($parametros['page'])){
                
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $tramites_origen = $tramites_origen->paginate($resultadosPorPagina);
                $tramites_destino = $tramites_destino->paginate($resultadosPorPagina);
                $tramites_validacion = $tramites_validacion->paginate($resultadosPorPagina);
            }else{
                $tramites_origen = ['data' => $tramites_origen->get()];
                $tramites_destino = ['data' => $tramites_destino->get()];
                $tramites_validacion = ['data' => $tramites_validacion->get()];
            }
            
            return response()->json(['data_origen'=>$tramites_origen,'data_destino'=>$tramites_destino,'data_validacion'=>$tramites_validacion, 'rh'=>$permison_rh, 'rh_central'=>$permison_of_central],HttpResponse::HTTP_OK);
            //return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        /*try{
            $parametros = $request->all();
            $tramite = Tramites::where("trabajador_id", $parametros['trabajador'])->get();
            return response()->json(['data'=>$tramite],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }*/
    }
    public function store(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $inputs = $inputs['params'];
        $reglas = [];
            $reglas = [
            ];
        

        DB::beginTransaction();
        $object = new Tramites();
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        $tramite = Tramites::where("trabajador_id", $inputs['trabajador'])->first();
        if($tramite != null)
        {
            return response()->json(["Existe una solicitud actualmente activa, favor de verificar" ], HttpResponse::HTTP_CONFLICT);
        }
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            
            $object->trabajador_id = $inputs['trabajador'];
            $object->tipo_tramite_id = 1;
            //$object->estatus = 1;
            
            
            $trabajador = Trabajador::with("datoslaborales", "datoslaboralesnomina")->find($inputs['trabajador']);
            $object->cr_origen = $trabajador->datoslaboralesnomina->cr_nomina_id;
            $object->cr_destino = $trabajador->datoslaborales->cr_fisico_id;
            
            if($trabajador->datoslaboralesnomina->clues->clave_nivel == 1)
            {
                $clues = Clues::with("cr")->where("clave_nivel", 4)->where("cve_jurisdiccion", $trabajador->datoslaboralesnomina->clues->cve_jurisdiccion)->first();
                //return Response::json(['error' => $clues], HttpResponse::HTTP_CONFLICT);
                $object->cr_firmante_origen = $clues->cr[0]->cr;
            }else{
                $object->cr_firmante_origen = $trabajador->datoslaboralesnomina->cr_nomina_id;
            }

            if($trabajador->datoslaborales->clues_fisico->clave_nivel == 1)
            {
                $clues = Clues::with("cr")->where("clave_nivel", 4)->where("cve_jurisdiccion", $trabajador->datoslaborales->clues_fisico->cve_jurisdiccion)->first();
                $object->cr_firmante_destino = $clues->cr[0]->cr;
            }else{
                $cr_firmante_destino = $trabajador->datoslaborales->cr_fisico_id;
                $cr_responsable_destino = Directorio::where("tipo_responsable_id",1)->where("cr", $cr_firmante_destino)->first();
                //DB::rollback();
                //return response()->json($cr_firmante_destino,HttpResponse::HTTP_OK);
                /*if($cr_responsable_destino->trabajador_id == $trabajador->id){
                    $cr_destino = Cr::where('cr',$trabajador->datoslaborales->cr_fisico_id)->first();
                    $desglose_area = explode('.',$cr_destino->area);

                    $cr_firma_destino = Cr::where('clues',$cr_destino->clues)->where('area',$desglose_area[0])->first();
                    $object->cr_firmante_destino = $cr_firma_destino->cr;
                }else{*/
                    $object->cr_firmante_destino = $cr_firmante_destino;
                //}
            }
            
            $fecha_actual = Carbon::now();
            
            $dia = $fecha_actual->day;
            $fecha_inicial = "";
            $fecha_final = "";
            if($dia < 15)
            {
                $diferencia = 16 - $dia;
                $fecha_actual->addDays($diferencia);
                $fecha_inicial = $fecha_actual->format("Y/m/d");
                $fecha_calculada = $fecha_actual;
                $fecha_calculada->addMonths(5);
                $fecha_calculada->addMonth();
                $fecha_calculada = $fecha_calculada->firstOfMonth();
                $fecha_calculada->subDay();
                $fecha_final = $fecha_calculada->format("Y/m/d");
            }else{
                $fecha_actual->addMonth();
                $fecha_actual = $fecha_actual->firstOfMonth();
                $fecha_inicial = $fecha_actual->format("Y/m/d");
                
                $fecha_calculada = $fecha_actual;
                $fecha_calculada->addMonths(5);
                $fecha_calculada->addDays(14);
                $fecha_final = $fecha_calculada->format("Y/m/d");
            }
            //Se quitar por el momento
            //$object->fecha_inicio = $fecha_inicial;
            //$object->fecha_final = $fecha_final;
            $object->fecha_inicio ="2022/01/01";
            $object->fecha_final ="2022/06/15";

            //return Response::json(['error' => $trabajador], HttpResponse::HTTP_CONFLICT);
            $object->save();
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            $params = $request->all();

            //$tramite = Tramites::with("trabajador.datoslaborales", "trabajador.datoslaboralesnomina")->find($id);
            $tramite = Trabajador::with("datoslaborales", 
                                        "datoslaboralesnomina",
                                        "rel_trabajador_tramite.cr_origen.directorioResponsable.responsable",
                                        "rel_trabajador_tramite.cr_origen.dependencia.directorioResponsable.responsable",
                                        "rel_trabajador_tramite.cr_destino.dependencia.directorioResponsable.responsable",
                                        "rel_trabajador_tramite.cr_destino.directorioResponsable.responsable"
                                        )
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_tramites)")
            ->find($id);

            $firmante_origen = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", $tramite->cr_firmante_origen)->first();
            $firmante_destino = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", $tramite->cr_firmante_destino)->first();
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
            return response()->json(["data"=>$tramite, "firmanteOrigen"=>$firmante_origen, "firmanteDestino"=>$firmante_destino, "nombres" => $nombres ],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function ListTramites(Request $request, $id)
    {
        try{
            $params = $request->all();

            $tramite = Tramites::with("trabajador.datoslaborales", "trabajador.datoslaboralesnomina")->where("trabajador_id",$id)->get();

            return response()->json($tramite,HttpResponse::HTTP_OK);
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
        $reglas = [];
        //return response()->json($inputs,HttpResponse::HTTP_OK);
        $reglas = [];
            
            
        $object = Tramites::find($id);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            //$object->estatus                       = $inputs['estatus'];   
            $fecha_actual = Carbon::now();
            
            $loggedUser = auth()->userOrFail();
            if($inputs['tipo_comision'] == 1)
            {
                $object->estatus_destino = $inputs['estatus'];
                $object->user_destino_id = $loggedUser->id;
                $object->fecha_respuesta_destino = $fecha_actual->format("Y-m-d H:i:s");
                if($inputs['estatus'] == 2)
                {
                    $object->estatus_validacion = $inputs['estatus'];
                }

            }else if($inputs['tipo_comision'] == 2){
                $object->estatus_origen = $inputs['estatus'];
                $object->user_origen_id = $loggedUser->id;
                $object->fecha_respuesta_origen = $fecha_actual->format("Y-m-d H:i:s");
                if($inputs['estatus'] == 2)
                {
                    $object->estatus_validacion = $inputs['estatus'];
                }
            }else if($inputs['tipo_comision'] == 3){
                /*$fecha_actual = Carbon::now();
                $fecha_calculada;
                $dia = $fecha_actual->day;
                $fecha_inicial = "";
                $fecha_final = "";
                if($dia < 15)
                {
                    $diferencia = 16 - $dia;
                    $fecha_actual->addDays($diferencia);
                    $fecha_inicial = $fecha_actual->format("Y/m/d");
                    $fecha_calculada = $fecha_actual;
                    $fecha_calculada->addMonths(5);
                    $fecha_calculada->addMonth();
                    $fecha_calculada = $fecha_calculada->firstOfMonth();
                    $fecha_calculada->subDay();
                    $fecha_final = $fecha_calculada->format("Y/m/d");
                }else{
                    $fecha_actual->addMonth();
                    $fecha_actual = $fecha_actual->firstOfMonth();
                    $fecha_inicial = $fecha_actual->format("Y/m/d");
                    
                    $fecha_calculada = $fecha_actual;
                    $fecha_calculada->addMonths(5);
                    $fecha_calculada->addDays(14);
                    $fecha_final = $fecha_calculada->format("Y/m/d");
                }
                $object->fecha_inicio = $fecha_inicial;
                $object->fecha_final = $fecha_final;*/
                $object->estatus_validacion = $inputs['estatus'];
                $fecha_validacion = Carbon::now();
                $object->fecha_respuesta_validacion = $fecha_validacion->format("Y-m-d H:i:s");
            }    
            /*if($inputs['estatus'] == 3)
            {
                
            }*/   
            $object->save();
            
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }
}
