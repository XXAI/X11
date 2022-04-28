<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableRelDatosFiscalesRazonSocial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_datos_fiscales', function (Blueprint $table) {
            $table->dropColumn('lada_telefono1');
            $table->dropColumn('lada_telefono2');
            $table->dropColumn('telefono1');
            $table->dropColumn('telefono2');
            $table->dropColumn('estado_domicilio');
            $table->dropColumn('estado_contribuyente');
            $table->dropColumn('actividad_economina');
            $table->dropColumn('fecha_actividad_economica');
            $table->string("razon_social", 250)->after("trabajador_id");
            $table->string("telefono", 15)->after("calle2");
            $table->string("lada", 250)->after("calle2");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_datos_fiscales', function (Blueprint $table) {
            $table->dropColumn('razon_social');
            $table->dropColumn('telefono');
            $table->dropColumn('lada');
            
            $table->string("lada_telefono1",10)->nullable()->after("trabajdor_id");
            $table->string("telefono1",20)->nullable()->after("trabajdor_id");
            $table->string("lada_telefono2",10)->nullable()->after("trabajdor_id");
            $table->string("telefono2",20)->nullable()->after("trabajdor_id");
            $table->string("estado_domicilio",100)->nullable()->after("trabajdor_id");
            $table->string("estado_contribuyente",100)->nullable()->after("trabajdor_id");
            $table->string("actividad_economina",200)->after("trabajdor_id");
            $table->date("fecha_actividad_economica")->after("trabajdor_id");
            
        });
    }
}
