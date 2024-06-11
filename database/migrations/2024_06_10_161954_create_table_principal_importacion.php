<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePrincipalImportacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_importacion', function (Blueprint $table) {
            $table->id();
            $table->string('archivo', 250);
            $table->decimal('peso', 6,2);
            $table->smallInteger('registros');
            $table->smallInteger('anio')->unsigned()->default(2024);
            $table->smallInteger('quincena')->unsigned()->default();
            $table->dateTime('fecha');
            $table->integer('user_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->dropColumn('fuente_financiamiento');
            $table->integer('user_id')->unsigned()->after('fecha_actualizacion');
            $table->smallInteger('quincena')->unsigned()->after('fecha_actualizacion');
            $table->smallInteger('anio')->unsigned()->after('fecha_actualizacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_importacion');

        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->string('fuente_financiamiento', 150)->after('clabe');
            $table->dropColumn('anio');
            $table->dropColumn('quincena');
            $table->dropColumn('user_id');
        });
    }
}
