import net from 'net'
import { spawn } from 'child_process'


/**
 * Funcione que crea un servidor
 */
const server = net.createServer((socket) => {
  console.log("Se ha conectado un cliente")

  /**
   * Metodo para la recepcion de datos del servido
   */
  let wholeData = ''
  socket.on('data', (datos) => {
    wholeData += datos.toString()
    let messageLimit = wholeData.indexOf('\n')
    let aux
    while(messageLimit !== -1) {
      aux = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      messageLimit = wholeData.indexOf('\n')
    }
    let datos_object = JSON.parse(datos.toString())
    console.log("Se va a ejecutar el comando: ", datos_object.cmd + " " + datos_object.opc)
    
    let comando
    if (datos_object.opc.length === 0) {
      comando = spawn(datos_object.cmd)
    }
    else {
      let opciones = datos_object.opc.split(" ")
      comando = spawn(datos_object.cmd, opciones)
    }

    /**
     * Metodo para la salida estandar del comando a ejecutar
     */
    let datos_aux = ''
    comando.stdout.on('data', (datos) => {
      datos_aux += datos;
      // socket.write(JSON.stringify({type: 'salida', salida: datos.toString()}) + '\n')
    })

    /**
     * Metodo para tratar errores en la ejecucion del comando
     */
    let error_2 = ''
    comando.stderr.on('data', (datos) => {
      error_2 += datos
      // socket.write(JSON.stringify({type: 'error_cmd', salida: datos.toString()}) + '\n')
    })


    comando.on('close', () => {
      if (datos_aux.length > 0) {
        socket.write(JSON.stringify({type: 'salida', salida: datos_aux.toString()}) + '\n')
      }
      else if(error_2.length > 0) {
        socket.write(JSON.stringify({type: 'error_cmd', salida: error_2.toString()}) + '\n')
      }
      else if(error_1.length > 0) {
        socket.write(JSON.stringify({type: 'error', salida: error_1.toString()}) + '\n')
      }
    })


    /**
     * Metodo para tratar los errores del comando
     */
    let error_1 = ''
    comando.on('error', (datos) => {
      error_1 += datos
      console.log("Ha ocurrido un error a la hora de ejecutar el comando")
      //socket.write(JSON.stringify({type: 'error', salida: datos.toString()}) + '\n')
    })
  })

  socket.on('close', () => {
    console.log("Se ha desconectado el cliente")
  })
})

server.listen(60300)