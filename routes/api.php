<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('save-participante',   'API\Modulos\ParticipantesController@saveParticipante');
Route::post('save-cuestionario',   'API\Modulos\ParticipantesController@saveCuestionario');
Route::post('actualizar-participante',   'API\Modulos\ParticipantesController@actualizarParticipante');
Route::get('verificar-cuestionario',   'API\Modulos\ParticipantesController@verificarCuestionario');
Route::get('verificar-avance',   'API\Modulos\ParticipantesController@verificarAvance');
Route::get('ver-constancia',   'API\Modulos\ParticipantesController@verConstancia');
Route::get('ver-reporte-dengue',                'API\Modulos\ParticipantesController@exportExcel');

Route::get('ver-foto/{id}',                'API\Modulos\CredencializacionController@foto');

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('register',   'API\Admin\RegistroController@register');
Route::post('refresh',  'API\Auth\AuthController@refresh');

Route::post('req-password-reset', 'Reset\ResetPwdReqController@reqForgotPassword');
Route::post('update-password', 'Reset\UpdatePwdController@updatePassword');

Route::group(['middleware'=>'auth'],function($router){
    Route::apiResource('user',          'API\Admin\UserController');
    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');
    
    //Modulos del Sistema
    /**
     * Rutas para el Modulo de Catalogos
     */
    Route::apiResource('profesiones',               'API\Modulos\ProfesionesController');
    Route::apiResource('grupos_unidades',           'API\Modulos\GrupoUnidadesController');

    /**
     * Rutas para el Modulo de Dashboard
     */
    Route::apiResource('dashboard',                 'API\Modulos\DashboardController');
    Route::get('dashboard-activo',                  'API\Modulos\DashboardController@activeDashboard');

    /**
     * Rutas para Servicios de la API
     */
    Route::get('listado-empleados', 'API\Servicios\EmpleadosServiceController@listadoEmpleados');
    Route::get('ver-info-empleado/{id}', 'API\Servicios\EmpleadosServiceController@infoEmpleado');

    /**
     * Rutas para el Modulo de Empleados
     */
    Route::apiResource('empleados',                 'API\Modulos\EmpleadosController');
    /* Trabajador */
    Route::apiResource('trabajador',                'API\Modulos\TrabajadorController');
    Route::get('catalogo-trabajador',               'API\Modulos\TrabajadorController@getCatalogos');
    Route::get('catalogo-fiscal/{id}',               'API\Modulos\TrabajadorController@getCatalogoFiscal');
    Route::get('buscador-datos-trabajador',         'API\Modulos\TrabajadorController@getBuscador');
    Route::get('valida-rfc/{id}',                   'API\Modulos\TrabajadorController@getBuscadorRfc');
    Route::put('trabajador_finalizar/{id}',         'API\Modulos\TrabajadorController@FinalizarCaptura');

    Route::get('ver-info-trabajador/{id}',          'API\Servicios\TrabajadorServiceController@detalleTrabajador');
    Route::put('liberar-trabajador/{id}',           'API\Modulos\TrabajadorController@unlinkTrabajador');
    /* Fin trabajador */
    Route::apiResource('firmantes',                 'API\Modulos\FirmantesController');
    Route::apiResource('clues',                     'API\Modulos\CluesController');
    
    Route::put('transferir-trabajador/{id}',          'API\Modulos\TrabajadorController@transferTrabajador');
    
    Route::put('finalizar-transferencia/{id}',      'API\Modulos\EmpleadosController@finishTransferEmployee');
    Route::put('liberar-empleado/{id}',             'API\Modulos\EmpleadosController@unlinkEmployee');
    Route::put('activar-empleado/{id}',             'API\Modulos\EmpleadosController@activateEmployee');
    Route::put('baja-empleado/{id}',                'API\Modulos\EmpleadosController@shutDownEmployee');
    //Route::put('agente-certificador/{id}',          'API\Modulos\EmpleadosController@setEmployeeAsAgent');
    Route::put('comision-empleado/{id}',            'API\Modulos\EmpleadosController@comisionEmployee');
    Route::get('empleados-area',                    'API\Modulos\EmpleadosController@getEmployeeAreaData');
    
    Route::put('finalizar-captura/{id?}',             'API\Modulos\GrupoUnidadesController@finalizarCaptura');

    Route::put('solicitar-transferencia/{id}',      'API\Modulos\EmpleadosController@requestTransferEmployee');
    Route::put('activar-trabajador/{id}',           'API\Modulos\TrabajadorController@requestTransferEmployee');
    Route::put('validar-trabajador/{id}',           'API\Modulos\TrabajadorController@validateTrabajador');
    Route::put('baja-trabajador/{id}',              'API\Modulos\TrabajadorController@bajaTrabajador');

    Route::get('ejecutar-query',                    'API\Admin\DevReporterController@executeQuery');
    Route::get('exportar-query',                    'API\Admin\DevReporterController@exportExcel');
    

    Route::get('catalogos-filtro-empleados', 'API\Modulos\EmpleadosController@getFilterCatalogs');

    Route::apiResource('catalogos',          'API\Modulos\CatalogosController');
    Route::get('catalogo-tipo-baja',         'API\Modulos\CatalogosController@catalogoTipoBaja');
    Route::get('catalogo-tipo-profesion',    'API\Modulos\CatalogosController@catalogoTipoProfesion');
    Route::get('catalogo-tipo-profesion',    'API\Modulos\CatalogosController@catalogoTipoProfesion');
    Route::get('catalogo_cargos',            'API\Modulos\CatalogosController@obtenerCatalogoCargo');

    Route::get('busqueda-clues',             'API\Modulos\SearchCatalogsController@getCluesAutocomplete');
    Route::get('busqueda-codigos',           'API\Modulos\SearchCatalogsController@getCodigoAutocomplete');
    Route::get('busqueda-profesiones',       'API\Modulos\SearchCatalogsController@getProfesionAutocomplete');
    Route::get('busqueda-empleados',         'API\Modulos\EmpleadosController@getEmpleadosComplete');
    Route::get('busqueda-firmantes',         'API\Modulos\FirmantesController@getTrabajadorComplete');
    Route::get('busqueda-trabajadores',      'API\Modulos\TrabajadorController@getTrabajadoresComplete');
    Route::put('activar-trabajador-sindical/{id}',      'API\Modulos\TrabajadorController@activarTrabajadorSindical');
    Route::get('busqueda-trabajador-tramite',      'API\Modulos\TrabajadorController@getTrabajadoresTramite');
    Route::get('busqueda-responsable',       'API\Modulos\EmpleadosController@getResponsableComplete');
    Route::get('busqueda-cr-adscripcion',    'API\Modulos\EmpleadosController@getCrAdscripcionComplete');
    Route::get('busqueda-cr',                'API\Modulos\EmpleadosController@getCrComplete');
    Route::get('reporte-empleados-validados',   'API\Modulos\EmpleadosController@reporteValidados');

    //Route::apiResource('tramites',       'API\Modulos\TramitesController');
    Route::apiResource('directorio',       'API\Modulos\DirectorioController');
    Route::get('directorio-trabajador',       'API\Modulos\DirectorioController@buscarResponsable');
    Route::post('responsable-unidad',       'API\Modulos\DirectorioController@AgregarResponsable');
    //Route::post('responsable-unidad/{id}',       'API\Modulos\DirectorioController@EliminarResponsable');
    //Route::get('tramites-trabajador/{id}',    'API\Modulos\TramitesController@ListTramites');
    Route::get('clues_asistencia',              'API\Modulos\TrabajadorController@ListCluesAsistencia');
    Route::post('upload-csf',                           'API\Modulos\TrabajadorController@Upload');
    
    Route::post('comision-sindical',                    'API\Modulos\TrabajadorController@comisionSindical');
    Route::apiResource('comision-interna-sindical',    'API\Modulos\ComisionSindicalController');
    //Rutas de Tramites
    Route::apiResource('tramite-documentacion',         'API\Modulos\TramiteDocumentacionController');
    Route::get('tramite-documentacion-reporte',         'API\Modulos\TramiteDocumentacionController@reporteDia');
    Route::post('tramite-documentacion-upload',         'API\Modulos\TramiteDocumentacionController@Upload');
    Route::post('tramite-importar-csv',                 'API\Modulos\TramiteComisionInternaController@UploadCsv');
    Route::post('importar_csv_data',                    'API\Modulos\TramiteComisionInternaController@CargarInformacion');
    Route::post('validar-importacion',                    'API\Modulos\TramiteComisionInternaController@ValidarImportacion');
    Route::post('migrar-importacion',                    'API\Modulos\TramiteComisionInternaController@migrarInformacion');
    
    Route::get('tramite-documentacion-download/{id}',   'API\Modulos\TramiteDocumentacionController@Download');
    Route::get('constancia-download/{id}',              'API\Modulos\TrabajadorController@Download');
    Route::apiResource('tramite-adscripcion',           'API\Modulos\TramiteAdscripcionController');
    Route::get('tramite-adscripcion-lote',              'API\Modulos\TramiteAdscripcionController@ObtenerLote');
    Route::apiResource('tramite-adscripcion-externa',   'API\Modulos\TramiteAdscripcionExternaController');
    Route::get('tramite-adscripcion-externa-lote',      'API\Modulos\TramiteAdscripcionExternaController@ObtenerLote');
    Route::apiResource('tramite-reincorporacion',       'API\Modulos\TramiteReincorporacionController');
    Route::get('tramite-reincorporacion-lote',          'API\Modulos\TramiteReincorporacionController@ObtenerLote');
    Route::apiResource('tramite-comision',              'API\Modulos\TramiteComisionInternaController');
    Route::get('tramite-comision-lote',                 'API\Modulos\TramiteComisionInternaController@ObtenerLote');
    Route::get('busqueda-comision',                     'API\Modulos\TramiteComisionInternaController@buscarTrabajadorComision');
    Route::post('truncar-comision',                     'API\Modulos\TramiteComisionInternaController@truncarComision');
    
    Route::apiResource('profile',                       'API\ProfileController')->only([ 'show', 'update']);
    Route::get('reset-contrasena/{id}',                 'API\Admin\UserController@resetPassword');
    //Credencializacion
    Route::apiResource('credencializacion',         'API\Modulos\CredencializacionController');
    Route::get('credencializacion-lote',            'API\Modulos\CredencializacionController@ImprimirLote');
    Route::get('public//FromatoCredencial//default.jpg', function($filename) {
        $file = \Illuminate\Support\Facades\Storage::get($filename);
        return response($file, 200) -> header('Content-Type', 'image/jpeg');
     });
});

Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});