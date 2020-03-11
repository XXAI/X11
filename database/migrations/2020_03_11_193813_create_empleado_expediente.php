<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmpleadoExpediente extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleado_expediente', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('empleado_id')->unsigned();
            $table->smallInteger('expediente_id')->unsigned();
            $table->string('nombre_archivo', 255);
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
        Schema::dropIfExists('empleado_expediente');
    }
}
