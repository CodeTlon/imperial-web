// Datos de ejemplo tomados de la app móvil (sanciones y plantel de Ankara +30). Los DNI son inventados.
import type { JugadorPlantel, Sancion } from '@/lib/demo-store'

export const SANCIONES_APP: Sancion[] = [
  {
    "id": "h1",
    "jugador": "Cristian Agustín Salussolia",
    "equipo": "Ankara +30",
    "partido": "vs. Los Ñoquis +30",
    "fecha": "15/06",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco — 1 fecha de suspensión, ya cumplida (Art. 39).",
    "estado": "Firme",
    "mensajes": [],
    "cumplida": true
  },
  {
    "id": "h2",
    "jugador": "Cristian Agustín Salussolia",
    "equipo": "Ankara +30",
    "partido": "vs. Belgrano Vet. +30",
    "fecha": "25/05",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Doble amonestación — 1 fecha de suspensión. El descargo fue aceptado y la sanción quedó sin efecto.",
    "estado": "Descargo aceptado",
    "descargo": "La segunda amarilla fue por una falta que no cometió el jugador; el árbitro confundió el número.",
    "mensajes": [],
    "cumplida": true
  },
  {
    "id": "s1",
    "jugador": "Cristian Agustín Salussolia",
    "equipo": "Ankara +30",
    "partido": "vs. Juan B. Justo +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco grave + agresión al árbitro — 8 fechas de suspensión, 4 por cumplir (Art. 39 y Art. 34 A).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s2",
    "jugador": "Luciano Jeremías Romano",
    "equipo": "Ankara +30",
    "partido": "vs. El Banco +30",
    "fecha": "06/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco — 4 fechas de suspensión, todas por cumplir (Art. 39).",
    "estado": "En revisión",
    "descargo": "El jugador disputaba el balón limpiamente; el contacto fue accidental y no hubo intención de lesionar al rival.",
    "mensajes": [
      {
        "de": "organizacion",
        "texto": "¿Tenés algún video o testigo del árbitro asistente que respalde la versión?",
        "fecha": "07/07"
      },
      {
        "de": "delegado",
        "texto": "No tenemos video, pero el capitán del rival puede confirmar que no hubo intención.",
        "fecha": "08/07"
      },
      {
        "de": "organizacion",
        "texto": "Perfecto, lo vamos a evaluar con el informe del árbitro antes de resolver.",
        "fecha": "08/07"
      }
    ]
  },
  {
    "id": "s3",
    "jugador": "Federico Villaroel",
    "equipo": "Chape +30",
    "partido": "vs. Smata +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Agresión a un jugador rival — 5 fechas de suspensión, 4 por cumplir (Art. 39 C).",
    "estado": "Descargo aceptado",
    "descargo": "Hubo una reacción tras una entrada previa no sancionada por el árbitro; se solicita reducción de la pena.",
    "mensajes": []
  },
  {
    "id": "s4",
    "jugador": "Matias Ochoa",
    "equipo": "Smata +30",
    "partido": "vs. La Sede +30",
    "fecha": "29/06",
    "tipo": "Roja directa",
    "articulo": "Art. 42",
    "fechasSuspension": 1,
    "motivo": "Conducta antideportiva grave — 10 fechas de suspensión, todas por cumplir (Art. 42 D.1).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s5",
    "jugador": "Jonathan Irazabal",
    "equipo": "Smata +30",
    "partido": "vs. El Tala +30",
    "fecha": "22/06",
    "tipo": "Roja directa",
    "articulo": "Art. 34",
    "fechasSuspension": 1,
    "motivo": "Agresión física al árbitro — 6 fechas de suspensión, todas por cumplir (Art. 34 A).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s6",
    "jugador": "Franco Espinoza",
    "equipo": "Smata +30",
    "partido": "vs. Triangulo +30",
    "fecha": "15/06",
    "tipo": "Roja directa",
    "articulo": "Art. 34",
    "fechasSuspension": 1,
    "motivo": "Agravio u ofensa al árbitro — 3 fechas de suspensión, todas por cumplir (Art. 34 B).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s7",
    "jugador": "Monje Lucas",
    "equipo": "Celtic +30",
    "partido": "vs. Azzurra +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Agresión a un jugador rival — 5 fechas de suspensión, todas por cumplir (Art. 39 C).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s8",
    "jugador": "German Zapata",
    "equipo": "Borussia +30",
    "partido": "vs. Ospaca +30",
    "fecha": "06/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco — 3 fechas de suspensión, 2 por cumplir (Art. 39).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s9",
    "jugador": "Brian Luna",
    "equipo": "Newbery +30",
    "partido": "vs. Alianza +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco — 2 fechas de suspensión, todas por cumplir (Art. 39).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s10",
    "jugador": "Gigena Gomez Nahuel",
    "equipo": "Triangulo +30",
    "partido": "vs. Chape +30",
    "fecha": "06/07",
    "tipo": "Roja directa",
    "articulo": "Art. 39",
    "fechasSuspension": 1,
    "motivo": "Juego brusco — 2 fechas de suspensión, 1 por cumplir (Art. 39).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s11",
    "jugador": "Yamil Segura",
    "equipo": "Aguilas +30",
    "partido": "vs. Caff +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 36",
    "fechasSuspension": 1,
    "motivo": "Expulsión por doble amonestación — 1 fecha de suspensión (Art. 36).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s12",
    "jugador": "Maximiliano Sánchez",
    "equipo": "Las Torres +30",
    "partido": "vs. Santos +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 36",
    "fechasSuspension": 1,
    "motivo": "Expulsión por doble amonestación — 1 fecha de suspensión (Art. 36).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s13",
    "jugador": "Albornoz Jonatan Exequiel",
    "equipo": "LBND +30",
    "partido": "vs. Azzurra +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 37",
    "fechasSuspension": 1,
    "motivo": "Agravio o incitación a la violencia entre jugadores — 1 fecha de suspensión (Art. 37).",
    "estado": "Firme",
    "mensajes": []
  },
  {
    "id": "s14",
    "jugador": "Linossi Joel",
    "equipo": "LBND +30",
    "partido": "vs. Azzurra +30",
    "fecha": "13/07",
    "tipo": "Roja directa",
    "articulo": "Art. 37",
    "fechasSuspension": 1,
    "motivo": "Agravio o incitación a la violencia entre jugadores — 1 fecha de suspensión (Art. 37).",
    "estado": "Firme",
    "mensajes": []
  }
]

