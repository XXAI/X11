@component('mail::message')
# Atención

Por favor de clic en el boton para resetear su password, si no lo redirecciona, favor de copiar y pegar el link en su navegador.

@component('mail::button', ['url' => 'http://localhost:4200/#/update-password?token='.$token])
Cambiar password
@endcomponent

Muchas gracias,<br>
(SIRH) Sistema de Información de Recursos Humanos.
@endcomponent










<style>
    .cabecera
    {
        font-size: 10pt;
        background-color:#CFCFCF;
        border: 0px;
    }
    .fuente
    {
        font-family: Helvetica;
    }
    .fuente_datos
    {
        font-family: Helvetica;
        font-size: 7pt;
    }
    .parrafo
    {
        font-family: Helvetica;
        font-size: 7pt;
        text-align: justify;
    }
    .encabezado
    {
        font-family: Helvetica;
        font-size: 7pt;
        text-align: left;
    }
    .fecha
    {
        font-family: Helvetica;
        font-size: 7pt;
        text-align: right;
    }
    .datos
    {
        font-size: 7pt;
    }

    .firmantes
    {
        font-size: 7pt;
        font-family: Helvetica;
    }

    .linea
    {
        border-bottom: 1px solid #cfcfcf;
        border-right: 1px solid #cfcfcf;
    }

    .centrado
    {
        text-align: center;
    }

    .falta
    {
        background-color: #EFEFEF;
    }
    .tamano
    {
        padding:0px 20px 0px 20px;
    }

    @page {
        margin: 100px 35px 0px 50px;

    }

    .encabezados
    {
        font-size: 7pt;
        text-align: center;
    }

    body{
        margin: 10px 0px 140px 5px;
    }

    header {
        position: fixed;
        width:100%;
        top: -80px;
        left: 0px;
        right: 0px;
        height: 50px;


    }

    .footer {
        position: fixed;
        bottom: 90px;
        left: 0px;
        right: 0px;
        height: 50px;
    }

    .marco {
        border: black 5px double;
        border-radius: 5px;
        padding: 2px 5px;
    }
    .datos_api {
        text-decoration-line: underline;
        text-decoration-style: wavy;
        text-decoration-color: black;
    }

    .tabla_checadas {
        font-size: 7pt;
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    .tabla_checadas td, .tabla_checadas th {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .tabla_checadas tr:nth-child(even){background-color: #f2f2f2;}

    .tabla_checadas tr:hover {background-color: #ddd;}

    .tabla_checadas th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #b8b8b8;
        color: black;
    }
    .espacio {
        white-space: normal;
    }

</style>

<header>
    <div class="fuente">

        <table width="50%">
            <tbody>
                <tr>
                    <td width="100px">
                        <img src='http://sistematizacion.saludchiapas.gob.mx/images/salud.png' width="100px">
                    </td>
                    <td>
                        <div class="centrado datos">
                       SECRETARÍA DE SALUD<BR>
                       INSTITUTO DE SALUD DEL ESTADO DE CHIAPAS<BR>
                        DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS<BR>
                        DEPARTAMENTO DE OPERACIÓN Y SISTEMATIZACIÓN DE NÓMINAS<BR>
                        CONTROL DE ASISTENCIA<BR>

                        </div>

                    </td>

                    <td width="100px">
                        <img src='http://sistematizacion.saludchiapas.gob.mx/images/chiapas.png' width="100px">
                    </td>
                </tr>
               <!--<tr>
                <td colspan='2' class='datos'>UNIDAD EXPEDIDORA: OFICINA CENTRAL</td>
                <td colspan='2' class='datos'>TIPO DE TRABAJADOR: </td>
               </tr>-->
            </tbody>
        </table>
    </div>
</header>

Por favor de clic en el boton para resetear su password, si no lo redirecciona, favor de copiar y pegar el link en su navegador.

@component('mail::button', ['url' => 'http://localhost:4200/#/update-password?token='.$token])
Cambiar password
@endcomponent

Muchas gracias,<br>
(SIRH) Sistema de Información de Recursos Humanos.

