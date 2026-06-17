// Robuster Static-Server für den Calvin-Prototyp hinter dem HTTPS-Proxy.
// - keine Keep-Alive-Verbindungen (Connection: close) -> Proxy kann keine
//   tote Upstream-Verbindung wiederverwenden ("socket hang up" / "Loading failed")
// - gzip für Text-Assets
// - SPA-Fallback auf index.html
import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import zlib from "node:zlib"

const DIST = path.resolve("dist")
const PORT = Number(process.env.PORT) || 5173

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".ico": "image/x-icon",
}
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".svg"])

function send(res, status, body, headers = {}) {
  res.writeHead(status, { Connection: "close", ...headers })
  res.end(body)
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0])
    let filePath = path.join(DIST, urlPath)

    // Verhindere Path-Traversal
    if (!filePath.startsWith(DIST)) return send(res, 403, "Forbidden")

    // SPA-Fallback: kein File mit Endung -> index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, "index.html")
    }

    const ext = path.extname(filePath)
    const type = MIME[ext] || "application/octet-stream"
    let data = fs.readFileSync(filePath)

    const headers = {
      "Content-Type": type,
      "Cache-Control": "no-cache",
    }

    const acceptsGzip = (req.headers["accept-encoding"] || "").includes("gzip")
    if (acceptsGzip && COMPRESSIBLE.has(ext)) {
      data = zlib.gzipSync(data)
      headers["Content-Encoding"] = "gzip"
    }
    headers["Content-Length"] = data.length

    send(res, 200, data, headers)
  } catch (e) {
    send(res, 500, "Server Error: " + e.message)
  }
})

// Zur Sicherheit auch serverseitig Keep-Alive praktisch ausschalten
server.keepAliveTimeout = 0
server.headersTimeout = 0

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Calvin-Prototyp (Static, Connection: close) -> http://0.0.0.0:${PORT}/`)
})
