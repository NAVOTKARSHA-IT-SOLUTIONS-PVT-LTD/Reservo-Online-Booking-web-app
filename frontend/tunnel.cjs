const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Starting backend tunnel on port 8080...");
  try {
    const backendTunnel = await localtunnel({ port: 8080 });
    const backendUrl = backendTunnel.url;
    console.log(`Backend Tunnel URL: ${backendUrl}`);
    fs.writeFileSync(path.join(__dirname, 'backend_url.txt'), backendUrl);

    // Update frontend/.env with VITE_API_URL pointing to the backend public URL
    const envPath = path.join(__dirname, '.env');
    const envContent = `# API Configuration\nVITE_API_URL=${backendUrl}\n\n# Environment\nNODE_ENV=development\n`;
    fs.writeFileSync(envPath, envContent);
    console.log("Updated frontend/.env with public backend URL.");

    console.log("Starting frontend tunnel on port 5174...");
    const frontendTunnel = await localtunnel({ port: 5174 });
    const frontendUrl = frontendTunnel.url;
    console.log(`Frontend Tunnel URL: ${frontendUrl}`);
    fs.writeFileSync(path.join(__dirname, 'frontend_url.txt'), frontendUrl);

    console.log("\n==========================================");
    console.log(`SHAREABLE FRONTEND URL: ${frontendUrl}`);
    console.log(`BACKEND API URL: ${backendUrl}`);
    console.log("==========================================\n");

    // Keep process alive
    setInterval(() => {}, 1000);

    backendTunnel.on('close', () => {
      console.log("Backend tunnel closed.");
    });

    frontendTunnel.on('close', () => {
      console.log("Frontend tunnel closed.");
    });
  } catch (err) {
    console.error("Tunnel creation failed:", err);
  }
})();
