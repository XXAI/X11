<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableSatCatalogos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_sat_entidad', function (Blueprint $table) {
            $table->string('clave_entidad',5);
            $table->string('clave_pais',5);
            $table->string("descripcion",200);
            $table->timestamps();
            $table->softDeletes();

            $table->primary('clave_entidad');
        });

        Schema::create('catalogo_sat_municipio', function (Blueprint $table) {
            $table->string('clave_municipio',5);
            $table->string('clave_entidad',5);
            $table->string("descripcion",200);
            $table->timestamps();
            $table->softDeletes();
            $table->primary(['clave_municipio', 'clave_entidad']);
        });

        Schema::create('catalogo_sat_localidad', function (Blueprint $table) {
            $table->string('clave_localidad',5);
            $table->string('clave_entidad',5);
            $table->string("descripcion",200);
            $table->timestamps();
            $table->softDeletes();
            $table->primary(['clave_localidad' , 'clave_entidad']);
        });

        Schema::create('catalogo_sat_regimen', function (Blueprint $table) {
            $table->string('clave_regimen',5);
            $table->string("descripcion",200);
            $table->timestamps();
            $table->softDeletes();
            $table->primary('clave_regimen');
        });

        Schema::table('rel_trabajador_datos_fiscales', function (Blueprint $table) {
            $table->string("clave_localidad", 5)->after("localidad");
            $table->string("clave_municipio", 5)->after("municipio");
            $table->string("clave_entidad", 5)->after("entidad");
            $table->string("clave_regimen", 5)->after("regimen");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_sat_entidad');
        Schema::dropIfExists('catalogo_sat_municipio');
        Schema::dropIfExists('catalogo_sat_localidad');

        Schema::table('rel_trabajador_datos_fiscales', function (Blueprint $table) {
            $table->dropColumn('clave_localidad');
            $table->dropColumn('clave_municipio');
            $table->dropColumn('clave_entidad');
            $table->dropColumn('clave_regimen');
        });
    }
}
