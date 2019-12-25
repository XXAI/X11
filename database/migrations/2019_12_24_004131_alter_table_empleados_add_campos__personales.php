<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableEmpleadosAddCamposPersonales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('estado_nacimiento')->after('nombre')->nullable();
            $table->string('nacionalidad')->after('nombre')->nullable();
            $table->string('correo_personal', 100)->after('nombre')->nullable();
            $table->string('telefono_celular',50)->after('nombre')->nullable();
            $table->string('telefono_fijo',50)->after('nombre')->nullable();
            $table->smallInteger('sexo')->after('nombre')->nullable()->comment('1 = Hombre, 2 = Mujer');;
            
            $table->string('cp', 6)->after('profesion_id')->nullable();
            $table->string('colonia')->after('profesion_id')->nullable();
            $table->string('no_interior',20)->after('profesion_id')->nullable();
            $table->string('no_exterior',20)->after('profesion_id')->nullable();
            $table->string('calle')->after('profesion_id')->nullable();
            $table->string('no_cedula',10)->after('profesion_id')->nullable();
            $table->tinyInteger('escolaridad_id')->after('profesion_id')->nullable();
        });

        Schema::table('comision_empleado', function (Blueprint $table) {
            $table->smallInteger('sindicato_id')->unsigned()->nullable()->after("cr");
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
            $table->dropColumn('estado_nacimiento');
            $table->dropColumn('nacionalidad');
            $table->dropColumn('correo_personal');
            $table->dropColumn('telefono_celular');
            $table->dropColumn('telefono_fijo');
            $table->dropColumn('sexo');
            
            $table->dropColumn('escolaridad_id');
            $table->dropColumn('no_cedula');
            $table->dropColumn('cp');
            $table->dropColumn('colonia');
            $table->dropColumn('no_interior');
            $table->dropColumn('no_exterior');
            $table->dropColumn('calle');
        });

        Schema::table('comision_empleado', function (Blueprint $table) {
            $table->dropColumn('sindicato_id');
        });
    }
}
