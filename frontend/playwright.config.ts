import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    viewport: { width: 390, height: 844 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // Eigener Port (3001), damit der laufende Dev-Server auf 3000 nicht kollidiert.
    // VSCODE_PROXY_URI="" → Vite setzt base = "/" → Assets werden ohne Proxy-Prefix
    // ausgeliefert, sodass Playwright direkt auf localhost zugreifen kann.
    command: "npx vite --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 60_000,
    env: {
      VSCODE_PROXY_URI: "",
    },
  },
})
