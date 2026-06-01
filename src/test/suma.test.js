const suma = require("./suma");

test("La funcion debe devolver la suma correcta,", () => {
  expect(suma(1, 2)).toBe(3);
});
