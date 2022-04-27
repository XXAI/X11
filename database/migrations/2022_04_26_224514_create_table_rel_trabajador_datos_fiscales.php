<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorDatosFiscales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_datos_fiscales', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->smallInteger("cp")->unsigned();
            $table->string("tipo_vialidad",200);
            $table->string("nombre_vialidad",200);
            $table->string("no_exterior",50);
            $table->string("no_interior",50)->nullable();
            $table->string("colonia",150);
            $table->string("localidad",100);
            $table->string("municipio",100);
            $table->string("entidad",100);
            $table->string("calle1",200);
            $table->string("calle2",200);
            $table->string("correo",100);
            $table->string("lada_telefono1",10)->nullable();
            $table->string("telefono1",20)->nullable();
            $table->string("lada_telefono2",10)->nullable();
            $table->string("telefono2",20)->nullable();
            $table->string("estado_domicilio",100)->nullable();
            $table->string("estado_contribuyente",100)->nullable();
            $table->string("actividad_economina",200);
            $table->date("fecha_actividad_economica");
            $table->string("regimen",200);
            $table->date("fecha_regimen");
            $table->boolean("documento_digital")->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_datos_fiscales');
    }
}
