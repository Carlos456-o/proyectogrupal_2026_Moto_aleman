# TODO - Implementar Entidad Venta en Dim_ventas

## Paso 1

- [x] Implementar `src/views/Dim_ventas.jsx` (carga de clientes/empleados/productos y tabla)

## Paso 2

- [x] Implementar `src/components/Dim_ventas/ModalRegistroDimVentas.jsx`:
  - [ ] selects por nombre (cliente, empleado, producto)
  - [ ] agregar múltiples productos con cantidad
  - [ ] calcular subtotal por ítem (Precio_Ven \* Cantidad_ven)
  - [ ] persistir en Supabase:
    - [ ] insertar cabecera/venta_detalle según esquema real

## Paso 3

- [ ] Actualizar `src/components/Dim_ventas/TablaDimVentas.jsx` a tabla real

## Paso 4

- [ ] Ajustar `ModalEdicionDimVentas.jsx` y `ModalEliminacionDimVentas.jsx` si aplica (mínimo eliminar y edición básica)

## Paso 5

- [ ] Probar en runtime: registrar venta con 2+ productos y validar subtotales
