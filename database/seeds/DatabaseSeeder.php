<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::create([
            'name' => 'Usuario Root',
            'username' => 'root',
            'password' => Hash::make('ssa.plataforma'),
            'email' => 'root@localhost',
            'is_superuser' => 1,
            'avatar' => '/assets/avatars/50-king.svg'
        ]);

        //Carga de archivos CSV
        $lista_csv = [
            'permissions',
            'roles',
            'role_user',
            'permission_role'
        ];

        //DB::beginTransaction();

        //DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        foreach($lista_csv as $csv){
            $archivo_csv = storage_path().'/app/seeds/'.$csv.'.csv';

            $query = sprintf("
                LOAD DATA local INFILE '%s' 
                INTO TABLE $csv 
                FIELDS TERMINATED BY ',' 
                OPTIONALLY ENCLOSED BY '\"' 
                ESCAPED BY '\"' 
                LINES TERMINATED BY '\\n' 
                IGNORE 1 LINES", addslashes($archivo_csv));
            echo $query;
            
            DB::connection()->getpdo()->exec($query);
        }

	    $this->call(TabuladorSeeder::class);
        $this->call(NivelAcademicoSeeder::class);
        $this->call(TipoNominaSeeder::class);
        $this->call(RamaSeeder::class);
        $this->call(ProgramaSeeder::class);
        $this->call(TipoProfesionSeeder::class);
        $this->call(ProfesionSeeder::class);
        $this->call(FuenteSeeder::class);
        $this->call(CrSeeder::class);
        $this->call(ComprobanteSeeder::class);
        $this->call(CodigoSeeder::class);
        $this->call(CluesSeeder::class);
        $this->call(SindicatoSeeder::class);
        $this->call(EmpleadoSeeder::class);
        $this->call(BajasSeeder::class);
            
            //DB::statement('SET FOREIGN_KEY_CHECKS=1');

            //DB::commit();
    }
}
