const { validateProducto, registerProducto } = require("./registroProducto");
const { supabase } = require("../database/supabaseconfig");

jest.mock("../database/supabaseconfig", () => ({
  supabase: {
    from: jest.fn(),
  },
}));
describe("Validación de producto", () => {
  test("Debe validar que PrecioC sea decimal ≥ 0", () => {
    const producto = { preciocompra: -5, precioventa: 10, cantidad: 5, disponible: true };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining(["PrecioC debe ser un decimal ≥ 0"]),
    );
  });
  test("Valida un producto correcto con disponible true", () => {
    const producto = { preciocompra: 15.5, precioventa: 25.99, cantidad: 10, disponible: true };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });
  test("Retorna error cuando falta disponible", () => {
    const producto = { preciocompra: 10, precioventa: 20, cantidad: 5 };
    const { valid, errors } = validateProducto(producto);
    expect(valid).toBe(false);
    expect(errors).toEqual(
      expect.arrayContaining(["disponible es obligatorio"]),
    );
  });
  test("Registro llama a supabase cuando es válido", async () => {
    const mockInsert = jest
      .fn()
      .mockResolvedValue({ data: [{ id: 1 }], error: null });
    supabase.from.mockReturnValue({ insert: mockInsert });
    const producto = {
      preciocompra: 10,
      precioventa: 20,
      cantidad: 5,
      disponible: true,
    };
    const res = await registerProducto(producto);
    expect(supabase.from).toHaveBeenCalledWith("productos");
    expect(mockInsert).toHaveBeenCalledWith([producto]);
    expect(res.success).toBe(true);
    expect(res.data).toEqual([{ id: 1 }]);
  });
});