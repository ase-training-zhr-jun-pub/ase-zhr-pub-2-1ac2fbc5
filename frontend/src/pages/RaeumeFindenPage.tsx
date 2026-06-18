import { useMemo, useState } from "react"
import { Users, Projector, PenLine, Video, Monitor, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import { RoomCard } from "@/components/room-card"
import {
  ALLE_AUSSTATTUNG,
  getBestMatch,
  getRaeumeByStandort,
  getStandort,
  HEUTE,
  istVerfuegbar,
  KOLLEGEN_IM_BUERO,
  type AusstattungsMerkmal,
} from "@/lib/mock-data"

const AUSSTATTUNG_ICONS: Record<AusstattungsMerkmal, React.ElementType> = {
  Beamer: Projector,
  Whiteboard: PenLine,
  "VC-Equipment": Video,
  Display: Monitor,
  Telefon: Phone,
}

export function RaeumeFindenPage() {
  const { standortId, favoriten } = useAppState()
  const standort = getStandort(standortId)

  const [datum, setDatum] = useState(HEUTE)
  const [start, setStart] = useState("09:00")
  const [ende, setEnde] = useState("10:00")
  const [kapazitaet, setKapazitaet] = useState(4)
  const [ausstattung, setAusstattung] = useState<AusstattungsMerkmal[]>([])

  const alleRaeume = getRaeumeByStandort(standortId)

  const gefiltert = useMemo(
    () =>
      alleRaeume
        .filter((r) => r.kapazitaet >= kapazitaet)
        .filter((r) => ausstattung.every((a) => r.ausstattung.includes(a))),
    [alleRaeume, kapazitaet, ausstattung],
  )

  const bestMatch = getBestMatch(standortId, datum, start, ende, kapazitaet, ausstattung)
  const verfuegbareAnzahl = gefiltert.filter((r) =>
    istVerfuegbar(r, datum, start, ende),
  ).length

  const favoritenRaeume = alleRaeume.filter((r) => favoriten.has(r.id))
  const kollegen = KOLLEGEN_IM_BUERO[standortId] ?? []

  function toggleAusstattung(a: AusstattungsMerkmal) {
    setAusstattung((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Räume finden</h1>
        <p className="text-sm text-muted-foreground">
          Standort {standort?.name}
        </p>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs" htmlFor="datum">Datum</Label>
              <Input id="datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className="h-9" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs" htmlFor="start">Von</Label>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} className="h-9" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs" htmlFor="ende">Bis</Label>
              <Input id="ende" type="time" value={ende} onChange={(e) => setEnde(e.target.value)} className="h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs">Mindest-Kapazität: {kapazitaet} Personen</Label>
            <input
              type="range"
              min={1}
              max={14}
              value={kapazitaet}
              onChange={(e) => setKapazitaet(Number(e.target.value))}
              className="accent-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Ausstattung</Label>
            <div className="flex flex-wrap gap-1.5">
              {ALLE_AUSSTATTUNG.map((a) => {
                const aktiv = ausstattung.includes(a)
                const Icon = AUSSTATTUNG_ICONS[a]
                return (
                  <button key={a} onClick={() => toggleAusstattung(a)}>
                    <Badge
                      variant={aktiv ? "default" : "outline"}
                      className={cn("cursor-pointer gap-1 font-normal", !aktiv && "hover:bg-muted")}
                    >
                      <Icon className="size-3" />
                      {a}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wer ist im Büro? */}
      {kollegen.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-medium">Wer ist im Büro?</p>
              <p className="text-xs text-muted-foreground">
                {kollegen.length} Kolleg:innen am {datum.split("-").reverse().join(".")}
              </p>
            </div>
            <div className="flex -space-x-2">
              {kollegen.slice(0, 4).map((k) => (
                <Avatar key={k.name} className="size-8 ring-2 ring-background">
                  <AvatarFallback className="bg-accent text-[10px] font-medium text-accent-foreground">
                    {k.initialen}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favoriten */}
      {favoritenRaeume.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Favoriten</h2>
          {favoritenRaeume.map((r) => (
            <RoomCard key={r.id} raum={r} datum={datum} start={start} ende={ende} gewuenschteAusstattung={ausstattung} />
          ))}
          <Separator className="my-1" />
        </section>
      )}

      {/* Ergebnisliste */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {verfuegbareAnzahl} von {gefiltert.length} Räumen verfügbar
          </h2>
        </div>

        {gefiltert.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
              <Users className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Keine Räume gefunden</p>
              <p className="text-xs text-muted-foreground">
                Passe Kapazität oder Ausstattung an.
              </p>
            </CardContent>
          </Card>
        ) : (
          gefiltert.map((r) => (
            <RoomCard
              key={r.id}
              raum={r}
              datum={datum}
              start={start}
              ende={ende}
              bestMatch={bestMatch?.id === r.id}
              gewuenschteAusstattung={ausstattung}
            />
          ))
        )}
      </section>
    </div>
  )
}
