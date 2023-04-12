<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use Carbon\Carbon;

use App\Exports\DevReportExport;
use App\Models\Expediente\Prestamos;
use App\Models\User;
use App\Models\Trabajador;

class ExpedienteController extends Controller
{
    public function index(Request $request)
    {
        $loggedUser = auth()->userOrFail();

        try{
            $access = $this->getUserAccessData();
            
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            $parametros = $request->all();
            $trabajador = Trabajador::with("rel_trabajador_expediente.prestador");
                            
            //Filtros, busquedas, ordenamiento
            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);

            /**/

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
               
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }else{
                if(isset($parametros['reporte'])){
                    /*$trabajador = $trabajador
                                    ->leftJoin("catalogo_rama as rama", "rama.id", "rel_trabajador_datos_laborales.rama_id")
                                    ->leftJoin("catalogo_jornada as jornada", "jornada.id", "rel_trabajador_datos_laborales.jornada_id")
                                    ->leftJoin("catalogo_clues as clues", "clues.clues", "rel_trabajador_datos_laborales.clues_adscripcion_fisica")
                                    ->leftJoin("catalogo_cr as cr", "cr.cr", "rel_trabajador_datos_laborales.cr_fisico_id")

                                    ->leftJoin("catalogo_clues as clues_nomina", "clues_nomina.clues", "datos_nominales.clues_adscripcion_nomina")
                                    ->leftJoin("catalogo_cr as cr_nomina", "cr_nomina.cr", "datos_nominales.cr_nomina_id")
                                    ->leftJoin("catalogo_area_trabajo as area_trabajo", "area_trabajo.id", "rel_trabajador_datos_laborales.area_trabajo_id")
                                    
                                    ->leftJoin("catalogo_ur as ur", "ur.llave", "datos_nominales.ur")
                                    ->leftJoin("catalogo_codigo as codigo", "codigo.codigo", "datos_nominales.codigo_puesto_id")
                                    ->leftJoin("catalogo_grupo_funcion as funcion", "funcion.id", "codigo.grupo_funcion_id")
                                    
                                    ->leftJoin("catalogo_sexo", "catalogo_sexo.id", "trabajador.sexo_id")
                                    ->leftJoin("catalogo_estado_conyugal", "catalogo_estado_conyugal.id", "trabajador.estado_conyugal_id")
                                    ->leftJoin("rel_trabajador_datos_fiscales", "trabajador.id", "rel_trabajador_datos_fiscales.trabajador_id")
                                    ->leftJoin("rel_trabajador_documentacion", "trabajador.id", "rel_trabajador_documentacion.trabajador_id")
                                    ->leftjoin('rel_trabajador_comision  as datos_comision', function ($join) {
                                        $join->on('datos_comision.trabajador_id', '=', 'trabajador.id')
                                             ->where('datos_comision.estatus', '=', 'A');
                                    })
                                  
                                    ->where("trabajador.estatus", "=", 1)
                                    ->select(
                                        "trabajador.rfc",
                                        "trabajador.curp",
                                        db::raw("concat(trabajador.apellido_paterno,' ',trabajador.apellido_materno,' ', trabajador.nombre) as nombre"),
                                        "catalogo_sexo.descripcion as sexo",
                                        "catalogo_estado_conyugal.descripcion as estado_conyugal",
                                        "trabajador.telefono_celular",
                                        "trabajador.correo_electronico",
                                        db::raw("concat(trabajador.calle,' ', trabajador.no_exterior,' Col.',trabajador.colonia,' C.P. ', trabajador.cp) as calle"),
                                        "rel_trabajador_datos_laborales.fecha_ingreso",
                                        "rel_trabajador_datos_laborales.fecha_ingreso_federal",
                                        "codigo.codigo",
                                        "codigo.descripcion as descripcion_codigo",
                                        "ur.descripcion as ur",
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 1) as lunes"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 2) as martes"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 3) as miercoles"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 4) as jueves"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 5) as viernes"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 6) as sabado"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 7) as domingo"),
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where trabajador.id=rel_trabajador_horario.trabajador_id and dia = 8) as festivo"),
                                        //Inicio Datos Adscripción Fisica
                                        "rel_trabajador_datos_laborales.clues_adscripcion_fisica",
                                        "rel_trabajador_datos_laborales.cr_fisico_id",
                                        "clues.nombre_unidad as nombre_unidad_fisica",
                                        "cr.descripcion as cr_fisico",
                                        //Fin Datos Adscripción Fisica
                                        //Inicio Datos Adscripción Nominal
                                        "datos_nominales.clues_adscripcion_nomina",
                                        "datos_nominales.cr_nomina_id",
                                        "clues_nomina.nombre_unidad as nombre_unidad_nomina",
                                        "cr_nomina.descripcion as cr_nomina",
                                        //Fin Datos Adscripción Nominal
                                        "rel_trabajador_datos_laborales.fecha_ingreso",
                                        "rel_trabajador_datos_laborales.fecha_ingreso_federal",
                                        "funcion.grupo as grupo",
                                        "rama.descripcion as rama_trabajo",
                                        "jornada.descripcion as jornada",
                                        "datos_comision.id as comision",
                                        db::raw("(select concat(entrada,' - ', salida) from rel_trabajador_horario where rel_trabajador_horario.trabajador_id=trabajador.id limit 1) as horario"),
                                        "trabajador.observacion",
                                        "rel_trabajador_datos_laborales.actividades",
                                        "area_trabajo.descripcion as area_trabajo",
                                        "rel_trabajador_datos_fiscales.razon_social",
                                        "rel_trabajador_datos_fiscales.cp as cp_df",
                                        "rel_trabajador_datos_fiscales.tipo_vialidad",
                                        "rel_trabajador_datos_fiscales.nombre_vialidad",
                                        "rel_trabajador_datos_fiscales.no_interior",
                                        "rel_trabajador_datos_fiscales.no_exterior",
                                        "rel_trabajador_datos_fiscales.colonia",
                                        "rel_trabajador_datos_fiscales.localidad",
                                        "rel_trabajador_datos_fiscales.municipio",
                                        "rel_trabajador_datos_fiscales.entidad",
                                        "rel_trabajador_datos_fiscales.calle1 as entre",
                                        "rel_trabajador_datos_fiscales.calle2 as y_entre",
                                        "rel_trabajador_datos_fiscales.lada",
                                        "rel_trabajador_datos_fiscales.telefono as tel_df",
                                        "rel_trabajador_datos_fiscales.correo",
                                        "rel_trabajador_datos_fiscales.regimen",
                                        "rel_trabajador_datos_fiscales.fecha_regimen as fecha_actividad",
                                        "rel_trabajador_datos_fiscales.documento_digital",
                                        DB::RAW("IF(rel_trabajador_documentacion.estatus = 1, 'ENVIADO POR TRABAJADOR ', IF(rel_trabajador_documentacion.estatus = 2, 'RECHAZADO POR CS.',IF(rel_trabajador_documentacion.estatus = 3, 'ACEPTADO POR CS.',IF(rel_trabajador_documentacion.estatus = 4, 'RECHAZADO POR OF. CENTRAL',IF(rel_trabajador_documentacion.estatus = 5,'VALIDADO Y CORRECTO',IF(rel_trabajador_documentacion.estatus IS NULL,'NO ENVIADO','')))))) AS 'ESTATUS EXPEDIENTE'")
                                        )
                                        ->orderby("rel_trabajador_datos_laborales.clues_adscripcion_fisica");
                                    //->get();
                    if(isset($parametros['export_excel']) && $parametros['export_excel']){
                        try{
                            ini_set('memory_limit', '-1');
                            
                            $trabajador = $trabajador->get();
                           
                            $columnas = array_keys(collect($trabajador[0])->toArray());

                            if(isset($parametros['nombre_archivo']) && $parametros['nombre_archivo']){
                                $filename = $parametros['nombre_archivo'];
                            }else{
                                $filename = 'reporte-personal-activo';
                            }
                            //echo "hola";
                            //exit;
                            return (new DevReportExport($trabajador,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
                        }catch(\Exception $e){
                            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
                        }
                    }else{
                        $trabajador = $trabajador->get();
                        $loggedUser->load('gruposUnidades.listaFirmantes.trabajador',"gruposUnidades.listaCR.clues.responsable");
                        if(count($loggedUser->gruposUnidades) > 0){
                            $firmantes = $loggedUser->gruposUnidades[0]->listaFirmantes;
                            $responsable_clues = $loggedUser->gruposUnidades[0]->listaCR;
                        }else if(isset($parametros['grupos']) && $parametros['grupos']){
                            $grupo = GrupoUnidades::with('listaFirmantes.trabajador','listaCR.clues.responsable')->find($parametros['grupos']);
                            if($grupo){
                                $firmantes = $grupo->listaFirmantes;
                                $responsable_clues = $grupo->listaCR;
                            }
                        }
                    }*/
                }
            } 
            
            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
            //return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
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

