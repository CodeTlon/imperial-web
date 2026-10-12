export type ItemCarta = { nombre: string; precio?: number; detalle?: string }
export type SeccionCarta = { titulo: string; icono: 'water' | 'beer' | 'wine' | 'restaurant' | 'flash' | 'cafe' | 'sparkles'; items: ItemCarta[] }

// Carta de Coronados Bar & Fernet Branca. Tragos, botellas y el Malbec no tienen precio en la carta impresa.
export const CARTA: SeccionCarta[] = [
  { titulo: 'Aguas', icono: 'water', items: [
    { nombre: 'Saborizada grande', precio: 6000 }, { nombre: 'Saborizada chica', precio: 3000 },
    { nombre: 'Agua mineral 1½', precio: 5000 }, { nombre: 'Agua mineral chica', precio: 2500 },
    { nombre: 'Soda', precio: 5000 }, { nombre: 'Bidón', precio: 10000 }, { nombre: 'Hielo', precio: 5000 },
  ] },
  { titulo: 'Gaseosas', icono: 'flash', items: [
    { nombre: 'Gaseosa grande', precio: 7000 }, { nombre: 'Gaseosa chica', precio: 3000 }, { nombre: 'Coca', precio: 8000 },
  ] },
  { titulo: 'Gatorade y Speed', icono: 'flash', items: [
    { nombre: 'Gatorade grande', precio: 7000 }, { nombre: 'Gatorade chico', precio: 5000 },
    { nombre: 'Speed chico', precio: 3000 }, { nombre: 'Speed grande', precio: 5000 },
  ] },
  { titulo: 'Fernet Branca', icono: 'sparkles', items: [
    { nombre: 'Vaso de Fernet Branca con Coca', precio: 12000 },
    { nombre: 'Promo Fernet Branca + 3 Cocas + hielo', precio: 42000 },
    { nombre: 'Botella de Fernet Branca', precio: 28000 },
  ] },
  { titulo: 'Cervezas', icono: 'beer', items: [
    { nombre: 'Stella y Premium', precio: 11000 }, { nombre: 'Brahma', precio: 9000 },
    { nombre: 'Latas económicas', precio: 5000 }, { nombre: 'Latas Premium', precio: 7000 },
  ] },
  { titulo: 'Vino y Gancia', icono: 'wine', items: [
    { nombre: 'Vino + gaseosa', precio: 22000 }, { nombre: 'Vino solo', precio: 15000 },
    { nombre: 'Fabre Montemayou Classic Malbec' },
    { nombre: 'Gancia + soda', precio: 20000 }, { nombre: 'Gancia + gaseosa', precio: 22000 }, { nombre: 'Gancia solo', precio: 12000 },
  ] },
  { titulo: 'Tragos', icono: 'wine', items: [
    { nombre: 'Brancamenta + soda' },
    { nombre: 'Blu Gin Tónic', detalle: 'Spirito Blu Gin, agua tónica, piel de limón' },
    { nombre: 'Vodka Sernova + jugo de naranja' },
    { nombre: 'Sernova saborizados + Speed' },
  ] },
  { titulo: 'Botellas', icono: 'sparkles', items: [
    { nombre: 'Spirito Blu Gin + Tónicas' }, { nombre: 'Sernova saborizados + Energizantes' },
  ] },
  { titulo: 'Comida y otros', icono: 'restaurant', items: [
    { nombre: 'Pebetes', precio: 3000 }, { nombre: 'Tortuguitas', precio: 4000 }, { nombre: 'Empanadas', precio: 2000 },
    { nombre: 'Carbón', precio: 6000 }, { nombre: 'Pan', precio: 4000 }, { nombre: 'Agua caliente', precio: 1000 },
    { nombre: 'Palitas', precio: 7000 }, { nombre: 'Cubiertos', precio: 7000 }, { nombre: 'Café', precio: 3000 },
  ] },
]

export const formatoPrecio = (n: number) => `$${n.toLocaleString('es-AR')}`
