<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \Storage, \File;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;
use App\Models\Directorio;
use App\Models\RelComisionGerencial;
use App\Models\Cr;
use App\Models\Codigo;
use App\Models\importarTramites;
use Carbon\Carbon;
use App\Models\User;
use App\Exports\DevReportExport;

class TramiteComisionGerencialController extends Controller
{
    public function index(Request $request)
    {
        $loggedUser = auth()->userOrFail();
        
        try{
            $access = $this->getUserAccessData();
            $parametros = $request->all();
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id); //En espera que tenga utilidad el permiso

            $permiso_departamento = false;
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'FZPI3FHjUi3A3lZPoiXVikHbVaVkL9QC'){ $permiso_departamento = true; }
                        
                    }
                }
                    
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'FZPI3FHjUi3A3lZPoiXVikHbVaVkL9QC'){ $permiso_departamento = true; }
                }   
            }

            $filtro_user = "";
            if(!$access->is_admin){
                if(!$permiso_departamento == true)
                {
                    $filtro_user = "and user_id=".$loggedUser->id;
                }
            }

            $trabajador = Trabajador::with("rel_datos_laborales_nomina", "rel_trabajador_comision_gerencial.cr_origen")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1 ".$filtro_user." and deleted_at is null)");

            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access); 
            
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('apellido_paterno');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }else{
                if(isset($parametros['export_excel'])){
                    ini_set('memory_limit', '-1');
                    $fecha_actual = Carbon::now();
                    $trabajador = RelComisionGerencial::where("fecha_oficio",">=", $fecha_actual->format("Y")."-01-01")
                                                        ->join("trabajador", "trabajador.id", "rel_trabajador_comision_gerencial.trabajador_id")
                                                        ->orderBy("fecha_oficio", "asc")
                                                        ->orderBy("rel_trabajador_comision_gerencial.id","asc")
                                                        ->select(DB::RAW("EXTRACT(YEAR FROM fecha_oficio) AS ANIO"),
                                                        DB::RAW("'' as QUINCENA"),
                                                        DB::RAW("'' as CONSECUTIVO"),        
                                                                "trabajador.rfc",
                                                                DB::RAW("CONCAT(trabajador.apellido_paterno,' ',trabajador.apellido_materno,' ',trabajador.nombre) as NOMBRE"),
                                                                DB::RAW("'' as CLUES_DESTINO"),
                                                                DB::RAW("'' as CR_DESTINO"),
                                                                "destino as DESTINO",
                                                                "fecha_oficio as FECHA_OFICIO",
                                                                "fecha_inicio as FECHA_INICIO",
                                                                "fecha_fin as FECHA_FIN",
                                                                DB::RAW("'COMISIÓN' as TIPO"))->get();
                                                                
                            
                    $columnas = array_keys(collect($trabajador[0])->toArray());

                    $filename = 'comision';
                    return (new DevReportExport($trabajador,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']        
                }
            }
               
            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            $trabajador = Trabajador::with("rel_trabajador_comision_gerencial.cr_origen.directorioResponsable.responsable",
                                            "rel_trabajador_comision_gerencial.responsable",
                                                "rel_trabajador_comision_gerencial.cr_origen.dependencia.directorioResponsable.responsable", 
                                                //"rel_trabajador_comision_gerencial.cr_destino.directorioResponsable.responsable", 
                                                //"rel_trabajador_comision_gerencial.cr_destino.dependencia.directorioResponsable.responsable", 
                                                "rel_datos_laborales_nomina")
                                                ->whereRaw(" trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales_nomina)")->find($id);
  
            //Copias y validaciones
            //Control del pago
            $control = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250010")->first();
            //sistematizacion
            $sistematizacion = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700250008")->first();
            //juridico
            $juridico = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700200008")->first();
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
            "direccion_admon"=> $direccion_admon_finanzas, "relaciones_laborales"=>$relaciones_laborales, "elaboracion"=>$elaboracion, "secretario"=>$secretario, "juridico"=>$juridico];

            return response()->json(['data'=>$trabajador, "nombres"=>$nombres],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function buscarTrabajadorComision(Request $request)
    {
        try{
            $parametros = $request->all();
            $obj = DB::Table("trabajador")
                                    ->Join("rel_trabajador_comision_gerencial", "rel_trabajador_comision_gerencial.trabajador_id","trabajador.id")
                                    ->LeftJoin("users", "users.id","rel_trabajador_comision_gerencial.user_id")
                                    ->Join("catalogo_cr", "catalogo_cr.cr","rel_trabajador_comision_gerencial.cr_destino")
                                    ->where(function($query)use($parametros){
                                        return $query
                                                    ->whereRaw('concat(trabajador.nombre," ", trabajador.apellido_paterno, " ", trabajador.apellido_materno) like "%'.$parametros['busqueda_empleado'].'%"' )
                                                    ->orWhere('trabajador.curp','LIKE','%'.$parametros['busqueda_empleado'].'%')
                                                    ->orWhere('trabajador.rfc','LIKE','%'.$parametros['busqueda_empleado'].'%');
                                    })
                                    ->select("trabajador.nombre","trabajador.apellido_paterno","trabajador.apellido_materno","trabajador.rfc", "rel_trabajador_comision_gerencial.fecha_oficio",
                                "rel_trabajador_comision_gerencial.fecha_inicio", "rel_trabajador_comision_gerencial.fecha_fin", "users.name", "users.username", "catalogo_cr.clues", "catalogo_cr.descripcion_actualizada")
                                    ->limit(10)->get();
  

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
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
        $inputs = $inputs['params'];
    
        $reglas = [
            'trabajador_id'           => 'required',
            'folio'                   => 'required',
            'destino'                 => 'required',
            'fecha_oficio'            => 'required',
            'fecha_inicio_periodo'    => 'required',
            'fecha_fin_periodo'       => 'required',
        ];
        
    
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $update = RelComisionGerencial::where("trabajador_id", $inputs['trabajador_id'])
                                        ->where("activo",1)
                                        ->where(function($query) use ($inputs) {
                                            $query->where([
                                                ['fecha_inicio',        '<=', $inputs['fecha_inicio_periodo']],
                                                ['fecha_fin',           '>=', $inputs['fecha_inicio_periodo']]
                                            ])
                                                ->orWhere([
                                                    ['fecha_inicio',  '<=', $inputs['fecha_fin_periodo']],
                                                    ['fecha_fin',       '>=', $inputs['fecha_fin_periodo']]
                                                ]);
                                        })
                                        ->count();

            if($update > 0)
            {
                return response()->json(['message'=>"COMISIÓN GERENCIAL ACTIVA"], HttpResponse::HTTP_CONFLICT);
            }else if($inputs['fecha_fin_periodo'] < date("Y-m-d"))
            {
                return response()->json(['message'=>"PERIODO NO VALIDO"], HttpResponse::HTTP_CONFLICT);
            }
            //
            $loggedUser = auth()->userOrFail();

            $origen = Cr::whereRaw("cr = (select cr_nomina_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            if(!$origen)
            {
                return response()->json(['error'=>['message'=>"TRABAJADOR NO NOMINAL"]], HttpResponse::HTTP_CONFLICT);
            }

            $codigo = Codigo::whereRaw("codigo = (select codigo_puesto_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            
            $object = new RelComisionGerencial();
            $object->cr_origen                  = $origen->cr;
            $object->destino                    = strtoupper($inputs['destino']);
            $object->trabajador_id              = $inputs['trabajador_id'];
            $object->folio                      = $inputs['folio'];
            $object->fecha_oficio               = $inputs['fecha_oficio'];
            $object->fecha_inicio               = $inputs['fecha_inicio_periodo'];
            $object->fecha_fin                  = $inputs['fecha_fin_periodo'];
            $object->trabajador_responsable_id  = $inputs['presentarse_id'];
            $object->codigo_id                  = $codigo->codigo;
            //$object->reingenieria       = $inputs['reingenieria'];
            $object->activo                     = 1;
            $object->user_id                    = $loggedUser->id;
            $object->save();
            
            
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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
        $inputs = $inputs['params'];
    
        $reglas = [
            'trabajador_id'             => 'required',
            'folio'                     => 'required',
            'destino'                   => 'required',
            'fecha_oficio'              => 'required',
            'fecha_inicio_periodo'      => 'required',
            'fecha_fin_periodo'         => 'required',
        ];
        
    
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = RelComisionGerencial::find($id);
             if($inputs['fecha_fin_periodo'] < date("Y-m-d"))
            {
                return response()->json(['error'=>['message'=>"PERIODO NO VALIDO"]], HttpResponse::HTTP_CONFLICT);
            }

            $origen = Cr::whereRaw("cr = (select cr_nomina_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            if(!$origen)
            {
                return response()->json(['error'=>['message'=>"TRABAJADOR NO NOMINAL"]], HttpResponse::HTTP_CONFLICT);
            }
            $codigo = Codigo::whereRaw("codigo = (select codigo_puesto_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            
            $object->cr_origen          = $origen->cr;
            $object->destino            = strtoupper($inputs['destino']);
            $object->folio              = $inputs['folio'];
            $object->trabajador_id      = $inputs['trabajador_id'];
            $object->fecha_oficio       = $inputs['fecha_oficio'];
            $object->fecha_inicio       = $inputs['fecha_inicio_periodo'];
            $object->fecha_fin          = $inputs['fecha_fin_periodo'];
            $object->trabajador_responsable_id  = $inputs['presentarse_id'];
            $object->codigo_id                  = $codigo->codigo;
            //$object->reingenieria       = $inputs['reingenieria'];
            $object->save();
            
            $revision = RelComisionGerencial::where("trabajador_id", $inputs['trabajador_id'])->where("activo",1)->where("fecha_fin",">",date("Y-m-d"))->count();
            if($revision > 1)
            {
                DB::rollback();
                return response()->json(['error'=>['message'=>"COMISIÓN ACTIVA"]], HttpResponse::HTTP_CONFLICT);
            }
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function Destroy($id)
    {
        try{
            $loggedUser = auth()->userOrFail();
            $obj = RelComisionGerencial::where("trabajador_id",$id)->where("activo",1)->first();
            $obj->user_deleted_id = $loggedUser->id;
            $obj->estatus = "C";
            $obj->save();
            $obj->delete();

            return response()->json(['data'=>"Responsable Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    public function truncarComision(Request $request)
    {
        try{
            $carbon = Carbon::now();
            $actual = Carbon::now();
            $dias_mes = $carbon->daysInMonth;
            $dia = $carbon->day;
            $diferencia = 0;

            if($dia < 15)
            {
                $diferencia = 15 - $dia;
            }else{
                $diferencia = $dias_mes - $dia;
            }

            $dia_truncar = $carbon->addDays($diferencia);
            $loggedUser = auth()->userOrFail();
            $inputs = $request->all();
            $inputs = $inputs['params'];
            $obj = RelComisionGerencial::where("trabajador_id",$inputs['trabajador_id'])->where("activo",1)->first();
            if($obj->fecha_inicio > $dia_truncar->format('Y-m-d'))
            {
                $obj->estatus = "C"; // Estatus de interrumpido
                $obj->user_deleted_id = $loggedUser->id;
                $obj->estatus = "C";
                $obj->save();
                $obj->delete();
            }else{
                $obj->estatus = "I"; // Estatus de interrumpido
                $obj->user_updated_id = $loggedUser->id;
                $obj->fecha_fin = $dia_truncar->format('Y-m-d');
                $obj->activo = 0;
                $obj->save();

            }
            // INTERRUMPIR
            return response()->json(['data'=>"Responsable Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function ObtenerLote(Request $request)
    {
        try{
            $parametros = $request->all();

            $access = $this->getUserAccessData();
            $loggedUser = auth()->userOrFail();

            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);
            $permiso_departamento = false;
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'FZPI3FHjUi3A3lZPoiXVikHbVaVkL9QC'){ $permiso_departamento = true; }
                        
                    }
                }
                    
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'FZPI3FHjUi3A3lZPoiXVikHbVaVkL9QC'){ $permiso_departamento = true; }
                }   
            }

            $filtro_user = "";
            if(!$access->is_admin){
                if(!$permiso_departamento == true)
                {
                    $filtro_user = "and user_id".$loggedUser->id;
                }
            }

            $trabajador = Trabajador::with("rel_trabajador_comision_gerencial.cr_origen.directorioResponsable.responsable",
            "rel_trabajador_comision_gerencial.responsable",
            "rel_trabajador_comision_gerencial.cr_origen.dependencia.directorioResponsable.responsable", 
            //"rel_trabajador_comision_gerencial.cr_destino.directorioResponsable.responsable", 
            //"rel_trabajador_comision_gerencial.cr_destino.dependencia.directorioResponsable.responsable", 
            "rel_datos_laborales_nomina")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1 and deleted_at is null ".$filtro_user.")")
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
            //juridico
            $juridico = Directorio::with("responsable")->where("tipo_responsable_id",1)->where("cr", "0700200008")->first();
            
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
            "juridico"=> $juridico];

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
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_gerencial where  activo=1 and cr_destino in (select cr from catalogo_cr where clues='".$parametros['clues']."'))");
            }

            if(isset($parametros['cr']) && $parametros['cr']){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1 and cr_destino ='".$parametros['cr']."')");
            }

            if(isset($parametros['distrito']) && $parametros['distrito'] && $parametros['distrito'] != 0){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1 and cr_destino in (select cr from catalogo_cr where clues in (select clues from catalogo_clues where cve_jurisdiccion='".$parametros['distrito']."')))");
            }

            if(isset($parametros['imprimible']) && $parametros['imprimible']){
                if($parametros['imprimible'] == 1)
                {
                    $main_query = $main_query
                            ->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_datos_laborales_nomina)")
                            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1  and cr_origen!='' and cr_destino!='')");
                }
                if($parametros['imprimible'] == 2)
                {
                    $main_query = $main_query->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_datos_laborales_nomina)");
                }
            }

            if(isset($parametros['fechaCreacion']) && $parametros['fechaCreacion'] ){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_gerencial where created_at between '".$parametros['fechaCreacion']." 00:00:01' AND '".$parametros['fechaCreacion']." 23:59:59')");
            }

            if(isset($parametros['reingenieria']) && $parametros['reingenieria'] !=""){
                $main_query = $main_query->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1 and reingenieria=".$parametros['reingenieria']." and deleted_at is null)");
                ///->where("trabajador.reingenieria ",$parametros['reingenieria']);
            }
        }
        return $main_query;
    }
}
