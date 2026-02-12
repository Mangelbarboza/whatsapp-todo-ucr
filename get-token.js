const clientId = '1736bed7-f873-4e6e-9c6e-148f41713a09'; // Tu Client ID
const tenantId = '6ff29174-79eb-46f9-b3a3-40398424dc3f'; // Tu Tenant ID

async function main() {
  // 1. Pedir código de dispositivo
  console.log("Iniciando solicitud de permiso...");
  const codeParams = new URLSearchParams({
    client_id: clientId,
    scope: 'offline_access Tasks.ReadWrite user.read', // Permisos necesarios
  });

  const codeRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/devicecode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: codeParams
  });

  const codeData = await codeRes.json();
  
  if (codeData.error) {
    console.error("Error obteniendo código:", codeData.error_description);
    return;
  }

  console.log("\n==================================================");
  console.log("⚠️  ACCIÓN REQUERIDA:");
  console.log(`1. Abre este link: ${codeData.verification_uri}`);
  console.log(`2. Escribe este código: ${codeData.user_code}`);
  console.log("==================================================\n");
  console.log("Esperando a que autorices...");

  // 2. Esperar a que el usuario autorice en el navegador
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const tokenParams = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: clientId,
        device_code: codeData.device_code
      });

      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams
      });

      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        clearInterval(interval);
        console.log("\n¡LISTO! ✅");
        console.log("Copia este REFRESH TOKEN y ponlo en las variables de Vercel:");
        console.log("---------------------------------------------------");
        console.log(tokenData.refresh_token); // ESTE ES EL QUE OCUPAS
        console.log("---------------------------------------------------");
        resolve();
      }
    }, 5000);
  });
}

main();