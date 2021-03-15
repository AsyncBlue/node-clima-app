require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {

    const busquedas = new Busquedas();

    let opt; 

    do{

        opt = await inquirerMenu();

        switch( opt ) {

            case 1:
                //MOSTRAR MENSAJE
                const termino = await leerInput('Ciudad: ');
                
                //BUSCAR LOS LUGARES
                const lugares = await busquedas.ciudad( termino );

                //SELECCIONAR EL LUGAR
                const id = await listarLugares( lugares );

                if ( id === '0' ) continue;

                const lugarSeleccionado = lugares.find( lugar => lugar.id === id );

                //GUARDAR EN DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );

                //DATOS CLIMA
                const clima = await busquedas.climaLugar( lugarSeleccionado.latitud, lugarSeleccionado.longitud );

                //MOSTRAR RESULTADOS
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre.green );
                console.log('Latitud: ', lugarSeleccionado.latitud );
                console.log('Longitud: ', lugarSeleccionado.longitud );
                console.log('Temperatura: ', clima.temp );
                console.log('Temperatura Minima: ', clima.tempMin );
                console.log('Temperatura Maxima: ', clima.tempMax );
                console.log('El clima se encuentra: ', clima.desc.green );

                break;

            case 2:

                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                });

                break;

        }

        if ( opt !== 0 ) await pausa();

    } while (opt !== 0)

}

main();