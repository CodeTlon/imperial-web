// Adjuntos de la demo: los blobs viven en IndexedDB (localStorage no alcanza para videos).
// En el mensaje solo se guardan los metadatos (ver tipo Adjunto).

export type Adjunto = { id: string; nombre: string; tipo: string; tamano: number }

const DB = 'ti-demo-adjuntos'
const TIENDA = 'archivos'

export const MAX_BYTES = 25 * 1024 * 1024
export const MAX_ARCHIVOS = 8

const EXT_OK = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip']

export type Clase = 'imagen' | 'video' | 'pdf' | 'archivo'

export function extension(nombre: string) {
  const i = nombre.lastIndexOf('.')
  return i < 0 ? '' : nombre.slice(i + 1).toLowerCase()
}

export function claseDe(a: { nombre: string; tipo: string }): Clase {
  const e = extension(a.nombre)
  if (a.tipo.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(e)) return 'imagen'
  if (a.tipo.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(e)) return 'video'
  if (a.tipo === 'application/pdf' || e === 'pdf') return 'pdf'
  return 'archivo'
}

export function formatoTamano(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

/** Devuelve un mensaje de error en español, o null si el archivo es válido. */
export function validar(f: File): string | null {
  if (!EXT_OK.includes(extension(f.name)) && !/^(image|video)\//.test(f.type) && f.type !== 'application/pdf')
    return `"${f.name}": ese tipo de archivo no está permitido. Subí imágenes, videos, PDF, Word, Excel, TXT o ZIP.`
  if (!EXT_OK.includes(extension(f.name)) && f.type && !['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf'].includes(f.type))
    return `"${f.name}": ese tipo de archivo no está permitido.`
  if (f.size === 0) return `"${f.name}" está vacío.`
  if (f.size > MAX_BYTES) return `"${f.name}" pesa ${formatoTamano(f.size)} y el máximo es ${formatoTamano(MAX_BYTES)} por archivo.`
  return null
}

function abrir(): Promise<IDBDatabase> {
  return new Promise((ok, mal) => {
    if (typeof indexedDB === 'undefined') return mal(new Error('IndexedDB no disponible'))
    let r: IDBOpenDBRequest
    try { r = indexedDB.open(DB, 1) } catch (e) { return mal(e) }
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(TIENDA)) r.result.createObjectStore(TIENDA) }
    r.onsuccess = () => ok(r.result)
    r.onerror = () => mal(r.error ?? new Error('No se pudo abrir la base de adjuntos'))
    r.onblocked = () => mal(new Error('Base de adjuntos bloqueada'))
  })
}

function tx<T>(modo: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return abrir().then((db) => new Promise<T>((ok, mal) => {
    const t = db.transaction(TIENDA, modo)
    const req = fn(t.objectStore(TIENDA))
    t.oncomplete = () => { db.close(); ok(req.result) }
    t.onerror = t.onabort = () => { db.close(); mal(t.error ?? new Error('Falló la operación sobre adjuntos')) }
  }))
}

function reducirImagen(file: File, maxLado = 1600): Promise<Blob> {
  const e = extension(file.name)
  if (file.type === 'image/gif' || e === 'gif' || file.size < 400 * 1024) return Promise.resolve(file)
  return new Promise((ok) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const k = Math.min(1, maxLado / Math.max(img.naturalWidth, img.naturalHeight))
      if (k >= 1 && file.size < 1.5 * 1024 * 1024) return ok(file)
      const c = document.createElement('canvas')
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k)
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height)
      const tipo = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      c.toBlob((b) => ok(b && b.size < file.size ? b : file), tipo, 0.85)
    }
    img.onerror = () => { URL.revokeObjectURL(url); ok(file) }
    img.src = url
  })
}

function nuevoId() {
  return `adj-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

/** Guarda el archivo (reduciendo imágenes grandes) y devuelve los metadatos. */
export async function guardar(file: File): Promise<Adjunto> {
  const id = nuevoId()
  const tipo = file.type || (extension(file.name) === 'pdf' ? 'application/pdf' : 'application/octet-stream')
  const blob = claseDe({ nombre: file.name, tipo }) === 'imagen' ? await reducirImagen(file) : file
  await tx('readwrite', (s) => s.put(blob, id))
  return { id, nombre: file.name, tipo, tamano: blob.size }
}

const cache = new Map<string, string>()

/** Object URL del adjunto (cacheada). Llamar a liberarURL para revocarla. */
export async function obtenerURL(id: string): Promise<string | null> {
  const c = cache.get(id)
  if (c) return c
  const blob = await tx<Blob | undefined>('readonly', (s) => s.get(id) as IDBRequest<Blob | undefined>)
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  cache.set(id, url)
  return url
}

export function liberarURL(id: string) {
  const u = cache.get(id)
  if (u) { URL.revokeObjectURL(u); cache.delete(id) }
}

export async function borrar(id: string) {
  liberarURL(id)
  await tx('readwrite', (s) => s.delete(id))
}

/** Vacía toda la base (Reiniciar demo). Nunca lanza. */
export async function borrarTodo() {
  cache.forEach((u) => URL.revokeObjectURL(u))
  cache.clear()
  try { await tx('readwrite', (s) => s.clear()) } catch {}
}
