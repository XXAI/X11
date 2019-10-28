<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmpleadoEscolaridadDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();
            $table->mediuminteger('empleado_escolaridad_id')->unsigned();
            $table->mediuminteger('rel_nivel_comprobante_id')->unsigned();
            $table->string('descripcion', 255);

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_escolaridad_id')
                ->references('id')->on('empleado_escolaridad')
                ->onUpdate('cascade')
                ->onDelete('cascade');  

            /*$table->foreign('rel_nivel_comprobante_id')
                ->references('id')->on('rel_nivel_comprobante')
                ->onUpdate('cascade')
                ->onDelete('cascade');   */   
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empleado_escolaridad_detalles');
    }
}
