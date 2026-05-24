import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/core/infrastructure/firebase/config';

// Conversión USD a CRC (aproximada)
const USD_TO_CRC = 530;

const serviciosSUNANDA = [
  // FACIALES
  {
    name: 'Limpieza Facial Básica',
    description: 'Limpieza profunda de cutis con extracción de puntos negros y mascarilla nutritiva',
    category: 'FACIAL',
    duration: 60,
    priceCRC: 25000,
    priceUSD: Math.round(25000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Piel limpia', 'Poros reducidos', 'Piel radiante'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Glow Force Máscara Iluminadora',
    description: 'Timexpert Radiance C+ · Luminosa, firme y radiante con Vitamina C Pura. Anti-fatiga, anti-manchas, estimula actividad celular.',
    category: 'FACIAL',
    duration: 90,
    priceCRC: 55000,
    priceUSD: Math.round(55000 / USD_TO_CRC),
    isActive: true,
    imageURL: '/assets/images/landing/timexpert-radiance.jpg',
    benefits: ['Luminosidad extraordinaria', 'Anti-manchas y anti-fatiga', 'Vitamina C Pura · HLG Patented'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Hydraluronic Máscara Extra-Hidratante',
    description: 'Timexpert Hydraluronic · Hidratación suprema. Textura rica y cremosa que se transforma en aceite nutritivo. HA triple peso molecular + nanopolímero HLG patentado.',
    category: 'FACIAL',
    duration: 90,
    priceCRC: 55000,
    priceUSD: Math.round(55000 / USD_TO_CRC),
    isActive: true,
    imageURL: '/assets/images/landing/timexpert-hydraluronic.png',
    benefits: ['Hidratación suprema e intensa', 'HA triple peso molecular + HLG Patented', 'Piel jugosa, radiante y reconfortada'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Expert Lab Peeling Químico',
    description: 'Expert Lab · Peeling químico de alta gama, uso estricto profesional. Tres variantes: Equilibrante (pieles grasas/acné), Antiedad (estimula colágeno, reduce arrugas), Flash (luminosidad e hidratación inmediatas). 5% Mandelic Acid + 5% Lactobionic Acid.',
    category: 'FACIAL',
    duration: 90,
    priceCRC: 55000,
    priceUSD: Math.round(55000 / USD_TO_CRC),
    isActive: true,
    imageURL: '/assets/images/landing/expert-lab-flash-peel.jpg',
    benefits: ['Peeling Equilibrante · pieles grasas o con acné', 'Peeling Antiedad · estimula colágeno y firmeza', 'Peeling Flash · luminosidad e hidratación inmediatas'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Limpieza Facial Profunda',
    description: 'Protocolo completo: desmaquillado, exfoliación, tónico, aparatología, activo, masaje, mascarilla, sellante y bloqueador según condición de piel',
    category: 'FACIAL',
    duration: 60,
    priceCRC: 20000,
    priceUSD: Math.round(20000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Desmaquillado profesional', 'Aparatología según condición', 'Mascarilla y sellante'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Piel Grasa',
    description: 'Tratamiento especializado para controlar la producción de sebo y reducir brillos',
    category: 'FACIAL',
    duration: 75,
    priceCRC: 30000,
    priceUSD: Math.round(30000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Control de grasa', 'Poros refinados', 'Piel mate'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Piel Seca',
    description: 'Hidratación intensiva y nutrición para pieles secas y deshidratadas',
    category: 'FACIAL',
    duration: 75,
    priceCRC: 30000,
    priceUSD: Math.round(30000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Hidratación profunda', 'Suavidad', 'Confort'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Piel Deshidratada',
    description: 'Tratamiento de choque para devolver la hidratación a la piel',
    category: 'FACIAL',
    duration: 75,
    priceCRC: 32000,
    priceUSD: Math.round(32000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Rehidratación', 'Elasticidad', 'Luminosidad'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Piel Sensible',
    description: 'Cuidado suave para pieles sensibles y reactivas con productos hipoalergénicos',
    category: 'FACIAL',
    duration: 75,
    priceCRC: 32000,
    priceUSD: Math.round(32000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Calma irritación', 'Fortalece la piel', 'Sin rojeces'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  // CORPORALES
  {
    name: 'Hidrolipoclasia',
    description: 'Tratamiento reductivo avanzado que combina drenaje y reducción de grasa localizada',
    category: 'CORPORAL',
    duration: 90,
    priceCRC: 45000,
    priceUSD: Math.round(45000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Reducción de medidas', 'Eliminación de toxinas', 'Piel tonificada'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Drenaje Linfático',
    description: 'Masaje especializado para eliminar toxinas y reducir retención de líquidos',
    category: 'CORPORAL',
    duration: 60,
    priceCRC: 35000,
    priceUSD: Math.round(35000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Desintoxicación', 'Reduce hinchazón', 'Mejora circulación'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamientos Reductivos',
    description: 'Sesiones intensivas para reducción de medidas y modelado corporal',
    category: 'CORPORAL',
    duration: 90,
    priceCRC: 40000,
    priceUSD: Math.round(40000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Pérdida de centímetros', 'Piel firme', 'Silueta definida'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Adiposidad Localizada',
    description: 'Tratamiento focalizado en zonas específicas con acumulación de grasa',
    category: 'CORPORAL',
    duration: 75,
    priceCRC: 38000,
    priceUSD: Math.round(38000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Reducción localizada', 'Mejora contorno', 'Piel suave'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Celulitis',
    description: 'Tratamiento completo anti-celulítico con técnicas de masaje y productos específicos',
    category: 'CORPORAL',
    duration: 75,
    priceCRC: 38000,
    priceUSD: Math.round(38000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Reduce piel de naranja', 'Mejora textura', 'Circulación mejorada'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  {
    name: 'Tratamiento para Flacidez',
    description: 'Reafirmación y tonificación de piel con pérdida de firmeza',
    category: 'CORPORAL',
    duration: 75,
    priceCRC: 38000,
    priceUSD: Math.round(38000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Piel firme', 'Efecto lifting', 'Elasticidad'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: false,
  },
  // PAQUETES
  {
    name: 'Paquete Novia',
    description: 'Preparación completa para el día especial: faciales, corporales y manos',
    category: 'PAQUETE',
    duration: 180,
    priceCRC: 85000,
    priceUSD: Math.round(85000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Piel radiante', 'Cuerpo tonificado', 'Relajación total'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: true,
    promotionType: 'percentage',
    promotionValue: 12, // 85000 - 12% = 75000
  },
  {
    name: 'Paquete Bienestar',
    description: 'Combo de tratamientos facial y corporal para bienestar integral',
    category: 'PAQUETE',
    duration: 150,
    priceCRC: 65000,
    priceUSD: Math.round(65000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Renovación completa', 'Desintoxicación', 'Armonía'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: true,
    promotionType: 'percentage',
    promotionValue: 11, // 65000 - 11% ≈ 58000
  },
  {
    name: 'Paquete Premium',
    description: 'Experiencia de lujo con los mejores tratamientos faciales y corporales',
    category: 'PAQUETE',
    duration: 240,
    priceCRC: 120000,
    priceUSD: Math.round(120000 / USD_TO_CRC),
    isActive: true,
    imageURL: '',
    benefits: ['Experiencia VIP', 'Resultados visibles', 'Relajación profunda'],
    productLines: ['Germaine de Capuccini'],
    hasPromotion: true,
    promotionType: 'percentage',
    promotionValue: 13, // 120000 - 13% ≈ 105000
  },
];

async function crearServiciosSUNANDA() {
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

export function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCrearServicios = async () => {
    setLoading(true);
    try {
      const res = await crearServiciosSUNANDA();
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Setup SUNANDA</h1>
        
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">⚠️ Importante</h2>
            <p className="text-red-400 text-sm mb-4">
              Si ya ejecutaste esto antes, primero ELIMINA todos los servicios antiguos en Firebase Console.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Crear Servicios</h2>
            <p className="text-dark-300 mb-4">
              Esto creará 18 servicios en Firebase con campos corregidos (priceCRC y priceUSD).
            </p>
          </div>

          <Button
            onClick={handleCrearServicios}
            isLoading={loading}
            variant="primary"
          >
            Crear 18 Servicios en Firebase
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded">
              <p className="text-green-400">
                ✅ Creados: {result.createdCount} servicios
              </p>
              {result.errorCount > 0 && (
                <p className="text-red-400">❌ Errores: {result.errorCount}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
