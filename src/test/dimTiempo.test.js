const {
  construirInsertsVentas,
  construirInsertsVentasAlt,
  construirMinimalInputs,
  construirMinimalAltInputs,
} = require("./dimTiempo");

describe("CP-HF015 - Dim_tiempo (prueba de caja blanca)", () => {
  const items = [
    {
      idProducto: 10,
      nombreProducto: "Filtro",
      precioVen: "25.5",
      cantidad: "2",
      totalVenta: "51",
    },
  ];

  test("construye inserts con id_tiempo por defecto 1 y campos en minúscula", () => {
    const inserts = construirInsertsVentas(items, 3, 5);

    expect(inserts).toEqual([
      {
        id_cliente: 3,
        id_empleado: 5,
        id_producto: 10,
        id_tiempo: 1,
        cantidad_ven: 2,
        precio_ven: 25.5,
        total_venta: 51,
      },
    ]);
  });

  test("construye inserts alternativos con campos en mayúsculas y id_tiempo incluido", () => {
    const insertsAlt = construirInsertsVentasAlt(items, 7, 9, 2);

    expect(insertsAlt).toEqual([
      {
        ID_Cliente: 7,
        ID_Empleado: 9,
        ID_Producto: 10,
        ID_Tiempo: 2,
        Cantidad_ven: 2,
        Precio_Ven: 25.5,
        Total_Venta: 51,
      },
    ]);
  });

  test("construye inserts mínimos en minúsculas para reintentos del fallback", () => {
    const minimal = construirMinimalInputs(items);

    expect(minimal).toEqual([
      {
        cantidad_ven: 2,
        precio_ven: 25.5,
        total_venta: 51,
      },
    ]);
  });

  test("construye inserts mínimos alternativos en mayúsculas para el último fallback", () => {
    const minimalAlt = construirMinimalAltInputs(items);

    expect(minimalAlt).toEqual([
      {
        Cantidad_ven: 2,
        Precio_Ven: 25.5,
        Total_Venta: 51,
      },
    ]);
  });
});
