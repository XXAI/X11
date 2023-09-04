<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTablesCluesAdministracion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //Quitamos Foreign keys
        /*Schema::table('permission_user', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::table('rel_grupo_unidades_usuario', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::table('role_user', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });*/
        
        //cambiamos el tipo en user id
        Schema::table('users', function (Blueprint $table) {
            $table->Integer('id')->change();
        });
        Schema::table('permission_user', function (Blueprint $table) {
            $table->Integer('user_id')->change();
        });
        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->Integer('user_id')->change();
        });
        Schema::table('rel_grupo_unidades_usuario', function (Blueprint $table) {
            $table->Integer('user_id')->change();
        });
        Schema::table('role_user', function (Blueprint $table) {
            $table->Integer('user_id')->change();
        });

        //Volvemos a linkear el foreign key
        Schema::table('permission_user', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
        });
 
        Schema::table('role_user', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('rel_grupo_unidades_usuario', function (Blueprint $table) {
           $table->foreign('user_id')->references('id')->on('users');
        });
        //eliminamos una tabla que no nos sirve
        Schema::dropIfExists('permuta_adscripcion');
        //Eliminados los campos inecesarios de cada tabla
        
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn("nombre_responsable");
            $table->dropColumn("cargo_responsable");
            $table->dropColumn("estatus");
        });

        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->dropColumn("estatus");
            $table->dropColumn("clave_estatus");
            $table->dropColumn("longitud");
            $table->dropColumn("latitud");
            $table->dropColumn("nivel_atencion");
            $table->dropColumn("clave_nivel");
            $table->dropColumn("estatus_acreditacion");
            $table->dropColumn("responsable_id");
            $table->dropColumn("cargo_responsable");
        });

        //Ahora agregamos los campos
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->integer("user_id")->after("cr_dependencia");
            $table->string("registrada")->after("clues")->default(1);
        });

        Schema::create('mov_clues_cr', function (Blueprint $table) {
            $table->bigIncrements("id")->unsigned();
            $table->date("fecha_movimiento");
            $table->integer("user_id");
            $table->string("clues_before", 14);
            $table->string("cr_before",15);
            $table->string("descripcion_before",250);
            $table->string("clues_after", 14);
            $table->string("cr_after",15);
            $table->string("descripcion_after",250);
            $table->string("descripcion",250);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('mov_clues_cr', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('clues_before')->references('clues')->on('catalogo_clues');
            $table->foreign('clues_after')->references('clues')->on('catalogo_clues');
            $table->foreign('cr_before')->references('cr')->on('catalogo_cr');
            $table->foreign('cr_after')->references('cr')->on('catalogo_cr');
         });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn("user_id");
            
        });
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string("nombre_responsable",250)->after("cr_dependencia");
            $table->string("cargo_responsable")->after("cr_dependencia");
            $table->string("estatus")->after("cr_dependencia");
            $table->dropColumn("registrada");
        });

        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->string("estatus",250)->after("clasificacion_descripcion");
            $table->string("clave_estatus",250)->after("clasificacion_descripcion");
            $table->string("longitud",250)->after("clasificacion_descripcion");
            $table->string("latitud",250)->after("clasificacion_descripcion");
            $table->string("nivel_atencion",250)->after("clasificacion_descripcion");
            $table->string("clave_nivel",250)->after("clasificacion_descripcion");
            $table->string("estatus_acreditacion",250)->after("clasificacion_descripcion");
            $table->string("responsable_id",250)->after("clasificacion_descripcion");
            $table->string("cargo_responsable",250)->after("clasificacion_descripcion");
        });

        Schema::dropIfExists('mov_clues_cr');
    }
}
