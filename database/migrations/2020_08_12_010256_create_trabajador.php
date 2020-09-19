<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTrabajador extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trabajador', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
           
            $table->string('rfc', 15)->index()->unique();
            $table->string('curp', 50)->index()->unique();
            $table->string('nombre', 255)->index();
            $table->string('apellido_paterno', 255)->index()->nullable();
            $table->string('apellido_materno', 255)->index()->nullable();
            $table->smallInteger('pais_nacimiento_id')->unsigned()->nullable();
            $table->smallInteger('entidad_nacimiento_id')->unsigned()->nullable();
            $table->smallInteger('municipio_nacimiento_id')->unsigned()->nullable();         
            $table->smallInteger('edad')->unsigned()->nullable();
            $table->smallInteger('nacionalidad_id')->unsigned()->nullable();
            $table->smallInteger('estado_conyugal_id')->unsigned()->nullable();
            $table->smallInteger('sexo_id')->unsigned()->nullable();
            $table->string('telefono_fijo',50)->nullable();
            $table->string('telefono_celular',50)->nullable();
            $table->string('correo_electronico', 100)->nullable();
            $table->string('cp', 6)->nullable();
            $table->string('colonia')->nullable();
            $table->string('no_interior',20)->nullable();
            $table->string('no_exterior',20)->nullable();
            $table->string('calle')->nullable();
            $table->smallInteger("validado")->default(0)->unsigned()->comments("1 = si, 0 = no");
            $table->smallInteger('estatus')->default(0)->unsigned()->comments("0 = activo, 1 inactivo");;
            $table->text('observacion')->nullable();

            //Estos creo que no van
            $table->smallInteger('entidad_federativa_id')->unsigned()->nullable();
            $table->smallInteger('municipio_federativo_id')->unsigned()->nullable();

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
        Schema::dropIfExists('trabajador');
    }
}
