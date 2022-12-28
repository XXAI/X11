<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableComisionGerencial extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->integer("trabajador_responsable_id")->after("observaciones")->nullable();
            $table->string("codigo_id",10)->after("observaciones")->nullable();
            $table->string("destino",200)->after("observaciones")->nullable();
        });
        
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->integer("trabajador_responsable_id")->after("estatus")->nullable();
            $table->string("destino",200)->after("estatus")->nullable();
            $table->string("codigo_id",10)->after("estatus")->nullable();
        });

        Schema::create('rel_trabajador_comision_gerencial', function (Blueprint $table) {
            $table->BigIncrements('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->string("cr_origen",15);
            //$table->string("cr_destino",15);
            $table->date('fecha_oficio');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->smallInteger('reingenieria')->default(0);
            $table->smallInteger("activo")->default(1);
            $table->smallInteger('user_id');
            //$table->string("cr_before_id",15)->nullable();
            $table->Integer("user_updated_id")->nullable();
            $table->Integer("user_deleted_id")->nullable();
            $table->string("estatus",2)->comments("P = Pendiente, A = Realizado, C=Cancelado, I=Interrumpido")->default("P");
            $table->integer("trabajador_responsable_id")->nullable();
            $table->string("codigo_id",10)->nullable();
            $table->string("destino",200)->nullable();
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
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->dropColumn("codigo_id"); 
            $table->dropColumn("trabajador_responsable_id"); 
            $table->dropColumn("destino"); 
        });
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->dropColumn("codigo_id"); 
            $table->dropColumn("trabajador_responsable_id"); 
            $table->dropColumn("destino"); 
        });
        Schema::dropIfExists('rel_trabajador_comision_gerencial');
        
    }
}
