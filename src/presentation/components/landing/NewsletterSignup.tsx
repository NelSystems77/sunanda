import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/core/infrastructure/firebase/config';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Verificar duplicados
      const q = query(collection(db, 'newsletter'), where('email', '==', email.trim().toLowerCase()));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setError('Este correo ya está suscrito.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'newsletter'), {
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        subscribedAt: serverTimestamp(),
        source: 'landing',
        active: true,
      });

      setDone(true);
    } catch {
      setError('Error al suscribirse. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-dark-800 border-y border-dark-700">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6"
            >
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por suscribirte!</h3>
              <p className="text-dark-400">Recibirás consejos de belleza y ofertas exclusivas directamente en tu correo.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-gold-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Consejos Exclusivos</h2>
              <p className="text-dark-400 mb-8">
                Suscribite y recibí consejos de cuidado de piel, ofertas especiales y novedades del spa directo a tu correo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500 text-sm"
                />
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent placeholder-dark-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="px-5 py-3 bg-gold-500 text-dark-900 rounded-xl font-bold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-dark-900/40 border-t-dark-900 rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Suscribirme</span>
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm text-left">{error}</p>}
              </form>

              <p className="text-xs text-dark-600 mt-4">
                Sin spam. Podés darte de baja en cualquier momento.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
