<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadosSinerias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->date('vigencia_fiel')->nullable()->after('apellido_paterno');
            $table->smallinteger('fiel')->nullable()->after('apellido_paterno');
            $table->smallinteger('sexo_id')->after('apellido_paterno');
            $table->smallinteger('estado_conyugal_id')->after('apellido_paterno')->nullable();
            $table->smallinteger('nacionalidad_id')->after('apellido_paterno');
            $table->smallinteger('edad')->after('apellido_paterno');
            $table->date('fecha_nacimiento')->after('apellido_paterno');
            $table->smallinteger('pais_nacimiento_id')->after('apellido_paterno');
            $table->smallinteger('municipio_nacimiento_id')->after('apellido_paterno')->nullable();
            $table->smallinteger('entidad_nacimiento_id')->after('apellido_paterno')->nullable();
            
            $table->smallinteger('municipio_id')->after('correo_personal')->nullable();
            $table->smallinteger('entidad_id')->after('correo_personal')->nullable();
            
            $table->smallinteger('lenguaje_senias')->default(0)->after('figf');
            $table->smallinteger('dominio_lengua_id')->after('figf')->nullable();
            $table->smallinteger('lengua_indigena_id')->after('figf')->nullable();
            $table->smallinteger('dominio_idioma_id')->after('figf')->nullable();
            $table->smallinteger('idioma_id')->after('figf')->nullable();
            $table->string('consejo', 255)->after('figf')->nullable();
            $table->smallinteger('certificacion_id')->after('figf')->nullable();
            $table->smallinteger('certificacion')->default(0)->after('figf')->nullable();
            $table->smallinteger('colegio_id')->after('figf')->nullable();
            $table->smallinteger('colegiacion')->default(0)->after('figf')->nullable();
            $table->smallinteger('anio_cursa_id')->after('figf')->nullable();
            $table->smallinteger('institucion_formadora_id')->after('figf')->nullable();
            $table->smallinteger('carrera_ciclo_id')->nullable()->after('figf');
            $table->smallinteger('tipo_ciclo_id')->nullable()->after('figf');
            $table->smallinteger('formacion')->default(0)->nullable()->after('figf');


            $table->decimal('remuneracion',15,2)->default(0)->nullable()->after('figf');
            $table->decimal('estimulo',15,2)->default(0)->nullable()->after('figf');
            $table->decimal('prestaciones_derivadas',15,2)->default(0)->nullable()->after('figf');
            $table->decimal('prestaciones',15,2)->default(0)->nullable()->after('figf');
            $table->decimal('compensacion',15,2)->default(0)->nullable()->after('figf');
            $table->decimal('sueldo_mensual',15,2)->default(0)->nullable()->after('figf');
            $table->smallinteger('seguro_retino')->default(0)->after('figf')->nullable();
            $table->smallinteger('licencia_materna')->default(0)->after('figf')->nullable();
            $table->smallinteger('seguro_salud')->default(0)->after('figf')->nullable();
            $table->smallinteger('temporalidad')->comments("son meses en caso de baja temporal")->after('figf')->nullable();
            $table->smallinteger('motivo_baja_id')->after('figf')->nullable();
            $table->smallinteger('vigencia_id')->comments("activo, baja temporal, baja definitiva")->after('figf')->nullable();
            $table->smallinteger('unidad_administradora_id')->after('figf')->nullable();
            $table->smallinteger('tipo_plaza_id')->after('figf')->nullable();
            $table->smallinteger('entidad_puesto_id')->after('figf')->nullable();
            $table->smallinteger('tipo_personal_id')->after('figf')->nullable();
            $table->smallinteger('area_trabajo_id')->after('figf')->nullable();
            $table->smallinteger('actividad_voluntaria_id')->after('figf')->nullable();
            $table->smallinteger('actividad_id')->after('figf')->nullable();

            
            $table->smallinteger('ciclo_curso_id')->nullable()->after('sindicato_id');
            $table->string('otro_institucion_curso', 255)->nullable()->after('sindicato_id');
            $table->smallinteger('institucion_curso_id')->nullable()->after('sindicato_id');
            $table->string('otro_titulo', 255)->nullable()->after('sindicato_id');
            $table->smallinteger('titulo_diploma_id')->nullable()->after('sindicato_id');
            $table->smallinteger('grado_academico')->nullable()->after('sindicato_id');
            $table->smallinteger('capacitacion_anual')->default(0)->after('sindicato_id');
            
            
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
            $table->dropColumn('vigencia_fiel');
            $table->dropColumn('fiel');
            $table->dropColumn('edad');
            $table->dropColumn('nacionalidad_id');
            $table->dropColumn('fecha_nacimiento');
            $table->dropColumn('entidad_nacimiento_id');
            $table->dropColumn('municipio_nacimiento_id');
            $table->dropColumn('entidad_id');
            $table->dropColumn('municipio_id');

            $table->dropColumn('pais_nacimiento_id');
            $table->dropColumn('estado_conyugal_id');
            $table->dropColumn('sexo_id');
            $table->dropColumn('consejo');
            
            $table->dropColumn('seguro_retino');
            $table->dropColumn('licencia_materna');
            $table->dropColumn('seguro_salud');
            $table->dropColumn('temporalidad');
            $table->dropColumn('motivo_baja_id');
            $table->dropColumn('tipo_plaza_id');
            $table->dropColumn('entidad_puesto_id');


            $table->dropColumn('area_trabajo_id');
            $table->dropColumn('tipo_personal_id');
            $table->dropColumn('unidad_administradora_id');
            $table->dropColumn('vigencia_id');
            $table->dropColumn('actividad_id');
            $table->dropColumn('actividad_voluntaria_id');
            

            $table->dropColumn('ciclo_curso_id');
            $table->dropColumn('otro_institucion_curso');
            $table->dropColumn('institucion_curso_id');
            $table->dropColumn('tipo_ciclo_id');
            $table->dropColumn('carrera_ciclo_id');
            $table->dropColumn('institucion_formadora_id');
            $table->dropColumn('anio_cursa_id');
            $table->dropColumn('colegio_id');
            $table->dropColumn('colegiacion');
            $table->dropColumn('certificacion_id');
            $table->dropColumn('certificacion');
            $table->dropColumn('dominio_idioma_id');
            $table->dropColumn('idioma_id');
            $table->dropColumn('lengua_indigena_id');
            $table->dropColumn('dominio_lengua_id');
            $table->dropColumn('lenguaje_senias');
            $table->dropColumn('capacitacion_anual');
            $table->dropColumn('grado_academico');
            $table->dropColumn('titulo_diploma_id');
            $table->dropColumn('otro_titulo');
            
            $table->dropColumn('sueldo_mensual');
            $table->dropColumn('compensacion');
            $table->dropColumn('prestaciones');
            $table->dropColumn('prestaciones_derivadas');
            $table->dropColumn('estimulo');
            $table->dropColumn('remuneracion');
            $table->dropColumn('formacion');
        });
    }
}