        $reglas = [
            'no_expediente'             => 'required',
            'no_vale'                   => 'required',
            'fecha_prestamo'            => 'required',
            'area_prestamista'          => 'required',
            'prestamista'               => 'required',
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
        }

        DB::beginTransaction();
        try {
            
            $loggedUser = auth()->userOrFail();
            
            $trabajador = Trabajador::find($inputs['id']);
            $trabajador->no_expediente = $inputs['no_expediente'];
            $trabajador->save();

            $obj = new Prestamos();
            $obj->trabajador_id                 = $inputs['trabajador_id'];
            $obj->no_vale                       = $inputs['no_vale'];
            $obj->fecha_prestamo                = $inputs['fecha_prestamo'];
            $obj->area_prestamista              = $inputs['area_prestamista'];
            $obj->trabajador_prestamista        = $inputs['prestamista'];
            $obj->observaciones                 = $inputs['observacion'];
            $obj->trabajador_prestador_id      = $loggedUser->id;
            $obj->estatus                       = 1;
                
            $obj->save();
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }
    public function update(Request $request,$id)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'no_expediente'             => 'required',
            'no_vale'                   => 'required',
            'fecha_prestamo'            => 'required',
            'area_prestamista'          => 'required',
            'prestamista'               => 'required',
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
        }

        DB::beginTransaction();
        try {
            
            $loggedUser = auth()->userOrFail();
            
            $trabajador = Trabajador::find($inputs['id']);
            $trabajador->no_expediente = $inputs['no_expediente'];
            $trabajador->save();

            $obj = Prestamos::find($id);
            $obj->no_vale                       = $inputs['no_vale'];
            $obj->fecha_prestamo                = $inputs['fecha_prestamo'];
            $obj->area_prestamista              = $inputs['area_prestamista'];
            $obj->trabajador_prestamista        = $inputs['prestamista'];
            $obj->observaciones                 = $inputs['observacion'];
                
            $obj->save();
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function destroy(Request $request)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'no_expediente'             => 'required',
            'no_vale'                   => 'required',
            'fecha_prestamo'            => 'required',
            'area_prestamista'          => 'required',
            'prestamista'               => 'required',
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
        }

        DB::beginTransaction();
        try {
            
            $loggedUser = auth()->userOrFail();
            $fecha_actual = Carbon::now();
            $obj = Prestamos::where("trabajador_id", $inputs['trabajador_id'])->where("estatus", "=", 1)->first();
            $obj->estatus                       = 3;
            $obj->fecha_elimino                 = $fecha_actual->format("Y-m-d");
            $obj->trabajador_elimino_id        = $loggedUser->id;
                
            $obj->save();
            $obj->delete();
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }
    
    public function devolver(Request $request,$id)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            'no_expediente'             => 'required',
            'no_vale'                   => 'required',
            'fecha_prestamo'            => 'required',
            'area_prestamista'          => 'required',
            'prestamista'               => 'required',
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
        }

        DB::beginTransaction();
        try {
            
            $loggedUser = auth()->userOrFail();
            $fecha_actual = Carbon::now();
            $obj = Prestamos::find($id);
            $obj->estatus                       = 2;
            $obj->fecha_devolucion              = $fecha_actual->format("Y-m-d");
            $obj->trabajador_devolvio_id        = $loggedUser->id;
                
            $obj->save();
            DB::commit();
            
            return response()->json($obj,HttpResponse::HTTP_OK);

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
                $main_query = $main_query->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales where clues_adscripcion_fisica ='".$parametros['clues']."')");
            }

            if(isset($parametros['cr']) && $parametros['cr']){
                $main_query = $main_query->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales where cr_fisico_id ='".$parametros['cr']."')");//where('rel_trabajador_datos_laborales.cr_fisico_id',$parametros['cr']);
            }

            if(isset($parametros['estatus']) && $parametros['estatus'] == 1){
                $main_query = $main_query->whereRaw('trabajador.id in (select trabajador_id from rel_trabajador_expediente where estatus =1 and deleted_at is null)');
            }
            
            if(isset($parametros['estatus']) && $parametros['estatus'] == 2){
                $main_query = $main_query->whereRaw('trabajador.id not in (select trabajador_id from rel_trabajador_expediente where estatus = 1 and deleted_at is null)');
            }
        }
        return $main_query;
    }
}
