<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSinerhiasEmpleados extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sinerhias_empleados', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->smallinteger('empleado_id')->unsigned();

            // Keys
            $table->integer('pais_nacimiento_id')->unsigned()->nullable();
            $table->integer('entidad_nacimiento_id')->unsigned()->nullable();
            $table->integer('municipio_nacimiento_id')->unsigned()->nullable();

            // Data
            $table->date('fecha_nacimiento')->nullable();
            $table->integer('edad')->unsigned()->nullable();

            // Keys
            $table->integer('nacionalidad_id')->unsigned()->nullable();
            $table->integer('estado_conyugal_id')->unsigned()->nullable();
            $table->integer('sexo_id')->unsigned()->nullable();

            // Data
            $table->boolean('tiene_fiel')->nullable();
            $table->date('vigencia_fiel')->nullable();

            // Keys
            $table->integer('entidad_federativa_id')->unsigned()->nullable();
            $table->integer('municipio_id')->unsigned()->nullable();

            // Implicit Key
            $table->integer('institucion_id')->unsigned()->nullable()->default(1); // Secretaría de salud

            // Keys
            $table->integer('actividad_id')->unsigned()->nullable();
            $table->integer('actividad_voluntaria_adicional_id')->unsigned()->nullable();
            $table->integer('area_trabajo_id')->unsigned()->nullable();
            $table->integer('tipo_personal_id')->unsigned()->nullable();
            $table->integer('codigo_puesto_id')->unsigned()->nullable();

            // Data
            $table->string('numero_empleado_asignado',18)->nullable();
            $table->date('fecha_ingreso_institucion')->nullable();
            $table->string('clues_adscripcion_nomina',14)->nullable();
            $table->string('clues_adscripcion_real',14)->nullable();

            // Keys
            $table->integer('entidad_federativa_puesto_id')->unsigned()->nullable();
            $table->integer('tipo_contrato_id')->unsigned()->nullable();
            $table->integer('tipo_plaza_id')->unsigned()->nullable();
            $table->integer('unidad_administradora_id')->unsigned()->nullable();
            
            // Implicit Key
            $table->integer('institucion_pertenece_puesto_id')->unsigned()->nullable()->default(1); // Secretaría de salud

            // Keys
            $table->integer('vigencia_id')->unsigned()->nullable();

            // Hybrid Keys
            $table->integer('motivo_hy_id')->unsigned()->nullable();
            
            // Data
            $table->tinyInteger('temporalidad')->unsigned()->nullable()->comment('Colocar el número de meses que estara de baja temporal. Ejemplo: 1,2,5,6,7,etc
            Solo se colocara dato en este campo si se selecciona el valor "BAJA TEMPORAL" en el catálogo "sinerhias_vigencia".');
            $table->boolean('seguro_popular')->nullable();
            $table->boolean('licencia_maternidad')->nullable();
            $table->boolean('seguro_retiro')->nullable();
            
            $table->boolean('labora_lunes')->nullable();
            $table->time('hora_entrada_lunes')->nullable();
            $table->time('hora_salida_lunes')->nullable();

            $table->boolean('labora_martes')->nullable();
            $table->time('hora_entrada_martes')->nullable();
            $table->time('hora_salida_martes')->nullable();

            $table->boolean('labora_miercoles')->nullable();
            $table->time('hora_entrada_miercoles')->nullable();
            $table->time('hora_salida_miercoles')->nullable();

            $table->boolean('labora_jueves')->nullable();
            $table->time('hora_entrada_jueves')->nullable();
            $table->time('hora_salida_jueves')->nullable();

            $table->boolean('labora_viernes')->nullable();
            $table->time('hora_entrada_viernes')->nullable();
            $table->time('hora_salida_viernes')->nullable();

            $table->boolean('labora_sabados')->nullable();
            $table->time('hora_entrada_sabados')->nullable();
            $table->time('hora_salida_sabados')->nullable();

            $table->boolean('labora_domingo')->nullable();
            $table->time('hora_entrada_domingo')->nullable();
            $table->time('hora_salida_domingo')->nullable();

            $table->boolean('labora_dias_festivos')->nullable();
            $table->time('hora_entrada_dias_festivos')->nullable();
            $table->time('hora_salida_dias_festivos')->nullable();

            // Keys
            $table->integer('jornada_id')->unsigned()->nullable();

            // Data
            $table->decimal('sueldo_salario_mensual',8,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');
            $table->decimal('compensaciones',8,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');
            $table->decimal('prestaciones_mandato_ley',8,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');
            $table->decimal('prestaciones_cgt_contrato_colectivo',8,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');
            $table->decimal('estimulos',8,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');
            $table->decimal('remuneracion_ordinaria_mensual',9,2)->nullable()->comment('No se puede superar la cantidad 200,000.00');

            // INICIO -- Grados academicos y recuso en formacion
            $table->boolean('recursos_humanos_formacion')->nullable();

            $table->integer('grado_academico_1_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diploma_1_hy_id')->unsigned()->nullable(); // LLave híbrida de diferentes tablas depndiendo el id grado academico
            $table->string('otro_nombre_titulo_diploma_1',80)->nullable();
            $table->integer('institucion_educativa_1_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa_1',80)->nullable();
            $table->boolean('tiene_cedula_1')->nullable();
            $table->string('numero_cedula_1',80)->nullable();

            $table->integer('grado_academico_2_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diploma_2_hy_id')->unsigned()->nullable(); // LLave híbrida de diferentes tablas depndiendo el id grado academico
            $table->string('otro_nombre_titulo_diploma_2',80)->nullable();
            $table->integer('institucion_educativa_2_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa_2',80)->nullable();
            $table->boolean('tiene_cedula_2')->nullable();
            $table->string('numero_cedula_2',80)->nullable();

            $table->integer('grado_academico_3_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diploma_3_hy_id')->unsigned()->nullable(); // LLave híbrida de diferentes tablas depndiendo el id grado academico
            $table->string('otro_nombre_titulo_diploma_3',80)->nullable();
            $table->integer('institucion_educativa_3_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa_3',80)->nullable();
            $table->boolean('tiene_cedula_3')->nullable();
            $table->string('numero_cedula_3',80)->nullable();

            $table->integer('grado_academico_4_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diploma_4_hy_id')->unsigned()->nullable(); // LLave híbrida de diferentes tablas depndiendo el id grado academico
            $table->string('otro_nombre_titulo_diploma_4',80)->nullable();
            $table->integer('institucion_educativa_4_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa_4',80)->nullable();
            $table->boolean('tiene_cedula_4')->nullable();
            $table->string('numero_cedula_4',80)->nullable();

            $table->integer('grado_academico_5_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diploma_5_hy_id')->unsigned()->nullable(); // LLave híbrida de diferentes tablas depndiendo el id grado academico
            $table->string('otro_nombre_titulo_diploma_5',80)->nullable();
            $table->integer('institucion_educativa_5_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa_5',80)->nullable();
            $table->boolean('tiene_cedula_5')->nullable();
            $table->string('numero_cedula_5',80)->nullable();

            $table->integer('tipo_ciclo_formacion_id')->unsigned()->nullable(); // Key
            $table->integer('carrera_ciclo_hy_id')->unsigned()->nullable(); // Key
            $table->integer('institucion_educativa_formadora_id')->unsigned()->nullable(); // Key
            $table->integer('anio_cursa_id')->unsigned()->nullable(); // Key

            // FIN -- Grados academicos y recuso en formacion

            // Colegiacion
            $table->boolean('colegiacion')->nullable();
            $table->integer('colegio_id')->unsigned()->nullable(); // Key

            //Certificacion
            $table->boolean('certificacion')->nullable();
            $table->integer('certificacion_id')->unsigned()->nullable(); // Key
            $table->string('consejo',256)->nullable();

            // Idioma
            $table->integer('idioma_id')->unsigned()->nullable(); // Key
            $table->integer('nivel_idioma_id')->unsigned()->nullable(); // Key

            // Lengua indigena
            $table->integer('lengua_indigena_id')->unsigned()->nullable(); // Key
            $table->integer('nivel_lengua_indigena_id')->unsigned()->nullable(); // Key

            // Data
            $table->boolean('lengua_senias')->nullable();

            // Capacitacion anual
            $table->boolean('tiene_capacitacion_anual')->nullable();
            
            $table->integer('entidad_federativa_1_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_curso_1_id')->unsigned()->nullable(); // Key
            $table->integer('entidad_federativa_2_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_curso_2_id')->unsigned()->nullable(); // Key
            $table->integer('entidad_federativa_3_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_curso_3_id')->unsigned()->nullable(); // Key
            $table->integer('entidad_federativa_4_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_curso_4_id')->unsigned()->nullable(); // Key
            $table->integer('grado_academico_id')->unsigned()->nullable(); // Key
            $table->integer('nombre_titulo_diplomado_hy_id')->unsigned()->nullable(); // Hybrid key
            $table->string('otro_nombre_titulo_diplomado',80)->nullable();
            $table->integer('institucion_educativa_id')->unsigned()->nullable(); // Key
            $table->string('otra_institucion_educativa',80)->nullable();
            $table->integer('ciclo_cursa_id')->unsigned()->nullable(); // Key



            $table->timestamps();

            // --------- Foreign keys ------------ //

            $table->foreign('empleado_id')->references('id')->on('empleados')->onUpdate('cascade')->onDelete('cascade');  

            $table->foreign('pais_nacimiento_id')->references('id')->on('sinerhias_pais_nacimiento')->onUpdate('cascade');
            $table->foreign('entidad_nacimiento_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('municipio_nacimiento_id')->references('id')->on('sinerhias_municipio')->onUpdate('cascade');
            
            $table->foreign('nacionalidad_id')->references('id')->on('sinerhias_nacionalidad')->onUpdate('cascade');
            $table->foreign('estado_conyugal_id')->references('id')->on('sinerhias_estado_conyugal')->onUpdate('cascade');
            $table->foreign('sexo_id')->references('id')->on('sinerhias_sexo')->onUpdate('cascade');

            $table->foreign('entidad_federativa_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('municipio_id')->references('id')->on('sinerhias_municipio')->onUpdate('cascade');

            $table->foreign('actividad_id')->references('id')->on('sinerhias_tipo_actividad')->onUpdate('cascade');
            $table->foreign('actividad_voluntaria_adicional_id')->references('id')->on('sinerhias_tipo_actividad_voluntaria')->onUpdate('cascade');
            $table->foreign('area_trabajo_id')->references('id')->on('sinerhias_area_trabajo')->onUpdate('cascade');
            $table->foreign('tipo_personal_id')->references('id')->on('sinerhias_tipo_personal')->onUpdate('cascade');
            $table->foreign('codigo_puesto_id')->references('id')->on('sinerhias_codigo_puesto')->onUpdate('cascade');

            $table->foreign('entidad_federativa_puesto_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('tipo_contrato_id')->references('id')->on('sinerhias_tipo_contrato')->onUpdate('cascade');
            $table->foreign('tipo_plaza_id')->references('id')->on('sinerhias_tipo_plaza')->onUpdate('cascade');
            $table->foreign('unidad_administradora_id')->references('id')->on('sinerhias_unidad_administradora')->onUpdate('cascade');

            $table->foreign('vigencia_id')->references('id')->on('sinerhias_vigencia')->onUpdate('cascade');

            $table->foreign('jornada_id')->references('id')->on('sinerhias_jornada')->onUpdate('cascade');

            $table->foreign('grado_academico_1_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_1_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('grado_academico_2_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_2_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('grado_academico_3_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_3_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('grado_academico_4_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_4_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('grado_academico_5_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_5_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('tipo_ciclo_formacion_id')->references('id')->on('sinerhias_ciclo_formativo')->onUpdate('cascade');
            $table->foreign('institucion_educativa_formadora_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('anio_cursa_id')->references('id')->on('sinerhias_anio_cursa')->onUpdate('cascade');

            $table->foreign('colegio_id')->references('id')->on('sinerhias_colegio')->onUpdate('cascade');
            $table->foreign('certificacion_id')->references('id')->on('sinerhias_certificacion')->onUpdate('cascade');
            
            $table->foreign('idioma_id')->references('id')->on('sinerhias_idioma')->onUpdate('cascade');
            $table->foreign('nivel_idioma_id')->references('id')->on('sinerhias_nivel_dominio')->onUpdate('cascade');

            $table->foreign('lengua_indigena_id')->references('id')->on('sinerhias_idioma')->onUpdate('cascade');
            $table->foreign('nivel_lengua_indigena_id')->references('id')->on('sinerhias_nivel_dominio')->onUpdate('cascade');

            $table->foreign('entidad_federativa_1_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('nombre_curso_1_id')->references('id')->on('sinerhias_nombre_curso')->onUpdate('cascade');
            $table->foreign('entidad_federativa_2_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('nombre_curso_2_id')->references('id')->on('sinerhias_nombre_curso')->onUpdate('cascade');
            $table->foreign('entidad_federativa_3_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('nombre_curso_3_id')->references('id')->on('sinerhias_nombre_curso')->onUpdate('cascade');
            $table->foreign('entidad_federativa_4_id')->references('id')->on('sinerhias_entidad')->onUpdate('cascade');
            $table->foreign('nombre_curso_4_id')->references('id')->on('sinerhias_nombre_curso')->onUpdate('cascade');
            $table->foreign('grado_academico_id')->references('id')->on('sinerhias_grado_academico')->onUpdate('cascade');
            $table->foreign('institucion_educativa_id')->references('id')->on('sinerhias_institucion_educativa')->onUpdate('cascade');
            $table->foreign('ciclo_cursa_id')->references('id')->on('sinerhias_tipo_ciclo_formacion')->onUpdate('cascade');

            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sinerhias_empleados');
    }
}
