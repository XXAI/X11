<?php
namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Database\Eloquent\Collection;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;
use Carbon\Carbon;

use App\Models\Directorio;
use App\Models\Trabajador;
use App\Models\Cr;
use App\Models\User;

class DirectorioController extends Controller
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
            
            $permison_general = false;                
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'eZnf7wVN6PePNEhZOCWmqjbYcP3D9GRC')
                        {
                            $permison_general = true;
                        }
                    }
                }
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'eZnf7wVN6PePNEhZOCWmqjbYcP3D9GRC')
                    {
                        $permison_general = true;
                    }
                }
            }

            $directorio = Cr::with("clues", "directorio.responsable");
            if(!$access->is_admin)
            {
                if(!$permison_general)
                {
                    $directorio = $directorio->whereIn("cr",$access->lista_cr);
                }
            }

            if(isset($parametros['query']) && $parametros['query']){
                $directorio = $directorio->where('descripcion','LIKE','%'.$parametros['query'].'%');
                
            }

            if(isset($parametros['page'])){
                
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $directorio = $directorio->paginate($resultadosPorPagina);
            }
            
            return response()->json(['data'=>$directorio],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function show(Request $request, $id)
    {
        try{
            $params = $request->all();

            $directorio = CR::with("directorio.responsable")->find($id);
            return response()->json(["data"=>$directorio],HttpResponse::HTTP_OK);
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
        //$inputs = $inputs['params'];
        $reglas = [
            'direccion'               => 'required',
            'municipio'              => 'required',
            //'nombre_responsable'              => 'required',
            //'cargo_responsable'              => 'required',
        ];
        

        DB::beginTransaction();
        $object = Cr::find($inputs['cr']);
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            
            
            $object->direccion = \Str::upper($inputs['direccion']);
            $object->municipio = \Str::upper($inputs['municipio']);
            $object->telefono = $inputs['telefono'];
            $object->save();
            
            
           /*if($inputs['nombre_responsable'] != '')
            {
                $object_responsable = Directorio::where("cr", $inputs['cr'])->where('tipo_responsable_id', "=",1)->first();
                if($object_responsable == null)
                {
                    $object_responsable = new Directorio();
                    $object_responsable->cr = $inputs['cr'];
                    $object_responsable->tipo_responsable_id = 1;
                    
                }
                $object_responsable->nombre = \Str::upper("mario");
                $object_responsable->cargo = \Str::upper($inputs['cargo_responsable']);
                $object_responsable->tipo_responsable_id = 1;
                $object_responsable->save();
            }
            if($inputs['nombre_director'] != '')
            {
                $director = Directorio::where("cr", $inputs['cr'])->where('tipo_responsable_id', "=",2)->first();
                if($director == null)
                {
                    $director = new Directorio();
                    $director->cr = $inputs['cr'];
                    $director->tipo_responsable_id = 2;
                    
                }
                $director->nombre = \Str::upper($inputs['nombre_director']);
                $director->cargo = \Str::upper($inputs['cargo_director']);
                $director->tipo_responsable_id = 2;
                $director->save();
            }*/
            DB::commit();
            
        return response()->json(["data"=>$object/*, "r"=>$object_responsable/*, "d"=>$object_director*/],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function AgregarResponsable(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];
        $inputs = $request->all();
        //$inputs = $inputs['params'];
        $reglas = [
            'cr'                    => 'required',
            'trabajador_id'         => 'required',
            'tipo_responsable_id'    => 'required',
            'cargo'                 => 'required',
            'telefono'                 => 'required',
        ];
        

        DB::beginTransaction();
        $object = Directorio::where("tipo_responsable_id",$inputs['tipo_responsable_id'])->where("cr", $inputs['cr'])->first();
        if($object != null)
        {
            $object->delete();
        }
        
        $v = Validator::make($inputs, $reglas, $mensajes);
        //busqueda de tramite actual
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }
        try {
            
            $new = new Directorio();
            $new->cr = $inputs['cr'];
            $new->trabajador_id = $inputs['trabajador_id'];
            $new->tipo_responsable_id = $inputs['tipo_responsable_id'];
            $new->cargo = $inputs['cargo'];
            
            $trabajador = Trabajador::find($inputs['trabajador_id']);
            $trabajador->telefono_celular = $inputs['telefono'];
            $trabajador->save();
            
            $new->save();
           
            DB::commit();
            
        return response()->json(["data"=>$object/*, "r"=>$object_responsable/*, "d"=>$object_director*/],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Destroy($id)
    {
        try{
            
            $responsable = Directorio::find($id);
            $responsable->delete();

            return response()->json(['data'=>"Responsable Eliminado"], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function buscarResponsable(Request $request)
    {
        try{
            $params = $request->all();

            $trabajador = Trabajador::join("rel_trabajador_datos_laborales", "rel_trabajador_datos_laborales.trabajador_id","=", "trabajador.id")
                                        ->where("rel_trabajador_datos_laborales.cr_fisico_id", $params['cr'])
                                        ->select("trabajador.id", "trabajador.nombre", "trabajador.apellido_paterno", "trabajador.apellido_materno", "trabajador.rfc", "trabajador.telefono_celular");

            if(isset($params['query']) && $params['query']){
                $trabajador = $trabajador->where(function($query)use($params){
                    return $query//->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$params['query'].'%"' )
                                ->orWhere('curp','LIKE','%'.$params['query'].'%')
                                ->orWhere('rfc','LIKE','%'.$params['query'].'%');
                });
            }                            
            $trabajador = $trabajador->get();
            return response()->json($trabajador,HttpResponse::HTTP_OK);
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
