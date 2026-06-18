import { useNavigate } from "react-router-dom"
import { Star, Users, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import { istVerfuegbar, type Konferenzraum } from "@/lib/mock-data"

interface RoomCardProps {
  raum: Konferenzraum
  datum: string
  start: string
  ende: string
  /** Hebt die Karte als Smart-Empfehlung hervor */
  bestMatch?: boolean
  /** Hebt die Karte als aktuell ausgewählten Buchungsentwurf hervor (CLVN-016d) */
  ausgewaehlt?: boolean
}

export function RoomCard({ raum, datum, start, ende, bestMatch, ausgewaehlt }: RoomCardProps) {
  const navigate = useNavigate()
  const { istFavorit, toggleFavorit } = useAppState()
  const verfuegbar = istVerfuegbar(raum, datum, start, ende)
  const favorit = istFavorit(raum.id)

  return (
    <Card className={cn(
      "relative",
      bestMatch && "border-primary ring-1 ring-primary",
      ausgewaehlt && "border-amber-400 ring-2 ring-amber-400",
    )}>
      {bestMatch && (
        <Badge className="absolute -top-2 left-3 bg-primary">Beste Wahl</Badge>
      )}
      {ausgewaehlt && (
        <Badge className="absolute -top-2 left-3 border-amber-400 bg-amber-50 text-amber-700">
          Ausgewählt
        </Badge>
      )}
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold leading-tight">{raum.name}</h3>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {raum.kapazitaet}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {raum.etage} · {raum.raumnummer}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleFavorit(raum.id)}
            aria-label={favorit ? "Favorit entfernen" : "Als Favorit markieren"}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Star className={cn("size-5", favorit && "fill-primary text-primary")} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {raum.ausstattung.map((a) => (
            <Badge key={a} variant="secondary" className="font-normal">
              {a}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              verfuegbar ? "text-emerald-600" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                verfuegbar ? "bg-emerald-500" : "bg-muted-foreground/50",
              )}
            />
            {verfuegbar ? "Verfügbar" : "Belegt"}
          </span>
          <Button
            size="sm"
            variant={verfuegbar ? "default" : "outline"}
            onClick={() => navigate(`/raeume/${raum.id}`)}
          >
            {verfuegbar ? "Details & Buchen" : "Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
