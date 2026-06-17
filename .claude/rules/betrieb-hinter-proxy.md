# Betrieb hinter dem Proxy (Crucible / VS Code)
Gilt für das **Vite**-Frontend (`frontend/`).
In der Trainings-Umgebung wird die App nicht unter `localhost` geöffnet, sondern über
einen Proxy unter einem Unterpfad:
```
https://crucible.ch.innoq.io/t/<token>/s/<session>/proxy/<port>/
```
Der konkrete Pfad steht in der Env-Variable `VSCODE_PROXY_URI`, z. B.:
```
https://crucible.ch.innoq.io/t/<token>/s/<session>/proxy/{{port}}/
```
## Symptom
Im Browser laden zwar `index.html` und ggf. `main.tsx`, aber Folge-Requests gehen an
die **nackte Origin ohne Proxy-Prefix** und liefern 404, z. B.:
```
https://crucible.ch.innoq.io/node_modules/.vite/deps/react.js?v=8184927e
```
statt korrekt:
```
https://crucible.ch.innoq.io/t/<token>/s/<session>/proxy/3000/node_modules/.vite/deps/react.js?v=...
```
## Ursache
Der Crucible-Proxy **strippt den Pfad-Prefix** (`/t/.../proxy/3000`) wieder weg, bevor
er an den Dev-Server weiterleitet. Vite muss aber für den Browser **absolute URLs mit
Prefix** erzeugen, damit der Browser sie wieder durch den Proxy schickt. Ohne passende
Konfiguration erzeugt Vite Pfade ab `/` (ohne Prefix) → der Browser löst sie gegen die
Origin auf → 404.
## Fix (`frontend/vite.config.ts`)
Drei Bausteine, die zusammengehören:
```ts
import { defineConfig, Plugin } from "vite"
// 1) Port zentral festlegen. Er steckt im Proxy-Pfad (base) UND im Dev-Server –
// beides MUSS denselben Port nutzen, sonst läuft die App auf 5173, der Proxy
//    zeigt aber auf 3000.
const PORT = 3000
const proxyUri = process.env.VSCODE_PROXY_URI
const base = proxyUri
  ? new URL(proxyUri.replace("{{port}}", String(PORT))).pathname
  : "/"
// 2) Der Proxy strippt den Prefix beim Weiterleiten -> wir hängen ihn für
//    eingehende Requests wieder an, damit Vite die Dateien findet. Dadurch
//    arbeitet Vite vollständig im "base-prefixed"-Modus und erzeugt alle
//    Client-URLs (auch node_modules/.vite/deps/*) konsistent mit Prefix.
function proxyBasePlugin(): Plugin {
  return {
    name: "proxy-base-rewrite",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (base !== "/" && req.url && !req.url.startsWith(base)) {
          req.url = base.replace(/\/$/, "") + req.url
        }
        next()
      })
    },
  }
}
export default defineConfig({
  base,
  plugins: [/* react(), tailwindcss(), */ proxyBasePlugin()],
  server: {
    host: "0.0.0.0",   // Proxy greift unter beliebigem Host zu
    port: PORT,        // 3) Port pinnen, damit `npm run dev` nicht auf 5173 landet
    allowedHosts: true,
  },
})
```
### Warum genau diese Teile
| Baustein | Zweck |
|---|---|
| `base` aus `VSCODE_PROXY_URI` | Vite erzeugt alle Asset-/Modul-URLs **mit** Proxy-Prefix. Fallback `"/"` lokal. |
| `proxyBasePlugin` | Hängt den vom Proxy gestrippten Prefix für eingehende Requests wieder an. Die `startsWith(base)`-Prüfung verhindert doppeltes Anhängen (falls der Proxy doch mal nicht strippt). |
| `host: "0.0.0.0"` + `allowedHosts: true` | Server lauscht auf allen Interfaces und akzeptiert den fremden Crucible-Host. |
| `port: PORT` | **Wichtig:** `npm run dev` startet `vite` ohne `--port` (Default **5173**). Ohne `port: PORT` läuft die App auf 5173, während `base`/Proxy auf 3000 zeigen → alles 404. |
## Nach jeder Änderung an `vite.config.ts`
1. **Dev-Server neu starten** (`cd frontend && npm run dev`). Vite picked Config-Änderungen
   zwar meist selbst auf, aber bei `base`-Wechseln sauberer mit Neustart.
2. Im Browser **Hard-Reload** (Cache leeren). Ein häufiges Folge-Symptom: Eine alte,
   gecachte `react.js?v=<alterHash>` ohne Prefix wird angefragt, obwohl der Server
   längst einen neuen Hash mit Prefix ausliefert. Erkennbar am **abweichenden `?v=`-Hash**.
3. Hartnäckiger Fall: Dep-Cache löschen und neu optimieren:
   `rm -rf frontend/node_modules/.vite && npm run dev`