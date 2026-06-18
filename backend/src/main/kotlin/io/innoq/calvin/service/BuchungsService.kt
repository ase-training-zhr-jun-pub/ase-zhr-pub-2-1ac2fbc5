package io.innoq.calvin.service

import io.innoq.calvin.domain.Buchung
import io.innoq.calvin.domain.BuchungRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

class DoppelbuchungsException(message: String) : RuntimeException(message)

class BuchungNichtGefundenException(message: String) : RuntimeException(message)

@Service
class BuchungsService(private val repo: BuchungRepository) {
    fun getMeineBuchungen(nutzerId: String): List<Buchung> = repo.findByNutzerIdOrderByDatumAscStartAsc(nutzerId)

    fun istVerfuegbar(
        raumId: String,
        datum: String,
        start: String,
        ende: String,
    ): Boolean = !repo.hatKonflikte(raumId, datum, start, ende)

    @Transactional
    fun buchungErstellen(
        nutzerId: String,
        raumId: String,
        standortId: String,
        datum: String,
        start: String,
        ende: String,
        titel: String,
        notiz: String?,
    ): Buchung {
        val konflikte = repo.findKonflikteMitLock(raumId, datum, start, ende)
        if (konflikte.isNotEmpty()) throw DoppelbuchungsException("Der Konferenzraum ist für diesen Zeitraum bereits belegt.")
        return repo.save(
            Buchung(
                id = UUID.randomUUID().toString(),
                nutzerId = nutzerId,
                raumId = raumId,
                standortId = standortId,
                datum = datum,
                start = start,
                ende = ende,
                titel = titel,
                notiz = notiz,
            ),
        )
    }

    @Transactional
    fun buchungAendern(
        id: String,
        nutzerId: String,
        raumId: String,
        standortId: String,
        datum: String,
        start: String,
        ende: String,
        titel: String,
        notiz: String?,
    ): Buchung {
        val buchung = repo.findById(id).orElseThrow { BuchungNichtGefundenException("Buchung $id nicht gefunden") }
        if (buchung.nutzerId != nutzerId) throw BuchungNichtGefundenException("Buchung $id gehört nicht zu Nutzer $nutzerId")
        val konflikte = repo.findKonflikteMitLockOhne(raumId, datum, start, ende, id)
        if (konflikte.isNotEmpty()) throw DoppelbuchungsException("Der Konferenzraum ist für diesen Zeitraum bereits belegt.")
        return repo.save(buchung.copy(raumId = raumId, standortId = standortId, datum = datum, start = start, ende = ende, titel = titel, notiz = notiz))
    }

    @Transactional
    fun buchungStornieren(
        id: String,
        nutzerId: String,
    ) {
        val buchung =
            repo.findById(id).orElseThrow {
                BuchungNichtGefundenException("Buchung $id nicht gefunden")
            }
        if (buchung.nutzerId != nutzerId) throw BuchungNichtGefundenException("Buchung $id gehört nicht zu Nutzer $nutzerId")
        repo.delete(buchung)
    }
}
