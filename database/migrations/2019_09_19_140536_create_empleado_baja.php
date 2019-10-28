<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmpleadoBaja extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleado_baja', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();
            $table->smallinteger('empleado_id')->unsigned();
            $table->tinyinteger('baja_id')->unsigned();
            $table->date('fecha_baja')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_id')
                ->references('id')->on('empleados')
                ->onUpdate('cascade')
                ->onDelete('cascade');  

            $table->foreign('baja_id')
                ->references('id')->on('catalogo_baja')
                ->onUpdate('cascade')
                ->onDelete('cascade');      
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empleado_baja');
    }
}
