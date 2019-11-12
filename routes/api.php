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
    Route::apiResource('empleados',                 'API\Modulos\EmpleadosController');
    Route::put('transferir-empleado/{id}',          'API\Modulos\EmpleadosController@transferEmployee');
    Route::get('obtener-datos-transferencia/{id}',  'API\Modulos\EmpleadosController@getEmployeeTransferData');
    Route::put('finalizar-transferencia/{id}',      'API\Modulos\EmpleadosController@finishTransferEmployee');
    Route::put('liberar-empleado/{id}',             'API\Modulos\EmpleadosController@unlinkEmployee');

    Route::get('catalogos-filtro-empleados', 'API\Modulos\EmpleadosController@getFilterCatalogs');

    Route::apiResource('catalogos',          'API\Modulos\CatalogosController');
    Route::get('busqueda-clues',             'API\Modulos\SearchCatalogsController@getCluesAutocomplete');
    Route::get('busqueda-codigos',             'API\Modulos\SearchCatalogsController@getCodigoAutocomplete');

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