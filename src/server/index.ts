import { buildApp } from './app';

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

async function start() {
  const app = buildApp();
  try {
    await app.listen({ port, host });
    console.log(`API listening on http://${host}:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
