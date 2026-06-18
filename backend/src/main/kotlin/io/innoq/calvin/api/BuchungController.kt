package io.innoq.calvin.api

import io.innoq.calvin.service.BuchungsService
import io.innoq.calvin.service.DoppelbuchungsException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.Base64

data class BuchungRequest(
    val raumId: String,
    val standortId: String,
    val datum: String,
    val start: String,
    val ende: String,
    val titel: String,
    val notiz: String? = null,
)

data class BuchungResponse(
    val id: String,
    val nutzerId: String,
    val raumId: String,
    val standortId: String,
    val datum: String,
    val start: String,
    val ende: String,
    val titel: String,
    val notiz: String?,
    val status: String,
)

data class VerfuegbarkeitResponse(val verfuegbar: Boolean)

@RestController
@RequestMapping("/api")
class BuchungController(private val service: BuchungsService) {
    @GetMapping("/buchungen")
    fun getMeineBuchungen(
        @RequestHeader("Authorization") auth: String,
    ): ResponseEntity<List<BuchungResponse>> {
        val nutzerId = extractNutzerId(auth)
        return ResponseEntity.ok(service.getMeineBuchungen(nutzerId).map { it.toResponse() })
    }

    @PostMapping("/buchungen")
    fun buchungErstellen(
        @RequestHeader("Authorization") auth: String,
        @RequestBody req: BuchungRequest,
    ): ResponseEntity<BuchungResponse> {
        val nutzerId = extractNutzerId(auth)
        return try {
            val buchung =
                service.buchungErstellen(
                    nutzerId = nutzerId,
                    raumId = req.raumId,
                    standortId = req.standortId,
                    datum = req.datum,
                    start = req.start,
                    ende = req.ende,
                    titel = req.titel,
                    notiz = req.notiz,
                )
            ResponseEntity.status(HttpStatus.CREATED).body(buchung.toResponse())
        } catch (e: DoppelbuchungsException) {
            ResponseEntity.status(HttpStatus.CONFLICT).build()
        }
    }

    @DeleteMapping("/buchungen/{id}")
    fun buchungStornieren(
        @RequestHeader("Authorization") auth: String,
        @PathVariable id: String,
    ): ResponseEntity<Void> {
        val nutzerId = extractNutzerId(auth)
        return try {
            service.buchungStornieren(id, nutzerId)
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/verfuegbarkeit")
    fun verfuegbarkeitPruefen(
        @RequestParam raumId: String,
        @RequestParam datum: String,
        @RequestParam start: String,
        @RequestParam ende: String,
    ): VerfuegbarkeitResponse = VerfuegbarkeitResponse(service.istVerfuegbar(raumId, datum, start, ende))
}

private fun extractNutzerId(authHeader: String): String =
    try {
        val encoded = authHeader.removePrefix("Basic ").trim()
        String(Base64.getDecoder().decode(encoded)).substringBefore(":")
    } catch (e: Exception) {
        "unbekannt"
    }

private fun io.innoq.calvin.domain.Buchung.toResponse() =
    BuchungResponse(
        id = id,
        nutzerId = nutzerId,
        raumId = raumId,
        standortId = standortId,
        datum = datum,
        start = start,
        ende = ende,
        titel = titel,
        notiz = notiz,
        status = status,
    )
