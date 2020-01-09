<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableEscolaridadDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->dropForeign(['empleado_escolaridad_id']);
            
            $table->renameColumn('rel_nivel_comprobante_id', 'nivel_academico_id');
            $table->renameColumn('empleado_escolaridad_id', 'empleado_id');    
        });

        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
           
            $table->smallinteger('nivel_academico_id')->unsigned()->nullable()->change();
            $table->smallinteger('empleado_id')->unsigned()->change();
            
            $table->foreign('empleado_id')->references('id')->on('empleados');

            $table->string('cedula', 15)->after('nivel_academico_id')->nullable();
            $table->smallInteger('profesion_id')->after('nivel_academico_id')->unsigned()->nullable();
            $table->smallInteger('titulado')->after('nivel_academico_id')->default(0)->comment("0 = No, 1 = Si");
            
        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->string('apellido_materno', 100)->after("nombre");  
            $table->string('apellido_paterno', 100)->after("nombre");
              
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            
            $table->dropColumn('titulado');
            $table->dropColumn('profesion_id');
            $table->dropColumn('cedula');
            
            $table->dropForeign(['empleado_id']);
        });

        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->renameColumn('nivel_academico_id', 'rel_nivel_comprobante_id');
            $table->renameColumn('empleado_id', 'empleado_escolaridad_id');    
        });

        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            \DB::statement('ALTER TABLE empleado_escolaridad_detalles MODIFY COLUMN empleado_escolaridad_id MEDIUMINT UNSIGNED NOT NULL');
            \DB::statement('ALTER TABLE empleado_escolaridad_detalles MODIFY COLUMN rel_nivel_comprobante_id MEDIUMINT UNSIGNED NULL');
            
        });

        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->foreign('empleado_escolaridad_id')
            ->references('id')->on('empleado_escolaridad')
            ->onUpdate('cascade')
            ->onDelete('cascade');  

        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->dropColumn('apellido_paterno');  
            $table->dropColumn('apellido_materno');  
        });

        
    }
}
