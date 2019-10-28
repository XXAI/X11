<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmpleadoEscolaridad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleado_escolaridad', function (Blueprint $table) {
            $table->mediumIncrements('id')->unsigned();
            $table->smallinteger('empleado_id')->unsigned();
            $table->boolean('secundaria')->default(0);
            $table->boolean('preparatoria')->default(0);
            $table->boolean('tecnica')->default(0);
            $table->boolean('carrera')->default(0);
            $table->boolean('titulo')->default(0);
            $table->boolean('maestria')->default(0);
            $table->boolean('doctorado')->default(0);
            $table->boolean('cursos')->default(0);
            $table->boolean('especialidad')->default(0);
            $table->boolean('diplomado')->default(0);
            $table->boolean('poliglota')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_id')
                ->references('id')->on('empleados')
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
        Schema::dropIfExists('empleado_escolaridad');
    }
}
