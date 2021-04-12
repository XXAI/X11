<?php
namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Requests;

use App\Http\Controllers\Controller;
use \Validator,\Hash, \Response, \DB;

use App\Models\Firmantes, App\Models\Trabajador;


class FirmantesController extends Controller
{
    public function index()
    {
        
        try{
            $loggedUser = auth()->userOrFail();
            
            $loggedUser->load('gruposUnidades.listaFirmantes.trabajador');
            
            return response()->json(['data'=>$loggedUser->gruposUnidades[0]->listaFirmantes ],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * sTORE the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $mensajes = [
            
            'required'      => "required",
            'email'         => "email",
            'unique'        => "unique"
        ];

        $reglas = [
            //'grupo_unidades_id'             => 'required',
            'firmante_id'             => 'required',
            'cargo'             => 'required',
        ];

        $inputs = $request->all();
        $v = Validator::make($inputs, $reglas, $mensajes);

        if ($v->fails()) {
            throw new \Exception("Hacen falta campos obligatorios", 1);
            //return response()->json(['error' => "Hace falta campos obligatorios."], HttpResponse::HTTP_CONFLICT);
        }

        DB::beginTransaction();
        try {
            
            $loggedUser = auth()->userOrFail();
            
            $loggedUser->load('gruposUnidades.listaFirmantes');

            $firmantes = new Firmantes();
                
            $firmantes->grupo_unidades_id = $loggedUser->gruposUnidades[0]->id;
            $firmantes->firmante_id = $inputs['firmante_id'];
            $firmantes->cargo = strtoupper($inputs['cargo']);
            $firmantes->save();
            DB::commit();
            
            return response()->json($firmantes,HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $firmante = Firmantes::find($id);

            $firmante->delete();

            return response()->json(['eliminado'=>true],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getTrabajadorComplete(Request $request)
    {
        try{
            $parametros = $request->all();

            $access = $this->getUserAccessData();
            
            $trabajador = Trabajador::Join("rel_trabajador_datos_laborales as datos_laborales", "datos_laborales.trabajador_id", "trabajador.id")
            ->where(function($query)use($parametros){
                return $query->whereRaw(' concat(nombre," ", apellido_paterno, " ", apellido_materno) like "%'.$parametros['busqueda_empleado'].'%"' )
                            ->orWhere('rfc','LIKE','%'.$parametros['busqueda_empleado'].'%')
                            ->orWhere('curp','LIKE','%'.$parametros['busqueda_empleado'].'%');
            });

            if(count($access->lista_cr) > 0)
            {
                $trabajador = $trabajador->whereRaw('datos_laborales.cr_fisico_id IN ('.implode(',',$access->lista_cr).')');
            }


            if(!$access->is_admin){
                $trabajador = $trabajador->select('trabajador.id','datos_laborales.clues_adscripcion_fisica','datos_laborales.cr_fisico_id',DB::raw('concat(apellido_paterno, " ", apellido_materno," ",nombre ) as nombre'),'rfc','curp','estatus','validado',DB::raw('IF(datos_laborales.cr_fisico_id IN ('.implode(',',$access->lista_cr).'),1,0) as empleado_propio'));
            }else{
                $trabajador = $trabajador->select('trabajador.id','datos_laborales.clues_adscripcion_fisica','datos_laborales.cr_fisico_id',DB::raw('concat(apellido_paterno, " ", apellido_materno," ",nombre ) as nombre'),'rfc','curp','estatus','validado',DB::raw('1 as empleado_propio'));
            }
            
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $trabajador = $trabajador->paginate($resultadosPorPagina);
            } else {

                $trabajador = $trabajador->get();
            }

            $trabajador->map(function($empleado){
                return $empleado->clave_credencial = \Encryption::encrypt($empleado->rfc);
            });

            return response()->json(['data'=>$trabajador],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    
    private function getUserAccessData($loggedUser = null){
        if(!$loggedUser){
            $loggedUser = auth()->userOrFail();
        }
        
        //$loggedUser->load('perfilCr');
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
