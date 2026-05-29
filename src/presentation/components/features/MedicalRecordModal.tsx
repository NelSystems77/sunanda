import { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useAuth } from '../../hooks/useAuth';
import { useMobileDetect } from '../../hooks/useMobileDetect';
import { MedicalRecord, Anamnesis, Consentimiento, SessionRecord, CONDICIONES_PIEL, ENFERMEDADES_COMUNES } from '@/core/domain/interfaces/MedicalRecord';
import { generateMedicalRecordPDF, generateSessionPDF, generateConsentPDF } from '@/shared/utils/pdfGenerator';
import { X, Save, FileText, Printer, Upload, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import { cn } from '@/shared/utils';

interface MedicalRecordModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

type Tab = 'anamnesis' | 'consentimiento' | 'atencion' | 'historial';

// Aplanar CONDICIONES_PIEL para búsquedas
const CONDICIONES_PIEL_FLAT = [
  ...(CONDICIONES_PIEL.FACIALES || []),
  ...(CONDICIONES_PIEL.CORPORALES || []),
];

export function MedicalRecordModal({ clientId, clientName, onClose }: MedicalRecordModalProps) {
  const { user } = useAuth();
  const { isMobile } = useMobileDetect();
  const { getByClientId, create, saveAnamnesis, saveConsentimiento, addSession, deleteSession, uploadImage, uploadSignature } = useMedicalRecords();
  
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('anamnesis');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingSessionId] = useState<string | null>(null);
  
  // ← NUEVO: Estados para acordeón mobile
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    enfermedades: true,
    embarazo: false,
    medicamentos: false,
    alergias: false,
    solar: false,
    habitos: false,
    rutina: false,
    tratamientos: false,
  });
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Estados de formulario (mantener igual)
  const [anamnesis, setAnamnesis] = useState<Anamnesis>({
    enfermedades: [],
    problemaDermato: [],
    embarazoLactancia: 'No',
    cirugiasRecientes: '',
    medicamentosActuales: '',
    medicamentosPiel: [],
    anticoagulantes: false,
    suplementos: '',
    alergiasCosmeticos: '',
    reaccionesPrevias: '',
    sensibilidadCutanea: '',
    exposicionSolar: '',
    usoCabinas: false,
    tabaquismo: false,
    consumoAlcohol: '',
    nivelEstres: 'Medio',
    calidadSueno: '',
    productosUsados: '',
    frecuenciaLimpieza: '',
    activosUsados: [],
    tratamientosPrevios: [],
    experienciaTratamientos: '',
  });

  const [consentimiento, setConsentimiento] = useState<Consentimiento>({
    procedimiento: '',
    riesgos: '',
    representante: '',
  });

  const [session, setSession] = useState<Partial<SessionRecord>>({
    fecha: new Date(),
    motivoConsulta: '',
    preocupacionesPrincipales: [],
    expectativas: '',
    tipoPiel: '',
    fototipo: '',
    condicionActual: [],
    observacionesClinicas: '',
    medidas: {},
    tratamientoRealizado: '',
    productosUsados: [],
    recomendaciones: '',
    fotosAntes: [],
    fotosDespues: [],
    costo: 0,
    metodoPago: 'Efectivo',
    createdBy: user?.email || '',
  });

  const [busquedaDiag, setBusquedaDiag] = useState('');
  const [sugerenciasDiag, setSugerenciasDiag] = useState<string[]>([]);

  // ← NUEVO: Toggle de sección en mobile
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Cargar expediente
  useEffect(() => {
    loadRecord();
  }, [clientId]);

  // Scroll al tope al cambiar tab
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      let data = await getByClientId(clientId);
      
      if (!data) {
        const newRecord = await create(clientId, clientName);
        if (newRecord) {
          data = newRecord;
          toast.success('Expediente creado automáticamente');
        }
      }
      
      if (data) {
        setRecord(data);
        if (data.anamnesis) setAnamnesis(data.anamnesis);
        if (data.consentimiento) setConsentimiento(data.consentimiento);
        
        if (data.sesiones?.length === 0) {
          setActiveTab('anamnesis');
          toast('Primera visita - Complete la anamnesis del paciente', { duration: 5000 });
        } else {
          setActiveTab('atencion');
          toast(`Paciente recurrente - ${data.sesiones.length} sesiones previas`, { duration: 3000 });
        }
      }
    } catch (error) {
      console.error('Error loading record:', error);
      toast.error('Error al cargar expediente');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnamnesis = async () => {
    setSaving(true);
    try {
      const success = await saveAnamnesis(clientId, anamnesis);
      if (success) {
        setActiveTab('consentimiento');
        await loadRecord();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConsentimiento = async () => {
    if (sigCanvas.current && !consentimiento.firmaUrl) {
      if (sigCanvas.current.isEmpty()) {
        toast.error('Por favor firme el consentimiento');
        return;
      }
      const dataUrl = sigCanvas.current.toDataURL();
      const url = await uploadSignature(dataUrl, clientId);
      if (url) {
        consentimiento.firmaUrl = url;
      }
    }

    setSaving(true);
    try {
      const success = await saveConsentimiento(clientId, consentimiento);
      if (success) {
        setActiveTab('atencion');
        await loadRecord();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSession = async () => {
    if (!session.motivoConsulta || !session.tratamientoRealizado) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    setSaving(true);
    try {
      const success = await addSession(clientId, session as Omit<SessionRecord, 'id' | 'createdAt' | 'updatedAt'>);
      if (success) {
        await loadRecord();
        setActiveTab('historial');
        setSession({
          fecha: new Date(),
          motivoConsulta: '',
          preocupacionesPrincipales: [],
          expectativas: '',
          tipoPiel: '',
          fototipo: '',
          condicionActual: [],
          observacionesClinicas: '',
          medidas: {},
          tratamientoRealizado: '',
          productosUsados: [],
          recomendaciones: '',
          fotosAntes: [],
          fotosDespues: [],
          costo: 0,
          metodoPago: 'Efectivo',
          createdBy: user?.email || '',
        });
        toast.success('Sesión guardada correctamente');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>, type: 'antes' | 'despues') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user?.id) {
      toast.error('Usuario no autenticado');
      return;
    }

    // Usar el ID de sesión actual o uno temporal basado en timestamp
    const sessionId = editingSessionId || `new_${Date.now()}`;

    setUploadingPhoto(true);
    try {
      const url = await uploadImage(file, clientId, sessionId, type);
      if (url) {
        if (type === 'antes') {
          setSession(prev => ({ ...prev, fotosAntes: [...(prev.fotosAntes || []), url] }));
        } else {
          setSession(prev => ({ ...prev, fotosDespues: [...(prev.fotosDespues || []), url] }));
        }
        toast.success(`Foto ${type === 'antes' ? 'antes' : 'después'} subida`);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al subir imagen');
    } finally {
      setUploadingPhoto(false);
      // Limpiar el input para permitir subir el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  const handleBuscarDiagnostico = (busqueda: string) => {
    setBusquedaDiag(busqueda);
    if (busqueda.trim().length < 2) {
      setSugerenciasDiag([]);
      return;
    }
    const sugerencias = CONDICIONES_PIEL_FLAT.filter((c: string) => 
      c.toLowerCase().includes(busqueda.toLowerCase())
    ).slice(0, 5);
    setSugerenciasDiag(sugerencias);
  };

  const agregarDiagnostico = (diag: string) => {
    if (!session.condicionActual?.includes(diag)) {
      setSession(prev => ({
        ...prev,
        condicionActual: [...(prev.condicionActual || []), diag]
      }));
    }
    setBusquedaDiag('');
    setSugerenciasDiag([]);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('¿Está seguro de eliminar esta sesión?')) return;
    
    const success = await deleteSession(clientId, sessionId);
    if (success) {
      await loadRecord();
    }
  };

  // ← NUEVO: Componente de sección colapsable para mobile
  const CollapsibleSection = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-700 transition-colors"
        >
          <span className="font-semibold text-white">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-dark-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-dark-700 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const TABS = [
    { id: 'anamnesis',      label: 'Anamnesis',      description: 'Historia clínica',  icon: '📋' },
    { id: 'consentimiento', label: 'Consentimiento', description: 'Autorización',       icon: '✍️' },
    { id: 'atencion',       label: 'Atención',        description: 'Registro sesión',   icon: '🩺' },
    { id: 'historial',      label: 'Historial',       description: 'Sesiones previas',  icon: '📚' },
  ];

  const isStepComplete = (tabId: string) => {
    if (!record) return false;
    if (tabId === 'anamnesis') return !!record.anamnesis;
    if (tabId === 'consentimiento') return !!(record.consentimiento?.firmaUrl || record.consentimiento?.procedimiento);
    return !!(record.sesiones?.length);
  };

  const completedSteps = useMemo(() => {
    if (!record) return 0;
    return [
      !!record.anamnesis,
      !!(record.consentimiento?.firmaUrl || record.consentimiento?.procedimiento),
      !!(record.sesiones?.length),
    ].filter(Boolean).length;
  }, [record]);
  const progress = Math.round((completedSteps / 3) * 100);

  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose} size={isMobile ? 'full' : 'xl'}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        </div>
      </Modal>
    );
  }

  if (!record) {
    return (
      <Modal isOpen={true} onClose={onClose} size={isMobile ? 'full' : 'xl'}>
        <div className="text-center py-12">
          <p className="text-dark-400">No se pudo cargar el expediente</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size={isMobile ? 'full' : 'xl'}
      className={isMobile ? 'p-0 m-0 max-h-screen' : ''}
    >
      <div className={cn('flex', isMobile ? 'flex-col h-full' : 'h-[min(85vh,720px)]')}>

        {/* NAVEGACIÓN */}
        {isMobile ? (
          /* Mobile: barra de tabs compacta sticky */
          <div className="sticky top-0 z-20 bg-dark-900 border-b border-dark-700 px-4 py-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap min-w-[90px]',
                      activeTab === tab.id
                        ? 'bg-gold-500 text-dark-900'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={() => generateMedicalRecordPDF(record)}
                  className="p-2 text-dark-400 hover:text-gold-400 transition-colors"
                  title="PDF"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-dark-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-1 h-0.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-gold-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          /* Desktop: sidebar izquierdo integrado */
          <aside className="w-52 flex-shrink-0 bg-dark-800 border-r border-dark-700 flex flex-col">
            <div className="p-5 pb-4 border-b border-dark-700">
              <p className="text-xs text-dark-500 uppercase tracking-wide mb-1">Expediente</p>
              <h2 className="font-bold text-white text-base leading-snug">{clientName}</h2>
              <p className="text-dark-500 text-xs mt-0.5">ID: {clientId}</p>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all group border',
                    activeTab === tab.id
                      ? 'bg-gold-500/10 border-gold-500/30'
                      : 'border-transparent hover:bg-dark-700'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                    isStepComplete(tab.id) && activeTab === tab.id
                      ? 'bg-gold-500 text-dark-900'
                      : isStepComplete(tab.id)
                        ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                        : activeTab === tab.id
                          ? 'bg-dark-700 text-gold-400 border border-gold-500/50'
                          : 'bg-dark-700 text-dark-500'
                  )}>
                    {isStepComplete(tab.id) ? '✓' : (index + 1)}
                  </div>
                  <div>
                    <div className={cn(
                      'text-sm font-semibold leading-tight',
                      activeTab === tab.id ? 'text-white' : 'text-dark-300 group-hover:text-white'
                    )}>
                      {tab.label}
                    </div>
                    <div className="text-xs text-dark-500 mt-0.5">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-dark-700 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-dark-500">{completedSteps}/3 completados</span>
                  <span className="text-gold-400 font-medium">{progress}%</span>
                </div>
                <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => generateMedicalRecordPDF(record)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-dark-400 hover:text-gold-400 border border-dark-700 hover:border-gold-500/30 rounded-lg transition-all"
                  title="Descargar PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-dark-400 hover:text-white border border-dark-700 hover:border-dark-500 rounded-lg transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Cerrar
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* CONTENIDO */}
        <div
          ref={panelRef}
          className={cn(
            'overflow-y-auto flex-1',
            isMobile ? 'px-4 pt-4 pb-8' : 'p-6 pt-4'
          )}
        >
        {/* ANAMNESIS */}
        {activeTab === 'anamnesis' && (
          <div className="space-y-4">
            <h3 className={cn(
              'font-bold text-white',
              isMobile ? 'text-lg' : 'text-2xl'
            )}>
              Anamnesis
            </h3>

            {isMobile ? (
              // ← MOBILE: Vista con acordeón
              <>
                <CollapsibleSection id="enfermedades" title="Enfermedades y Condiciones">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Enfermedades Médicas
                    </label>
                    <div className={cn(
                      "grid gap-3",
                      isMobile ? "grid-cols-1" : "grid-cols-2"
                    )}>
                      {ENFERMEDADES_COMUNES.map(enf => (
                        <label 
                          key={enf} 
                          className={cn(
                            "flex items-start gap-3 text-dark-300 p-3 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors cursor-pointer",
                            anamnesis.enfermedades.includes(enf) && "bg-gold-500/10 border-gold-500/30"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={anamnesis.enfermedades.includes(enf)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnamnesis({ ...anamnesis, enfermedades: [...anamnesis.enfermedades, enf] });
                              } else {
                                setAnamnesis({ ...anamnesis, enfermedades: anamnesis.enfermedades.filter(x => x !== enf) });
                              }
                            }}
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm leading-relaxed flex-1">{enf}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Problemas Dermatológicos
                    </label>
                    <div className={cn(
                      "grid gap-3",
                      isMobile ? "grid-cols-1" : "grid-cols-2"
                    )}>
                      {CONDICIONES_PIEL_FLAT.slice(0, 8).map((cond: string) => (
                        <label 
                          key={cond} 
                          className={cn(
                            "flex items-start gap-3 text-dark-300 p-3 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors cursor-pointer",
                            anamnesis.problemaDermato.includes(cond) && "bg-gold-500/10 border-gold-500/30"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={anamnesis.problemaDermato.includes(cond)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnamnesis({ ...anamnesis, problemaDermato: [...anamnesis.problemaDermato, cond] });
                              } else {
                                setAnamnesis({ ...anamnesis, problemaDermato: anamnesis.problemaDermato.filter(x => x !== cond) });
                              }
                            }}
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-sm leading-relaxed flex-1">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="embarazo" title="Embarazo y Cirugías">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      ¿Embarazo o Lactancia?
                    </label>
                    <select
                      value={anamnesis.embarazoLactancia}
                      onChange={(e) => setAnamnesis({ ...anamnesis, embarazoLactancia: e.target.value as 'No' | 'Embarazo' | 'Lactancia' })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                    >
                      <option value="No">No</option>
                      <option value="Embarazo">Embarazo</option>
                      <option value="Lactancia">Lactancia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Cirugías Recientes
                    </label>
                    <textarea
                      value={anamnesis.cirugiasRecientes}
                      onChange={(e) => setAnamnesis({ ...anamnesis, cirugiasRecientes: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      rows={3}
                      placeholder="Describa las cirugías..."
                    />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="medicamentos" title="Medicamentos">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Medicamentos Actuales
                    </label>
                    <textarea
                      value={anamnesis.medicamentosActuales}
                      onChange={(e) => setAnamnesis({ ...anamnesis, medicamentosActuales: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      rows={3}
                      placeholder="Liste los medicamentos..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={anamnesis.anticoagulantes}
                        onChange={(e) => setAnamnesis({ ...anamnesis, anticoagulantes: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">¿Toma anticoagulantes?</span>
                    </label>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="alergias" title="Alergias y Sensibilidad">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Alergias a Cosméticos
                    </label>
                    <textarea
                      value={anamnesis.alergiasCosmeticos}
                      onChange={(e) => setAnamnesis({ ...anamnesis, alergiasCosmeticos: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      rows={2}
                      placeholder="Describa alergias..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Sensibilidad Cutánea
                    </label>
                    <input
                      type="text"
                      value={anamnesis.sensibilidadCutanea}
                      onChange={(e) => setAnamnesis({ ...anamnesis, sensibilidadCutanea: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      placeholder="Describa sensibilidad..."
                    />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="solar" title="Exposición Solar">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Exposición Solar
                    </label>
                    <input
                      type="text"
                      value={anamnesis.exposicionSolar}
                      onChange={(e) => setAnamnesis({ ...anamnesis, exposicionSolar: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      placeholder="Frecuencia y protección..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={anamnesis.usoCabinas}
                        onChange={(e) => setAnamnesis({ ...anamnesis, usoCabinas: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">¿Usa cabinas de bronceado?</span>
                    </label>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="habitos" title="Hábitos de Vida">
                  <div>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={anamnesis.tabaquismo}
                        onChange={(e) => setAnamnesis({ ...anamnesis, tabaquismo: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">Fumador/a</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Consumo de Alcohol
                    </label>
                    <input
                      type="text"
                      value={anamnesis.consumoAlcohol}
                      onChange={(e) => setAnamnesis({ ...anamnesis, consumoAlcohol: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      placeholder="Frecuencia..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nivel de Estrés
                    </label>
                    <select
                      value={anamnesis.nivelEstres}
                      onChange={(e) => setAnamnesis({ ...anamnesis, nivelEstres: e.target.value as 'Bajo' | 'Medio' | 'Alto' })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                    </select>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="rutina" title="Rutina de Cuidado">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Productos Usados
                    </label>
                    <textarea
                      value={anamnesis.productosUsados}
                      onChange={(e) => setAnamnesis({ ...anamnesis, productosUsados: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      rows={3}
                      placeholder="Liste productos actuales..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Frecuencia de Limpieza
                    </label>
                    <input
                      type="text"
                      value={anamnesis.frecuenciaLimpieza}
                      onChange={(e) => setAnamnesis({ ...anamnesis, frecuenciaLimpieza: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      placeholder="Ej: Dos veces al día"
                    />
                  </div>
                </CollapsibleSection>

                <CollapsibleSection id="tratamientos" title="Tratamientos Previos">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Experiencia con Tratamientos
                    </label>
                    <textarea
                      value={anamnesis.experienciaTratamientos}
                      onChange={(e) => setAnamnesis({ ...anamnesis, experienciaTratamientos: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-lg text-base"
                      rows={3}
                      placeholder="Describa tratamientos anteriores..."
                    />
                  </div>
                </CollapsibleSection>

                {/* Botón guardar mobile - Inline al final del formulario */}
                <div className="mt-6 mb-4">
                  <Button
                    variant="primary"
                    onClick={handleSaveAnamnesis}
                    isLoading={saving}
                    className="w-full h-12 text-base"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Continuar a Consentimiento
                  </Button>
                </div>
              </>
            ) : (
              // ← DESKTOP: Vista completa en grid
              <div className="space-y-6 max-w-4xl">

                {/* Fila 1: Enfermedades + Problemas dermatológicos */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-3">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Enfermedades Médicas
                    </h4>
                    <div className="space-y-2">
                      {ENFERMEDADES_COMUNES.map(enf => (
                        <label key={enf} className="flex items-center gap-2 text-dark-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={anamnesis.enfermedades.includes(enf)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnamnesis({ ...anamnesis, enfermedades: [...anamnesis.enfermedades, enf] });
                              } else {
                                setAnamnesis({ ...anamnesis, enfermedades: anamnesis.enfermedades.filter(x => x !== enf) });
                              }
                            }}
                            className="w-4 h-4 accent-gold-500"
                          />
                          <span className="text-sm">{enf}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-3">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Problemas Dermatológicos
                    </h4>
                    <div className="space-y-2">
                      {CONDICIONES_PIEL_FLAT.slice(0, 8).map((cond: string) => (
                        <label key={cond} className="flex items-center gap-2 text-dark-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={anamnesis.problemaDermato.includes(cond)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnamnesis({ ...anamnesis, problemaDermato: [...anamnesis.problemaDermato, cond] });
                              } else {
                                setAnamnesis({ ...anamnesis, problemaDermato: anamnesis.problemaDermato.filter(x => x !== cond) });
                              }
                            }}
                            className="w-4 h-4 accent-gold-500"
                          />
                          <span className="text-sm">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fila 2: Embarazo/Cirugías + Medicamentos */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Embarazo y Cirugías
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        ¿Embarazo o Lactancia?
                      </label>
                      <select
                        value={anamnesis.embarazoLactancia}
                        onChange={(e) => setAnamnesis({ ...anamnesis, embarazoLactancia: e.target.value as 'No' | 'Embarazo' | 'Lactancia' })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                      >
                        <option value="No">No</option>
                        <option value="Embarazo">Embarazo</option>
                        <option value="Lactancia">Lactancia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Cirugías Recientes
                      </label>
                      <textarea
                        value={anamnesis.cirugiasRecientes}
                        onChange={(e) => setAnamnesis({ ...anamnesis, cirugiasRecientes: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={3}
                        placeholder="Describa las cirugías..."
                      />
                    </div>
                  </div>

                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Medicamentos
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Medicamentos Actuales
                      </label>
                      <textarea
                        value={anamnesis.medicamentosActuales}
                        onChange={(e) => setAnamnesis({ ...anamnesis, medicamentosActuales: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={3}
                        placeholder="Liste los medicamentos..."
                      />
                    </div>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anamnesis.anticoagulantes}
                        onChange={(e) => setAnamnesis({ ...anamnesis, anticoagulantes: e.target.checked })}
                        className="w-4 h-4 accent-gold-500"
                      />
                      <span className="text-sm font-medium">¿Toma anticoagulantes?</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Suplementos
                      </label>
                      <input
                        type="text"
                        value={anamnesis.suplementos}
                        onChange={(e) => setAnamnesis({ ...anamnesis, suplementos: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Vitaminas, suplementos..."
                      />
                    </div>
                  </div>
                </div>

                {/* Fila 3: Alergias + Exposición Solar */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Alergias y Sensibilidad
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Alergias a Cosméticos
                      </label>
                      <textarea
                        value={anamnesis.alergiasCosmeticos}
                        onChange={(e) => setAnamnesis({ ...anamnesis, alergiasCosmeticos: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={2}
                        placeholder="Describa alergias..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Reacciones Previas
                      </label>
                      <textarea
                        value={anamnesis.reaccionesPrevias}
                        onChange={(e) => setAnamnesis({ ...anamnesis, reaccionesPrevias: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={2}
                        placeholder="Reacciones a productos..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Sensibilidad Cutánea
                      </label>
                      <input
                        type="text"
                        value={anamnesis.sensibilidadCutanea}
                        onChange={(e) => setAnamnesis({ ...anamnesis, sensibilidadCutanea: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Describa sensibilidad..."
                      />
                    </div>
                  </div>

                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Exposición Solar
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Exposición Solar
                      </label>
                      <input
                        type="text"
                        value={anamnesis.exposicionSolar}
                        onChange={(e) => setAnamnesis({ ...anamnesis, exposicionSolar: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Frecuencia y protección..."
                      />
                    </div>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anamnesis.usoCabinas}
                        onChange={(e) => setAnamnesis({ ...anamnesis, usoCabinas: e.target.checked })}
                        className="w-4 h-4 accent-gold-500"
                      />
                      <span className="text-sm font-medium">¿Usa cabinas de bronceado?</span>
                    </label>
                  </div>
                </div>

                {/* Fila 4: Hábitos + Rutina de Cuidado */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Hábitos de Vida
                    </h4>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anamnesis.tabaquismo}
                        onChange={(e) => setAnamnesis({ ...anamnesis, tabaquismo: e.target.checked })}
                        className="w-4 h-4 accent-gold-500"
                      />
                      <span className="text-sm font-medium">Fumador/a</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Consumo de Alcohol
                      </label>
                      <input
                        type="text"
                        value={anamnesis.consumoAlcohol}
                        onChange={(e) => setAnamnesis({ ...anamnesis, consumoAlcohol: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Frecuencia..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Nivel de Estrés
                      </label>
                      <select
                        value={anamnesis.nivelEstres}
                        onChange={(e) => setAnamnesis({ ...anamnesis, nivelEstres: e.target.value as 'Bajo' | 'Medio' | 'Alto' })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Calidad del Sueño
                      </label>
                      <input
                        type="text"
                        value={anamnesis.calidadSueno}
                        onChange={(e) => setAnamnesis({ ...anamnesis, calidadSueno: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Horas, calidad..."
                      />
                    </div>
                  </div>

                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-5 space-y-4">
                    <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                      Rutina de Cuidado
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Productos Usados
                      </label>
                      <textarea
                        value={anamnesis.productosUsados}
                        onChange={(e) => setAnamnesis({ ...anamnesis, productosUsados: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={3}
                        placeholder="Liste productos actuales..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Frecuencia de Limpieza
                      </label>
                      <input
                        type="text"
                        value={anamnesis.frecuenciaLimpieza}
                        onChange={(e) => setAnamnesis({ ...anamnesis, frecuenciaLimpieza: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        placeholder="Ej: Dos veces al día"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Experiencia con Tratamientos Previos
                      </label>
                      <textarea
                        value={anamnesis.experienciaTratamientos}
                        onChange={(e) => setAnamnesis({ ...anamnesis, experienciaTratamientos: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-700 text-white rounded-lg"
                        rows={3}
                        placeholder="Describa tratamientos anteriores..."
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleSaveAnamnesis}
                  isLoading={saving}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Continuar a Consentimiento
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CONSENTIMIENTO */}
        {activeTab === 'consentimiento' && (
          <div className="space-y-4">
            <h3 className={cn(
              'font-bold text-white',
              isMobile ? 'text-lg' : 'text-2xl'
            )}>
              Consentimiento Informado
            </h3>

            <div className={cn(
              'bg-dark-800 border border-dark-700 rounded-lg space-y-4',
              isMobile ? 'p-4' : 'p-6'
            )}>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Procedimiento
                </label>
                <textarea
                  value={consentimiento.procedimiento}
                  onChange={(e) => setConsentimiento({ ...consentimiento, procedimiento: e.target.value })}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  rows={isMobile ? 4 : 3}
                  placeholder="Describa el procedimiento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Riesgos y Contraindicaciones
                </label>
                <textarea
                  value={consentimiento.riesgos}
                  onChange={(e) => setConsentimiento({ ...consentimiento, riesgos: e.target.value })}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  rows={isMobile ? 4 : 3}
                  placeholder="Liste los riesgos..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Firma del Paciente
                </label>
                {consentimiento.firmaUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={consentimiento.firmaUrl} 
                      alt="Firma" 
                      className={cn(
                        'border border-dark-700 rounded bg-dark-900',
                        isMobile ? 'w-full h-40' : 'w-full h-32'
                      )}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setConsentimiento({ ...consentimiento, firmaUrl: undefined })}
                    >
                      Volver a firmar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="white"
                      canvasProps={{ 
                        className: cn(
                          'w-full border border-dark-700 rounded bg-dark-900',
                          isMobile ? 'h-48' : 'h-32'
                        )
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => sigCanvas.current?.clear()}
                    >
                      Borrar
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className={cn(
              'flex gap-4',
              isMobile && 'flex-col'
            )}>
              <Button 
                variant="outline" 
                onClick={() => generateConsentPDF(record)}
                className={cn(isMobile && 'w-full h-12 text-base')}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Hoja
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveConsentimiento} 
                isLoading={saving} 
                className={cn(
                  'flex-1',
                  isMobile && 'w-full h-12 text-base'
                )}
              >
                Continuar a Atención
              </Button>
            </div>
          </div>
        )}

        {/* ATENCIÓN */}
        {activeTab === 'atencion' && (
          <div className="space-y-4">
            <h3 className={cn(
              'font-bold text-white',
              isMobile ? 'text-lg' : 'text-2xl'
            )}>
              Registro de Atención
            </h3>

            <div className={cn(
              'bg-dark-800 border border-dark-700 rounded-lg space-y-4',
              isMobile ? 'p-4' : 'p-6'
            )}>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Motivo de Consulta *
                </label>
                <textarea
                  value={session.motivoConsulta}
                  onChange={(e) => setSession({ ...session, motivoConsulta: e.target.value })}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  rows={3}
                  required
                  placeholder="Describa el motivo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Diagnóstico Clínico
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {session.condicionActual?.map(d => (
                    <span 
                      key={d} 
                      className="bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                    >
                      {d}
                      <button 
                        onClick={() => setSession(prev => ({ 
                          ...prev, 
                          condicionActual: prev.condicionActual?.filter(x => x !== d) 
                        }))} 
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={busquedaDiag}
                  onChange={(e) => handleBuscarDiagnostico(e.target.value)}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  placeholder="Buscar condición..."
                />
                {sugerenciasDiag.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto border border-dark-700 rounded-lg">
                    {sugerenciasDiag.map(s => (
                      <button
                        key={s}
                        onClick={() => agregarDiagnostico(s)}
                        className={cn(
                          'w-full text-left text-white hover:bg-dark-700',
                          isMobile ? 'px-4 py-3 text-base' : 'px-4 py-2 text-sm'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tratamiento Realizado *
                </label>
                <textarea
                  value={session.tratamientoRealizado}
                  onChange={(e) => setSession({ ...session, tratamientoRealizado: e.target.value })}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  rows={4}
                  required
                  placeholder="Describa el tratamiento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Recomendaciones
                </label>
                <textarea
                  value={session.recomendaciones}
                  onChange={(e) => setSession({ ...session, recomendaciones: e.target.value })}
                  className={cn(
                    'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                    isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                  )}
                  rows={3}
                  placeholder="Recomendaciones post-tratamiento..."
                />
              </div>

              {/* Fotos */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Galería de Seguimiento
                </label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  <label 
                    className={cn(
                      'border-2 border-dashed border-dark-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gold-500 flex-shrink-0',
                      isMobile ? 'w-32 h-32' : 'w-24 h-24',
                      uploadingPhoto && 'opacity-50'
                    )}
                  >
                    <Upload className={cn(
                      'text-dark-400',
                      isMobile ? 'w-8 h-8' : 'w-6 h-6'
                    )} />
                    <input 
                      type="file" 
                      hidden 
                      onChange={(e) => handleUploadPhoto(e, 'antes')} 
                      accept="image/*" 
                      disabled={uploadingPhoto} 
                    />
                  </label>
                  {session.fotosAntes?.map((url, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        'relative flex-shrink-0',
                        isMobile ? 'w-32 h-32' : 'w-24 h-24'
                      )}
                    >
                      <img 
                        src={url} 
                        className="w-full h-full object-cover rounded-lg" 
                        alt="Antes" 
                      />
                      <button 
                        onClick={() => setSession(prev => ({ 
                          ...prev, 
                          fotosAntes: prev.fotosAntes?.filter((_, idx) => idx !== i) 
                        }))} 
                        className={cn(
                          'absolute bg-red-500 text-white rounded-full text-xs',
                          isMobile ? '-top-2 -right-2 w-7 h-7' : '-top-2 -right-2 w-6 h-6'
                        )}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pago */}
              <div className={cn(
                'bg-gold-500/10 rounded-lg space-y-4',
                isMobile ? 'p-4' : 'p-4 grid grid-cols-2 gap-4'
              )}>
                <div>
                  <label className="block text-sm font-medium text-gold-300 mb-2">
                    Costo (₡) *
                  </label>
                  <input
                    type="number"
                    value={session.costo}
                    onChange={(e) => setSession({ ...session, costo: parseInt(e.target.value) })}
                    className={cn(
                      'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                      isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                    )}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gold-300 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={session.metodoPago}
                    onChange={(e) => setSession({ ...session, metodoPago: e.target.value as any })}
                    className={cn(
                      'w-full bg-dark-900 border border-dark-700 text-white rounded-lg',
                      isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2'
                    )}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Sinpe">Sinpe</option>
                  </select>
                </div>
              </div>
            </div>

            <Button 
              variant="primary" 
              onClick={handleSaveSession} 
              isLoading={saving} 
              className={cn(
                'w-full',
                isMobile && 'h-12 text-base'
              )}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar y Finalizar Atención
            </Button>
          </div>
        )}

        {/* HISTORIAL */}
        {activeTab === 'historial' && (
          <div className="space-y-4">
            <h3 className={cn(
              'font-bold text-white',
              isMobile ? 'text-lg' : 'text-2xl'
            )}>
              Historial de Sesiones
            </h3>
            
            {record.sesiones && record.sesiones.length > 0 ? (
              record.sesiones.map((s, i) => (
                <div 
                  key={s.id} 
                  className={cn(
                    'bg-dark-800 border border-dark-700 rounded-lg space-y-3',
                    isMobile ? 'p-4' : 'p-6'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white">
                        Sesión {i + 1}
                      </h4>
                      <p className="text-sm text-dark-400">
                        {s.fecha.toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateSessionPDF(record, s)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteSession(s.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-dark-300">
                    <strong>Motivo:</strong> {s.motivoConsulta}
                  </p>
                  <p className="text-sm text-dark-300">
                    <strong>Tratamiento:</strong> {s.tratamientoRealizado}
                  </p>
                  <p className="text-sm text-gold-400">
                    <strong>Costo:</strong> ₡{s.costo.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-dark-800 border border-dark-700 rounded-lg">
                <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">No hay sesiones registradas</p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </Modal>
  );
}
