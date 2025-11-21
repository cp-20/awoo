import { Hono } from "hono";
import { serveStatic, upgradeWebSocket } from 'hono/deno'
import { Main } from "./components.tsx";
import { repository } from "./repository.ts";
import { pubsub } from "./pubsub.ts";

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }))

app.get("/", async (c) => {
  const counter = await repository.getCount();
  return c.html(<Main counter={counter} clients={pubsub.getCount()} />);
});

const clientElement = `<img src="/awoo.webp" alt="" width="32" height="32" class="inline-block mr-2 mb-1" /><span id="awoo-clients" class="align-middle font-mono font-bold text-stone-700"></span>`;

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    onOpen(_, ws) {
      pubsub.subscribe(ws);
      pubsub.publish(`<div hx-swap-oob="innerHTML:#awoo-clients">${clientElement.repeat(pubsub.getCount())}</div>`);
    },
    onClose(_, ws) {
      pubsub.unsubscribe(ws);
      pubsub.publish(`<div hx-swap-oob="innerHTML:#awoo-clients">${clientElement.repeat(pubsub.getCount())}</div>`);
    },
  }))
);

app.post('/awoo', async (c) => {
  await repository.increment();
  const counter = await repository.getCount();
  pubsub.publish(`<span hx-swap-oob="innerHTML:#awoo-counter">${counter}</span>`);
  return c.html(`${counter}`);
});

Deno.serve(app.fetch);
