<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Database\Eloquent\Collection;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Carbon\Carbon;


use App\Models\Trabajador;
use App\Models\Pais;
use App\Models\Entidad;
use App\Models\Municipio;
use App\Models\Nacionalidad;
use App\Models\EstadoConyugal;
use App\Models\EstudiosAcademicos;
use App\Models\Sexo;
use App\Models\Codigo;
use App\Models\Rama;
use App\Models\Actividad;
use App\Models\ActividadVoluntaria;
use App\Models\AreaTrabajo;
use App\Models\TipoPersonal;
use App\Models\UnidadAdministradora;
use App\Models\Programa;
use App\Models\UR;
use App\Models\Jornada;
use App\Models\GradoAcademico;
use App\Models\NivelDominio;
use App\Models\Cursos;
use App\Models\Cr;

use App\Models\InstitucionEducativa;
use App\Models\AnioCursa;
use App\Models\CicloFormacion;
use App\Models\Profesion;
use App\Models\Colegio;
use App\Models\Certificado;
use App\Models\Idioma;
use App\Models\Lengua;
use App\Models\Sindicato;
use App\Models\TipoBaja;
use App\Models\GrupoUnidades;
use App\Models\CluesAsistencia;

//Relacionales
use App\Models\RelCapacitacion;
use App\Models\RelCapacitacionDetalles;
use App\Models\RelDatosLaborales;
use App\Models\RelEscolaridad;
use App\Models\RelEscolaridadCursante;
use App\Models\RelHorario;
use App\Models\RelNomina;
use App\Models\RelBaja;
use App\Models\RelTransaccion;
use App\Models\RelComision;
use App\Models\User;

use App\Exports\DevReportExport;

