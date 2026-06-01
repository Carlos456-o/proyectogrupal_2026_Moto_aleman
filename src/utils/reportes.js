import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const obtenerFechaActual = () => {
  const fecha = new Date();
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const prepararFilas = (datos, columnas) => {
  return datos.map((item) => {
    const fila = {};

    columnas.forEach(({ key, label, transform }) => {
      let valor = transform ? transform(item[key], item) : item[key];

      if (valor === null || valor === undefined) {
        valor = "";
      }

      if (typeof valor === "boolean") {
        valor = valor ? "Sí" : "No";
      }

      fila[label] = valor;
    });

    return fila;
  });
};

export const generarReportePDF = (titulo, datos, columnas) => {
  const filas = prepararFilas(datos, columnas);
  const doc = new jsPDF("p", "pt", "a4");
  const fecha = obtenerFechaActual();

  doc.setFontSize(16);
  doc.text(titulo, 40, 40);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha}`, 40, 56);

  autoTable(doc, {
    startY: 72,
    head: [columnas.map((col) => col.label)],
    body: filas.map((fila) => columnas.map((col) => fila[col.label])),
    theme: "striped",
    headStyles: { fillColor: [220, 53, 69], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: "auto" } },
  });

  const nombreArchivo = `${titulo.replace(/\s+/g, "_")}_${fecha.replace(/\//g, "-")}.pdf`;
  doc.save(nombreArchivo);
};

export const generarReporteExcel = (titulo, datos, columnas) => {
  const filas = prepararFilas(datos, columnas);
  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, titulo);

  const fecha = obtenerFechaActual().replace(/\//g, "-");
  const nombreArchivo = `${titulo.replace(/\s+/g, "_")}_${fecha}.xlsx`;
  XLSX.writeFile(libro, nombreArchivo);
};
