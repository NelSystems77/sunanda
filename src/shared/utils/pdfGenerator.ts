import jsPDF from 'jspdf';
import { MedicalRecord, SessionRecord } from '@/core/domain/interfaces/MedicalRecord';

/**
 * Generar PDF completo del expediente
 */
export const generateMedicalRecordPDF = (record: MedicalRecord) => {
  const pdf = new jsPDF();
  let yPos = 20;

  // Header
  pdf.setFillColor(212, 175, 55); // Gold
  pdf.rect(0, 0, 210, 35, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUNANDA', 105, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Estética y Spa', 105, 23, { align: 'center' });
  pdf.text('Expediente Médico/Estético', 105, 30, { align: 'center' });

  yPos = 45;

  // Información del Cliente
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Información del Paciente', 14, yPos);
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${record.clientName}`, 14, yPos);
  yPos += 6;
  pdf.text(`Expediente No.: ${record.id}`, 14, yPos);
  yPos += 6;
  pdf.text(`Fecha de apertura: ${record.createdAt.toLocaleDateString('es-ES')}`, 14, yPos);
  
  yPos += 15;

  // Anamnesis
  if (record.anamnesis) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(212, 175, 55);
    pdf.text('ANAMNESIS', 14, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');

    // Salud General
    pdf.text('Salud General:', 14, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'normal');
    
    if (record.anamnesis.enfermedades.length > 0) {
      pdf.text(`• Enfermedades: ${record.anamnesis.enfermedades.join(', ')}`, 20, yPos);
      yPos += 6;
    }
    
    if (record.anamnesis.problemaDermato.length > 0) {
      pdf.text(`• Problemas dermatológicos: ${record.anamnesis.problemaDermato.join(', ')}`, 20, yPos);
      yPos += 6;
    }

    pdf.text(`• Embarazo/Lactancia: ${record.anamnesis.embarazoLactancia}`, 20, yPos);
    yPos += 6;

    if (record.anamnesis.cirugiasRecientes) {
      pdf.text(`• Cirugías recientes: ${record.anamnesis.cirugiasRecientes}`, 20, yPos);
      yPos += 6;
    }

    yPos += 4;

    // Medicación
    pdf.setFont('helvetica', 'bold');
    pdf.text('Medicación:', 14, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'normal');

    if (record.anamnesis.medicamentosActuales) {
      pdf.text(`• Medicamentos actuales: ${record.anamnesis.medicamentosActuales}`, 20, yPos);
      yPos += 6;
    }

    if (record.anamnesis.medicamentosPiel.length > 0) {
      pdf.text(`• Medicamentos que afectan piel: ${record.anamnesis.medicamentosPiel.join(', ')}`, 20, yPos);
      yPos += 6;
    }

    pdf.text(`• Anticoagulantes: ${record.anamnesis.anticoagulantes ? 'Sí' : 'No'}`, 20, yPos);
    yPos += 6;

    yPos += 4;

    // Alergias
    pdf.setFont('helvetica', 'bold');
    pdf.text('Alergias e Hipersensibilidades:', 14, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'normal');

    if (record.anamnesis.alergiasCosmeticos) {
      const lines = pdf.splitTextToSize(`• Alergias a cosméticos: ${record.anamnesis.alergiasCosmeticos}`, 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 6;
    }

    if (record.anamnesis.sensibilidadCutanea) {
      pdf.text(`• Sensibilidad cutánea: ${record.anamnesis.sensibilidadCutanea}`, 20, yPos);
      yPos += 6;
    }

    // Nueva página si es necesario
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }

    yPos += 4;

    // Estilo de Vida
    pdf.setFont('helvetica', 'bold');
    pdf.text('Estilo de Vida:', 14, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'normal');

    pdf.text(`• Exposición solar: ${record.anamnesis.exposicionSolar}`, 20, yPos);
    yPos += 6;
    pdf.text(`• Cabinas de bronceado: ${record.anamnesis.usoCabinas ? 'Sí' : 'No'}`, 20, yPos);
    yPos += 6;
    pdf.text(`• Tabaquismo: ${record.anamnesis.tabaquismo ? 'Sí' : 'No'}`, 20, yPos);
    yPos += 6;
    pdf.text(`• Nivel de estrés: ${record.anamnesis.nivelEstres}`, 20, yPos);
    yPos += 6;

    yPos += 10;
  }

  // Sesiones
  if (record.sesiones && record.sesiones.length > 0) {
    // Nueva página para sesiones
    pdf.addPage();
    yPos = 20;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(212, 175, 55);
    pdf.text('HISTORIAL DE SESIONES', 14, yPos);
    yPos += 10;

    record.sesiones.forEach((sesion, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Sesión ${index + 1} - ${sesion.fecha.toLocaleDateString('es-ES')}`, 14, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      pdf.text(`Motivo: ${sesion.motivoConsulta}`, 14, yPos);
      yPos += 6;

      if (sesion.condicionActual.length > 0) {
        pdf.text(`Diagnóstico: ${sesion.condicionActual.join(', ')}`, 14, yPos);
        yPos += 6;
      }

      const tratamientoLines = pdf.splitTextToSize(`Tratamiento: ${sesion.tratamientoRealizado}`, 180);
      pdf.text(tratamientoLines, 14, yPos);
      yPos += tratamientoLines.length * 6;

      if (sesion.productosUsados.length > 0) {
        pdf.text(`Productos: ${sesion.productosUsados.join(', ')}`, 14, yPos);
        yPos += 6;
      }

      // Medidas si existen
      if (sesion.medidas) {
        yPos += 4;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Medidas:', 14, yPos);
        yPos += 6;
        pdf.setFont('helvetica', 'normal');

        const medidas = [];
        if (sesion.medidas.peso) medidas.push(`Peso: ${sesion.medidas.peso}kg`);
        if (sesion.medidas.busto) medidas.push(`Busto: ${sesion.medidas.busto}cm`);
        if (sesion.medidas.cintura) medidas.push(`Cintura: ${sesion.medidas.cintura}cm`);
        if (sesion.medidas.cadera) medidas.push(`Cadera: ${sesion.medidas.cadera}cm`);

        pdf.text(medidas.join(' | '), 20, yPos);
        yPos += 6;
      }

      pdf.text(`Costo: ₡${sesion.costo.toLocaleString()} (${sesion.metodoPago})`, 14, yPos);
      yPos += 10;

      // Línea separadora
      pdf.setDrawColor(200, 200, 200);
      pdf.line(14, yPos, 196, yPos);
      yPos += 10;
    });
  }

  // Footer en todas las páginas
  const pageCount = pdf.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`SUNANDA Estética y Spa - Expediente ${record.clientName}`, 105, 285, { align: 'center' });
    pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }

  // Descargar
  pdf.save(`Expediente_${record.clientName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Generar PDF de una sesión específica
 */
export const generateSessionPDF = (record: MedicalRecord, session: SessionRecord) => {
  const pdf = new jsPDF();

  // Header
  pdf.setFillColor(212, 175, 55);
  pdf.rect(0, 0, 210, 35, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUNANDA', 105, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Estética y Spa', 105, 23, { align: 'center' });
  pdf.text('Reporte de Sesión', 105, 30, { align: 'center' });

  let yPos = 50;

  // Información
  pdf.setFontSize(10);
  pdf.text(`Paciente: ${record.clientName}`, 14, yPos);
  yPos += 6;
  pdf.text(`Fecha: ${session.fecha.toLocaleDateString('es-ES')}`, 14, yPos);
  yPos += 6;
  pdf.text(`Profesional: ${session.createdBy}`, 14, yPos);
  yPos += 15;

  // Contenido
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Motivo de Consulta:', 14, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const motivoLines = pdf.splitTextToSize(session.motivoConsulta, 180);
  pdf.text(motivoLines, 14, yPos);
  yPos += motivoLines.length * 6 + 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Diagnóstico:', 14, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(session.condicionActual.join(', '), 14, yPos);
  yPos += 12;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tratamiento Realizado:', 14, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const tratamientoLines = pdf.splitTextToSize(session.tratamientoRealizado, 180);
  pdf.text(tratamientoLines, 14, yPos);
  yPos += tratamientoLines.length * 6 + 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Productos Utilizados:', 14, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(session.productosUsados.join(', '), 14, yPos);
  yPos += 12;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recomendaciones:', 14, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const recomendacionesLines = pdf.splitTextToSize(session.recomendaciones, 180);
  pdf.text(recomendacionesLines, 14, yPos);
  yPos += recomendacionesLines.length * 6 + 15;

  // Costo
  pdf.setFillColor(248, 249, 250);
  pdf.rect(14, yPos, 180, 20, 'F');
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Total: ₡${session.costo.toLocaleString()}`, 20, yPos + 13);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Método de pago: ${session.metodoPago}`, 120, yPos + 13);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('SUNANDA Estética y Spa', 105, 285, { align: 'center' });
  pdf.text(`Reporte generado el ${new Date().toLocaleDateString('es-ES')}`, 105, 290, { align: 'center' });

  pdf.save(`Sesion_${record.clientName}_${session.fecha.toISOString().split('T')[0]}.pdf`);
};

/**
 * Generar PDF de consentimiento informado
 */
export const generateConsentPDF = (record: MedicalRecord) => {
  if (!record.consentimiento) return;

  const pdf = new jsPDF();

  // Header
  pdf.setFillColor(212, 175, 55);
  pdf.rect(0, 0, 210, 35, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUNANDA', 105, 15, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Estética y Spa', 105, 23, { align: 'center' });
  pdf.text('Consentimiento Informado', 105, 30, { align: 'center' });

  let yPos = 50;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const consentText = `Yo, ${record.clientName}, certifico que he recibido la explicación detallada del procedimiento estético a realizar, comprendo los beneficios esperados y he sido informado/a de los posibles riesgos y complicaciones asociados. Doy mi consentimiento de manera voluntaria y consciente para la realización del tratamiento.`;
  
  const lines = pdf.splitTextToSize(consentText, 180);
  pdf.text(lines, 14, yPos);
  yPos += lines.length * 6 + 15;

  pdf.setFont('helvetica', 'bold');
  pdf.text('Procedimiento:', 14, yPos);
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  const procLines = pdf.splitTextToSize(record.consentimiento.procedimiento, 180);
  pdf.text(procLines, 14, yPos);
  yPos += procLines.length * 6 + 10;

  pdf.setFont('helvetica', 'bold');
  pdf.text('Riesgos informados:', 14, yPos);
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  const riesgoLines = pdf.splitTextToSize(record.consentimiento.riesgos, 180);
  pdf.text(riesgoLines, 14, yPos);
  yPos += riesgoLines.length * 6 + 20;

  // Firma
  if (record.consentimiento.firmaUrl) {
    pdf.text('Firma del paciente:', 14, yPos);
    yPos += 10;
    // Aquí iría la imagen de la firma si está disponible
  }

  yPos += 20;
  pdf.text(`Fecha: ${record.consentimiento.fecha?.toLocaleDateString('es-ES') || '_______________'}`, 14, yPos);
  
  pdf.save(`Consentimiento_${record.clientName}.pdf`);
};
