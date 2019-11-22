export class App {
    name:string;
    route: string;
    icon: string;
    isHub?:boolean;
    permission?: string;
    children?:App[];
}

export const APPS:App [] = [
    { name:"Usuarios",  route: "usuarios",      icon: "assets/icons/users.svg",              permission:"nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt" },
    { name:'Permisos',  route: "permisos",      icon: "assets/icons/security-shield.svg",    permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl" },
    { name:'Roles',     route: "roles",         icon: "assets/icons/users-roles.svg",        permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs" },
    { name:'Empleados', route: "empleados",     icon: "assets/icons/trabajador_salud.svg",   permission:"8QnE1cYkjjNAmM7qHSf1CSlPMJiQeqr5",
      children: [
        {name:'Reportes',route:'empleados/reportes',icon:'insert_drive_file', permission:"dmcnXs5gK1qHzn30WvGXDzFimcrVJZ9Z"} //permiso de admin-personal-activo
      ]
    },
    { name:'Herramientas Dev', route: "dev-tools/reportes",  icon: "assets/icons/toolbox.svg", isHub:true, 
      children:[
        {name:'Reportes MySQL',route:'dev-tools/reportes', icon:'insert_drive_file', permission:"6ARHQGj1N8YPkr02DY04K1Zy7HjIdDcj"}
      ],
    },
    /*
    { name: "Seguridad", route: "seguridad", icon: "assets/icons/security-shield.svg", 
        children: [
            {name:'Permisos',route:'permisos',icon:'lock', permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl"},
            {name:'Roles',route:'roles',icon:'people_alt', permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs"}
        ] 
    },*/
    //{ name: "Viáticos", route: "configuracion", icon: "assets/icons/travel-expenses.png" },
    //{ name: "Herramientas", route: "herramientas", icon: "assets/icons/toolbox.svg" },    
    //{ name: "Configuración", route: "configuracion", icon: "assets/icons/settings.svg" },8QnE1cYkjjNAmM7qHSf1CSlPMJiQeqr5
]