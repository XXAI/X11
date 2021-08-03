<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorE4 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('rel_trabajador_e4')){
            Schema::create('rel_trabajador_e4', function (Blueprint $table) {
                $table->Increments('id')->unsigned();
                $table->smallInteger('trabajador_id')->unsigned();
                $table->string('rfc',13);
                $table->decimal('pe400',15,2);
                
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
        Schema::dropIfExists('rel_trabajador_e4');
    }
}
