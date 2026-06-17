import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { CalendarCheck, Search, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import { AKTUELLER_NUTZER, getStandort, STANDORTE } from "@/lib/mock-data"

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
        C
      </div>
      <span className="text-lg font-semibold tracking-tight">Calvin</span>
    </div>
  )
}

function BackendStatus() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/hello`)
      .then((r) => r.text())
      .then((text) => { setMessage(text); setStatus("ok") })
      .catch(() => setStatus("error"))
  }, [])

  return (
    <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium">
      <span className={
        status === "ok" ? "size-1.5 rounded-full bg-green-500" :
        status === "error" ? "size-1.5 rounded-full bg-red-500" :
        "size-1.5 rounded-full bg-yellow-400"
      } />
      {status === "ok" ? message : status === "error" ? "Backend nicht erreichbar" : "…"}
    </span>
  )
}

function Header() {
  const { standortId, setStandortId } = useAppState()
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur">
      <Brand />
      <div className="flex items-center gap-2">
        <Select value={standortId} onValueChange={(v) => v && setStandortId(v)}>
          <SelectTrigger className="h-9 w-[140px]" aria-label="Standort wählen">
            <SelectValue>
              {(value: string | null) =>
                (value && getStandort(value)?.name) || "Standort"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STANDORTE.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <BackendStatus />
        <Avatar className="size-9">
          <AvatarFallback className="bg-muted text-xs font-medium">
            {AKTUELLER_NUTZER.initialen}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

const navItems = [
  { to: "/raeume", label: "Räume", icon: Search },
  { to: "/buchungen", label: "Meine", icon: CalendarCheck },
]

function BottomNav() {
  const navigate = useNavigate()
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-3 items-center border-t bg-background px-2 py-1.5">
      <NavTab item={navItems[0]} />
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/schnellbuchung")}
          className="flex flex-col items-center gap-1 -mt-6"
          aria-label="Schnellbuchung"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background">
            <Zap className="size-6" />
          </span>
          <span className="text-[11px] font-medium text-primary">Schnell</span>
        </button>
      </div>
      <NavTab item={navItems[1]} />
    </nav>
  )
}

function NavTab({ item }: { item: (typeof navItems)[number] }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center gap-1 rounded-md py-2 text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      <Icon className="size-5" />
      {item.label}
    </NavLink>
  )
}

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col border-x bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
