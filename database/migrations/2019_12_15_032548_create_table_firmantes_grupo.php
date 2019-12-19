<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableFirmantesGrupo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('firmantes_grupo', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('grupo_unidades_id')->unsigned();
            $table->smallInteger('firmante_id')->unsigned();
            $table->string('cargo');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('grupo_unidades_id')
                  ->references('id')->on('grupos_unidades')
                  ->onUpdate('cascade')
                  ->onDelete('cascade'); 

            $table->foreign('firmante_id')
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
        Schema::dropIfExists('firmantes_grupo');
    }
}
