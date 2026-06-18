package io.innoq.calvin.domain

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "buchungen")
data class Buchung(
    @Id val id: String,
    val nutzerId: String,
    val raumId: String,
    val standortId: String,
    val datum: String,
    val start: String,
    val ende: String,
    val titel: String,
    val notiz: String? = null,
    val status: String = "anstehend",
)
