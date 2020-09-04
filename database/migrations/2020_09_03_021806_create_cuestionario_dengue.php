<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuestionarioDengue extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participante', function (Blueprint $table) {
            $table->smallIncrements('id', 10)->unsigned();
            $table->string('rfc', 15)->index()->unique();
            $table->string('curp', 50)->index()->unique();
            $table->string('nombre', 255)->index();
            $table->string('celular', 40);
            $table->string('correo',70);
            $table->smallinteger('distrito_id')->unsigned();
            $table->text('unidad_medica')->nullable();
            $table->smallinteger('sector_salud_id')->unsigned();
            $table->smallinteger('perfil_id')->unsigned();
            $table->decimal('calificacion',15,2)->default(0)->nullable();
            $table->smallinteger('video1')->default(0)->unsigned();
            $table->smallinteger('video2')->default(0)->unsigned();
            $table->smallinteger('video3')->default(0)->unsigned();
            $table->smallinteger('video4')->default(0)->unsigned();
            $table->smallinteger('realizado')->default(0)->unsigned();
            
            $table->timestamps();
            $table->softDeletes();                
        });
        
        Schema::create('participante_cuestionario', function (Blueprint $table) {
            $table->smallIncrements('id', 10)->unsigned();
            $table->smallInteger('participante_id')->unsigned();
            $table->smallinteger('pregunta_1')->default(0)->unsigned();
            $table->smallinteger('pregunta_2')->default(0)->unsigned();
            $table->smallinteger('pregunta_3')->default(0)->unsigned();
            $table->smallinteger('pregunta_4')->default(0)->unsigned();
            $table->smallinteger('pregunta_5')->default(0)->unsigned();
            $table->smallinteger('pregunta_6')->default(0)->unsigned();
            $table->smallinteger('pregunta_7')->default(0)->unsigned();
            $table->smallinteger('pregunta_8')->default(0)->unsigned();
            $table->smallinteger('pregunta_9')->default(0)->unsigned();
            $table->smallinteger('pregunta_10')->default(0)->unsigned();
            
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
        Schema::dropIfExists('participante');
        Schema::dropIfExists('participante_cuestionario');
    }
}
