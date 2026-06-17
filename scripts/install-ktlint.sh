#!/usr/bin/env bash
# Installiert ktlint – den Kotlin-Formatter für den Calvin Booking Service.
# Wird vom PostToolUse-Hook (.claude/settings.json) verwendet, um .kt-Dateien
# unterhalb von backend/ bei Write/Edit automatisch zu formatieren.
# Benötigt ein installiertes JDK (siehe scripts/install-sdk.sh).
set -eo pipefail

KTLINT_VERSION="1.5.0"
INSTALL_DIR="/usr/local/bin"   # liegt im Standard-PATH -> Hook ruft einfach `ktlint`

# ── 0. Java vorhanden? (ktlint ist eine JVM-Anwendung) ───────────────────────
if ! command -v java &>/dev/null; then
  echo "✖ Kein 'java' im PATH gefunden."
  echo "  Bitte zuerst das JDK installieren:  scripts/install-sdk.sh"
  exit 1
fi

# ── 1. Bereits installiert? ──────────────────────────────────────────────────
if command -v ktlint &>/dev/null && ktlint --version 2>/dev/null | grep -q "$KTLINT_VERSION"; then
  echo "✔ ktlint $KTLINT_VERSION ist bereits installiert ($(command -v ktlint))."
  exit 0
fi

# ── 2. ktlint-CLI herunterladen ──────────────────────────────────────────────
echo "▶ ktlint $KTLINT_VERSION wird heruntergeladen …"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
curl -sSLf -o "$TMP/ktlint" \
  "https://github.com/pinterest/ktlint/releases/download/${KTLINT_VERSION}/ktlint"
chmod +x "$TMP/ktlint"

# ── 3. Nach $INSTALL_DIR verschieben (ggf. mit sudo) ─────────────────────────
if [[ -w "$INSTALL_DIR" ]]; then
  mv "$TMP/ktlint" "$INSTALL_DIR/ktlint"
else
  sudo mv "$TMP/ktlint" "$INSTALL_DIR/ktlint"
fi

# ── 4. Ergebnis prüfen ───────────────────────────────────────────────────────
echo ""
echo "✔ Installation abgeschlossen: $(command -v ktlint)"
ktlint --version
