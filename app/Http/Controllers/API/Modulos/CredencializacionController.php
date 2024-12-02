<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Database\Eloquent\Collection;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB, \File, \Store;
use Illuminate\Facades\Storage;
use Carbon\Carbon;

use App\Models\Trabajador;
use App\Models\Credencializacion;
use App\Models\Cargo;
use App\Models\Cr;
use App\Models\Clues;
use App\Models\User;

use App\Exports\DevReportExport;


class CredencializacionController extends Controller
{
    public function index(Request $request)
    {
        $firmantes = array();
        $responsable_clues = array();
        $loggedUser = auth()->userOrFail();

        $carbon = Carbon::now();

        $permiso_impresion = false;
        $permiso_visualizar_todos = false;
        $permison_individual = false; 
        try{
            $access = $this->getUserAccessData();
            
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);

            $parametros = $request->all();
            $trabajador = Trabajador::with("rel_datos_comision", "rel_datos_laborales", "credencial.usuario")
                            ->whereRaw("xtrabajador.id not in (select trabajador_id from rel_trabajador_comision where tipo_comision_id='CS' and fecha_fin>=".$carbon->format('Y-m-d')." and estatus='A' )")
                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_baja where tipo_baja_id=2 and fecha_fin_baja ='0000-00-00' and deleted_at is null)")
                            ->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina WHERE ur!='420_OPD')"); //Esta filtro es para los de la opd
                            
             
            
            $trabajador = $trabajador->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina where basificados=0)");
            if(!$access->is_admin){
                foreach ($permisos->roles as $key => $value) {
                    
                    foreach ($value->permissions as $key2 => $value2) {
                        if($value2->id == 'MA5a5d9UandF0MBBpWi4Ew98uN9sZKCE')
                        {
                            $permiso_impresion = true;
                        }
                        
                        if($value2->id == 'a1LC0TC1p9OkNd9zaIWKwUuM8qYKpprT')
                        {
                            $permiso_visualizar_todos = true;
                        }
                    }
                }
                    
                foreach ($permisos->permissions as $key2 => $value2) {
                    if($value2->id == 'MA5a5d9UandF0MBBpWi4Ew98uN9sZKCE')
                    {
                        $permiso_impresion = true;
                    }
                    
                    if($value2->id == 'a1LC0TC1p9OkNd9zaIWKwUuM8qYKpprT')
                    {
                        $permiso_visualizar_todos = true;
                    }
                }
                
            }else{
                $permiso_impresion = true;
            }
            
            //filtro de valores por permisos del usuario
            if(!$access->is_admin && $permison_individual == false && $permiso_visualizar_todos == false){
                $trabajador = $trabajador->where(function($query){
                    $query->whereIn('trabajador.estatus',[1,4]);
                })->where(function($query)use($access){
                    $clues_arreglo = join("','",$access->lista_clues);
                    $cr_arreglo = join("','",$access->lista_cr);

                    $query->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales where clues_adscripcion_fisica in ('".$clues_arreglo."'))")
                    ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_datos_laborales where cr_fisico_id in ('".$cr_arreglo."'))");
                    //->whereIn('rel_trabajador_datos_laborales.cr_fisico_id',$access->lista_cr);
                });
            }
            
            $trabajador = $this->aplicarFiltrosIndex($trabajador, $parametros, $access);
            
            $trabajador = $trabajador
            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_datos_laborales where (cr_fisico_id is null or clues_adscripcion_fisica is null))");
            
            if(isset($parametros['export_excel']) && $parametros['export_excel']){
                ini_set('memory_limit', '-1');
                
                             $trabajadorx = Trabajador::whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_comision where tipo_comision_id='CS' and fecha_fin>=".$carbon->format('Y-m-d')." and estatus='A' )")
                                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_baja where tipo_baja_id=2 and fecha_fin_baja='0000-00-00' and deleted_at is null)")
                                            ->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina where ur!='420_OPD')")     
                                            ->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina where basificados=0)");     
                             $trabajadorx = $this->aplicarFiltrosIndex($trabajadorx, $parametros, $access);
                             $trabajadorx = $trabajadorx->select(
                                 \DB::Raw("concat(nombre,' ', apellido_paterno,' ',apellido_materno) as nombre"), "rfc", "curp",
                                 \DB::Raw("(select clues from catalogo_cr where cr=(select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id)) as clues"),
                                 \DB::Raw("(select descripcion_actualizada from catalogo_cr where cr=(select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=trabajador.id)) as nombre_unidad"));
                             $trabajadorx = $trabajadorx->get();
                             $columnas = array_keys(collect($trabajadorx[0])->toArray());

                $filename = "LISTADO_CREDENCIALIZACION";
                
                //return $columnas;
                return (new DevReportExport($trabajadorx,$columnas))->download('hola.xlsx');
                
            }else if(isset($parametros['page'])){
                
                $trabajador = $trabajador->orderBy('nombre');
                            
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
                
            } 
            
            if(!$loggedUser->gruposUnidades){
                $loggedUser->load('gruposUnidades');
            }
            if(count($loggedUser->gruposUnidades) > 0){
                $estatus = ['grupo_usuario'=>true, 'finalizado'=>$loggedUser->gruposUnidades[0]->finalizado];
            }else{
                $estatus = ['grupo_usuario'=>false];
            }
            
            return response()->json(['data'=>$trabajador, 'impresion'=>$permiso_impresion, "todos"=> $permiso_visualizar_todos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            $response_data = [];
            //$loggedUser = auth()->userOrFail();
            $carbon = Carbon::now();
            $trabajador = Trabajador::with('credencial.cargo', 'rel_datos_laborales')
            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_comision where tipo_comision_id='CS' and fecha_fin>=".$carbon->format('Y-m-d')." and estatus='A' )")
            ->find($id);

            /*foreach ($permisos->roles as $key => $value) {
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
            }*/

            $image = base64_encode(\Storage::get('public\\FromatoCredencial\\Gafete2024_4.jpg'));
            if($trabajador->credencial != null)
            {
                
                if($trabajador->credencial->foto == 1)
                {
                    $trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\'.$trabajador->id.'.'.$trabajador->credencial->extension));
                }
            }

            $encriptacion = "ubp((%kU0";
            $trabajador->encriptar = encrypt($trabajador->rfc, $encriptacion);
            
            return response()->json(["data"=>$trabajador, "formato" => $image],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function Store(Request $request)
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
        ];
        DB::beginTransaction();
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

     try{  
       $trabajador = Trabajador::find($inputs['trabajador_id']);
      
        if($request->hasFile('archivo')) {
            
            $fileName = $trabajador->id;
            $extension = $request->file('archivo')->getClientOriginalExtension();
            if($extension == "jpg" || $extension == "jpeg")
            {
                $name = $fileName.".".$extension;
                $request->file("archivo")->storeAs("public/FotoTrabajador", $name);
            }else{
                return response()->json(['error' => "Formato de imagen incorrento, favor de verificar" ], HttpResponse::HTTP_CONFLICT);
            }
             
            $object_rel = Credencializacion::where("trabajador_id",$trabajador->id)->first();
            $object_rel->foto = 1;
            $object_rel->extension = $extension;
            $object_rel->save();

            DB::commit();
        }
        
       
        return response()->json(['data'=>$object_rel],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
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
        
        $reglas = [
            'tipo_sangre_id'            => 'required',
            'signo'                        => 'required',
            'cargo'                     => 'required',
            'contacto'                  => 'required',
            'contacto_telefono'         => 'required',
            'donador'                   => 'required',
            'capacidad_especial'        => 'required',
            
        ];
            
        
        $object = Trabajador::with("credencial")->find($id);
        if(!$object){
            return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
        }

        
        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return response()->json(['error' => "Hace falta campos obligatorios. ".$v->errors() ], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            
            if($object->credencial != null)
            {
                $object_rel = Credencializacion::find($object['credencial']['id']);
                $object_rel->tipo_sanguineo = $inputs['tipo_sangre_id'];
                $object_rel->rh= $inputs['signo'];
                $object_rel->cargo_id= $inputs['cargo'];
                $object_rel->area_opcional= $inputs['area_opcional'];
                $object_rel->donador_id= $inputs['donador'];
                $object_rel->capacidad_especial_id= $inputs['capacidad_especial'];
                $object_rel->contacto= $inputs['contacto'];
                $object_rel->contacto_telefono= $inputs['contacto_telefono'];
                $object_rel->save();
                    
            
            }else{
                $new = new Credencializacion;
                $new->trabajador_id= $id;
                $new->tipo_sanguineo= $inputs['tipo_sangre_id'];
                $new->rh= $inputs['signo'];
                $new->cargo_id= $inputs['cargo'];
                $new->area_opcional= $inputs['area_opcional'];
                $new->donador_id= $inputs['donador'];
                $new->capacidad_especial_id= $inputs['capacidad_especial'];
                $new->contacto= $inputs['contacto'];
                $new->contacto_telefono= $inputs['contacto_telefono'];
                $new->save();
            }
           
            
            DB::commit();
            return response()->json($object,HttpResponse::HTTP_OK);

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

    public function ImprimirLote(Request $request)
    {
        $loggedUser = auth()->userOrFail();
        try{
            $access = $this->getUserAccessData();
            
            $permisos = User::with('roles.permissions','permissions')->find($loggedUser->id);
            $carbon = Carbon::now();
            $parametros = $request->all();
            $trabajador = Trabajador::with('credencial.cargo', 'rel_datos_laborales')
                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_baja where tipo_baja_id=2 and fecha_fin_baja ='0000-00-00' and deleted_at is null)")
                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_datos_laborales where cr_fisico_id is null)")
                            ->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina where ur!='420_OPD')")
                            ->whereRaw("trabajador.id in (select trabajador_id FROM rel_trabajador_datos_laborales_nomina where basificados=0)")
                            ->whereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_comision where tipo_comision_id='CS' and fecha_fin>=".$carbon->format('Y-m-d')." and estatus='A' )");
                            
                                       
            $parametros['imprimible'] = 1;
            $trabajador = $this->aplicarFiltros($trabajador, $parametros, $access);       
            if(isset($parametros['page'])){
                $trabajador = $trabajador->orderBy('nombre');

                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            } 

            $permison_individual = false;                

            $formato = base64_encode(\Storage::get('public\\FromatoCredencial\\Gafete2024_4.jpg'));
            
            $encriptacion = "ubp((%kU0";
            foreach ($trabajador as $key => $value) {
                $trabajador[$key]->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\'.$value->id.'.'.$value->credencial->extension));
                //$trabajador[$key]->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\1.jpg'));
                
                $trabajador[$key]->encriptar = encrypt($trabajador[$key]->rfc, $encriptacion);
                //Actualizacion de credencial
                $obj = Credencializacion::where("trabajador_id",$value->id)->first();
                $obj->impreso = 1;
                $obj->fecha_impresion = $carbon;
                $obj->user_impresion_id = $loggedUser->id;
                $obj->save();
            }

        return response()->json(['data'=>$trabajador, 'formato'=>$formato],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function RegistroImpreso(Request $request, $id)
    {
        $loggedUser = auth()->userOrFail();
        try{
            $carbon = Carbon::now();
            $obj = Credencializacion::where("trabajador_id",$id)->first();
            $obj->impreso = 1;
            $obj->fecha_impresion = $carbon;
            $obj->user_impresion_id = $loggedUser->id;
            $obj->save();
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function foto(Request $request, $id)
    {
        try{
            $encriptacion = "ubp((%kU0";
            $rfc = decrypt($id, $encriptacion);
            
    
            $trabajador = Trabajador::where("rfc", $rfc)
            ->select("id", "nombre", "apellido_paterno", "apellido_materno")
            ->first();

            $credencial = Credencializacion::where("trabajador_id", $trabajador->id)
                            ->select("area_opcional", "extension", "foto", "cargo_id")->first();

            $cargo = Cargo::find($credencial->cargo_id);
            $cr = Cr::whereRaw("cr = (select cr_fisico_id from rel_trabajador_datos_laborales where trabajador_id=".$trabajador->id.")")->select("descripcion", "cr")->first();
            $clues = Clues::whereRaw("clues = (select clues_adscripcion_fisica from rel_trabajador_datos_laborales where trabajador_id=".$trabajador->id.")")->select("nombre_unidad", "clues")->first();

            $trabajador->credencial = $credencial;
            if($trabajador->credencial)
            {
                $trabajador->credencial->cargo = $cargo;
            }
            
            $trabajador->cr = $cr;
            if($trabajador->cr)
            {
                $trabajador->cr->clues = $clues;
            }
            if($trabajador)
            {
                $trabajador->credencial->foto_trabajador = base64_encode(\Storage::get('public\\FotoTrabajador\\'.$trabajador->id.'.'.$trabajador->credencial->extension));
            }else{
                $trabajador = [];
            }
            return response()->json($trabajador,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    function encrypt($string, $key) {
        $result = '';
        for($i=0; $i<strlen($string); $i++) {
           $char = substr($string, $i, 1);
           $keychar = substr($key, ($i % strlen($key))-1, 1);
           $char = chr(ord($char)+ord($keychar));
           $result.=$char;
        }
        return base64_encode($result);
     }

     function decrypt($string, $key) {
        $result = '';
        $string = base64_decode($string);
        for($i=0; $i<strlen($string); $i++) {
           $char = substr($string, $i, 1);
           $keychar = substr($key, ($i % strlen($key))-1, 1);
           $char = chr(ord($char)-ord($keychar));
           $result.=$char;
        }
        return $result;
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

            if(isset($parametros['imprimible']) && $parametros['imprimible'] == 1){
                $main_query = $main_query->where('validado',1)
                                          ->where('estatus',1)
                                          ->where('actualizado',1)
                                          ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_credencial where deleted_at is null and foto=1)");
            }
        }
        return $main_query;
    }

    private function aplicarFiltrosIndex($main_query, $parametros, $access){
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

            if(isset($parametros['imprimible']) && $parametros['imprimible'] == 1){
                $main_query = $main_query->where('validado',1)
                                          ->where('estatus',1)
                                          ->where('actualizado',1)
                                          ->whereRaw("trabajador.id in (select trabajador_id from rel_trabajador_credencial where deleted_at is null and foto=1)");
            }else if(isset($parametros['imprimible']) && $parametros['imprimible'] == 2)
            {
                $main_query = $main_query->Where(function($query) {
                    $query->where('validado',0)
                    ->orWhere('estatus',0)
                    ->orWhere('actualizado',0)
                    ->orWhereRaw("trabajador.id not in (select trabajador_id from rel_trabajador_credencial where deleted_at is null and foto=1)");
                });
            }
        }
        return $main_query;
    }

}
