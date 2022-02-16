<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorReincorporacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_reincorporacion', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->date('fecha_oficio')->nullable();
            $table->string("cr_origen",15);
            $table->string("cr_destino",15);
            $table->smallInteger("adjudicado")->default(0);
            $table->smallInteger("activo")->default(1);
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
        Schema::dropIfExists('rel_trabajador_reincorporacion');
    }
}
