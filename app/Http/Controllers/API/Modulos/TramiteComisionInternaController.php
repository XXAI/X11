<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \Storage, \File;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;
use App\Models\Directorio;
use App\Models\RelComisionInterna;
use App\Models\Cr;
use App\Models\importarTramites;
use Carbon\Carbon;

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

            $trabajador = Trabajador::with("rel_datos_laborales_nomina", "rel_trabajador_comision_interna.cr_origen", "rel_trabajador_comision_interna.cr_destino")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1 ".$filtro_user." and deleted_at is null)");

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
                                    ->Join("rel_trabajador_comision_interna", "rel_trabajador_comision_interna.trabajador_id","trabajador.id")
                                    ->LeftJoin("users", "users.id","rel_trabajador_comision_interna.user_id")
                                    ->Join("catalogo_cr", "catalogo_cr.cr","rel_trabajador_comision_interna.cr_destino")
                                    ->where(function($query)use($parametros){
                                        return $query
                                                    ->whereRaw('concat(trabajador.nombre," ", trabajador.apellido_paterno, " ", trabajador.apellido_materno) like "%'.$parametros['busqueda_empleado'].'%"' )
                                                    ->orWhere('trabajador.curp','LIKE','%'.$parametros['busqueda_empleado'].'%')
                                                    ->orWhere('trabajador.rfc','LIKE','%'.$parametros['busqueda_empleado'].'%');
                                    })
                                    ->select("trabajador.nombre","trabajador.apellido_paterno","trabajador.apellido_materno","trabajador.rfc", "rel_trabajador_comision_interna.fecha_oficio",
                                "rel_trabajador_comision_interna.fecha_inicio", "rel_trabajador_comision_interna.fecha_fin", "users.name", "users.username", "catalogo_cr.clues", "catalogo_cr.descripcion_actualizada")
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
            'folio'           => 'required',
            'trabajador_id'           => 'required',
            'clues'                     => 'required',
            'fecha_oficio'           => 'required',
            'fecha_inicio_periodo'           => 'required',
            'fecha_fin_periodo'           => 'required',
        ];
        
    
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $update = RelComisionInterna::where("trabajador_id", $inputs['trabajador_id'])
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
            //Validacion del registro
            if($update > 0)
            {
                return response()->json(['message'=>"COMISIÓN ACTIVA"], HttpResponse::HTTP_CONFLICT);
            }else if($inputs['fecha_fin_periodo'] < date("Y-m-d"))
            {
                return response()->json(['message'=>"PERIODO NO VALIDO"], HttpResponse::HTTP_CONFLICT);
            }
            //
            
            
            /*if($update)
            {
                //return Response::json(['error' => $update], HttpResponse::HTTP_CONFLICT);
                $update->activo = 0;
                $update->save();    
            }*/
            $loggedUser = auth()->userOrFail();

            $origen = Cr::whereRaw("cr = (select cr_nomina_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            if(!$origen)
            {
                return response()->json(['error'=>['message'=>"TRABAJADOR NO NOMINAL"]], HttpResponse::HTTP_CONFLICT);
            }

            $object_desactivar = RelComisionInterna::where("trabajador_id",$inputs['trabajador_id'])->first();
            if($object_desactivar)
            {
                $object_desactivar->activo = 0;
                $object_desactivar->save();
            }

            $object = new RelComisionInterna();
            $object->cr_origen          = $origen->cr;
            $object->cr_destino         = $inputs['clues']['cr'];
            $object->trabajador_id      = $inputs['trabajador_id'];
            $object->folio              = $inputs['folio'];
            $object->fecha_oficio       = $inputs['fecha_oficio'];
            $object->fecha_inicio       = $inputs['fecha_inicio_periodo'];
            $object->fecha_fin          = $inputs['fecha_fin_periodo'];
            $object->reingenieria       = $inputs['reingenieria'];
            $object->activo             = 1;
            $object->user_id            = $loggedUser->id;
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
            'trabajador_id'           => 'required',
            'clues'                     => 'required',
            'fecha_oficio'           => 'required',
            'fecha_inicio_periodo'           => 'required',
            'fecha_fin_periodo'           => 'required',
        ];
        
    
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            $object = RelComisionInterna::find($id);
            /* if($inputs['fecha_fin_periodo'] < date("Y-m-d"))
            {
                return response()->json(['error'=>['message'=>"PERIODO NO VALIDO"]], HttpResponse::HTTP_CONFLICT);
            }*/

            $origen = Cr::whereRaw("cr = (select cr_nomina_id from rel_trabajador_datos_laborales_nomina where trabajador_id=".$inputs['trabajador_id'].")")->first();
            if(!$origen)
            {
                return response()->json(['error'=>['message'=>"TRABAJADOR NO NOMINAL"]], HttpResponse::HTTP_CONFLICT);
            }
            
            $object->cr_origen          = $origen->cr;
            $object->cr_destino         = $inputs['clues']['cr'];
            $object->trabajador_id      = $inputs['trabajador_id'];
            $object->folio              = $inputs['folio'];
            $object->fecha_oficio       = $inputs['fecha_oficio'];
            $object->fecha_inicio       = $inputs['fecha_inicio_periodo'];
            $object->fecha_fin          = $inputs['fecha_fin_periodo'];
            $object->reingenieria       = $inputs['reingenieria'];
            $object->save();
            
            $revision = RelComisionInterna::where("trabajador_id", $inputs['trabajador_id'])->where("activo",1)->where("fecha_fin",">",date("Y-m-d"))->count();
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
            $obj = RelComisionInterna::where("trabajador_id",$id)->where("activo",1)->first();
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
            $obj = RelComisionInterna::where("trabajador_id",$inputs['trabajador_id'])->where("activo",1)->first();
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

    public function UploadCsv(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
      
        try{  
            $parametros = $request->all();
            $loggedUser = auth()->userOrFail();
            $folder = "";
            
            $folder = "importacion";
            
            importarTramites::where("user_id",$loggedUser->id)->forceDelete();
            
            if($request->hasFile('archivo')) {
                $extension = $request->file('archivo')->getClientOriginalExtension();
                if($extension == "csv" || $extension == "CSV")
                {
                    Storage::disk('public')->put($folder."\\importacion_".$loggedUser->id.".csv" , File::get($request->file("archivo")));
                }else{
                    return response()->json(['error' => "Formato de archivo incorrento,extensión csv requerida, favor de verificar" ], HttpResponse::HTTP_CONFLICT);
                }
                return response()->json(['data'=>''],HttpResponse::HTTP_OK);
            }else
            {
               return response()->json(['error'=>['message'=>"Error en archivo"]], HttpResponse::HTTP_CONFLICT);
            }
            
        }catch(\Exception $e){

            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    
    public function CargarInformacion(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
      
        try{  
            $loggedUser = auth()->userOrFail();
            DB::beginTransaction();
            $parametros = $request->all();
            $parametros = $parametros['params'];
            $folder = "";
            //if($inputs['tipo'] == 1)
            //{
                $folder = "importacion";
            //}
            
            $archivo_csv = storage_path().'/app/public/'.$folder."/importacion_".$loggedUser->id.".csv";
            $data = \Excel::toArray('', $archivo_csv, null, \Maatwebsite\Excel\Excel::TSV)[0];
            $registros = [];
            foreach ($data as $key => $value) {
                $indice = count($registros);
                $registros[$indice]['rfc']                      = ($value[0] == null)?'':$value[0];
                $registros[$indice]['nombre_completo']          = ($value[1] == null)?'':$value[1];
                $registros[$indice]['clues']                    = ($value[2] == null)?'':$value[2];
                $registros[$indice]['cr_destino']               = ($value[3] == null)?'':$value[3];
                $registros[$indice]['codigo']                   = ($value[4] == null)?'':$value[4];
                $registros[$indice]['adscripcion']              = ($value[5] == null)?'':$value[5];
                $registros[$indice]['fecha_oficio']             = ($value[6] == null)?'':$value[6];
                $registros[$indice]['fecha_inicio']             = ($value[7] == null)?'':$value[7];
                $registros[$indice]['fecha_fin']                = ($value[8] == null)?'':$value[8];
                $registros[$indice]['reingenieria']             = ($value[9] == null)?'':$value[9];
                $registros[$indice]['tipo']                     = $parametros['tipo'];
                $registros[$indice]['destino']                  = ($value[10] == null)?'':$value[10];
                $registros[$indice]['trabajador_responsable_id']= ($value[11] == null)?'':$value[11];
                $registros[$indice]['folio']                    = ($value[12] == null)?'':$value[12];
                $registros[$indice]['user_id']                  = $loggedUser->id;
                
            }
            unset($registros[0]); //Eliminamos la cabecera para que no se importe
            foreach ($registros as $key => $value) {
                importarTramites::create($value);        
            }
            
            DB::commit();
            return response()->json(['data'=>$registros],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }    
    }

    public function ValidarImportacion(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
        $parametros = $inputs['params'];
        try{  
            $loggedUser = auth()->userOrFail();
            
            $filtro = " a.user_id=".$loggedUser->id." and a.tipo=".$parametros['tipo'];
            
            //Validamos id del trabajador por rfc
            DB::statement("UPDATE importar_tramites a left join trabajador b on a.`rfc`=b.`rfc` set trabajador_id=b.id where ".$filtro);
            
            //Validamos id del trabajador por nombre
            DB::statement("UPDATE importar_tramites a LEFT JOIN trabajador b on a.`nombre_completo`=concat(b.nombre,' ',b.apellido_paterno,' ',b.apellido_materno) or a.`nombre_completo`=concat(b.apellido_paterno,' ',b.apellido_materno,' ', b.nombre) set a.trabajador_id=b.id where ".$filtro." and a.trabajador_id=0");
            
            //Validamos adscripcion nominal de origen, y su codigo
            DB::statement("UPDATE importar_tramites a INNER JOIN rel_trabajador_datos_laborales_nomina b ON a.`trabajador_id`=b.`trabajador_id` INNER JOIN catalogo_cr c ON b.cr_nomina_id=c.cr AND c.`deleted_at` IS NULL SET a.cr_origen=b.cr_nomina_id, a.codigo_id=b.codigo_puesto_id WHERE a.trabajador_id!=0 and b.`cr_nomina_id` IS NOT NULL and ".$filtro);
            
            //Validamos adscripcion nominal antes de modificacion
            DB::statement("UPDATE importar_tramites a INNER JOIN rel_trabajador_datos_laborales b ON a.`trabajador_id`=b.`trabajador_id` SET a.cr_before_id=b.cr_fisico_id WHERE a.trabajador_id!=0 and b.`cr_fisico_id` IS NOT NULL and ".$filtro);
            
            if (!in_array($parametros['tipo'], ['3'])) {
                //Validamos cr del destino por cr para sacar los de la oficina
                DB::statement("UPDATE importar_tramites a LEFT JOIN catalogo_cr b ON a.`cr_destino`=b.`cr` AND b.`deleted_at` IS NULL SET cr_destino=b.cr WHERE a.clues='CSSSA017213' and b.cr IS NOT NULL and ".$filtro);
            
                //Validamos cr del destino por clues
                DB::statement("UPDATE importar_tramites a LEFT JOIN catalogo_cr b ON a.`clues`=b.`clues` AND b.`deleted_at` IS NULL SET cr_destino=b.cr WHERE a.clues!='CSSSA017213' and b.cr IS NOT NULL and ".$filtro);
            }

            //Validacion de datos correctos e ingreso de observaciones
            //Validamos trabajador activo
            DB::statement("update importar_tramites a  set observaciones=' -<b>TRABAJADOR NO ENCONTRADO<b><br>' where ".$filtro." and trabajador_id is null OR trabajador_id=0 OR trabajador_id = ''");
            
            //Validamos trabajador duplicado
            $importacion = importarTramites::where("trabajador_id","!=",0)->where("user_id",$loggedUser->id)->where("tipo", $parametros['tipo'])->groupBy("trabajador_id")->havingRaw("count(*)>1")->select("trabajador_id")->get();
            //DB::statement("update importar_tramites a set observaciones=concat(observaciones,', TRABAJADOR DUPLICADO') where trabajador_id!=0 and trabajador_id in (select trabajador_id from importar_tramites group by trabajador_id)");
            foreach ($importacion as $key => $value) {
                DB::statement("update importar_tramites a set observaciones=concat(observaciones,'- <b>TRABAJADOR DUPLICADO</b><br>'), estatus=2 where trabajador_id=".$value->trabajador_id);
                //echo "update importar_tramites a set observaciones=concat(observaciones,', TRABAJADOR DUPLICADO') where trabajador_id=".$value->trabajador_id;
            }
            
            if (!in_array($parametros['tipo'], ['3'])) {
                //Validamos destino encontrado
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>CR DESTINO NO ENCONTRADO</b><br> '), estatus=3 where ".$filtro." and cr_destino is null or cr_destino=0 or cr_destino = ''");
            
                //Validamos destino encontrado (por mala captura)
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>CR DESTINO NO ENCONTRADO (EN CATÁLOGO)</b><br>'), estatus=3 where ".$filtro." and cr_destino not in (select cr from catalogo_cr where deleted_at is null)");

                //Validamos origen destino
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>ORIGEN Y DESTINO IGUALES</b><br>'), estatus=6 where ".$filtro." and cr_origen=cr_destino");
            }

            //Validamos origen encontrado
            DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>CR ADSCRIPCION NO ENCONTRADO</b><br>'), estatus=4 where ".$filtro." and cr_origen is null or cr_origen=0 or cr_origen = ''");
            
            if (in_array($parametros['tipo'], ['1','3'])) {
                //Validamos fechas
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>FECHA DE OFICIO MAYOR A FECHA DE INICIO DE PERIODO</b><br>'), estatus=5 where ".$filtro."  and fecha_inicio>concat(EXTRACT(YEAR FROM a.`fecha_inicio`),'-01-04') AND fecha_oficio>fecha_inicio");
                //Validamos comision activa
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>COMISIÓN ACTIVA</b>'), estatus=7 where ".$filtro." and trabajador_id in (select trabajador_id from rel_trabajador_comision_interna where activo=1)");
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>COMISIÓN ACTIVA</b>'), estatus=7 where ".$filtro." and trabajador_id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1)");
                DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>SIN COMISIÓN HISTORICA</b>'), estatus=99 where ".$filtro." and (trabajador_id not in (select trabajador_id from rel_trabajador_comision_gerencial where deleted_at is null) and trabajador_id not in (select trabajador_id from rel_trabajador_comision_interna where deleted_at is null))");
                /*if (in_array($parametros['tipo'], ['2'])) {
                    
                }else if (in_array($parametros['tipo'], ['3'])) {
                    //Validamos comision activa
                    DB::statement("update importar_tramites a  set observaciones=concat(observaciones, '-<b>COMISIÓN ACTIVA</b>'), estatus=7 where ".$filtro." and trabajador_id in (select trabajador_id from rel_trabajador_comision_gerencial where activo=1)");
                }*/

                //Validamos fechas de eventual
                DB::statement("UPDATE importar_tramites a INNER JOIN rel_trabajador_datos_laborales_nomina b ON a.`trabajador_id`=b.`trabajador_id` SET observaciones=CONCAT(observaciones,'-<b>FECHA DE CONTRATO EVENTUAL</b>'), estatus=5 WHERE  ".$filtro." and b.`ur` NOT IN ('416','HOM','REG','FO2','FO3','FOR') AND a.`estatus`=1  AND EXTRACT(YEAR FROM a.`fecha_inicio`) != EXTRACT(YEAR FROM a.`fecha_fin`)");//(a.`fecha_inicio`<'".date("Y")."-01-01' OR a.`fecha_fin`>'".date("Y")."-12-31')

                //Validamos fechas 
                DB::statement("UPDATE importar_tramites a SET observaciones=CONCAT(observaciones,'-<b>PERIODO NO VIGENTE</b>'), estatus=5 WHERE  ".$filtro." and a.fecha_fin<'".date("Y-m-d")."' AND a.`estatus`=1");           
            }
            
            
            $respuesta['total'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->count();
            $respuesta['totalCorrectos'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus",1)->count();
            $respuesta['totalIncorrectos'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","!=",1)->count();
            $respuesta['totalDuplicado'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",2)->count();
            $respuesta['totalDestino'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",3)->count();
            $respuesta['totalOrigen'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",4)->count();
            $respuesta['totalFechas'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",5)->count();
            $respuesta['totalNoTrabajadores'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("trabajador_id",0)->count();
            $respuesta['totalOrigenDestino'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",6)->count();
            $respuesta['totalComisionActiva'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",7)->count();
            $respuesta['totalAdvertencia'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","=",99)->count();
            $respuesta['data'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->where("estatus","!=",1)->orderBy("estatus","asc")->orderBy("trabajador_id","asc")->get();

            
            return response()->json(['data'=>$respuesta],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }   
    }

    public function migrarInformacion(Request $request)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
        $parametros = $inputs['params'];
        try{  
            $loggedUser = auth()->userOrFail();
            
            //$filtro = " a.user_id=".$loggedUser->id." and a.tipo=".$parametros['tipo'];
            if($parametros['tipo'] == 1)
            {
                //importamos origen encontrado
                DB::statement("INSERT INTO rel_trabajador_comision_interna (trabajador_id, cr_origen, cr_destino, fecha_oficio, fecha_inicio, fecha_fin, reingenieria, activo, user_id, created_at, updated_at, cr_before_id, folio) SELECT trabajador_id, cr_origen, cr_destino, fecha_oficio, fecha_inicio, fecha_fin, reingenieria, 1, user_id, '".date("Y-m-d")." 16:00:00', '".date("Y-m-d")." 16:00:00', cr_before_id, folio FROM importar_tramites WHERE tipo=1 and estatus in (1,99) AND user_id=".$loggedUser->id.";");
                
            }else if($parametros['tipo'] == 2){
                DB::statement("INSERT INTO rel_trabajador_adscripcion (trabajador_id, cr_origen, cr_destino, fecha_oficio, fecha_cambio, reingenieria, activo, user_id, created_at, updated_at, cr_before_id, folio) SELECT trabajador_id, cr_origen, cr_destino, fecha_oficio, fecha_inicio, reingenieria, 1, user_id, '".date("Y-m-d")." 16:00:00', '".date("Y-m-d")." 16:00:00', cr_before_id, folio FROM importar_tramites WHERE tipo=2 and estatus=1 AND user_id=".$loggedUser->id.";");
            }else if($parametros['tipo'] == 3){
                DB::statement("INSERT INTO rel_trabajador_comision_gerencial (trabajador_id, cr_origen, destino, fecha_oficio, fecha_inicio, fecha_fin, reingenieria, activo, user_id, created_at, updated_at, codigo_id, trabajador_responsable_id, folio) SELECT trabajador_id, cr_origen, destino, fecha_oficio, fecha_inicio, fecha_fin, reingenieria, 1, user_id, '".date("Y-m-d")." 16:00:00', '".date("Y-m-d")." 16:00:00', codigo_id,trabajador_responsable_id, folio FROM importar_tramites WHERE tipo=3 and estatus in (1,99) AND user_id=".$loggedUser->id.";");
            }
            
            $respuesta['total'] = importarTramites::where("user_id", $loggedUser->id)->where("tipo", $parametros['tipo'])->count();
            
            
            return response()->json(['data'=>$respuesta],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }   
    }

    public function verificarComision(Request $request, $id)
    {
        ini_set('memory_limit', '-1');
        $inputs = $request->all();
        try{  
            $primero = DB::table('rel_trabajador_comision_interna')
            ->where('trabajador_id',$id)
            ->select('id')
            ->whereNull('deleted_at');
 
            $segundo = DB::table('rel_trabajador_comision_gerencial')
            ->whereNull('deleted_at')
            ->where('trabajador_id',$id)
            ->select('id')
            ->unionAll($primero)
            ->count();
            
            return response()->json(['data'=>$segundo],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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

            $trabajador = Trabajador::with("rel_trabajador_comision_interna.cr_origen.directorioResponsable.responsable",
            "rel_trabajador_comision_interna.cr_origen.dependencia.directorioResponsable.responsable", 
            "rel_trabajador_comision_interna.cr_destino.directorioResponsable.responsable", 
            "rel_trabajador_comision_interna.cr_destino.dependencia.directorioResponsable.responsable", 
            "rel_datos_laborales_nomina")
            ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1 and deleted_at is null ".$filtro_user.")")
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
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_interna where  activo=1 and cr_destino in (select cr from catalogo_cr where clues='".$parametros['clues']."'))");
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

            if(isset($parametros['fechaCreacion']) && $parametros['fechaCreacion'] ){
                $main_query = $main_query->whereRaw("trabajador.id  in (select trabajador_id from rel_trabajador_comision_interna where created_at between '".$parametros['fechaCreacion']." 00:00:01' AND '".$parametros['fechaCreacion']." 23:59:59')");
            }

            if(isset($parametros['reingenieria']) && $parametros['reingenieria'] !=""){
                $main_query = $main_query->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_comision_interna where activo=1 and reingenieria=".$parametros['reingenieria']." and deleted_at is null)");
                ///->where("trabajador.reingenieria ",$parametros['reingenieria']);
            }
        }
        return $main_query;
    }
}
