<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterRelUsuarioCluesCrCambioNombreCampoUsersId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->renameColumn('users_id', 'user_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('rel_usuario_clues_cr', function (Blueprint $table) {
            $table->renameColumn('user_id', 'users_id');
        });
        Schema::enableForeignKeyConstraints();
    }
}
