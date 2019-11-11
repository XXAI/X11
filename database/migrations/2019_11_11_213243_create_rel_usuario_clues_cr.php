<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelUsuarioCluesCr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->smallInteger('users_id')->unsigned();
            $table->string('clues', 14)->index();
            $table->string('cr_id', 15)->index();
            
            $table->primary(array('users_id', 'clues', "cr_id"));

            $table->foreign('users_id')->references('id')->on('users');
            $table->foreign('clues')->references('clues')->on('catalogo_clues');
            $table->foreign('cr_id')->references('cr')->on('catalogo_cr');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::dropIfExists('rel_usuario_empleado');
        
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('horario', 150)->after('proporcionado_por');
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string('clues', 14)->after('descripcion');
            $table->string('area', 10)->after('clues');
        });

        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->string('cr_origen_id', 15)->after('clues_origen');
            $table->string('cr_destino_id', 15)->after('clues_destino');

            $table->foreign('cr_origen_id')
                ->references('cr')->on('catalogo_cr')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            
            $table->foreign('cr_destino_id')
                ->references('cr')->on('catalogo_cr')
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
        Schema::dropIfExists('rel_usuario_clues_cr');
        Schema::create('rel_usuario_empleado', function (Blueprint $table) {
            $table->mediumIncrements('id');
            $table->smallInteger("empleado_id")->unsigned();
            $table->smallInteger("user_id")->unsigned();
            
            $table->foreign('empleado_id')
                  ->references('id')->on('empleados')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropColumn("horario");
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn("clues");
            $table->dropColumn("area");
        });

        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->dropColumn("cr_origen_id");            
            $table->dropColumn("cr_destino_id");            
        });

        
    }
}
