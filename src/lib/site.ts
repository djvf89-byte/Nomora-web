// URL canónica del sitio en producción. AUTH_URL (definida en Vercel) tiene prioridad;
// si no está seteada usamos el dominio real como respaldo para dev/build local.
export const SITE_URL = process.env.AUTH_URL ?? "https://www.somosnomora.com"
