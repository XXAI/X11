<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNomina extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nomina', function (Blueprint $table) {
            $table->mediumIncrements('id', 10)->unsigned();
            $table->smallinteger("empleado_id")->unsigned();
            $table->integer("quincena")->unsigned();
            $table->smallinteger("anio")->unsigned();
            $table->decimal("percepcion", 15,2);
            $table->decimal("deduccion", 15,2);
            $table->decimal("liquido", 15,2);

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
        Schema::dropIfExists('nomina');
    }
}
