<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCatProfesion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_profesion', function (Blueprint $table) {
            $table->unsignedTinyInteger('rama_id')->nullable()->after('tipo_profesion_id');

            $table->foreign('rama_id')->references('id')->on('catalogo_rama');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_profesion', function (Blueprint $table) {
            $table->dropForeign(['rama_id']);
            $table->dropColumn('rama_id');
        });
    }
}
