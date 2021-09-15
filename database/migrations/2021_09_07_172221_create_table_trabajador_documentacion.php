<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTrabajadorDocumentacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('rel_trabajador_documentacion')){
            Schema::create('rel_trabajador_documentacion', function (Blueprint $table) {
                $table->Increments('id')->unsigned();
                $table->smallInteger('trabajador_id')->unsigned()->unique()->index();
                $table->string('rfc',13)->unique()->index();
                $table->text('observacion');
                $table->smallInteger('estatus')->default(1)->comments("1=Pendiene, 2= En Observacion, 3= Invalidado");
                
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
        Schema::dropIfExists('rel_trabajador_documentacion');
    }
}
