<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorCredencial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_credencial', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->smallInteger('tipo_sanguineo');
            $table->smallInteger('rh');
            $table->smallInteger('cargo_id');
            $table->string('area_opcional', 254)->nullable();
            $table->smallInteger('donador_id');
            $table->smallInteger('capacidad_especial_id');
            $table->string('contacto',254);
            $table->string('contacto_telefono',254);
            $table->smallInteger('foto');
            $table->string('extension',10);
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
        Schema::dropIfExists('rel_trabajador_credencial');
    }
}