export const PLANTEL_APP: JugadorPlantel[] = [
  {
    "id": "j1",
    "equipo": "Ankara +30",
    "nombre": "Mallky Facundo Godoy",
    "dni": "27.251.655",
    "posicion": "Delantero",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j2",
    "equipo": "Ankara +30",
    "nombre": "Cristian Agustín Salussolia",
    "dni": "28.668.386",
    "posicion": "Defensor",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j3",
    "equipo": "Ankara +30",
    "nombre": "Luciano Jeremías Romano",
    "dni": "29.085.117",
    "posicion": "Mediocampista",
    "estadoDoc": "Pendiente"
  },
  {
    "id": "j4",
    "equipo": "Ankara +30",
    "nombre": "Nicolás Vera",
    "dni": "30.502.848",
    "posicion": "Arquero",
    "estadoDoc": "Observado"
  },
  {
    "id": "j5",
    "equipo": "Ankara +30",
    "nombre": "Ezequiel Molina",
    "dni": "31.919.579",
    "posicion": "Defensor",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j6",
    "equipo": "Ankara +30",
    "nombre": "Sebastián Roldán",
    "dni": "32.336.310",
    "posicion": "Mediocampista",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j7",
    "equipo": "Ankara +30",
    "nombre": "Lucas Medina",
    "dni": "33.753.041",
    "posicion": "Defensor",
    "estadoDoc": "Pendiente"
  },
  {
    "id": "j8",
    "equipo": "Ankara +30",
    "nombre": "Franco Navarro",
    "dni": "34.170.772",
    "posicion": "Mediocampista",
    "estadoDoc": "Observado"
  },
  {
    "id": "j9",
    "equipo": "Ankara +30",
    "nombre": "Maximiliano Ledesma",
    "dni": "27.587.503",
    "posicion": "Delantero",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j10",
    "equipo": "Ankara +30",
    "nombre": "Nahuel Ponce",
    "dni": "28.004.234",
    "posicion": "Defensor",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j11",
    "equipo": "Ankara +30",
    "nombre": "Alan Cabrera",
    "dni": "29.421.965",
    "posicion": "Mediocampista",
    "estadoDoc": "Pendiente"
  },
  {
    "id": "j12",
    "equipo": "Ankara +30",
    "nombre": "Julian Ibañez",
    "dni": "30.838.696",
    "posicion": "Arquero",
    "estadoDoc": "Observado"
  },
  {
    "id": "j13",
    "equipo": "Ankara +30",
    "nombre": "Rodrigo Quiroga",
    "dni": "31.255.427",
    "posicion": "Defensor",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j14",
    "equipo": "Ankara +30",
    "nombre": "Damian Ojeda",
    "dni": "32.672.158",
    "posicion": "Mediocampista",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j15",
    "equipo": "Ankara +30",
    "nombre": "Ezequiel Bazan",
    "dni": "33.089.889",
    "posicion": "Delantero",
    "estadoDoc": "Pendiente"
  },
  {
    "id": "j16",
    "equipo": "Ankara +30",
    "nombre": "Marcos Peralta",
    "dni": "34.506.620",
    "posicion": "Defensor",
    "estadoDoc": "Observado"
  },
  {
    "id": "j17",
    "equipo": "Ankara +30",
    "nombre": "Leandro Coronel",
    "dni": "27.923.351",
    "posicion": "Mediocampista",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j18",
    "equipo": "Ankara +30",
    "nombre": "Cristian Villalba",
    "dni": "28.340.082",
    "posicion": "Arquero",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j19",
    "equipo": "Ankara +30",
    "nombre": "Sergio Maldonado",
    "dni": "29.757.813",
    "posicion": "Defensor",
    "estadoDoc": "Pendiente"
  },
  {
    "id": "j20",
    "equipo": "Ankara +30",
    "nombre": "Pablo Segovia",
    "dni": "30.174.544",
    "posicion": "Mediocampista",
    "estadoDoc": "Observado"
  },
  {
    "id": "j21",
    "equipo": "Ankara +30",
    "nombre": "Nicolas Farias",
    "dni": "31.591.275",
    "posicion": "Delantero",
    "estadoDoc": "Aprobado"
  },
  {
    "id": "j22",
    "equipo": "Ankara +30",
    "nombre": "Matías Fernández",
    "dni": "32.008.006",
    "posicion": "Defensor",
    "estadoDoc": "Aprobado"
  }
]
