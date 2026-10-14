# Imperial Web — Torneo Imperial

Sitio web y paneles de demostración del **Torneo Imperial** (fútbol amateur, Córdoba). Next.js 15, React 18 y Tailwind. Sin backend: los datos de demo se guardan en el navegador (localStorage) y los paneles usan un login simulado.

Repo hermano: [`CodeTlon/imperial-app`](https://github.com/CodeTlon/imperial-app) (app mobile). Comparten paleta, vocabulario y datos de demo: ver "Sincronía con la app".

## Uso rápido

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compila y verifica tipos
```

Para verlo desde otra máquina de la red: `npx next dev -H 0.0.0.0 -p <puerto>`.

## Qué incluye

- **Sitio público:** inicio, fixture, posiciones, equipos, campeones, sanciones, reglamento, carta del bar, cómo llegar e inscripción.
- **Paneles** (`/ingresar`): organización, delegado y jugador. Las cuentas de prueba están en la propia pantalla de login ("Cuentas de prueba"); la contraseña de todas es `imperial123`.
- **Contenido editable** desde el panel de organización (contacto, portada, llamado a inscribirse e inscripción).
- Formularios con validación en todos los campos, accesibilidad (WCAG) y diseño responsive.

## Estructura

```
src/app/          páginas (sitio público y paneles: /panel, /delegado, /jugador)
src/components/   sections/, panel/, ui/, layout/, match/
src/lib/          datos de demo (torneo-data, categorias-mock, plantel-mock, sanciones-mock), estado (demo-store), configuración (demo-config)
public/images/    fotos, sponsors y escudos (los de +30 son reales, el resto está generado)
```

## Sincronía con la app

Estos archivos son iguales en `imperial-app` y hay que mantenerlos juntos:
`src/lib/categorias-mock.ts`, `carta.ts` y `reglamento-ti.ts` (idénticos), y la paleta (`demo-config.ts` y `components/panel/ui.tsx` aquí; `tailwind.config.js` y `src/lib/theme.ts` allá). `plantel-mock.ts` y `sanciones-mock.ts` generan los mismos jugadores y sanciones que sus pares de la app. Las reglas y las sanciones salen solo del reglamento (`reglamento-ti.ts`): no se reescriben ni se inventan.

## Documentación de trabajo

- `PROGRESO.md`: estado y decisiones del proyecto.
- `PEDIDOS-SESION-2026-10-13.md`: traspaso de las últimas sesiones (qué se pidió, qué está hecho y qué falta).
- `GUION-LOOM.md`: guion del video de presentación.

## Changelog

- **2026-10-14:** repo separado de `CodeTlon/demos`. Paleta del escudo unificada con la app, escudos para los 100 equipos, sanciones y planteles de demo en todas las categorías, reglamento reordenado, páginas de sanciones, carta y cómo llegar rehechas, descargos en tabla y detalle, validaciones en todos los formularios y menú lateral en los paneles.
