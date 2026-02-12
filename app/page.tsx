import { revalidatePath } from 'next/cache';

export default function Home() {
  async function createTask(formData: FormData) {
    'use server';
    const taskTitle = formData.get('task')?.toString();
    if (!taskTitle) return;

    // Usaremos el ID de la lista que ya configuraste en Vercel
    const listId = process.env.LIST_ID;
    const userId = process.env.USER_ID;
    
    // Este es el token que me pasaste. Si ya pasó más de una hora, 
    // tendrías que copiar uno nuevo del Graph Explorer.
    const token = "EwB4BMl6BAAUu4TQbLz/EdYigQnDPtIo76ZZUKsAAQyUnt3bPJwYbmOX+g5rrduViUzcM2k2vOwUUkhbw/fSezuh/pC8yy/9kSBjwJAvzKp1z4/cwQcHLMDWApg0CTX9bykzXqDfz2bo86OxvH7otaIgvilfTAj2gTrvzrELH0Y5Je2DC1QapHTx7I+zsCjHvo5hQvxnMWmKN/eWuePe4vl1WfVc3GaNQmYwQsGljbY2N+Y1HU5J6o+Ewm22ksYeXhL4jFEhHPalaIuA/Vqqzcqwr71fa/Vys9iRqyG1hp3am6J23lUZ8yvigXFgEx1XlPA1kUpiM1woUAlu49mKUP7306NjhfXmfHvvkp8epiMdRzv7JTofQzYeVvSenV0QZgAAEJml5ZZnqELU9CRV/rElH99AA++jQUSOyaY9MTkp9R68RlpB0hTek2xRuHixS0RH/+dqIDOnvf9VXej3CareE+mb9HkNs8PenmNqZR3dHEmcAQP7fOClCuskSEVKfO0vFExsfFMgqIVlurri+dKmidoJVp1oUlbT3nRuUQpS+Q4cHaN2mrhT0Ey33YpPqNdef1C2Z3MQ8wbssbR537q2eS5aF50u1rJER6MddfAOvkXJc6uOakqWhaNPl7n5hgGBwYoPgaBSKnRDD8hqZI2SDA3HaO7VZDExjIqp94dq6UmnvOlmZuJcIj3pN7sgEguk6eYytt3bp0gHfoGPe5R3JSxougyjiR077FnptpF3g65iF/dfiGkvi+kQqyMduyJdYRF/puI5MRpO3NwloDpATWhKUvuJfGZ74NRS+E5z4MUUL9JCCdrypAJ9Go5CqTgpsKK8TysYKdV/J7xrx2tUI0wGZkFUQCKv6MvOt+fcS1JRDO/seEGSInv14WKXBqA7dv9kYA97xt1Sj72e4FF4jsndaiarpYa7SXyrDO+FMuRir9v9gqs4uUYX1p6w61EWhwQbHxhDJfBWUwkR5zZY+fAID8tR8T4dblAisklBS5KVL81HHV7bLhda7yhKHuz9xMULAoXrmEqn37N88R0vvEz2xN3Nejb293f77bF5Zzsa8wxYeYA173RnI20cOGuYxMhllPHLkzMCd/mkFC5lUtuaUJjFqkx4KqToUm+H+nDQjrlPjltmvKrIgGA22Uu04oy1/FVNEL42eN10dn59+GcxodjVorF8e/CMNuNuwdl98wcaxrX1sYqnZiX+vLuHapvc4ZyuKMFRboII1obE261/RrlOUF9xAypetkOWG4G8thdxg0TIZk4B4YfpqWxSy1mNNd6PZGU7Yibi5wCwZb2v7OBreevs1DaL3du9ywfgJPTWKkPs+ay6xfak+lPO88K1e+AaW46v4Q9t9rtePfurF9iFGCmHzEP3ztFyaHJnf8GHHkQZrZRHMoytXFH866cUfqwvIaNrbopP/gB02yTLJ2KlLzKXJcozcU9t8Wzu3oysyVziN4glukvS5ZVC+hOPV12SvZDS/WLOHUr66sscYtmYbE1hH8SYBTMlrBa8c857Aw==";

    try {
      const res = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/${listId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (res.ok) {
        revalidatePath('/');
      } else {
        const error = await res.json();
        console.error("Microsoft Error:", error);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100">
        <h1 className="text-xl font-bold text-slate-800 mb-6 text-center">UCR Tasks 📝</h1>
        
        <form action={createTask} className="space-y-4">
          <input
            name="task"
            type="text"
            placeholder="¿Qué hay que hacer?"
            required
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none text-slate-700"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Anotar Pendiente
          </button>
        </form>
      </div>
    </main>
  );
}