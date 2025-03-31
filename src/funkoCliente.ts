import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import { Tipo } from './funko.js';
import net from "net"

const argv = yargs(hideBin(process.argv))
  .command('add', 'Adds a funko', {
    usuario: { type: 'string', demandOption: true },
    id: {description: 'Funko ID', type: 'number', demandOption: true},
    nombre: {description: 'Funko nombre', type: 'string', demandOption: true},
    tipo: {description: 'Tipo de Funko (Pop, Pop Rides, Vinyl Soda, Vinyl Gold)', type: 'string', choices: Object.values(Tipo), demandOption: true},
    coste: {description: 'Coste', type: 'number', demandOption: true}
  })

  .command('eliminar', 'Delete a funko', {
    usuario: { type: 'string', demandOption: true },
    id: {description: 'Funko ID', type: 'number', demandOption: true},
    nombre: {description: 'Funko nombre', type: 'string', demandOption: true},
    tipo: {description: 'Tipo de Funko (Pop, Pop Rides, Vinyl Soda, Vinyl Gold)', type: 'string', choices: Object.values(Tipo), demandOption: true},
    coste: {description: 'Coste', type: 'number', demandOption: true}
  })

  .command('listar', 'Listar funkos', {
    usuario: { type: 'string', demandOption: true }
  })

  .command('mostrar', 'Muestra un Funko', {
    usuario: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  })
 .help()
 .parseSync(); // Usar parseSync() para evitar promesas

  const comandoNombre = argv._.length > 0 ? argv._[0] : '';

 const client = net.createConnection({ port: 60300 }, () => {
  console.log("Conectado al servidor Funko");
  const comando = { comando: comandoNombre, ...argv };
  client.write(JSON.stringify(comando));
});

client.on('data', (data) => {
  console.log("Respuesta del servidor:", data.toString());
  client.end();
});

client.on('end', () => {
  console.log("Desconectado del servidor");
});