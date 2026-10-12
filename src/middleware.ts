import { NextResponse, type NextRequest } from 'next/server'

// Protección de rutas de la demo: la cookie `ti_rol` la pone el login mockeado.
export function middleware(req: NextRequest) {
  const rol = req.cookies.get('ti_rol')?.value
  const { pathname } = req.nextUrl
  const permitido = pathname.startsWith('/panel') ? rol === 'organizacion' : rol === 'delegado'
  if (permitido) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = '/ingresar'
  url.searchParams.set('desde', pathname)
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/panel/:path*', '/delegado/:path*'] }
