import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/core/infrastructure/firebase/config';
import { COLLECTIONS } from '@/shared/constants';

// PÁGINA TEMPORAL — eliminar después de crear el admin
// Acceder en: /admin-bootstrap

const SECRET = 'sunanda2026';

export function AdminBootstrapPage() {
  const [secret, setSecret] = useState('');
  const [email, setEmail] = useState('administracion@sunanda.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const unlock = () => {
    if (secret === SECRET) setUnlocked(true);
    else setMessage('Clave incorrecta.');
  };

  const handleCreate = async () => {
    if (!password || password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      setStatus('loading');
      setMessage('');

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = credential.user.uid;

      const now = Timestamp.now();
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        email,
        displayName: 'Administración',
        role: 'ADMIN',
        phoneNumber: '+50688083390',
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
      });

      setStatus('done');
      setMessage(`✅ Usuario creado con UID: ${uid}\n\nYa podés iniciar sesión. Eliminá esta página del código.`);
    } catch (err: any) {
      setStatus('error');
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md space-y-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold text-yellow-400">Bootstrap Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Página de uso único — eliminar después</p>
        </div>

        {!unlocked ? (
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Clave de acceso"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={unlock}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg text-sm"
            >
              Desbloquear
            </button>
            {message && <p className="text-red-400 text-xs text-center">{message}</p>}
          </div>
        ) : status === 'done' ? (
          <div className="bg-green-900/40 border border-green-600 rounded-lg p-4">
            <pre className="text-green-300 text-xs whitespace-pre-wrap">{message}</pre>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={status === 'loading'}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold py-2 rounded-lg text-sm"
            >
              {status === 'loading' ? 'Creando...' : 'Crear usuario admin'}
            </button>
            {message && (
              <p className={`text-xs text-center ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
