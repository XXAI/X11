<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorContrato extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_contrato', function (Blueprint $table) {
            $table->id();
            
            $table->integer("user_id");
            $table->smallinteger("trabajador_id")->nullable();
            $table->date("fecha_impresion")->nullable();
            $table->date("fecha_inicio");
            $table->date("fecha_termino");
            $table->smallInteger("duracion");
            $table->string("rfc",25);
            $table->smallInteger("sm");
            $table->smallInteger("sf");
            $table->date("fecha_nacimiento");
            $table->smallInteger("anios");
            $table->string("calle_num", 250);
            $table->string("colonia", 250);
            $table->string("cp", 50);
            $table->string("municipio", 100);
            $table->string("estado", 100);
            $table->string("nacionalidad", 100);
            $table->string("lugar_nacimiento", 100);
            $table->string("edo_civil", 100);
            $table->string("religion", 100);
            $table->string("telèfono_casa", 100)->nullable();
            $table->string("telefono_cel", 100)->nullable();
            $table->string("correo", 150);
            $table->smallInteger("primaria")->default(0);
            $table->smallInteger("secundaria")->default(0);
            $table->smallInteger("bachillarato")->default(0);
            $table->smallInteger("tecnico")->default(0);
            $table->smallInteger("licenciatura")->default(0);
            $table->smallInteger("especialidad")->default(0);
            $table->smallInteger("maestria")->default(0);
            $table->smallInteger("doctorado")->default(0);
            $table->string("escolaridad", 250);
            $table->string("acredita_escolaridad", 250);
            $table->string("folio_escolaridad", 250);
            $table->string("expide_escolaridad", 250);
            $table->smallInteger("titulo")->default(0);
            $table->string("no_cedula")->nullable();
            $table->date("fecha_acredita_escolaridad");
            $table->string("escuela_egreso", 250);
            $table->string("cve_jurisdiccion", 50);
            $table->string("jurisdiccion", 250);
            $table->string("cve_programa", 50);
            $table->string("programa", 250);
            $table->string("funciones", 250);
            
            $table->string("partida", 50)->nullable();
            $table->string("fuente", 50)->nullable();
            $table->smallInteger("anio_real");
            $table->decimal("total_bruto_mensual", 8,2)->default(0);
            $table->decimal("importe_quincela_bruto", 8,2)->default(0);
            $table->string("cve_movimiento", 10);

            $table->string("apellido_paterno_vacante", 100)->nullable();
            $table->string("apellido_materno_vacante", 100)->nullable();
            $table->string("nombre_vacante", 100)->nullable();
            $table->smallInteger("validado")->default(0);
            $table->text("observacion")->nullable();
            
            $table->smallInteger("horario_especial")->default(0);
            $table->string("horario_trabajo", 250);
            $table->string("horario_descanso", 250);
            $table->string("horas_trabajo", 50);
            $table->string("descanso_trabajo", 150);
            
            $table->text("observacion_unidad")->nullable();
            $table->string("validador", 250);
            $table->date("fecha_validacion");

            $table->text("observacion_general")->nullable();
            $table->smallInteger("impreso")->default(0);
            $table->smallInteger("firmado")->default(0);
            

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_contrato');
    }
}
