Deploying the Next.js app to IIS (overview)

1. Build the app
   - On your build machine: run `npm install` then `npm run build`.

2. Prepare production environment
   - Create a `.env.production` file with the values from `.env.production.example`.
   - Ensure `NODE_ENV=production` is set.

3. Deploy to IIS server
   - Copy the project folder (including `.next`, `public`, `server.js`, `web.config`, `package.json`, `node_modules`) to the IIS server site folder.
   - Install iisnode module on the IIS server (https://github.com/Azure/iisnode).
   - Ensure Node.js is available on the server and the PATH is configured.

4. Start/Restart site
   - App should be managed by IIS via iisnode and accessible on the configured IIS site port.
   - Alternatively, you can run `node server.js` directly and reverse-proxy with IIS or another webserver.

Notes
- Large static images were intentionally kept in `public/`. If your repo contains many large images, consider hosting them externally for performance.
- For advanced deployments, use a process manager (PM2) or Azure App Service instead of iisnode.
