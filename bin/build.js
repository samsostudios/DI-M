/* eslint-disable no-console */
import http from 'node:http';
import process from 'node:process';

import * as esbuild from 'esbuild';
import sirv from 'sirv';

// Config output
const BUILD_DIRECTORY = 'dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2019' : 'esnext',
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  define: {
    SERVE_PORT: `${SERVE_PORT}`,
  },
});

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
}

// Watch and serve files in dev
else {
  await context.watch();

  const serve = sirv(BUILD_DIRECTORY, { dev: true });

  const server = http.createServer((req, res) => {
    const host = (req.headers.host || '').toLowerCase();
    const hostOk =
      host.startsWith('localhost') ||
      host.startsWith('127.0.0.1') ||
      host.endsWith('.devtunnels.ms') ||
      host.endsWith('.trycloudflare.com');

    if (!hostOk) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`403 - Forbidden: The host "${host}" is not allowed`);
      return;
    }

    serve(req, res);
  });

  server.listen(SERVE_PORT, '0.0.0.0', () => {
    const origin = `http://localhost:${SERVE_PORT}`;
    const files = ENTRY_POINTS.map(
      (p) => `${origin}/${p.replace('src/', '').replace('.ts', '.js')}`,
    );

    console.log('Serving at:', origin);
    console.log('Built files:', files);
  });
}
