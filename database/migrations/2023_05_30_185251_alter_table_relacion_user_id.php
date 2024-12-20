<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableRelacionUserId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->change();
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
            $table->smallInteger('user_id')->unsigned()->change();
        });
       
    }
}
