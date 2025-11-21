import { FC } from "hono/jsx";

interface Props {
  counter: number;
}

export const Main: FC<Props> = ({ counter }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>:awoo:</title>
        <meta property="og:title" content=":awoo:" />
        <meta property="og:image" content="https://awoo.trap.show/awoo.webp" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content=":awoo:" />
        <meta name="twitter:image" content="https://awoo.trap.show/awoo.webp" />

        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" />
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js" integrity="sha384-/TgkGk7p307TH7EXJDuUlgG3Ce1UVolAOFopFekQkkXihi5u/6OCvVKyz1W+idaz" crossorigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/htmx-ext-ws@2.0.4" integrity="sha384-1RwI/nvUSrMRuNj7hX1+27J8XDdCoSLf0EjEyF69nacuWyiJYoQ/j39RT1mSnd2G" crossorigin="anonymous" />
      </head>
      <body hx-ext="ws" ws-connect="/ws" class="flex flex-col items-center justify-center min-h-screen bg-red-50 text-stone-800 font-sans selection:bg-orange-200">
        <main class="flex flex-col items-center gap-12 p-8">
          <h1 class="text-6xl font-black tracking-tighter text-stone-900">: awoo :</h1>
          <div class="flex flex-col items-center gap-4">
            <div id="awoo-counter" class="text-5xl font-bold tabular-nums text-orange-600">{counter}</div>
          </div>
          <button
            hx-post="/awoo"
            hx-target="#awoo-counter"
            hx-swap="innerHTML"
            hx-on:click="const c = document.getElementById('awoo-counter'); c.innerText = parseInt(c.innerText) + 1"
            id="awoo-button"
            type="button"
            class="cursor-pointer p-0 border-0 bg-transparent transition-all active:scale-90 hover:scale-105 ease-out duration-150 outline-none focus-visible:ring-4 focus-visible:ring-orange-300 rounded-full"
          >
            <img src="/awoo.webp" alt="awoo button" width={160} height={160} class="drop-shadow-xl" />
          </button>
        </main>
      </body>
    </html>
  );
}
