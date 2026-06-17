#!/usr/bin/env bash
# Installiert das JDK für den Calvin Booking Service (Spring Boot / Kotlin)
# via SDKMAN! – funktioniert auf macOS, Debian/Ubuntu und in Devcontainern.
set -eo pipefail   # kein -u: sdkman-init.sh nutzt ungebundene Variablen

JAVA_VERSION="21.0.7-tem"   # Eclipse Temurin 21 LTS

# ── 0. System-Abhängigkeiten (unzip + zip werden von SDKMAN benötigt) ────────
if ! command -v unzip &>/dev/null; then
  echo "▶ unzip wird installiert …"
  sudo apt-get update -qq && sudo apt-get install -y -qq unzip zip curl
fi

# ── 1. SDKMAN installieren (falls noch nicht vorhanden) ──────────────────────
if [[ ! -d "$HOME/.sdkman" ]]; then
  echo "▶ SDKMAN! wird installiert …"
  curl -s "https://get.sdkman.io" | bash
fi

# ── 2. SDKMAN in diese Shell-Session laden ───────────────────────────────────
export SDKMAN_DIR="$HOME/.sdkman"
# shellcheck source=/dev/null
source "$SDKMAN_DIR/bin/sdkman-init.sh"

# ── 3. Java 21 (Temurin) installieren ────────────────────────────────────────
if sdk list java | grep -q "${JAVA_VERSION}.*installed"; then
  echo "✔ Java ${JAVA_VERSION} ist bereits installiert."
else
  echo "▶ Java ${JAVA_VERSION} wird installiert …"
  sdk install java "$JAVA_VERSION"
fi

# ── 4. Java als Standard setzen ─────────────────────────────────────────────
sdk default java "$JAVA_VERSION"

# ── 5. Ergebnis prüfen ───────────────────────────────────────────────────────
echo ""
echo "✔ Installation abgeschlossen."
java -version
echo ""
echo "Damit 'java' im Terminal verfügbar ist, führe einmal aus:"
echo "  source \"\$HOME/.sdkman/bin/sdkman-init.sh\""
echo "Oder öffne ein neues Terminal-Fenster."
