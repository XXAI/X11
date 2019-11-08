<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Clues;
use App\Models\Codigo;
use App\Models\Cr;
use App\Models\Fuente;
use App\Models\Profesion;
use App\Models\Programa;
use App\Models\Rama;
use App\Models\TipoNomina;
use App\Models\TipoProfesion;

class CatalogosController extends Controller
{
    public function index()
    {
        try{
            $params = Input::all();
            $clues = Clues::all();
            $codigo = Codigo::orderBy("descripcion")->get();
            $cr = Cr::orderBy("descripcion")->get();
            $fuente = Fuente::orderBy("descripcion")->get();
            $tipoProfesion = TipoProfesion::orderBy("id")->get();

            if($params['profesion_id'] && $params['profesion_id'] != 'null'){
                $consultaprofesion = Profesion::where("id", "=", $params['profesion_id'])->select("tipo_profesion_id")->first();
                $profesion = Profesion::where("tipo_profesion_id", "=", $consultaprofesion->tipo_profesion_id)->orderBy("descripcion")->get();

                $tipo_profesion_id = $consultaprofesion->tipo_profesion_id;
            }else{
                $tipo_profesion_id = null;
                $profesion = [];
            }
            
            $programa = Programa::orderBy("descripcion")->get();
            $rama = Rama::orderBy("descripcion")->get();
            $tipoNomina = TipoNomina::orderBy("descripcion")->get();
            
            return response()->json(['clues'=>$clues, "codigo"=>$codigo, "cr"=>$cr, "fuente"=>$fuente, "tipo_profesion"=>$tipoProfesion, "profesion"=>$profesion, "programa"=>$programa, "rama"=>$rama, "tipoNomina"=>$tipoNomina, "consulta_tipo_profesion"=>$tipo_profesion_id],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
