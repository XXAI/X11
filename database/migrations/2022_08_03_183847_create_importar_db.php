<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImportarDb extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('importar_nomina', function (Blueprint $table) {
            $table->string('rfc_nomina',15);
            $table->string('curp_nomina',50);
            $table->string('nombre_nomina',250);
            $table->date('fecha_ingreso');
            $table->date('fecha_ingreso_federal');
            $table->string('codigo_puesto_id', 20);
            $table->string('rama', 100);
            $table->string('clave_presupuestal', 100);
            $table->string('fuente_financiamiento', 150);
            $table->string('clues_adscripcion_nomina', 50);
            $table->string('ur', 50);
            $table->string('cr_nomina_id', 15);
            
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
        Schema::dropIfExists('importar_nomina');
    }
}
