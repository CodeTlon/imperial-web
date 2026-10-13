import { NextResponse, type NextRequest } from 'next/server'

// Protección de rutas de la demo: la cookie `ti_rol` la pone el login mockeado.
const INICIO: Record<string, string> = { organizacion: '/panel', delegado: '/delegado', jugador: '/jugador' }
const RUTA_DE: Record<string, string> = { '/panel': 'organizacion', '/delegado': 'delegado', '/jugador': 'jugador' }

export function middleware(req: NextRequest) {
  const rol = req.cookies.get('ti_rol')?.value
  const { pathname } = req.nextUrl
  const seccion = Object.keys(RUTA_DE).find((r) => pathname === r || pathname.startsWith(`${r}/`))
  if (seccion && rol === RUTA_DE[seccion]) return NextResponse.next()
  const url = req.nextUrl.clone()
  // Con sesión de otro rol se lo manda a su propio panel; sin sesión, al login.
  if (rol && INICIO[rol]) {
    url.pathname = INICIO[rol]
    url.search = ''
  } else {
    url.pathname = '/ingresar'
    url.searchParams.set('desde', pathname)
  }
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/panel/:path*', '/delegado/:path*', '/jugador/:path*'] }
