<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAlterTableRelUsuarioCluesCr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grupo_usuarios', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_usuario_grupo', function (Blueprint $table) {
            $table->smallInteger('grupo_id')->unsigned();
            $table->smallInteger("users_id")->unsigned();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('grupo_id')
                  ->references('id')->on('grupo_usuarios')
                  ->onUpdate('cascade')
                  ->onDelete('cascade'); 

            $table->foreign('users_id')
                  ->references('id')->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade'); 
        });

        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->smallInteger("grupo_id")->unsigned()->after('users_id')->nullable();
        });

        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->foreign('grupo_id')
                  ->references('id')->on('grupo_usuarios')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
        });

        Schema::rename('rel_usuario_clues_cr', 'rel_grupo_clues_cr');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::rename('rel_grupo_clues_cr', 'rel_usuario_clues_cr');

        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->dropForeign('rel_usuario_clues_cr_grupo_id_foreign');
        });

        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->dropColumn('grupo_id');
        });

        Schema::dropIfExists('rel_usuario_grupo');
        Schema::dropIfExists('grupo_usuarios');
    }
}
