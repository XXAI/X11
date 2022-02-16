<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorAdscripcion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->string("cr_origen",15);
            $table->string("cr_destino",15);
            $table->smallInteger("adjudicado")->default(0);
            $table->date('fecha_cambio');
            $table->date('fecha_oficio')->nullable();
            $table->smallInteger("activo")->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('rel_trabajador_tramites', function (Blueprint $table) {
            $table->smallInteger("adjudicado")->default(0)->after('user_validacion_id');
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string("cr_dependencia", 15)->after("direccion");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_adscripcion');

        Schema::table('rel_trabajador_tramites', function (Blueprint $table) {
            $table->dropColumn('adjudicado');
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn('cr_dependencia');
        });
    }
}
