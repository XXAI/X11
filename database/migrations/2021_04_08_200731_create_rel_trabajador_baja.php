<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelTrabajadorBaja extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('rel_trabajador_baja')){
            Schema::create('rel_trabajador_baja', function (Blueprint $table) {
                $table->Increments('id')->unsigned();
                $table->smallInteger('trabajador_id')->unsigned();
                $table->smallInteger('tipo_baja_id')->unsigned();
                $table->smallInteger('baja_id')->unsigned();
                $table->date('fecha_baja');
                $table->date('fecha_fin_baja');
                $table->text('observacion');
                $table->smallInteger('user_id');
    
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_baja');
    }
}