class TrabajadorController extends Controller
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
            $trabajador = Trabajador::with("rel_datos_comision", "rel_datos_laborales", "rel_trabajador_baja.baja")
                            ->join("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                            ->leftjoin("rel_trabajador_datos_laborales_nomina as datos_nominales", "datos_nominales.trabajador_id", "=", "trabajador.id")
                            ->select("trabajador.*", "rel_trabajador_datos_laborales.cr_fisico_id", "datos_nominales.cr_nomina_id")
                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_baja where tipo_baja_id=2 and deleted_at is null and fecha_fin_baja is null)");
                            

            $permison_individual = false;                
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg')
                        {
                            $trabajador = $trabajador->where("rfc", "=", $loggedUser->username);
                            $permison_individual = true;
                        }
                    }
                }
            }
            
            
            //filtro de valores por permisos del usuario
            if(!$access->is_admin && $permison_individual == false){
                $trabajador = $trabajador->where(function($query){
                    $query->whereIn('trabajador.estatus',[1,4]);
                })->where(function($query)use($access){
                    $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr)
                        /*->orWhere(function($query2)use($access){
                            $query2->whereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                        })*/;
                });
            }
            
            //Sacamos totales para el estatus de las cantidades validadas
            $estatus_validacion = clone $trabajador;
            $estatus_actualizacion = clone $trabajador;
            $estatus_validacion = $estatus_validacion->select(\DB::raw('sum(IF(trabajador.estatus = 1 OR trabajador.estatus = 4,1,0)) as total_activos'),DB::raw('sum(IF(trabajador.estatus = 1 AND trabajador.validado = 1,1,0)) as total_validados'),DB::raw('count(trabajador.id) as total_registros'))->first();
            $estatus_actualizacion = $estatus_actualizacion->select(\DB::raw('sum(IF(trabajador.actualizado = 1,1,0)) as total_actualizado'))->whereIn("trabajador.validado", [1,4])->first();
            if($estatus_validacion->total_activos == 0)
            {
                $estatus_validacion->porcentaje = 0;
            }else{
                $estatus_validacion->porcentaje = intval(($estatus_validacion->total_validados*100)/$estatus_validacion->total_activos);
            }
            

            //Filtros, busquedas, ordenamiento
            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);

            /*if(isset($parametros['query']) && $parametros['query']){
                $trabajador = $trabajador->where(function($query)use($parametros){
                    return $query//->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }
            //$trabajador = $trabajador->where("cr_fisico_id", "!=","cr_nomina_id");

            if(isset($parametros['active_filter']) && $parametros['active_filter']){
                if(isset($parametros['clues']) && $parametros['clues']){
                    if(isset($parametros['adscripcion']) && $parametros['adscripcion'] && $parametros['adscripcion'] == 'EOU'){
                        $trabajador = $trabajador->where('datos_nominales.clues_adscripcion_nomina',$parametros['clues']);
                    }else{
                        $trabajador = $trabajador->where('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$parametros['clues']);
                    }
                }

                if(isset($parametros['cr']) && $parametros['cr']){
                    $trabajador = $trabajador->where('rel_trabajador_datos_laborales.cr_fisico_id',$parametros['cr']);
                }

                if(isset($parametros['rama']) && $parametros['rama']){
                    $trabajador = $trabajador->where('rama_id',$parametros['rama']);
                }

                if(isset($parametros['estatus']) && $parametros['estatus']){
                    $estatus = explode('-',$parametros['estatus']);
                    $trabajador = $trabajador->where('trabajador.estatus',$estatus[0]);
                    if(isset($estatus[1])){
                        $trabajador = $trabajador->where('trabajador.validado',$estatus[1]);
                    }
                }

                if(isset($parametros['adscripcion']) && $parametros['adscripcion']){
                    $adscripcion = $parametros['adscripcion'];
                    if($adscripcion == 'MU'){
                        $trabajador = $trabajador->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica = datos_nominales.clues_adscripcion_nomina');
                    }else if($adscripcion == 'OU'){
                        $trabajador = $trabajador->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica != datos_nominales.clues_adscripcion_nomina');
                    }else if($adscripcion == 'EOU'){
                        $trabajador = $trabajador->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica != datos_nominales.clues_adscripcion_nomina');
                    }
                }
                if(isset($parametros['comisionado']) && $parametros['comisionado'] == 1){
                    $trabajador = $trabajador->whereRaw("trabajador.id in (select rl.trabajador_id from rel_trabajador_datos_laborales rl, rel_trabajador_datos_laborales_nomina rln where rl.trabajador_id=rln.trabajador_id and rl.cr_fisico_id!=rln.cr_nomina_id)");
                }
                if(isset($parametros['e4']) && $parametros['e4'] == 1){
                    $trabajador = $trabajador->join("rel_trabajador_e4", "rel_trabajador_e4.trabajador_id", "=", "trabajador.id");
                }

                if($access->is_admin){
                    if(isset($parametros['grupos']) && $parametros['grupos']){
                        $grupo = GrupoUnidades::with('listaCR')->find($parametros['grupos']);
                        $lista_cr = $grupo->listaCR->pluck('cr')->toArray();

                        $trabajador = $trabajador->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$lista_cr);
                        //->where(function($query)use($lista_cr){
                        //    $query->whereIn('trabajador.cr_fisico_id',$lista_cr)
                        //        ->orWhere(function($query2)use($lista_cr){
                        //            $query2->whereIn('permuta_adscripcion.cr_destino_id',$lista_cr);
                        //        });
                        //});
                    }
                }
            }*/

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
               
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }else{
                if(isset($parametros['reporte'])){
                    $trabajador = $trabajador
                                    //leftJoin("rel_trabajador_datos_laborales as datos_laborales", "datos_laborales.trabajador_id", "trabajador.id")
                                    
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
                                    ->leftjoin('rel_trabajador_comision  as datos_comision', function ($join) {
                                        $join->on('datos_comision.trabajador_id', '=', 'trabajador.id')
                                             ->where('datos_comision.estatus', '=', 'A');
                                    })
                                    //->leftJoin("rel_trabajador_comision as datos_comision", "datos_comision.trabajador_id", "trabajador.id")
                                    //->leftJoin("sindicato", "sindicato.id", "datos_comision.sindicato_id")
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
                                        "area_trabajo.descripcion as area_trabajo")
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
                    }
                }
            } 
            
            if(!$loggedUser->gruposUnidades){
                $loggedUser->load('gruposUnidades');
            }
            if(count($loggedUser->gruposUnidades) > 0){
                $estatus = ['grupo_usuario'=>true, 'finalizado'=>$loggedUser->gruposUnidades[0]->finalizado];
            }else{
                $estatus = ['grupo_usuario'=>false];
            }
            $estatus['estatus_validacion'] = $estatus_validacion;
            $estatus['estatus_actualizacion'] = $estatus_actualizacion;
            

            return response()->json(['data'=>$trabajador, 'firmantes'=> $firmantes, 'responsables'=>$responsable_clues, 'estatus'=>$estatus],HttpResponse::HTTP_OK);
            //return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
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
        //$main_query = $main_query->where("cr_fisico_id", "!=","cr_nomina_id");

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

            if(isset($parametros['rama']) && $parametros['rama']){
                $main_query = $main_query->where('rama_id',$parametros['rama']);
            }

            if(isset($parametros['estatus']) && $parametros['estatus']){
                $estatus = explode('-',$parametros['estatus']);
                $main_query = $main_query->where('trabajador.estatus',$estatus[0]);
                if(isset($estatus[1])){
                    $main_query = $main_query->where('trabajador.validado',$estatus[1]);
                }
                if(isset($estatus[2])){
                    $main_query = $main_query->where('trabajador.actualizado',$estatus[2]);
                    
                }
            }

            if(isset($parametros['adscripcion']) && $parametros['adscripcion']){
                $adscripcion = $parametros['adscripcion'];
                if($adscripcion == 'MU'){
                    $main_query = $main_query->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica = datos_nominales.clues_adscripcion_nomina');
                }else if($adscripcion == 'OU'){
                    $main_query = $main_query->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica != datos_nominales.clues_adscripcion_nomina');
                }else if($adscripcion == 'EOU'){
                    $main_query = $main_query->whereRaw('rel_trabajador_datos_laborales.clues_adscripcion_fisica != datos_nominales.clues_adscripcion_nomina');
                }
            }
            if(isset($parametros['comisionado']) && $parametros['comisionado'] == 1){
                $main_query = $main_query->whereRaw("trabajador.id in (select rl.trabajador_id from rel_trabajador_datos_laborales rl, rel_trabajador_datos_laborales_nomina rln where rl.trabajador_id=rln.trabajador_id and rl.cr_fisico_id!=rln.cr_nomina_id)");
            }
            if(isset($parametros['e4']) && $parametros['e4'] == 1){
                $main_query = $main_query->join("rel_trabajador_e4", "rel_trabajador_e4.trabajador_id", "=", "trabajador.id");
            }

            if($access->is_admin){
                if(isset($parametros['grupos']) && $parametros['grupos']){
                    $grupo = GrupoUnidades::with('listaCR')->find($parametros['grupos']);
                    $lista_cr = $grupo->listaCR->pluck('cr')->toArray();

                    $main_query = $main_query->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$lista_cr);
                }
            }
        }
        return $main_query;
    }

    public function show(Request $request, $id)
    {
        try{
            $response_data = [];
            $loggedUser = auth()->userOrFail();
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);
            $params = $request->all();

            $trabajador = Trabajador::with('municipio_nacimiento','datoslaborales','escolaridad','horario', 'datoslaboralesnomina.clues', 'datoslaboralesnomina.cr', 'credencial')->where("id", "=", $id);

            foreach ($permisos->roles as $key => $value) {
                foreach ($value->permissions as $key2 => $value2) {
                    if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg')
                    {
                        $trabajador = $trabajador->where("rfc", "=", $loggedUser->username);
                    }
                }
            }
            $trabajador = $trabajador->first();

            //$trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\default.jpg'));
            /*if($trabajador){
                $trabajador->clave_credencial = \Encryption::encrypt($trabajador->rfc);
            }*/
            if($trabajador->credencial != null)
            {
                if($trabajador->credencial->foto == 1)
                {
                    if(\Storage::exists('public\\FotoTrabajador\\'.$trabajador->id.'.'.$trabajador->credencial->extension))
                    {
                        $trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\'.$trabajador->id.'.'.$trabajador->credencial->extension));
                    }else{
                        $trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\default.jpg'));
                    }
                    //$trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\'.$trabajador->id.'.'.$trabajador->credencial->extension));
                }
            }
            
            
            $response_data['data'] = $trabajador;
            $response_data['mini_paginador'] = false;
            if(isset($params['selectedIndex'])){
                $response_data['mini_paginador'] = $this->calcularMiniPaginador($params,$permisos);
            }

            return response()->json($response_data,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    private function calcularMiniPaginador($params,$permisos){
        $access = $this->getUserAccessData();
        $per_page = $params['pageSize'];
        $page_index = $params['pageIndex'];
        $selected_index = $params['selectedIndex'];

        $real_index = ($per_page * $page_index) + $selected_index; //calculamos el index real dentro de todo el "universo" de registros

        $trabajadores = Trabajador::select('trabajador.id')
                                    ->join("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                    ->leftjoin("rel_trabajador_datos_laborales_nomina as datos_nominales", "datos_nominales.trabajador_id", "=", "trabajador.id")
                                    ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_baja  where tipo_baja_id=2)")
                                    ->orderBy('trabajador.nombre');
                                    
        //
        $permison_individual = false;                
        if(!$access->is_admin){
            foreach ($permisos->roles as $key => $value) {
                foreach ($value->permissions as $key2 => $value2) {
                    if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg'){
                        $permison_individual = true;
                    }
                }
            }
        }
        
        if($permison_individual){
            return false;
        }

        //filtro de valores por permisos del usuario
        if(!$access->is_admin && $permison_individual == false){
            $trabajadores = $trabajadores->where(function($query){
                                            $query->whereIn('trabajador.estatus',[1,4]);
                                        })->where(function($query)use($access){
                                            $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)
                                                    ->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                                        });
        }
        
        //para hacer el limit en el query, seleccionando los registros anterior y siguiente al index del id actual
        if($real_index == 0){
            $limit_index = 0;
            $total_results = 2;
        }else{
            $limit_index = $real_index-1;
            $total_results = 3;
        }

        //aplicar todos los filtros asignados
        $trabajadores = $this->aplicarFiltros($trabajadores,$params,$access);

        $total_trabajadores = clone $trabajadores;
        $total_trabajadores = $total_trabajadores->count();
        $trabajadores = $trabajadores->skip($limit_index)->take($total_results)->get();

        $mini_pagination = ['next_prev'=>$trabajadores,'total'=>$total_trabajadores];

        return $mini_pagination;
    }

    public function FinalizarCaptura(Request $request, $id)
    {
        $object = Trabajador::find($id);
        DB::beginTransaction();
        try {
            $object->actualizado = 1;
            $object->save();
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }   
    }
    public function comisionSindical(Request $request)
    {
        $mensajes = [
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        $inputs = $inputs['obj'];
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
            
                $fecha_actual = Carbon::now();
                $fecha_inicio = Carbon::parse($inputs['fecha_inicio']);
                $fecha_fin = Carbon::parse($inputs['fecha_fin']);
                //Actualizamos el estatus de comision
                $actualizacion = RelComision::where("fecha_fin", "<",$fecha_fin->toDateString())->where("estatus", "A");
                $actualizacion->update(['estatus'=> 'E']);
                //
                
                $diferencia = $fecha_inicio->diffInDays($fecha_fin, FALSE);  
                if($diferencia < 1)
                {
                    $fecha_pivote   = $fecha_fin;
                    $fecha_fin      = $fecha_inicio;
                    $fecha_inicio   = $fecha_pivote;
                    $diferencia = $fecha_inicio->diffInDays($fecha_fin, FALSE);   
                    //return Response::json(['error' => $diferencia], HttpResponse::HTTP_CONFLICT);
                }

                $diferencia = $fecha_actual->diffInDays($fecha_fin, FALSE); 
                if($diferencia < 1)
                {
                    return Response::json(['error' => "El periodo de la comisión debe de ser mayor a la fecha actual"], HttpResponse::HTTP_CONFLICT);
                }

                $busqueda = RelComision::where("trabajador_id", $inputs['trabajador_id'])->where("fecha_fin", ">", $fecha_fin->toDateString())->where("estatus", "A")->get();

                if(count($busqueda) > 0)
                {
                    return Response::json(['error' => "Actualmente existe una comision sindical activa, verifique sus datos"], HttpResponse::HTTP_CONFLICT);
                }
                $object->trabajador_id              = $inputs['trabajador_id'];
                $object->fecha_inicio               = $inputs['fecha_inicio'];
                $object->fecha_fin                  = $inputs['fecha_fin'];
                
                $object->no_oficio                  = $inputs['no_documento'];
                $object->sindicato_id                = $inputs['sindicato_id'];
                $object->tipo_comision_id            = "CS";
                $object->estatus                    = "A";
                
            $object->save();

            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getBuscadorRfc(Request $request, $id)
    {
        try{
            $object = Trabajador::where("rfc",$id)->first();
            if($object)
            {
                return response()->json(1,HttpResponse::HTTP_OK);
            }else{
                return response()->json(2,HttpResponse::HTTP_OK);
            }
            
            DB::beginTransaction();
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
        $reglas = [];

        if($inputs['tipo_dato'] == 1)
        {

            $reglas = [
                //'rfc'                       => 'required',
                'curp'                      => 'required',
                'nombre'                    => 'required',
                'calle'                     => 'required',
                'no_exterior'               => 'required',
                'colonia'                   => 'required',
                'cp'                        => 'required',
                'correo_electronico'        => 'required|email',
                'telefono_celular'          => 'required',
                'nacionalidad_id'           => 'required',
                'pais_nacimiento_id'        => 'required',
                //'entidad_nacimiento_id'     => 'required',
                //'municipio_nacimiento_id'   => 'required',
                'estado_conyugal_id'        => 'required',
                'sexo'                      => 'required',
                'idioma_id'                 => 'required',
                'lengua_indigena_id'        => 'required',
                'lenguaje_senias'           => 'required',
            ];
            
            if(trim($inputs['apellido_paterno']) == "" && trim($inputs['apellido_materno']) == "")
            {   
                throw new \Exception("Debe de escribir al menos un apellido, por favor verificar", 1);
            }
        }else if($inputs['tipo_dato'] == 2)
        {
            $reglas = [
                'actividad_id'              => 'required',
                'actividad_voluntaria_id'   => 'required',
                'area_trabajo_id'           => 'required',
                'tipo_personal_id'         => 'required',
                //'fecha_ingreso'             => 'required',
                'seguro_salud'              => 'required',
                'licencia_maternidad'       => 'required',
                'seguro_retiro'             => 'required',
                //'recurso_formacion'         => 'required',
                'tiene_fiel'                => 'required',
                'actividades'               => 'required',
                'rama_id'                   => 'required',
            ];
        }else if($inputs['tipo_dato'] == 3)
        {
            $reglas = [
                'jornada_id'              => 'required',
            ];
        }else if($inputs['tipo_dato'] == 4)
        {
            $reglas = [
                'nivel_maximo_id'              => 'required',
            ];
        }else if($inputs['tipo_dato'] == 5)
        {
            $reglas = [
                'capacitacion_anual'                => 'required',
                'ciclo_id'                          => 'required',
            ];
        }else if($inputs['tipo_dato'] == 6)
        {
            $reglas = [
                'tipo_ciclo_formacion_id'   => 'required',
                'carrera_ciclo'             => 'required',
                'institucion_ciclo'         => 'required',
                'anio_cursa_id'             => 'required',
                'colegiacion'               => 'required',
                //'colegio'              => 'required',
                'certificacion'             => 'required',
                //'certificacion_id'              => 'required',
                'consejo'                   => 'required',
                
            ];
        }

        
        $object = Trabajador::find($id);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        /*if($inputs['rfc'] != $object->rfc)
        {
            $object = Trabajador::where("rfc", "=", $inputs['rfc'])->orWhere("curp", "=",  $inputs['curp'])->first();
            if($object){
                throw new \Exception("Existe en empleado con el mismo rfc o curp, por favor verificar", 1);
            }
        }*/
 
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            
            
            if($inputs['tipo_dato'] == 1)
            {
                $fecha_actual = Carbon::now();
                $fecha = Carbon::parse($inputs['fecha_nacimiento']);
                $edad = $fecha_actual->diffInYears($fecha);  
                $object->nombre                     = strtoupper($inputs['nombre']);
                $object->apellido_paterno           = strtoupper($inputs['apellido_paterno']);
                $object->apellido_materno           = strtoupper($inputs['apellido_materno']);
                //$object->rfc                        = strtoupper($inputs['rfc']);
                $object->curp                       = $inputs['curp'];
                $object->sexo_id                    = $inputs['sexo'];
                $object->calle                      = strtoupper($inputs['calle']);
                $object->no_exterior                = $inputs['no_exterior'];
                $object->no_interior                = $inputs['no_interior'];
                $object->colonia                    = strtoupper($inputs['colonia']);
                $object->cp                         = $inputs['cp'];
                $object->telefono_fijo              = $inputs['telefono_fijo'];
                $object->telefono_celular           = $inputs['telefono_celular'];
                $object->correo_electronico         = $inputs['correo_electronico'];
                $object->pais_nacimiento_id         = $inputs['pais_nacimiento_id'];
                $object->entidad_nacimiento_id      = $inputs['entidad_nacimiento_id'];
                $object->municipio_nacimiento_id    = $inputs['municipio_nacimiento_id'];
                $object->nacionalidad_id            = $inputs['nacionalidad_id'];
                $object->estado_conyugal_id         = $inputs['estado_conyugal_id'];
                $object->entidad_federativa_id      = 7;
                $object->municipio_federativo_id    = 186;
                $object->edad                       = $edad;
                $object->observacion                = $inputs['observacion'];
                if($inputs['idioma_id'] != 0)
                {
                    $object->idioma_id = $inputs['idioma_id'];
                    $object->nivel_idioma_id = $inputs['nivel_idioma_id'];
                }else{
                    $object->idioma_id = null;
                    $object->nivel_idioma_id = null;
                }
                if($inputs['lengua_indigena_id'] != 102)
                {
                    $object->lengua_indigena_id = $inputs['lengua_indigena_id'];
                    $object->nivel_lengua_id = $inputs['nivel_lengua_id'];
                }else{
                    $object->lengua_indigena_id = $inputs['lengua_indigena_id'];
                    $object->nivel_lengua_id = null;
                }
                
                $object->lenguaje_senias = $inputs['lenguaje_senias'];
                $object->save();
            }else if($inputs['tipo_dato'] == 2)
            {
                $objectRL = RelDatosLaborales::where("trabajador_id", "=", $id)->first();
                if($objectRL == null)
                {
                    $objectRL = new RelDatosLaborales();
                    $objectRL->trabajador_id = $id;
                    $objectRL->cr_fisico_id = $inputs['cr_id'];
                    $objectRL->clues_adscripcion_fisica = $inputs['clues'];
                }
                
                $objectRL->actividad_id             = $inputs['actividad_id'];
                $objectRL->actividad_voluntaria_id  = $inputs['actividad_voluntaria_id'];
                $objectRL->area_trabajo_id          = $inputs['area_trabajo_id'];
                $objectRL->tipo_personal_id         = $inputs['tipo_personal_id'];
                //$objectRL->fecha_ingreso            = $inputs['fecha_ingreso'];
                //$objectRL->fecha_ingreso_federal    = $inputs['fecha_ingreso_federal'];
                //$objectRL->unidad_administradora_id = $inputs['unidad_administradora_id'];
                $objectRL->seguro_salud             = $inputs['seguro_salud'];
                $objectRL->licencia_maternidad      = $inputs['licencia_maternidad'];
                $objectRL->seguro_retiro            = $inputs['seguro_retiro'];
                $objectRL->recurso_formacion        = 0;
                $objectRL->tiene_fiel               = $inputs['tiene_fiel'];
                if($objectRL->tiene_fiel == 1)
                {
                    $objectRL->vigencia_fiel            = $inputs['vigencia_fiel'];
                }
                
                $objectRL->actividades              = $inputs['actividades'];
                $objectRL->rama_id                  = $inputs['rama_id'];
                $objectRL->save();

            }else if($inputs['tipo_dato'] == 3)
            {
                $objectRL = RelDatosLaborales::where("trabajador_id", "=", $id)->first();
                if($objectRL == null)
                {
                    $objectRL = new RelDatosLaborales();
                    $objectRL->trabajador_id = $id;
                }
                
                $objectRL->jornada_id               = $inputs['jornada_id'];
                $objectRL->save();
                
                $borrar_horario = DB::table("rel_trabajador_horario")->where("trabajador_id", "=", $id)->delete();
                $dias = array("lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", "festivo");
                $indice = 0;
                while($indice < count($dias))
                {
                    if($inputs['horario_'.$dias[$indice]] != null)
                    {
                        $horario = new RelHorario();
                        $horario->trabajador_id     = $id;
                        $horario->dia               = ($indice + 1);
                        $horario->entrada           = $inputs['hora_inicio_'.$dias[$indice]];
                        $horario->salida            = $inputs['hora_fin_'.$dias[$indice]];
                        $horario->save();
                    }
                    $indice++;
                }
            }else if($inputs['tipo_dato'] == 4)
            {
                $escolaridad = $inputs['datos'];
                $indice_escolaridad = 0;
                $object->nivel_maximo_id = $inputs['nivel_maximo_id'];
                $object->save();
                
                $borrar_escolaridad = DB::table("rel_trabajador_escolaridad")->where("trabajador_id", "=", $id)->delete();
                while($indice_escolaridad < count($escolaridad))
                {
                    $dato = $escolaridad[$indice_escolaridad];
                    $objectEscolaridad = new RelEscolaridad();
                    $objectEscolaridad->trabajador_id = $id;
                    $objectEscolaridad->grado_academico_id = $dato['grado_academico_id'];
                    if($dato['otro_estudio'] == true)
                    {
                        $objectEscolaridad->otro_nombre_estudio = $dato['otro_nombre_estudio'];
                        $objectEscolaridad->nombre_estudio_id = null;
                    }else{
                        $objectEscolaridad->otro_nombre_estudio = null;
                        $objectEscolaridad->nombre_estudio_id = $dato['nombre_estudio']['id'];
                    }
                    
                    if($dato['otro_institucion'] == true)
                    {
                        $objectEscolaridad->otro_nombre_institucion = $dato['otro_nombre_institucion'];
                        $objectEscolaridad->institucion_id = null;
                    }else{
                        $objectEscolaridad->institucion_id = $dato['institucion']['id'];
                        $objectEscolaridad->otro_nombre_institucion = null;
                    }

                    $objectEscolaridad->cedula = $dato['cedula'];
                    if($dato['cedula'] == 1)
                    {
                        $objectEscolaridad->no_cedula = $dato['no_cedula'];
                    }else{
                        $objectEscolaridad->no_cedula = null;
                    }
                    $objectEscolaridad->save();
                    $indice_escolaridad++;
                }
            }else if($inputs['tipo_dato'] == 5)
            {
                $objectCapacitacion = RelCapacitacion::where("trabajador_id", "=", $id)->first();
                if($objectCapacitacion == null)
                {
                    $objectCapacitacion = new RelCapacitacion();
                    $objectCapacitacion->trabajador_id = $id;
                }
                $objectCapacitacion->capacitacion_anual = $inputs['capacitacion_anual'];
                $objectCapacitacion->grado_academico_id = $inputs['grado_academico_id'];
                if($inputs['otro_estudio_capacitacion'] == true)
                {
                    $objectCapacitacion->otro_nombre_titulo = $inputs['otro_nombre_titulo'];
                    $objectCapacitacion->titulo_diploma_id = null;
                }else{
                    $objectCapacitacion->titulo_diploma_id = $inputs['titulo_capacitacion']['id'];
                    $objectCapacitacion->otro_nombre_titulo = null;
                }
                if($inputs['otro_institucion_educativa'] == true)
                {
                    $objectCapacitacion->otro_nombre_institucion = $inputs['otro_nombre_institucion'];
                    $objectCapacitacion->institucion_id = null;
                }else{
                    $objectCapacitacion->institucion_id = $inputs['institucion']['id'];
                    $objectCapacitacion->otro_nombre_institucion = null;
                }
                
                $objectCapacitacion->ciclo_id = $inputs['ciclo_id'];
                $objectCapacitacion->save();

                $capacitacionDetalles = $inputs['datos'];
                $borrar_capacitacion = DB::table("rel_trabajador_capacitacion_detalles")->where("trabajador_id", "=", $id)->delete();
                $indice_cursos = 0;
                while($indice_cursos < count($capacitacionDetalles))
                {
                    $dato = $capacitacionDetalles[$indice_cursos];
                    $objectCursos = new RelCapacitacionDetalles();
                    $objectCursos->trabajador_id = $id;
                    $objectCursos->entidad_id = $dato['entidad_id'];
                    $objectCursos->nombre_curso_id = $dato['nombre_curso']['id'];
                    
                    $objectCursos->save();
                    $indice_cursos++;
                }

            }else if($inputs['tipo_dato'] == 6)
            {
                $objectCursos = RelEscolaridadCursante::where("trabajador_id", "=", $id)->first();
                if($objectCursos == null)
                {
                    $objectCursos = new RelEscolaridadCursante();
                    $objectCursos->trabajador_id = $id;
                }
                $objectCursos->tipo_ciclo_formacion_id = $inputs['tipo_ciclo_formacion_id'];
                $objectCursos->carrera_ciclo_id = $inputs['carrera_ciclo']['id'];
                $objectCursos->tipo_ciclo_formacion_id = $inputs['tipo_ciclo_formacion_id'];
                $objectCursos->institucion_ciclo_id = $inputs['institucion_ciclo']['id'];
                $objectCursos->colegiacion = $inputs['colegiacion'];
                if($inputs['colegiacion'] == 1){ $objectCursos->colegio_id = $inputs['colegio']['id']; }else{ $objectCursos->colegio_id = null; }
                $objectCursos->certificacion = $inputs['certificacion'];
                if($inputs['certificacion'] == 1){ $objectCursos->certificacion_id = $inputs['certificacion_id']; }else { $objectCursos->certificacion_id = null; }
                $objectCursos->consejo = $inputs['consejo'];
               
                $objectCursos->anio_cursa_id = $inputs['anio_cursa_id'];
                $objectCursos->save();
            }
            
            $object->save();
            
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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

        if($inputs['tipo_dato'] == 1)
        {

            $reglas = [
                //'rfc'                       => 'required',
                'curp'                      => 'required',
                'nombre'                    => 'required',
                'calle'                     => 'required',
                'no_exterior'               => 'required',
                'colonia'                   => 'required',
                'cp'                        => 'required',
                'correo_electronico'        => 'required|email',
                'telefono_celular'          => 'required',
                'nacionalidad_id'           => 'required',
                'pais_nacimiento_id'        => 'required',
                //'entidad_nacimiento_id'     => 'required',
                //'municipio_nacimiento_id'   => 'required',
                'estado_conyugal_id'        => 'required',
                'sexo'                      => 'required',
                'idioma_id'                 => 'required',
                'lengua_indigena_id'        => 'required',
                'lenguaje_senias'           => 'required',
            ];
            
            if(trim($inputs['apellido_paterno']) == "" && trim($inputs['apellido_materno']) == "")
            {   
                throw new \Exception("Debe de escribir al menos un apellido, por favor verificar", 1);
            }
        }

        DB::beginTransaction();
        $object = new Trabajador();
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
       
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        
        try {
            
            
            if($inputs['tipo_dato'] == 1)
            {
                $fecha_actual = Carbon::now();
                $fecha = Carbon::parse($inputs['fecha_nacimiento']);
                $edad = $fecha_actual->diffInYears($fecha);  
                $object->nombre                     = strtoupper($inputs['nombre']);
                $object->apellido_paterno           = strtoupper($inputs['apellido_paterno']);
                $object->apellido_materno           = strtoupper($inputs['apellido_materno']);
                $object->rfc                        = strtoupper($inputs['rfc']);
                $object->curp                       = $inputs['curp'];
                $object->sexo_id                    = $inputs['sexo'];
                $object->calle                      = strtoupper($inputs['calle']);
                $object->no_exterior                = $inputs['no_exterior'];
                $object->no_interior                = $inputs['no_interior'];
                $object->colonia                    = strtoupper($inputs['colonia']);
                $object->cp                         = $inputs['cp'];
                $object->telefono_fijo              = $inputs['telefono_fijo'];
                $object->telefono_celular           = $inputs['telefono_celular'];
                $object->correo_electronico         = $inputs['correo_electronico'];
                $object->pais_nacimiento_id         = $inputs['pais_nacimiento_id'];
                $object->entidad_nacimiento_id      = $inputs['entidad_nacimiento_id'];
                $object->municipio_nacimiento_id    = $inputs['municipio_nacimiento_id'];
                $object->nacionalidad_id            = $inputs['nacionalidad_id'];
                $object->estado_conyugal_id         = $inputs['estado_conyugal_id'];
                $object->entidad_federativa_id      = 7;
                $object->municipio_federativo_id    = 186;
                $object->edad                       = $edad;
                $object->observacion                = $inputs['observacion'];
                $object->estatus                    = 1;
                if($inputs['idioma_id'] != 0)
                {
                    $object->idioma_id = $inputs['idioma_id'];
                    $object->nivel_idioma_id = $inputs['nivel_idioma_id'];
                }else{
                    $object->idioma_id = null;
                    $object->nivel_idioma_id = null;
                }
                if($inputs['lengua_indigena_id'] != 102)
                {
                    $object->lengua_indigena_id = $inputs['lengua_indigena_id'];
                    $object->nivel_lengua_id = $inputs['nivel_lengua_id'];
                }else{
                    $object->lengua_indigena_id = $inputs['lengua_indigena_id'];
                    $object->nivel_lengua_id = null;
                }
                
                $object->lenguaje_senias = $inputs['lenguaje_senias'];
                $object->save();
            }
            
            $object->save();

            //return Response::json(['error' => $inputs['cr']['clues']['clues']], HttpResponse::HTTP_CONFLICT);
            $objectRL = new RelDatosLaborales();
            $objectRL->trabajador_id = $object->id;
            $objectRL->cr_fisico_id = $inputs['cr']['cr'];
            $objectRL->clues_adscripcion_fisica = $inputs['cr']['clues']['clues'];
            $objectRL->seguro_salud = 0;
            $objectRL->licencia_maternidad = 0;
            $objectRL->seguro_retiro = 0;
            $objectRL->tiene_fiel = 0;

            $objectRL->save();
            //$object ->id = 1;
            DB::commit();
            
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getTrabajadoresComplete(Request $request)
    {
        try{
            $parametros = $request->all();

            $access = $this->getUserAccessData();
            
            $trabajador = Trabajador::with("rel_datos_laborales", "rel_datos_laborales_nomina", "rel_trabajador_baja.baja")->where(function($query)use($parametros){
                return $query->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['busqueda_empleado'].'%"' )
                            ->orWhere('rfc','LIKE','%'.$parametros['busqueda_empleado'].'%')
                            ->orWhere('curp','LIKE','%'.$parametros['busqueda_empleado'].'%');
            });

            /*if(!$access->is_admin){
                $trabajador = $trabajador->select('id','clues','cr_id',DB::raw('concat(apellido_paterno, " ", apellido_materno," ",nombre ) as nombre'),'rfc','curp','estatus','validado',DB::raw('IF(cr_id IN ('.implode(',',$access->lista_cr).'),1,0) as empleado_propio'));
            }else{
                $trabajador = $trabajador->select('id','clues','cr_id',DB::raw('concat(apellido_paterno, " ", apellido_materno," ",nombre ) as nombre'),'rfc','curp','estatus','validado',DB::raw('1 as empleado_propio'));
            }*/
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            } else {

                $trabajador = $trabajador->get();
            }

            $trabajador->map(function($trabajador){
                return $trabajador->clave_credencial = \Encryption::encrypt($trabajador->rfc);
            });

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function getCatalogos()
    {
        try{
            $catalogos = Array();
            $catalogos['pais']              = Pais::orderBy("descripcion")->get();
            $catalogos['entidad']           = Entidad::all();
            $catalogos['nacionalidad']      = Nacionalidad::all();
            $catalogos['estado_conyugal']   = EstadoConyugal::all();
            $catalogos['sexo']              = Sexo::all();
            $catalogos['rama']              = Rama::all();
            $catalogos['actividad']         = Actividad::all();
            $catalogos['area_trabajo']         = AreaTrabajo::all();
            $catalogos['tipo_personal']         = TipoPersonal::all();
            $catalogos['unidad_administradora']         = UnidadAdministradora::all();
            $catalogos['programa']         = Programa::all();
            $catalogos['ur']         = UR::all();
            $catalogos['jornada']         = Jornada::orderBy("descripcion")->get();
            $catalogos['grado_academico']         = GradoAcademico::all();
            $catalogos['grado_academico_estudios']         = GradoAcademico::whereIn("id", [2039843,2039848,2039849, 2039850, 2039851, 2039852, 2039853,2039854,2039855, 2039856])->get();
            $catalogos['institucion_educativa']         = InstitucionEducativa::all();
            $catalogos['anio_cursa']         = AnioCursa::all();
            $catalogos['ciclo_formacion']         = CicloFormacion::all();
            $catalogos['colegio']         = Colegio::all();
            $catalogos['idioma']         = Idioma::all();
            $catalogos['lengua']         = Lengua::all();
            $catalogos['certificacion']         = Certificado::all();
            $catalogos['nivel_dominio']         = NivelDominio::all();
            $catalogos['actividad_voluntaria']         = ActividadVoluntaria::all();
            $catalogos['codigo']            = Codigo::orderBy("codigo")->get();
            
            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function ListCluesAsistencia(Request $request)
    {
        try{
            $obj = CluesAsistencia::all();
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
        return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function getBuscador(Request $request)
    {
        try{
            $parametros = $request->all();
            switch ($parametros['tipo']) {
                case 1:
                    $obj = Municipio::where("descripcion", "like", "%".$parametros['query']."%")
                    ->where("entidad_id", "=", $parametros['entidad_nacimiento']);
                break;
                
                case 2:
                /*$obj = Profesion::where("descripcion", "like", "%".$parametros['query']."%")
                ->where("tipo_profesion_id", "=", $parametros['grado_academico']);*/
                $obj = EstudiosAcademicos::where("descripcion", "like", "%".$parametros['query']."%")
                ->where("grado_academico_id", "=", $parametros['grado_academico']);
                break;
                case 3:
                $obj = InstitucionEducativa::where("descripcion", "like", "%".$parametros['query']."%");
                break;
                case 4:
                    $obj = Profesion::where("descripcion", "like", "%".$parametros['query']."%")
                    ->whereIn("tipo_profesion_id", [1,3,4,8,9]);
                break;
                case 5:
                    $obj = InstitucionEducativa::where("descripcion", "like", "%".$parametros['query']."%");
                break;
                case 6:
                    $obj = Colegio::where("descripcion", "like", "%".$parametros['query']."%");
                break;
                case 7:
                    $obj = Profesion::where("descripcion", "like", "%".$parametros['query']."%")
                    ->where("entidad_id", "=", $parametros['grado_academico']);
                break;
                case 8:
                    
                    $obj = Cursos::where("descripcion", "like", "%".$parametros['query']."%")
                    ->where("entidad_id", "=", $parametros['entidad']);
                break;
                case 9:
                    $obj = Cr::where("descripcion", "like", "%".$parametros['query']."%");
                break;
                case 10:
                    $obj = Sindicato::orderBy("id");
                break;
                case 11:
                    $obj = TipoBaja::orderBy("id");
                break;
            }
            
            $obj = $obj->get();
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
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

        if (\Gate::allows('has-permission', \Permissions::ADMIN_PERSONAL_ACTIVO)){
            $accessData->is_admin = true;
        }else{
            $accessData->is_admin = false;
        }

        return $accessData;
    }

    public function unlinkTrabajador($id){
        try{
            
            $trabajador = Trabajador::find($id);
            $trabajador->estatus = 3;
            $trabajador->validado = 0;
            $trabajador->actualizado = 0;
            $trabajador_datos_laborales =  RelDatosLaborales::where("trabajador_id", "=", $trabajador->id)->first();
            
            $loggedUser = auth()->userOrFail();
            
            $trabajador_datos_laborales->clues_adscripcion_fisica = null;
            $trabajador_datos_laborales->cr_fisico_id = null;
            $trabajador->user_last_update = $loggedUser->id;
            
            $trabajador->save();
            $trabajador_datos_laborales->save();

            return response()->json(['datos_trabajador'=>$trabajador, 'datos_laborales'=>$trabajador_datos_laborales],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function validateTrabajador($id){
        try{
            
            $trabajador = Trabajador::find($id);
            $trabajador->validado = 1;
            $trabajador->save();
            
            return response()->json(['datos_trabajador'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function bajaTrabajador($id, Request $request){
        try{
            $parametros = $request->all();

            $trabajador = Trabajador::find($id);
            $baja = new RelBaja();
            $baja->trabajador_id = $trabajador->id;
            $baja->tipo_baja_id = $parametros['tipo_baja_id'];
            $baja->baja_id = $parametros['baja_id'];
            $baja->fecha_baja = $parametros['fecha_baja'];
            $baja->observacion = $parametros['observacion'];
            $baja->save();
            $trabajador->estatus = 2;
            $trabajador->save();
            //$trabajador->validado = 1;
            //$trabajador->save();
            
            return response()->json(['datos_trabajador'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function requestTransferEmployee(Request $request, $id){
        try{
            $parametros = $request->all();
            
            //$datos_transferencia = PermutaAdscripcion::where('empleado_id',$id)->first();
            $trabajador = Trabajador::find($id);

            $clues_destino = $parametros['clues'];
            $cr_destino = $parametros['cr'];
            
            DB::beginTransaction();

            if(true){ //aceptado por ahora
                $loggedUser = auth()->userOrFail();
                //$trabajador_datos_laborales =  RelDatosLaborales::where("trabajador_id", "=", $trabajador->id)->first();
                $trabajador_datos_laborales =  RelDatosLaborales::firstOrCreate(['trabajador_id'=> $trabajador->id]);
                                                                
                $trabajador_datos_laborales->clues_adscripcion_fisica = $clues_destino;
                $trabajador_datos_laborales->cr_fisico_id = $cr_destino;
                $trabajador_datos_laborales->save();

                $trabajador->estatus = 1;
                $baja = RelBaja::where("trabajador_id", $trabajador->id)->update(['fecha_fin_baja' => \Date("Y-m-d")]);
                $trabajador->save();

            }

            DB::commit();

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function transferTrabajador(Request $request, $id)
    {
        try{
            $parametros = $request->all();
            
            $trabajador = Trabajador::with("datoslaborales")->find($id);

            $cr_destino = $parametros['cr'];
            $observacion = $parametros['observaciones'];
            
            //return response()->json(['data'=>$cr_destino],HttpResponse::HTTP_OK);
            
            DB::beginTransaction();

            if(true){ //aceptado por ahora
                $loggedUser = auth()->userOrFail();

                

                $trabajador_laborales =  RelDatosLaborales::where("trabajador_id", "=", $trabajador->id)->first();
                $transaccion = new RelTransaccion();
                $transaccion->trabajador_id = $trabajador->id;
                $transaccion->fecha = Carbon::now()->toDateString();
                $transaccion->cr_origen = $trabajador_laborales->cr_fisico_id;
                $transaccion->cr_destino = $cr_destino['cr'];
                $transaccion->user_id = $loggedUser->id;
                $transaccion->observacion = $observacion;
                
                $transaccion->save();

                $trabajador_datos_laborales =  RelDatosLaborales::firstOrCreate(['trabajador_id'=> $trabajador->id]);
                                                                
                $trabajador_datos_laborales->clues_adscripcion_fisica = $cr_destino['clues']['clues'];
                $trabajador_datos_laborales->cr_fisico_id = $cr_destino['cr'];
                $trabajador_datos_laborales->save();

            }

            DB::commit();

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
