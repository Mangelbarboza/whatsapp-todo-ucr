'use client';
import { useState } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Enviando...');

    // CONFIGURACIÓN (Asegúrate de que estos coincidan con tus IDs)
    const userId = "d309a2491b0946a2"; 
    const listId = "AQMkADAwATMwMAItZTNjNC04NmMwLTAwAi0wMAoALgAAA0oHt41H7KVNuHSNaKNV4dgBAD6zxzNuZedPh0TkQX2pW-QABT3CBn8AAAA=";
    
    // ⚠️ RECUERDA: Tienes que sacar un token NUEVO del Graph Explorer
    // El anterior que me pasaste probablemente ya expiró.
    const token = "TU_NUEVO_TOKEN_AQUI"; 

    try {
      const res = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${listId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: task }),
      });

      if (res.ok) {
        setStatus('✅ ¡Tarea anotada con éxito!');
        setTask('');
      } else {
        const errorData = await res.json();
        setStatus(`❌ Error de Microsoft: ${errorData.error.message}`);
      }
    } catch (err) {
      setStatus('❌ Error de conexión al enviar.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-xl font-bold text-slate-800 mb-4 text-center">UCR Tasks 🎓</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="¿Qué hay que hacer?"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
          >
            Anotar Tarea
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center text-sm font-medium ${status.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {status}
          </p>
        )}
      </div>
    </main>
  );
}