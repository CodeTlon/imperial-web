import type { Sancion } from '@/lib/demo-store'

// Sanciones de demostración de las categorías que no son +30 (Libre, +35, +40, +45 y Femenino): los mismos casos
// que en la app (torneo-imperial-app/src/lib/sanciones-mock.ts). Los artículos y los rangos de fechas salen del
// reglamento (Art. 36, 37, 39 y 43 Bis); los jugadores son de los planteles de demostración.
export type SancionMock = Sancion & { categoria: string; porCumplir: number }

export const SANCIONES_MOCK: SancionMock[] = [
  {
    id: 'm1', categoria: "Libre", jugador: "Mauro Ponce", equipo: "Atlético Sur Libre", partido: "vs. Barrio Alberdi Libre", fecha: "19/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 3, porCumplir: 3,
    motivo: "Juego brusco — 3 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "En revisión", descargo: "El jugador disputaba la pelota de manera limpia; el contacto fue accidental y pedimos que se revise la jugada.", mensajes: [],
  },
  {
    id: 'm2', categoria: "Libre", jugador: "Claudio Morales", equipo: "Defensores del Centro Libre", partido: "vs. Los Pibes Libre", fecha: "12/09",
    tipo: "Roja directa", articulo: "Art. 37", articulos: ["Art. 37"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Agravio o insulto entre jugadores — 1 fecha de suspensión, 1 por cumplir (Art. 37).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm3', categoria: "Libre", jugador: "Gastón Ortiz", equipo: "Los Pibes Libre", partido: "vs. Juventud Unida Libre", fecha: "19/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 43 Bis", articulos: ["Art. 43 Bis"], fechasSuspension: 1, porCumplir: 0,
    motivo: "Cinco amarillas acumuladas — 1 fecha de suspensión. El descargo fue aceptado y la sanción quedó sin efecto (Art. 43 Bis).",
    estado: "Descargo aceptado", descargo: "La tarjeta fue por error de identificación del jugador; el árbitro lo reconoció al revisar la planilla.", mensajes: [],
  },
  {
    id: 'm4', categoria: "Libre", jugador: "Axel Díaz", equipo: "Barrio Alberdi Libre", partido: "vs. Racing Ballesteros Libre", fecha: "26/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm5', categoria: "Libre", jugador: "Tomás Romero", equipo: "Fénix FC Libre", partido: "vs. Club Palermo Libre", fecha: "12/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 0,
    motivo: "Doble amonestación — 1 fecha de suspensión, ya cumplida (Art. 36).",
    estado: "Firme", cumplida: true, mensajes: [],
  },
  {
    id: 'm6', categoria: "Libre", jugador: "Santiago Acosta", equipo: "Deportivo Norte Libre", partido: "vs. Atlético Sur Libre", fecha: "05/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 4, porCumplir: 3,
    motivo: "Juego brusco — 4 fechas de suspensión, 3 por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm7', categoria: "+35", jugador: "Damián Suárez", equipo: "El Galpón +35", partido: "vs. Gral. Paz Jrs +35", fecha: "05/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm8', categoria: "+35", jugador: "Nicolás Molina", equipo: "Las Palmas +35", partido: "vs. Veteranos del Sur +35", fecha: "05/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Descargo rechazado", descargo: "Solicitamos la revisión de la sanción por considerar excesiva la cantidad de fechas.", mensajes: [],
  },
  {
    id: 'm9', categoria: "+35", jugador: "Rodrigo Rodríguez", equipo: "Gral. Paz Jrs +35", partido: "vs. Los Pumas +35", fecha: "19/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 4, porCumplir: 4,
    motivo: "Juego brusco — 4 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm10', categoria: "+35", jugador: "Lucas Molina", equipo: "Peñarol Cba +35", partido: "vs. El Mirador +35", fecha: "05/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 3, porCumplir: 0,
    motivo: "Juego brusco — 3 fechas de suspensión, ya cumplida (Art. 39).",
    estado: "Firme", cumplida: true, mensajes: [],
  },
  {
    id: 'm11', categoria: "+35", jugador: "Tomás Cabrera", equipo: "Santa Rosa +35", partido: "vs. La Legión +35", fecha: "05/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 2, porCumplir: 2,
    motivo: "Juego brusco — 2 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm12', categoria: "+40", jugador: "Sebastián Luna", equipo: "Argentinos Jrs. Vet. +40", partido: "vs. Tiro Federal +40", fecha: "05/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 43 Bis", articulos: ["Art. 43 Bis"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Cinco amarillas acumuladas — 1 fecha de suspensión, 1 por cumplir (Art. 43 Bis).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm13', categoria: "+40", jugador: "Axel Peralta", equipo: "El Fortín +40", partido: "vs. Club Los Andes +40", fecha: "12/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm14', categoria: "+40", jugador: "Agustín Cabrera", equipo: "La Pandilla +40", partido: "vs. San Martín Vet. +40", fecha: "03/10",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm15', categoria: "+40", jugador: "Sebastián Ponce", equipo: "San Martín Vet. +40", partido: "vs. El Rancho +40", fecha: "12/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 2, porCumplir: 2,
    motivo: "Juego brusco — 2 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm16', categoria: "+40", jugador: "Juan Juárez", equipo: "Los Cracks +40", partido: "vs. Matadero FC +40", fecha: "03/10",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 4, porCumplir: 4,
    motivo: "Juego brusco — 4 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm17', categoria: "+45", jugador: "Julián Fernández", equipo: "Los Pinos +45", partido: "vs. San Lorenzo Vet. +45", fecha: "19/09",
    tipo: "Roja directa", articulo: "Art. 37", articulos: ["Art. 37"], fechasSuspension: 3, porCumplir: 2,
    motivo: "Agravio o insulto entre jugadores — 3 fechas de suspensión, 2 por cumplir (Art. 37).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm18', categoria: "+45", jugador: "Rodrigo Suárez", equipo: "La Cofradía +45", partido: "vs. Rivadavia +45", fecha: "26/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 43 Bis", articulos: ["Art. 43 Bis"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Cinco amarillas acumuladas — 1 fecha de suspensión, 1 por cumplir (Art. 43 Bis).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm19', categoria: "+45", jugador: "Santiago Herrera", equipo: "Los Gladiadores +45", partido: "vs. Maracaná +45", fecha: "26/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm20', categoria: "+45", jugador: "Iván García", equipo: "Fortaleza +45", partido: "vs. Los Pinos +45", fecha: "26/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm21', categoria: "Femenino", jugador: "Ariel Cabrera", equipo: "Las Panteras Fem.", partido: "vs. Las Tigresas Fem.", fecha: "19/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm22', categoria: "Femenino", jugador: "Franco Ríos", equipo: "Las Guerreras Fem.", partido: "vs. Las Fieras Fem.", fecha: "26/09",
    tipo: "Amarillas acumuladas", articulo: "Art. 36", articulos: ["Art. 36"], fechasSuspension: 1, porCumplir: 1,
    motivo: "Doble amonestación — 1 fecha de suspensión, 1 por cumplir (Art. 36).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm23', categoria: "Femenino", jugador: "Martín Martínez", equipo: "Las Gladiadoras Fem.", partido: "vs. Furia Celeste Fem.", fecha: "03/10",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 2, porCumplir: 1,
    motivo: "Juego brusco — 2 fechas de suspensión, 1 por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
  {
    id: 'm24', categoria: "Femenino", jugador: "Julián Díaz", equipo: "Amazonas FC Fem.", partido: "vs. Las Guerreras Fem.", fecha: "05/09",
    tipo: "Roja directa", articulo: "Art. 39", articulos: ["Art. 39"], fechasSuspension: 2, porCumplir: 2,
    motivo: "Juego brusco — 2 fechas de suspensión, todas por cumplir (Art. 39).",
    estado: "Firme", mensajes: [],
  },
]
