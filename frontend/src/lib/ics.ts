import type { Buchung } from "@/lib/mock-data"
import { getRaum, getStandort } from "@/lib/mock-data"

/** Erzeugt einen .ics-Kalendereintrag und stößt den Download an (Extra-Feature). */
export function exportiereAlsIcs(buchung: Buchung) {
  const raum = getRaum(buchung.raumId)
  const standort = getStandort(buchung.standortId)
  const dt = buchung.datum.replace(/-/g, "")
  const start = `${dt}T${buchung.start.replace(":", "")}00`
  const ende = `${dt}T${buchung.ende.replace(":", "")}00`

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Calvin//Raumbuchung//DE",
    "BEGIN:VEVENT",
    `UID:${buchung.id}@calvin.innoq`,
    `DTSTART:${start}`,
    `DTEND:${ende}`,
    `SUMMARY:${buchung.titel}`,
    `LOCATION:${raum?.name ?? ""} – ${standort?.name ?? ""}`,
    `DESCRIPTION:${buchung.notiz ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `calvin-${buchung.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
