const suma = require("./suma");

test("suma 1 + 2 = 3", () => {
  expect(suma(1, 2)).toBe(3);
});
