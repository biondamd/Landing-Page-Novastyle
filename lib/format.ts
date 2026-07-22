/**
 * Formatea un precio en soles: 189 -> "S/ 189.00", 1299.5 -> "S/ 1,299.50".
 *
 * Es el único lugar donde se arma un precio. No se usa Intl.NumberFormat
 * porque su salida para PEN varía entre versiones de Node y navegadores
 * (a veces con espacio duro), y el diseño exige exactamente "S/ 189.00".
 */
export function formatPrice(value: number): string {
  const [integer, decimals] = value.toFixed(2).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
  return `S/ ${grouped}.${decimals}`;
}