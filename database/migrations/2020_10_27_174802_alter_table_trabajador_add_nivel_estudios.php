<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableTrabajadorAddNivelEstudios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('trabajador', function (Blueprint $table) {
            $table->mediumInteger('nivel_maximo_id')->nullable()->unsigned()->after('municipio_federativo_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('trabajador', function (Blueprint $table) {
            $table->dropColumn('nivel_maximo_id');
        });
    }
}
