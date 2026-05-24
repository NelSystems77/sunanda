/**
 * Script para crear servicios de SUNANDA en Firebase
 * 
 * Ejecutar en consola del navegador en claude.ai mientras estés logueado
 * O crear como función temporal en el código
 */

import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/core/infrastructure/firebase/config';

const serviciosSUNANDA = [
  // FACIALES
  {
    name: 'Limpieza Facial Básica',
    description: 'Limpieza profunda de cutis con extracción de puntos negros y mascarilla nutritiva',
    category: 'FACIAL',
    duration: 60,
    price: 25000,
    isActive: true,
    imageUrl: '',
    benefits: ['Piel limpia', 'Poros reducidos', 'Piel radiante'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Glow Force Máscara Iluminadora',
    description: 'Timexpert Radiance C+ · Piel perfecta en 15 minutos. Luminosa, firme y radiante con Vitamina C Pura. Anti-fatiga, anti-manchas, estimula actividad celular.',
    category: 'FACIAL',
    duration: 15,
    price: 55000,
    isActive: true,
    imageUrl: '/assets/images/landing/timexpert-radiance.jpg',
    benefits: ['Luminosidad extraordinaria', 'Anti-manchas y anti-fatiga', 'Vitamina C Pura · HLG Patented'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Hydraluronic Máscara Extra-Hidratante',
    description: 'Timexpert Hydraluronic · Hidratación suprema en 15 minutos. Textura rica y cremosa que se transforma en aceite nutritivo. HA triple peso molecular + nanopolímero HLG patentado.',
    category: 'FACIAL',
    duration: 15,
    price: 55000,
    isActive: true,
    imageUrl: '/assets/images/landing/timexpert-hydraluronic.png',
    benefits: ['Hidratación suprema e intensa', 'HA triple peso molecular + HLG Patented', 'Piel jugosa, radiante y reconfortada'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Limpieza Facial Profunda',
    description: 'Protocolo completo: desmaquillado, exfoliación, tónico, aparatología, activo, masaje, mascarilla, sellante y bloqueador según condición de piel',
    category: 'FACIAL',
    duration: 60,
    price: 20000,
    isActive: true,
    imageUrl: '',
    benefits: ['Desmaquillado profesional', 'Aparatología según condición', 'Mascarilla y sellante'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Piel Grasa',
    description: 'Tratamiento especializado para controlar la producción de sebo y reducir brillos',
    category: 'FACIAL',
    duration: 75,
    price: 30000,
    isActive: true,
    imageUrl: '',
    benefits: ['Control de grasa', 'Poros refinados', 'Piel mate'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Piel Seca',
    description: 'Hidratación intensiva y nutrición para pieles secas y deshidratadas',
    category: 'FACIAL',
    duration: 75,
    price: 30000,
    isActive: true,
    imageUrl: '',
    benefits: ['Hidratación profunda', 'Suavidad', 'Confort'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Piel Deshidratada',
    description: 'Tratamiento de choque para devolver la hidratación a la piel',
    category: 'FACIAL',
    duration: 75,
    price: 32000,
    isActive: true,
    imageUrl: '',
    benefits: ['Rehidratación', 'Elasticidad', 'Luminosidad'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Piel Sensible',
    description: 'Cuidado suave para pieles sensibles y reactivas con productos hipoalergénicos',
    category: 'FACIAL',
    duration: 75,
    price: 32000,
    isActive: true,
    imageUrl: '',
    benefits: ['Calma irritación', 'Fortalece la piel', 'Sin rojeces'],
    productLines: ['Germaine de Capuccini'],
  },

  // CORPORALES
  {
    name: 'Hidrolipoclasia',
    description: 'Tratamiento reductivo avanzado que combina drenaje y reducción de grasa localizada',
    category: 'CORPORAL',
    duration: 90,
    price: 45000,
    isActive: true,
    imageUrl: '',
    benefits: ['Reducción de medidas', 'Eliminación de toxinas', 'Piel tonificada'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Drenaje Linfático',
    description: 'Masaje especializado para eliminar toxinas y reducir retención de líquidos',
    category: 'CORPORAL',
    duration: 60,
    price: 35000,
    isActive: true,
    imageUrl: '',
    benefits: ['Desintoxicación', 'Reduce hinchazón', 'Mejora circulación'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamientos Reductivos',
    description: 'Sesiones intensivas para reducción de medidas y modelado corporal',
    category: 'CORPORAL',
    duration: 90,
    price: 40000,
    isActive: true,
    imageUrl: '',
    benefits: ['Pérdida de centímetros', 'Piel firme', 'Silueta definida'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Adiposidad Localizada',
    description: 'Tratamiento focalizado en zonas específicas con acumulación de grasa',
    category: 'CORPORAL',
    duration: 75,
    price: 38000,
    isActive: true,
    imageUrl: '',
    benefits: ['Reducción localizada', 'Mejora contorno', 'Piel suave'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Celulitis',
    description: 'Tratamiento completo anti-celulítico con técnicas de masaje y productos específicos',
    category: 'CORPORAL',
    duration: 75,
    price: 38000,
    isActive: true,
    imageUrl: '',
    benefits: ['Reduce piel de naranja', 'Mejora textura', 'Circulación mejorada'],
    productLines: ['Germaine de Capuccini'],
  },
  {
    name: 'Tratamiento para Flacidez',
    description: 'Reafirmación y tonificación de piel con pérdida de firmeza',
    category: 'CORPORAL',
    duration: 75,
    price: 38000,
    isActive: true,
    imageUrl: '',
    benefits: ['Piel firme', 'Efecto lifting', 'Elasticidad'],
    productLines: ['Germaine de Capuccini'],
  },

  // PAQUETES
  {
    name: 'Paquete Novia',
    description: 'Preparación completa para el día especial: faciales, corporales y manos',
    category: 'PAQUETE',
    duration: 180,
    price: 85000,
    isActive: true,
    imageUrl: '',
    benefits: ['Piel radiante', 'Cuerpo tonificado', 'Relajación total'],
    productLines: ['Germaine de Capuccini'],
    promotionPrice: 75000,
  },
  {
    name: 'Paquete Bienestar',
    description: 'Combo de tratamientos facial y corporal para bienestar integral',
    category: 'PAQUETE',
    duration: 150,
    price: 65000,
    isActive: true,
    imageUrl: '',
    benefits: ['Renovación completa', 'Desintoxicación', 'Armonía'],
    productLines: ['Germaine de Capuccini'],
    promotionPrice: 58000,
  },
  {
    name: 'Paquete Premium',
    description: 'Experiencia de lujo con los mejores tratamientos faciales y corporales',
    category: 'PAQUETE',
    duration: 240,
    price: 120000,
    isActive: true,
    imageUrl: '',
    benefits: ['Experiencia VIP', 'Resultados visibles', 'Relajación profunda'],
    productLines: ['Germaine de Capuccini'],
    promotionPrice: 105000,
  },
];

export async function crearServiciosSUNANDA() {
  console.log('🚀 Iniciando creación de servicios SUNANDA...');
  
  const servicesCollection = collection(db, 'services');
  let createdCount = 0;
  let errorCount = 0;

  for (const servicio of serviciosSUNANDA) {
    try {
      const serviceData = {
        ...servicio,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(servicesCollection, serviceData);
      console.log(`✅ Creado: ${servicio.name} (ID: ${docRef.id})`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creando ${servicio.name}:`, error);
      errorCount++;
    }
  }

  console.log(`
    🎉 Proceso completado!
    ✅ Servicios creados: ${createdCount}
    ❌ Errores: ${errorCount}
  `);

  return { createdCount, errorCount };
}

// Para ejecutar en desarrollo:
// Agregar botón temporal o ejecutar desde consola del navegador
