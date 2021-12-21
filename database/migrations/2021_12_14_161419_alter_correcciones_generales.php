<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterCorreccionesGenerales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->smallInteger("tipo_unidad_id")->after("estatus")->default(0);
        });

        Schema::create('catalogo_cargo', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->string('descripcion',254);
            $table->smallInteger('nivel')->default(1);
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
        Schema::dropIfExists('catalogo_cargo');
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->dropColumn('tipo_unidad_id');
        });
    }
}
