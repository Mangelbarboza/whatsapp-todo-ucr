import { revalidatePath } from 'next/cache';

export default function Home() {
  async function createTask(formData) {
    'use server';
    const taskTitle = formData.get('task');

    if (!taskTitle) return;

    try {
      // 1. Obtener Token de Microsoft
      const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          scope: 'https://graph.microsoft.com/.default',
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
        }),
      });

      const { access_token } = await tokenRes.json();

      // 2. Enviar a la lista "Universidad Pendientes"
      await fetch(`https://graph.microsoft.com/v1.0/users/${process.env.CLIENT_ID}/todo/lists/${process.env.LIST_ID}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      revalidatePath('/');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-bold text-slate-800">Pendientes de Mango</h1>
        </div>
        
        <p className="text-slate-500 mb-8 text-sm">
          Cualquier cosa que anotés aquí llegará directo a mi lista.
        </p>

        <form action={createTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Descripción de la tarea
            </label>
            <input
              name="task"
              type="text"
              placeholder="Ej: Subir práctica de estadística..."
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            Enviar a Angel
          </button>
        </form>

        <footer className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Conectado con Microsoft Graph API & Vercel
          </p>
        </footer>
      </div>
    </main>
  );
}