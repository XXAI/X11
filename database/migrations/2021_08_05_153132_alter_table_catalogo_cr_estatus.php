<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableCatalogoCrEstatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_cr', function (Blueprint $table) {
            
            $table->smallinteger('estatus')->default(1)->after('municipio')->comment("1->activo, 2->baja");
            $table->string('direccion', 255)->after('municipio')->nullable();
            $table->string('telefono', 255)->after('municipio')->nullable();
        });

        if(!Schema::hasTable('rel_trabajador_cr_responsables')){
            Schema::create('rel_trabajador_cr_responsables', function (Blueprint $table) {
                $table->Increments('id')->unsigned();
                $table->string('cr', 15)->index();
                $table->smallInteger('tipo_responsable_id')->unsigned()->comment("1->reponsable, 2->director");
                $table->smallInteger('trabajador_id');
                $table->string('cargo',240);
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_cr_responsables');
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn('direccion');
            $table->dropColumn('estatus');
            $table->dropColumn('telefono');
        });
    }
}
