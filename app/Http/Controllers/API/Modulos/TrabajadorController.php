<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

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

//Relacionales
use App\Models\RelCapacitacion;
use App\Models\RelCapacitacionDetalles;
use App\Models\RelDatosLaborales;
use App\Models\RelEscolaridad;
use App\Models\RelEscolaridadCursante;
use App\Models\RelHorario;
use App\Models\RelNomina;
use App\Models\User;

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
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            $parametros = Input::all();
            $trabajador = Trabajador::select('trabajador.*')/*select('empleados.*','permuta_adscripcion.clues_destino as permuta_activa_clues','permuta_adscripcion.cr_destino_id as permuta_activa_cr')
                            ->leftJoin('permuta_adscripcion',function($join)use($access){
                                $join = $join->on('permuta_adscripcion.empleado_id','=','empleados.id')->where('permuta_adscripcion.estatus',1);
                                if(!$access->is_admin){
                                    $join->whereIn('permuta_adscripcion.cr_destino_id',$access->lista_cr);
                                }
                            })*/;
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg')
                        {
                            $trabajador = $trabajador->where("rfc", "=", $loggedUser->username);
                        }
                    }
                }
            }
            
            //filtro de valores por permisos del usuario
            /*if(!$access->is_admin){
                $trabajador = $trabajador->where(function($query){
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
            $loggedUser = auth()->userOrFail();
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);
            $params = Input::all();

            $trabajador = Trabajador::with('municipio_nacimiento','capacitacion','datoslaborales','escolaridad','escolaridadcursante','horario', 'datoslaboralesnomina'/*, 'capacitacionDetalles'*/)->where("id", "=", $id);

            foreach ($permisos->roles as $key => $value) {
                foreach ($value->permissions as $key2 => $value2) {
                    if($value2->id == 'nwcdIRRIc15CYI0EXn054CQb5B0urzbg')
                    {
                        $trabajador = $trabajador->where("rfc", "=", $loggedUser->username);
                    }
                }
            }
            $trabajador = $trabajador->first();

            if($trabajador){
                $trabajador->clave_credencial = \Encryption::encrypt($trabajador->rfc);
            }
            return response()->json($trabajador,HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
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
    public function update(Request $request, $id)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = Input::all();
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
                'entidad_nacimiento_id'     => 'required',
                'municipio_nacimiento_id'   => 'required',
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
                'fecha_ingreso'             => 'required',
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
                }
                
                $objectRL->actividad_id             = $inputs['actividad_id'];
                $objectRL->actividad_voluntaria_id  = $inputs['actividad_voluntaria_id'];
                $objectRL->area_trabajo_id          = $inputs['area_trabajo_id'];
                $objectRL->tipo_personal_id         = $inputs['tipo_personal_id'];
                $objectRL->fecha_ingreso            = $inputs['fecha_ingreso'];
                $objectRL->fecha_ingreso_federal    = $inputs['fecha_ingreso_federal'];
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
}
