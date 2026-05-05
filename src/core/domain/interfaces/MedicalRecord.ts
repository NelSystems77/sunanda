/**
 * Interfaz de Expediente Médico/Estético para SUNANDA
 */

export interface Anamnesis {
  // Salud General
  enfermedades: string[];
  problemaDermato: string[];
  embarazoLactancia: 'No' | 'Embarazo' | 'Lactancia';
  cirugiasRecientes: string;
  
  // Medicación
  medicamentosActuales: string;
  medicamentosPiel: string[];
  anticoagulantes: boolean;
  suplementos: string;
  
  // Alergias
  alergiasCosmeticos: string;
  reaccionesPrevias: string;
  sensibilidadCutanea: string;
  
  // Estilo de Vida
  exposicionSolar: string;
  usoCabinas: boolean;
  tabaquismo: boolean;
  consumoAlcohol: string;
  nivelEstres: 'Bajo' | 'Medio' | 'Alto';
  calidadSueno: string;
  
  // Rutina Actual
  productosUsados: string;
  frecuenciaLimpieza: string;
  activosUsados: string[];
  
  // Historial Estético
  tratamientosPrevios: string[];
  fechaUltimoTratamiento?: Date;
  experienciaTratamientos: string;
}

export interface Consentimiento {
  procedimiento: string;
  riesgos: string;
  firmaUrl?: string;
  fecha?: Date;
  representante?: string;
}

export interface Medidas {
  peso?: number;
  altura?: number;
  busto?: number;
  cintura?: number;
  cadera?: number;
  musloD?: number;
  musloI?: number;
  brazoD?: number;
  brazoI?: number;
  abdomen?: number;
}

export interface SessionRecord {
  id: string;
  fecha: Date;
  
  // Evaluación
  motivoConsulta: string;
  preocupacionesPrincipales: string[];
  expectativas: string;
  
  // Diagnóstico Profesional
  tipoPiel: string;
  fototipo: string;
  condicionActual: string[];
  observacionesClinicas: string;
  
  // Medidas (para corporales)
  medidas?: Medidas;
  
  // Tratamiento
  tratamientoRealizado: string;
  productosUsados: string[];
  recomendaciones: string;
  proximaSesion?: Date;
  
  // Fotos
  fotosAntes: string[];
  fotosDespues: string[];
  
  // Pago
  costo: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Sinpe';
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  clientId: string;
  clientName: string;
  
  // Datos principales
  anamnesis?: Anamnesis;
  consentimiento?: Consentimiento;
  sesiones: SessionRecord[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Catálogo de condiciones para diagnóstico
 */
export const CONDICIONES_PIEL = {
  FACIALES: [
    'Piel grasa',
    'Piel seca',
    'Piel mixta',
    'Piel sensible',
    'Piel deshidratada',
    'Acné',
    'Acné rosácea',
    'Rosácea',
    'Manchas solares',
    'Melasma',
    'Hiperpigmentación',
    'Arrugas finas',
    'Arrugas profundas',
    'Líneas de expresión',
    'Poros dilatados',
    'Puntos negros',
    'Flacidez facial',
    'Ojeras',
    'Bolsas',
  ],
  CORPORALES: [
    'Celulitis grado I',
    'Celulitis grado II',
    'Celulitis grado III',
    'Adiposidad localizada',
    'Flacidez cutánea',
    'Estrías rojas',
    'Estrías blancas',
    'Retención de líquidos',
    'Mala circulación',
    'Piel de naranja',
    'Nódulos adiposos',
  ],
};

export const ENFERMEDADES_COMUNES = [
  'Diabetes',
  'Hipotiroidismo',
  'Hipertiroidismo',
  'Hipertensión',
  'Problemas circulatorios',
  'Epilepsia',
  'Hepatitis',
  'VIH',
  'Cáncer',
  'Enfermedades autoinmunes',
];

export const MEDICAMENTOS_PIEL = [
  'Isotretinoína (Roacután)',
  'Antibióticos tópicos',
  'Antibióticos orales',
  'Corticoides tópicos',
  'Corticoides orales',
  'Retinoides tópicos',
  'Ácido retinoico',
  'Hidroquinona',
];

export const ACTIVOS_COSMETICOS = [
  'Ácido hialurónico',
  'Ácido glicólico',
  'Ácido salicílico',
  'Ácido mandélico',
  'Retinol',
  'Vitamina C',
  'Vitamina E',
  'Niacinamida',
  'Péptidos',
  'Colágeno',
];

export const TRATAMIENTOS_PREVIOS = [
  'Limpieza facial profunda',
  'Peeling químico',
  'Microdermoabrasión',
  'Láser facial',
  'Luz pulsada (IPL)',
  'Radiofrecuencia',
  'Toxina botulínica',
  'Rellenos dérmicos',
  'Mesoterapia facial',
  'Drenaje linfático',
  'Hidrolipoclasia',
  'Cavitación',
  'Presoterapia',
  'Masaje reductivo',
];

export const FOTOTIPOS = [
  'I - Muy clara, siempre se quema',
  'II - Clara, se quema fácilmente',
  'III - Media, se broncea gradualmente',
  'IV - Morena clara, raramente se quema',
  'V - Morena oscura, nunca se quema',
  'VI - Negra, muy pigmentada',
];

export const TIPOS_PIEL = [
  'Normal',
  'Grasa',
  'Seca',
  'Mixta',
  'Sensible',
  'Deshidratada',
  'Acneica',
  'Madura',
];
