<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermutaAdscripcion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permuta_adscripcion', function (Blueprint $table) {
            $table->mediumIncrements('id', 10)->unsigned();
            $table->smallinteger('empleado_id')->unsigned();
            $table->smallinteger('user_origen_id')->unsigned();
            $table->string('clues_origen', 14);
            $table->smallinteger('user_destino_id')->unsigned();
            $table->string('clues_destino', 14);
            $table->text('observacion');
            $table->tinyinteger('estatus');
            $table->smallinteger('user_id')->unsigned();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');  

            $table->foreign('user_origen_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade'); 

            $table->foreign('user_destino_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');  

            $table->foreign('empleado_id')
                ->references('id')->on('empleados')
                ->onUpdate('cascade')
                ->onDelete('cascade');  

            $table->foreign('clues_origen')
                ->references('clues')->on('catalogo_clues')
                ->onUpdate('cascade')
                ->onDelete('cascade');   
            
            $table->foreign('clues_destino')
                ->references('clues')->on('catalogo_clues')
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
        Schema::dropIfExists('permuta_adscripcion');
    }
}
