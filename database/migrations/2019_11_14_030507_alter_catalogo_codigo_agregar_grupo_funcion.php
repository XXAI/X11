<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCatalogoCodigoAgregarGrupoFuncion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_codigo', function (Blueprint $table) {
            $table->string('grupo_funcion_id',2)->after('descripcion')->nullable();

            $table->foreign('grupo_funcion_id')
                  ->references('id')->on('catalogo_grupo_funcion')
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
        Schema::table('catalogo_codigo', function (Blueprint $table) {
            $table->dropColumn('grupo_funcion_id');
        });
    }
}
