export enum Tipo {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold"
}

export class Funko {
  id: number
  nombre: string
  tipo: Tipo
  coste: number

  constructor(id: number, nombre: string, tipo: Tipo, coste: number) {
    this.id = id
    this.nombre = nombre
    this.tipo = tipo
    this.coste = coste
  }
}