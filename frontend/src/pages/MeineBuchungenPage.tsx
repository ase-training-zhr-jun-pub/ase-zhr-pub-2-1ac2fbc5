import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CalendarCheck, Clock, MapPin, CalendarPlus, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getRaum, getStandort } from "@/lib/mock-data"
import { getMeineBuchungen, storniereBuchungApi, type BuchungDto } from "@/lib/api"
import { exportiereAlsIcs } from "@/lib/ics"

function formatDatum(iso: string) {
  return iso.split("-").reverse().join(".")
}

function BuchungsKarte({
  buchung,
  onStorniert,
}: {
  buchung: BuchungDto
  onStorniert: (id: string) => void
}) {
  const raum = getRaum(buchung.raumId)
  const standort = getStandort(buchung.standortId)

  async function stornieren() {
    try {
      await storniereBuchungApi(buchung.id)
      onStorniert(buchung.id)
      toast("Buchung storniert", {
        description: `${raum?.name ?? buchung.raumId} · ${formatDatum(buchung.datum)}`,
      })
    } catch {
      toast.error("Stornierung fehlgeschlagen", { description: "Bitte versuche es erneut." })
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{buchung.titel}</h3>
            <p className="text-sm text-muted-foreground">
              {raum?.name ?? buchung.raumId} · {standort?.name ?? buchung.standortId}
            </p>
          </div>
          <Badge variant={buchung.status === "anstehend" ? "default" : "secondary"}>
            {buchung.status === "anstehend" ? "Anstehend" : "Vergangen"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarCheck className="size-4" /> {formatDatum(buchung.datum)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" /> {buchung.start}–{buchung.ende}
          </span>
          {raum && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {raum.etage}
            </span>
          )}
        </div>
        {buchung.notiz && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            {buchung.notiz}
          </p>
        )}
        {buchung.status === "anstehend" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                exportiereAlsIcs({
                  id: buchung.id,
                  raumId: buchung.raumId,
                  standortId: buchung.standortId,
                  datum: buchung.datum,
                  start: buchung.start,
                  ende: buchung.ende,
                  titel: buchung.titel,
                  notiz: buchung.notiz,
                  status: buchung.status,
                })
                toast.success("Kalendereintrag exportiert", {
                  description: "calvin-" + buchung.id + ".ics",
                })
              }}
            >
              <CalendarPlus className="size-4" /> .ics
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={stornieren}
            >
              <Trash2 className="size-4" /> Stornieren
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MeineBuchungenPage() {
  const [buchungen, setBuchungen] = useState<BuchungDto[]>([])
  const [laden, setLaden] = useState(true)
  const [tab, setTab] = useState("anstehend")

  useEffect(() => {
    getMeineBuchungen()
      .then(setBuchungen)
      .catch(() => toast.error("Buchungen konnten nicht geladen werden"))
      .finally(() => setLaden(false))
  }, [])

  function onStorniert(id: string) {
    setBuchungen((prev) => prev.filter((b) => b.id !== id))
  }

  const anstehend = buchungen.filter((b) => b.status === "anstehend")
  const vergangen = buchungen.filter((b) => b.status === "vergangen")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Meine Buchungen</h1>

      {laden ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="anstehend" className="flex-1">
              Anstehend ({anstehend.length})
            </TabsTrigger>
            <TabsTrigger value="vergangen" className="flex-1">
              Vergangene ({vergangen.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anstehend" className="flex flex-col gap-3 pt-3">
            {anstehend.length === 0 ? (
              <EmptyState text="Keine anstehenden Buchungen." />
            ) : (
              anstehend.map((b) => (
                <BuchungsKarte key={b.id} buchung={b} onStorniert={onStorniert} />
              ))
            )}
          </TabsContent>

          <TabsContent value="vergangen" className="flex flex-col gap-3 pt-3">
            {vergangen.length === 0 ? (
              <EmptyState text="Keine vergangenen Buchungen." />
            ) : (
              vergangen.map((b) => (
                <BuchungsKarte key={b.id} buchung={b} onStorniert={onStorniert} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
        <CalendarCheck className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
