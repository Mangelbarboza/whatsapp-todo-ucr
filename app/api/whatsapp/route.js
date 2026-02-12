import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const body = formData.get('Body'); // El mensaje de WhatsApp
  const from = formData.get('From'); // El número de ella

  if (body && body.startsWith('#')) {
    const tarea = body.substring(1).trim();

    try {
      // 1. Obtener Token de Microsoft
      const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials',
      });

      const tokenRes = await fetch(tokenUrl, { method: 'POST', body: params });
      const { access_token } = await tokenRes.json();

      // 2. Crear la tarea (Usa el ID de tu lista que sacaremos luego)
      // Por ahora, lo mandaremos a "Tasks" por defecto si no tenemos el ID
      await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/tasks/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: tarea })
      });

      // 3. Respuesta XML para Twilio
      return new Response(`
        <Response>
          <Message>¡Listo Angel! Tarea "${tarea}" anotada en la U. 🎓</Message>
        </Response>`, 
        { headers: { 'Content-Type': 'text/xml' } }
      );
    } catch (error) {
      return NextResponse.json({ error: 'Fallo el servidor' }, { status: 500 });
    }
  }

  return new Response('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } });
}