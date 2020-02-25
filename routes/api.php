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
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('refresh',  'API\Auth\AuthController@refresh');

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
    Route::get('dashboard-activo',          'API\Modulos\DashboardController@activeDashboard');

    /**
     * Rutas para el Modulo de Empleados
     */
    Route::apiResource('empleados',                 'API\Modulos\EmpleadosController');
    Route::apiResource('firmantes',                 'API\Modulos\FirmantesController');
    Route::apiResource('clues',                     'API\Modulos\CluesController');

    Route::put('transferir-empleado/{id}',          'API\Modulos\EmpleadosController@transferEmployee');
    Route::get('obtener-datos-transferencia/{id}',  'API\Modulos\EmpleadosController@getEmployeeTransferData');
    Route::put('finalizar-transferencia/{id}',      'API\Modulos\EmpleadosController@finishTransferEmployee');
    Route::put('liberar-empleado/{id}',             'API\Modulos\EmpleadosController@unlinkEmployee');
    Route::put('activar-empleado/{id}',             'API\Modulos\EmpleadosController@activateEmployee');
    Route::put('baja-empleado/{id}',                'API\Modulos\EmpleadosController@shutDownEmployee');
    Route::put('comision-empleado/{id}',            'API\Modulos\EmpleadosController@comisionEmployee');
    Route::get('empleados-area',                    'API\Modulos\EmpleadosController@getEmployeeAreaData');
    
    Route::put('finalizar-captura/{id?}',             'API\Modulos\GrupoUnidadesController@finalizarCaptura');

    Route::put('solicitar-transferencia/{id}',      'API\Modulos\EmpleadosController@requestTransferEmployee');

    Route::get('ejecutar-query',                    'API\Admin\DevReporterController@executeQuery');
    Route::get('exportar-query',                    'API\Admin\DevReporterController@exportExcel');

    Route::get('catalogos-filtro-empleados', 'API\Modulos\EmpleadosController@getFilterCatalogs');

    Route::apiResource('catalogos',          'API\Modulos\CatalogosController');
    Route::get('catalogo-tipo-baja',         'API\Modulos\CatalogosController@catalogoTipoBaja');
    Route::get('catalogo-tipo-profesion',    'API\Modulos\CatalogosController@catalogoTipoProfesion');
    Route::get('obtener-catalogos',          'API\Modulos\CatalogosController@obtenerCatalogos');

    Route::get('busqueda-clues',             'API\Modulos\SearchCatalogsController@getCluesAutocomplete');
    Route::get('busqueda-codigos',           'API\Modulos\SearchCatalogsController@getCodigoAutocomplete');
    Route::get('busqueda-profesiones',       'API\Modulos\SearchCatalogsController@getProfesionAutocomplete');
    Route::get('busqueda-empleados',         'API\Modulos\EmpleadosController@getEmpleadosComplete');
    Route::get('busqueda-responsable',       'API\Modulos\EmpleadosController@getResponsableComplete');
    Route::get('busqueda-cr-adscripcion',    'API\Modulos\EmpleadosController@getCrAdscripcionComplete');
    Route::get('busqueda-cr',                'API\Modulos\EmpleadosController@getCrComplete');
    Route::get('reporte-empleados-validados',   'API\Modulos\EmpleadosController@reporteValidados');

    Route::apiResource('profile',       'API\ProfileController')->only([ 'show', 'update']);
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