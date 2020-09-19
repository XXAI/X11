<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoUnidadAdministradora extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_unidad_administradora', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion', 256);
            $table->mediumInteger('clave_sinergias')->unsigned();
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
        Schema::dropIfExists('catalogo_unidad_administradora');
    }
}
