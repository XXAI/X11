<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableEmpleados extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropColumn('numemp');
            $table->dropColumn('no_general');
            $table->dropColumn('no_interno');
            $table->dropColumn('observacion');
            $table->dropColumn('clave_google');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('numemp', 50);
            $table->string('no_general',14)->nullable()->nullable();
            $table->string('no_interno',14)->nullable()->nullable();
            $table->text('observacion')->nullable();
            $table->string('clave_google', 14)->nullable();
            
        });
    }
}
