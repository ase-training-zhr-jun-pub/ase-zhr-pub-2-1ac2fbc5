import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const PORT = 3000
const BACKEND_PORT = 8080
const proxyUri = process.env.VSCODE_PROXY_URI
const base = proxyUri
  ? new URL(proxyUri.replace("{{port}}", String(PORT))).pathname
  : "/"
// Basis-Pfad ohne abschliessenden Slash, leer bei lokalem Betrieb
const basePrefix = base.replace(/\/$/, "")

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
  plugins: [react(), tailwindcss(), proxyBasePlugin()],
  server: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: true,
    hmr: false,
    proxy: {
      // Nach proxyBasePlugin-Rewrite enthält der Pfad den Basis-Prefix.
      // Rewrite entfernt ihn wieder, damit der Booking Service /api/... sieht.
      [`${basePrefix}/api`]: {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        ...(basePrefix && {
          rewrite: (path: string) => path.replace(basePrefix, ""),
        }),
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: PORT,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const parts = id.split("node_modules/")[1].split("/")
            const pkg = parts[0].startsWith("@") ? `${parts[0]}-${parts[1]}` : parts[0]
            return `vendor-${pkg.replace("@", "").replace("/", "-")}`
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
