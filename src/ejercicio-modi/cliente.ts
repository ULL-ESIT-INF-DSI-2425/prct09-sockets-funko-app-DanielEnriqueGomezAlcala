import { Socket } from 'dgram';
import net from 'net';
import chalk from 'chalk';

const client = new net.Socket();

/**
 * Funcion que imprime el funcionamiento en pantalla
 */
function Usage() : void {
  console.log('Tiene que indicar el comando y sus opciones: ');
  console.log('Usage: node dist/cliente.js comando opciones fichero');
  process.exit(1)
}

if (process.argv.length !== 4) {
  Usage()
}

let comando = process.argv[2]
let opciones = process.argv[3]

/**
 * Conecta el socket al puerto TCP 60300
 */
client.connect(60300, () => {
  client.write(JSON.stringify({type: 'comando', cmd: comando, opc: opciones}) + '\n')
})

/**
 * Recepcion de datos en el cliente del servidor
 */
let wholeData = ''
client.on('data', (datos) => {
  wholeData += datos.toString()
  let messageLimit = wholeData.indexOf('\n')
  let aux
  while(messageLimit !== -1) {
    aux = wholeData.substring(0, messageLimit);
    wholeData = wholeData.substring(messageLimit + 1);
    messageLimit = wholeData.indexOf('\n') 
  }

  const mensaje = JSON.parse(aux!.toString())
  switch(mensaje.type) {
    case 'error':
      console.log(chalk.red(`\nError en el comando:\n\n${mensaje.salida}`))
      break
    case 'salida':
      console.log(chalk.green(`\nSalida del comando:\n\n${mensaje.salida}`))
      break
    case 'error_cmd': 
      console.log(chalk.red(`\nError en la ejecucion del comando:\n\n${mensaje.salida}`))
      break
  }

  client.end()
})
