<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelEmpleadoTolerancia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_empleado_tolerancia', function (Blueprint $table) {
            $table->smallInteger('empleado_id')->unsigned();
            $table->smallInteger('tolerancia_id')->unsigned();
            $table->date('dia_inicio');
            $table->date('dia_fin')->nullable();
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
        Schema::dropIfExists('rel_empleado_tolerancia');
    }
}
