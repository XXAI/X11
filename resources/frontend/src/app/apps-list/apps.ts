export class App {
    name:string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?:boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?:boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?:App[]; //Lista de modulos y componentes hijos de la aplicación
}

export const APPS:App [] = [
    { name:'Dashboard', route: "dashboard",     icon:"assets/icons/dashboard.svg",           permission:'JIZVHPLq3b50VmEiwHDoGOViE63rBJpF',
      children:[
        {name:'Configuración',        route:'dashboard/configuracion',  icon:'settings', permission:"JIZVHPLq3b50VmEiwHDoGOViE63rBJpFa"}
      ]
    },
    { name:"USUARIOS",                route: "usuarios",                icon: "assets/icons/users.png",              permission:"nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt" },
    { name:'PERMISOS',                route: "permisos",                icon: "assets/icons/permisos.png",    permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl" },
    { name:'ROLES',                   route: "roles",                   icon: "assets/icons/roles.png",        permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs" },
    { name:'Empleados',               route: "empleados",               icon: "assets/icons/trabajador_salud.svg",   permission:"8QnE1cYkjjNAmM7qHSf1CSlPMJiQeqr5" },
    { name:'TRABAJADORES',            route: "trabajadores",            icon: "assets/icons/trabajadores.png",         permission:"VguUicBQPIYqZgocJaOHdhMbfnzVqJ7k" },
    { name:'HERRAMIENTAS',            route: "dev-tools",               icon: "assets/icons/herramientas.png",           isHub:true, hideHome:true, 
      children:[
        {name:'Reportes MySQL',                     route:'dev-tools/mysql-reportes', icon:'settings', permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj"},
        {name:'Herramientas Administrativas',       route:'dev-tools/utilerias', icon:'settings', permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj"},
        {name:'Importación de Nomina',              route:'dev-tools/nomina', icon:'cloud_upload', permission:"ug1mNzfHlNo0rDY6jS3I6pgrBLgQDrqj"},
      ],
    },
    { name:'CATÁLOGOS',               route: "catalogos",               icon: "assets/icons/catalogos.png", isHub:true, hideHome:true, 
      children:[
        { name:'Clues',               route:'catalogos/clues',          icon:'insert_drive_file', permission:"55sHMIb36J8r9Dgr3uvfxO3wX1ZvudbL" },
        { name:'Grupos',              route:'catalogos/grupos',         icon:'group_work', permission:"v5xfsLRdLaESqktB1HKQwwWXkfVP4jQe" },
        { name:'Profesiones',         route:'catalogos/profesiones',    icon:'school', permission:"NBhsLjYRsIJmDa9igB4sKBxd91thtxWr" },
      ],
    },
    { name:'TRAMITES',                route: "tramites",                icon: "assets/icons/tramites.png", permission:'hEpNOyGTBaMrjcy1nhRymykXgsRv3jPt', isHub:true, hideHome:true, 
      children:[
        { name:'Comisión Interna',    route:'tramites/comision',                  icon:'call_merge', permission:"sy4A7MgqfzYNb0yIxVbRSxdSHgCkwUml" },
        { name:'Comisión Gerencial',  route:'tramites/comision-gerencial',        icon:'call_merge', permission:"DMuRcYkvysn5eUT4sjgMpeeWRUQlnRpt" },
        { name:'Adscripción',         route:'tramites/adscripcion',               icon:'call_made', permission:"ToU3QxHxAbC0lC1mw9PVjYVSjUT2yAdL" },
        { name:'Adscripción Ext.',    route:'tramites/adscripcion-externa',       icon:'call_made', permission:"Qv9dwjtlfwl5haI3NysAs2hjmlpyDKcN" },
        
        { name:'Reincorporación',     route:'tramites/reincorporacion',           icon:'call_received', permission:"3T9B0ixmJOwPLZVc69a4EeUPbWl1Dp38" },
        { name:'Documentacion',       route:'tramites/documentacion',             icon:'insert_drive_file', permission:"8HXTiaeI3NvlUWwNyzdKCgTxcepkqvDj" },
        { name:'Comisión Sindical',   route:'tramites/comision-sindical',         icon:'supervised_user_circle', permission:"FsSuyE47aBCxZ46SrTLb0g85frN1lT4W" }
      ] },
      { name:'EXPEDIENTES',            route: "expedientes",            icon: "assets/icons/expedientes.png",         permission:"IBEdRdfjYzSFaKt19silqzJCVFjsaFtK" }, 
      /*{ name:'Archivo',                route: "archivo",                icon: "assets/icons/archivo.png", permission:'hEpNOyGTBaMrjcy1nhRymykXgsRv3jPt'},*/  
    { name:'CREDENCIALIZACIÓN',       route: "credencializacion",                 icon: "assets/icons/credencial_trabajador.png",  isHub:true, hideHome:true, 
      children:[
        { name:'Salud',               route:'credencializacion/salud',            icon:'contacts', permission:"82UHsnkhEdH5x276N6i5Ollnftcri7Yx" },
        /*{ name:'',              route:'catalogos/grupos',         icon:'group_work', permission:"v5xfsLRdLaESqktB1HKQwwWXkfVP4jQe" },
        { name:'Profesiones',         route:'catalogos/profesiones',    icon:'school', permission:"NBhsLjYRsIJmDa9igB4sKBxd91thtxWr" },*/
      ],
    },
    { name:'DIRECTORIO',              route: "directorio",              icon: "assets/icons/directorio.png",  permission:"RkggFnAkLcXiLUTbZk3A07y0c4WdjjCO" },
    //{ name:'OPD',                     route: "opd",                     icon: "assets/icons/actas.png",  permission:"fbXoEtYYUgX2snZjIiVEqlTSgkisW59x" },
    
    /*{ name:'BRIGADISTAS',                route: "brigadista",                icon: "assets/icons/tramites.png", permission:'hEpNOyGTBaMrjcy1nhRymykXgsRv3jPt', isHub:true, hideHome:true, 
      children:[
        { name:'SALUD PÚBLICA',    route:'brigadista/registro',                  icon:'call_merge', permission:"sy4A7MgqfzYNb0yIxVbRSxdSHgCkwUml" },
        { name:'CAPTURISTA',  route:'brigadista/capturista',        icon:'call_merge', permission:"DMuRcYkvysn5eUT4sjgMpeeWRUQlnRpt" },

      ] }*/  
]