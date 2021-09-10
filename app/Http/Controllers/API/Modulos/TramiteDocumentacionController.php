<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \File, \Store;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Trabajador;

//Relacionales
use App\Models\User;


class TramiteDocumentacionController extends Controller
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
            $trabajador = Trabajador::with("rel_trabajador_documentos", "datoslaborales")->where("estatus",1);

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
                $trabajador = $trabajador->where(function($query)use($access){
                    $query->whereIn('rel_trabajador_datos_laborales.clues_adscripcion_fisica',$access->lista_clues)->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                });
            }
            
            //Sacamos totales para el estatus de las cantidades validadas
            
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
            

            

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Upload(Request $request)
    {
        ini_set('memory_limit', '-1');
        $request->validate([
            'archivo' => 'required|mimes:pdf|max:5000',
            'id' => 'required',
            'rfc' =>'required'
            ]);
    
            $fileModel = new File;
            $parametros = $request->all();
            if($request->hasFile('archivo')) {
                $fileName = $parametros['rfc'];//$request->file('archivo')->getClientOriginalName();
                $extension = $request->file('archivo')->getClientOriginalExtension();
                $name = $fileName.".".$extension;
                $path = $request->file("archivo")->storeAs("public/documentacion", $name);
                dd($path);
                
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
