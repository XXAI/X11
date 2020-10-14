<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Trabajador;
use App\Models\Pais;
use App\Models\Entidad;
use App\Models\Municipio;
use App\Models\Nacionalidad;
use App\Models\EstadoConyugal;
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

//Relacionales
use App\Models\RelCapacitacion;
use App\Models\RelCapacitacionDetalles;
use App\Models\RelDatosLaborales;
use App\Models\RelEscolaridad;
use App\Models\RelEscolaridadCursante;
use App\Models\RelHorario;
use App\Models\RelNomina;

use App\Exports\DevReportExport;

class TrabajadorController extends Controller
{
    public function index()
    {
        $firmantes = array();
        $responsable_clues = array();
        $loggedUser = auth()->userOrFail();

        try{
            $access = $this->getUserAccessData();
            
            $parametros = Input::all();
            $trabajador = Trabajador::select('trabajador.*')/*select('empleados.*','permuta_adscripcion.clues_destino as permuta_activa_clues','permuta_adscripcion.cr_destino_id as permuta_activa_cr')
                            ->leftJoin('permuta_adscripcion',function($join)use($access){
                                $join = $join->on('permuta_adscripcion.empleado_id','=','empleados.id')->where('permuta_adscripcion.estatus',1);
                                if(!$access->is_admin){
                                    $join->whereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                                }
                            })*/;
            
            //filtro de valores por permisos del usuario
            /*if(!$access->is_admin){
                $empleados = $empleados->where(function($query){
                    $query->whereIn('empleados.estatus',[1,4]);
                })->where(function($query)use($access){
                    $query->whereIn('empleados.clues',$access->lista_clues)->whereIn('empleados.cr_id',$access->lista_cr)
                        ->orWhere(function($query2)use($access){
                            $query2->whereIn('permuta_adscripcion.clues_destino',$access->lista_clues)->orWhereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                        });
                });
            }

            //Sacamos totales para el estatus de las cantidades validadas
            $estatus_validacion = clone $empleados;
            $estatus_validacion = $estatus_validacion->select(DB::raw('sum(IF(empleados.estatus = 1 OR empleados.estatus = 4,1,0)) as total_activos'),DB::raw('sum(IF(empleados.estatus = 1 AND empleados.validado = 1,1,0)) as total_validados'),DB::raw('count(empleados.id) as total_registros'))->first();
            $estatus_validacion->porcentaje = intval(($estatus_validacion->total_validados*100)/$estatus_validacion->total_activos);

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $empleados = $empleados->where(function($query)use($parametros){
                    return $query//->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){
                if(isset($parametros['clues']) && $parametros['clues']){
                    $empleados = $empleados->where('empleados.clues',$parametros['clues']);
                }

                if(isset($parametros['cr']) && $parametros['cr']){
                    $empleados = $empleados->where('empleados.cr_id',$parametros['cr']);
                }

                if(isset($parametros['estatus']) && $parametros['estatus']){
                    $estatus = explode('-',$parametros['estatus']);
                    $empleados = $empleados->where('empleados.estatus',$estatus[0]);
                    if(isset($estatus[1])){
                        $empleados = $empleados->where('empleados.validado',$estatus[1]);
                    }
                }

            
                if(isset($parametros['rama']) && $parametros['rama']){
                    $empleados = $empleados->where('rama_id',$parametros['rama']);
                }

                if($access->is_admin){
                    if(isset($parametros['grupos']) && $parametros['grupos']){
                        $grupo = GrupoUnidades::with('listaCR')->find($parametros['grupos']);
                        $lista_cr = $grupo->listaCR->pluck('cr')->toArray();

                        $empleados = $empleados->where(function($query)use($lista_cr){
                            $query->whereIn('empleados.cr_id',$lista_cr)
                                ->orWhere(function($query2)use($lista_cr){
                                    $query2->whereIn('permuta_adscripcion.cr_destino_id',$lista_cr);
                                });
                        });
                    }
                }
            }*/

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            } /*else {
                if(isset($parametros['reporte'])){
                    //Reporte Personal Activo
                    $empleados = $empleados->select('empleados.*','turnos.descripcion as turno','funciones.grupo as funcion','clues.nombre_unidad as clues_descripcion','cr.descripcion as cr_descripcion', "codigos.descripcion as codigo")
                                        ->leftjoin('catalogo_turno as turnos','turnos.id','empleados.turno_id')
                                        ->leftjoin('catalogo_codigo as codigos','codigos.codigo','empleados.codigo_id')
                                        ->leftjoin('catalogo_grupo_funcion as funciones','funciones.id','codigos.grupo_funcion_id')
                                        ->leftjoin('catalogo_clues as clues','clues.clues','empleados.clues')
                                        ->leftjoin('catalogo_cr as cr','cr.cr','empleados.cr_id')
                                        ->orderBy('clues','asc')
                                        ->orderBy('cr_id','asc');
                    
                    if(isset($parametros['export_excel']) && $parametros['export_excel']){
                        ini_set('memory_limit', '-1');
                        $empleados = $empleados->select('empleados.clues as CLUES','empleados.cr_id as CR','cr.descripcion as CR_DESC','empleados.rfc as RFC','empleados.curp as CURP',DB::raw('concat_ws(" ",empleados.apellido_paterno,empleados.apellido_materno,empleados.nombre) as NOMBRE'),'codigos.codigo as CODIGO','codigos.descripcion as DESC_CODIGO',
                                                        'LIC_DET.descripcion as LICENCIATURA','TEC_DET.descripcion as TECNICA','turnos.descripcion as TURNO', 'empleados.hora_entrada as HORA_ENTRADA','empleados.hora_salida as HORA_SALIDA','empleados.area_servicio as AREA_SERVICIO',
                                                        'funciones.grupo as FUNCION','empleados.observaciones as OBSERVACIONES')
                                                ->leftjoin('empleado_escolaridad_detalles as LIC',function($join){
                                                    $join->on('LIC.empleado_id','=','empleados.id')->where('LIC.tipo_estudio','LIC')->whereNull('LIC.deleted_at');
                                                })
                                                ->leftjoin('catalogo_profesion as LIC_DET','LIC_DET.id','LIC.profesion_id')
                                                ->leftjoin('empleado_escolaridad_detalles as TEC',function($join){
                                                    $join->on('TEC.empleado_id','=','empleados.id')->where('TEC.tipo_estudio','TEC')->whereNull('TEC.deleted_at');
                                                })
                                                ->leftjoin('catalogo_profesion as TEC_DET','TEC_DET.id','TEC.profesion_id');
    
                        try{
                            $empleados = $empleados->get();
                            $columnas = array_keys(collect($empleados[0])->toArray());
    
                            if(isset($parametros['nombre_archivo']) && $parametros['nombre_archivo']){
                                $filename = $parametros['nombre_archivo'];
                            }else{
                                $filename = 'reporte-personal-activo';
                            }
                            
                            return (new DevReportExport($empleados,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
                        }catch(\Exception $e){
                            return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
                        }
                    }else{
                        $empleados = $empleados->with(['escolaridadDetalle'=>function($query){
                                            $query->whereIn('tipo_estudio',['LIC','TEC']);
                                        },'escolaridadDetalle.profesion']);
                    }
                }
                $empleados = $empleados->get();

                $loggedUser->load('gruposUnidades.listaFirmantes.empleado',"gruposUnidades.listaCR.clues.responsable");
                if(count($loggedUser->gruposUnidades) > 0){
                    $firmantes = $loggedUser->gruposUnidades[0]->listaFirmantes;
                    $responsable_clues = $loggedUser->gruposUnidades[0]->listaCR;
                }else if(isset($parametros['grupos']) && $parametros['grupos']){
                    $grupo = GrupoUnidades::with('listaFirmantes.empleado','listaCR.clues.responsable')->find($parametros['grupos']);
                    if($grupo){
                        $firmantes = $grupo->listaFirmantes;
                        $responsable_clues = $grupo->listaCR;
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
            $estatus['estatus_validacion'] = $estatus_validacion;*/
            

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show($id)
    {
        try{
            $access = $this->getUserAccessData();

            $params = Input::all();

            $trabajador = Trabajador::with('capacitacion','datoslaborales','escolaridad','escolaridadcursante','horario')->where("id", "=", $id)->first();

            return response()->json($trabajador,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getCatalogos()
    {
        try{
            $catalogos = Array();
            $catalogos['pais']              = Pais::all();
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

    public function getBuscador()
    {
        try{
            $parametros = Input::all();
            switch ($parametros['tipo']) {
                case 1:
                    $obj = Municipio::where("descripcion", "like", "%".$parametros['query']."%")
                    ->where("entidad_id", "=", $parametros['entidad_nacimiento']);
                break;
                
                case 2:
                $obj = Profesion::where("descripcion", "like", "%".$parametros['query']."%")
                ->where("tipo_profesion_id", "=", $parametros['grado_academico']);
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
}
