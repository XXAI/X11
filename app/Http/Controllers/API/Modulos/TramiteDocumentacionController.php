<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \File, \Store;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Facades\Storage;
use App\Models\Trabajador;
use App\Models\RelDocumentacion;


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
            

            $permison_rh = false;                
            $permison_of_central = false;                
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'EySO29UpzhUKu551egauF0V0gDk5Tqzd')
                        {
                            $permison_rh = true;
                        }
                        if($value2->id == 'KUeJRn2HvxMehoKDSyNTeiJX1Aax7tIh')
                        {
                            $permison_of_central = true;
                        }
                    }
                }
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'EySO29UpzhUKu551egauF0V0gDk5Tqzd')
                    {
                        $permison_rh = true;
                    }
                    if($value2->id == 'KUeJRn2HvxMehoKDSyNTeiJX1Aax7tIh')
                    {
                        $permison_of_central = true;
                    }
                }
            }else{
                $permison_rh = true;
                $permison_of_central = true;
            }
            
            //Sacamos totales para el estatus de las cantidades validadas
            if($permison_rh || $access->is_admin){
                $trabajador = Trabajador::leftJoin("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                    ->with('rel_trabajador_documentos', "datoslaborales")
                                        ->where("estatus", 1);
            }
            else if($permison_of_central == true)
            {
                $trabajador = Trabajador::leftJoin("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id", "=", "trabajador.id")
                                        ->with('rel_trabajador_documentos',"datoslaborales")
                                        ->whereRaw(DB::RAW("(trabajador.id in (select trabajador_id from rel_trabajador_documentacion where estatus in (1,3)))"))
                                        ->where("trabajador.estatus", 1);
            } 
            
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

            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);

            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            }
            

            

            return response()->json(['data'=>$trabajador, 'rh'=>$permison_rh, 'oficina'=>$permison_of_central],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
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
        $reglas = ['estatus'=> 'required'];
            
            
        $object = RelDocumentacion::where("trabajador_id",$id)->first();
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            if($inputs['estatus'] == 2)
            {
                $object->observacion                       = $inputs['observacion'];       
            }
            $object->estatus                       = $inputs['estatus'];   
            $object->save();
            
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function Upload(Request $request)
    {
        
        ini_set('memory_limit', '-1');
        
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        
        $reglas = [
            'trabajador_id'       => 'required',
            'rfc'                 => 'required',
        ];
        
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
      
        
     try{  
       $parametros = $request->all();
       $documentacion = RelDocumentacion::where("trabajador_id", $parametros['trabajador_id'])->first();
       
       
       if(!$documentacion)
       {
            $documentacion = new RelDocumentacion();
       }
        if($request->hasFile('archivo')) {
            $fileName = $parametros['rfc'];
            $extension = $request->file('archivo')->getClientOriginalExtension();
            $name = $fileName.".".$extension;
            $request->file("archivo")->storeAs("public/documentacion", $name);
            
            $documentacion->trabajador_id = $parametros['trabajador_id']; 
            $documentacion->rfc = $parametros['rfc']; 
            $documentacion->estatus = 1;
            $documentacion->save(); 
            DB::commit();
        }
        
       
        return response()->json(['data'=>$documentacion],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Download(Request $request, $id)
    {
        
        ini_set('memory_limit', '-1');
        DB::beginTransaction();
        
     try{  
       $documentacion = RelDocumentacion::where("trabajador_id", $id)->first();
       

        return \Storage::download("public//documentacion//".$documentacion->rfc.".pdf");
        //return response()->json(['data'=>$documentacion],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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

            
        }
        return $main_query;
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
