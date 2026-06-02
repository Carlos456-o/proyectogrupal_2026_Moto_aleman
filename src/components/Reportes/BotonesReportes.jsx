import React from "react";
import { Button } from "react-bootstrap";
import { generarReportePDF, generarReporteExcel } from "../../utils/reportes";

const BotonesReportes = ({ entidad, datos, columnas, onSuccess, onError }) => {
  const exportar = async (formato) => {
    if (!datos || datos.length === 0) {
      onError?.("No hay datos disponibles para generar el reporte.");
      return;
    }

    try {
      if (formato === "pdf") {
        generarReportePDF(entidad, datos, columnas);
      } else {
        generarReporteExcel(entidad, datos, columnas);
      }

      onSuccess?.(`Reporte ${formato.toUpperCase()} generado para ${entidad}.`);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      onError?.(
        "Error al generar el reporte. Verifica los datos y vuelve a intentar."
      );
    }
  };

  return (
    <div className="d-flex gap-2">
      <Button className="btn-report" variant="outline-secondary" size="md" onClick={() => exportar("pdf")}> 
        <i className="bi bi-file-earmark-pdf-fill"></i>
        <span className="d-none d-md-inline ms-2">PDF</span>
      </Button>
      <Button className="btn-report" variant="outline-secondary" size="md" onClick={() => exportar("excel")}> 
        <i className="bi bi-filetype-xlsx"></i>
        <span className="d-none d-md-inline ms-2">Excel</span>
      </Button>
    </div>
  );
};

export default BotonesReportes;
