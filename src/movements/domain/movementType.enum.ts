export enum MovementType {
  IN_PURCHASE = 'IN_PURCHASE', // Compra a proveedor
  IN_RETURN = 'IN_RETURN', // Devolución de cliente
  IN_ADJUSTMENT = 'IN_ADJUSTMENT', // Ajuste positivo (inventario inicial)
  OUT_SALE = 'OUT_SALE', // Venta
  OUT_LOSS = 'OUT_LOSS', // Pérdida/Robo/Rotura
  OUT_ADJUSTMENT = 'OUT_ADJUSTMENT', // Ajuste negativo,
  IN_INITIAL = 'IN_INITIAL', // Carga inicial
}
