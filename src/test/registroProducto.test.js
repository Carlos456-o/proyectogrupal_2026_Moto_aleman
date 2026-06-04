const { validateProducto, registerProducto } = require("./registroProducto");
const { supabase } = require("../database/supabaseconfig");

jest.mock("../database/supabaseconfig", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("Validación de producto", () => {
  test("Debe requerir nombre, descripción, imagen", () => {
    const producto = { cantidad: 1, preciocompra: 10, precioventa: 20 };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining([
        "El nombre es obligatorio",
        "La descripción es obligatoria",
        "La imagen del producto es obligatoria",
      ]),
    );
  });

  test("Precios deben ser positivos", () => {
    const producto = {
      nombre_p: "X",
      descripcion: "d",
      cantidad: 1,
      preciocompra: -5,
      precioventa: 0,
      archivo: {},
    };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining([
        "El precio de compra debe ser un número positivo",
        "El precio de venta debe ser un número positivo",
      ]),
    );
  });

  test("Cantidad debe ser positiva", () => {
    const producto = {
      nombre_p: "X",
      descripcion: "d",
      cantidad: 0,
      preciocompra: 5,
      precioventa: 10,
      archivo: {},
    };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining(["La cantidad debe ser un número positivo"]),
    );
  });

  test("Registro llama a supabase cuando es válido", async () => {
    const mockInsert = jest
      .fn()
      .mockResolvedValue({ data: [{ id: 1 }], error: null });
    supabase.from.mockReturnValue({ insert: mockInsert });

    const producto = {
      nombre_p: "X",
      descripcion: "d",
      cantidad: 2,
      preciocompra: 5,
      precioventa: 10,
      archivo: {},
    };
    const res = await registerProducto(producto);
    expect(supabase.from).toHaveBeenCalledWith("productos");
    expect(mockInsert).toHaveBeenCalledWith([producto]);
    expect(res.success).toBe(true);
    expect(res.data).toEqual([{ id: 1 }]);
  });
});
