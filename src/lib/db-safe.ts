// Envuelve queries de Prisma para que un fallo de conexión a BD no tumbe la página.
// Necesario mientras no haya un Postgres real conectado en desarrollo (ver docs/prd.md).
export async function dbSafe<T>(query: () => Promise<T>, fallback: T): Promise<{ data: T; dbError: boolean }> {
  try {
    const data = await query()
    return { data, dbError: false }
  } catch {
    return { data: fallback, dbError: true }
  }
}
