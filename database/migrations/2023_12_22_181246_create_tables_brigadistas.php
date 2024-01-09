<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablesBrigadistas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brigadista', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion", 250);
            $table->smallInteger("anio")->default(2024);
            
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('rel_brigadistas_mes', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("brigadista_id")->unsigned();
            $table->smallInteger("mes")->default(1);
            $table->smallInteger("brigadista")->default(0);
            $table->smallInteger("vacunador")->default(0);
            $table->smallInteger("dengue")->default(0);
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('subbrigadista', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("brigadista_id")->unsigned();
            $table->string("descripcion", 250);
            
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('rel_subbrigadista_mes', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("subbrigadista_id")->unsigned();
            $table->smallInteger("mes")->default(1);
            $table->smallInteger("brigadista")->default(0);
            $table->smallInteger("vacunador")->default(0);
            $table->smallInteger("dengue")->default(0);
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_brigadista', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("rel_subbrigadista_mes_id")->unsigned();
            $table->date("fecha_alta");
            $table->date("fecha_termino")->nullable();
            $table->string("nombre_completo", 250);
            $table->string("rfc", 14);
            $table->string("curp", 19);
            $table->string("clave_elector", 19);
            $table->smallInteger("estado_civil")->default(1);
            $table->string("domicilio", 255)->nullable();
            $table->string("telefono", 30)->nullable();
            $table->string("correo", 120)->nullable();
            $table->string("profesion", 120)->nullable();
            $table->string("cedula", 20)->nullable();
            $table->string("adscripcion", 250)->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_nomina_brigadista', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_brigadista_id")->unsigned();
            $table->bigInteger("rel_subbrigadista_mes_id")->unsigned();
            
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
        Schema::dropIfExists('brigadista');
        Schema::dropIfExists('rel_brigadistas_mes');
        Schema::dropIfExists('subbrigadista');
        Schema::dropIfExists('rel_subbrigadista_mes');
        Schema::dropIfExists('catalogo_brigadista');
        Schema::dropIfExists('rel_brigadista_mes');
    }
}
