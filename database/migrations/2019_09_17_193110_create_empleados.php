<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmpleados extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleados', function (Blueprint $table) {
            $table->smallIncrements('id', 10)->unsigned();
            $table->string('numemp', 50);
            $table->string('rfc', 15)->index()->unique();
            $table->string('curp', 50)->index()->unique();
            $table->string('nombre', 255)->index();
            $table->date('fissa');
            $table->date('figf');
            $table->string('ur', 100);
            $table->string('clues',14);
            $table->tinyinteger('tipo_nomina_id')->unsigned();
            $table->tinyinteger('programa_id')->unsigned();
            $table->tinyinteger('fuente_id')->unsigned()->nullable();
            $table->string('codigo_id', 10)->nullable();
            $table->string('cr_id', 15)->nullable();
            $table->tinyinteger('rama_id')->unsigned()->nullable();
            $table->smallinteger('profesion_id')->unsigned()->nullable();
            $table->string('crespdes', 255);
            $table->string('proporcionado_por', 255)->nullable();
            $table->string('no_general',14)->nullable()->nullable();
            $table->string('no_interno',14)->nullable()->nullable();
            $table->text('observacion')->nullable();
            $table->string('clave_google', 14)->nullable();
            $table->tinyInteger('comision_sindical')->unsigned()->nullable();
            $table->tinyInteger('estatus')->default(0)->unsigned();
            $table->tinyInteger("validado")->unsigned();

            $table->timestamps();
            $table->softDeletes();

            


            $table->foreign('clues')
                  ->references('clues')->on('catalogo_clues')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->foreign('tipo_nomina_id')
                  ->references('id')->on('catalogo_tipo_nomina')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
                  
            $table->foreign('programa_id')
                  ->references('id')->on('catalogo_programa')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');      

            $table->foreign('fuente_id')
                  ->references('id')->on('catalogo_fuente')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');      
            
            /*$table->foreign('codigo_id')
                  ->references('codigo')->on('catalogo_codigo')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');*/      
            
            $table->foreign('rama_id')
                  ->references('id')->on('catalogo_rama')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
                  
            $table->foreign('profesion_id')
                  ->references('id')->on('catalogo_profesion')
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
        Schema::dropIfExists('empleados');
    }
}
