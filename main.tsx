import { Hono } from "hono";
import { serveStatic, upgradeWebSocket } from 'hono/deno'
import { Main } from "./components.tsx";
import { repository } from "./repository.ts";
import { pubsub } from "./pubsub.ts";

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }))

app.get("/", async (c) => {
  const counter = await repository.getCount();
  return c.html(<Main counter={counter} />);
});

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    onOpen(_, ws) {
      pubsub.subscribe(ws);
    },
    onClose(_, ws) {
      pubsub.unsubscribe(ws);
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
