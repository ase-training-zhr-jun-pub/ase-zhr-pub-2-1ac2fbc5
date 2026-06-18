package io.innoq.calvin.domain

import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query

interface BuchungRepository : JpaRepository<Buchung, String> {
    fun findByNutzerIdOrderByDatumAscStartAsc(nutzerId: String): List<Buchung>

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Buchung b WHERE b.raumId = :raumId AND b.datum = :datum AND b.start < :ende AND b.ende > :start")
    fun findKonflikteMitLock(
        raumId: String,
        datum: String,
        start: String,
        ende: String,
    ): List<Buchung>

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Buchung b WHERE b.raumId = :raumId AND b.datum = :datum AND b.start < :ende AND b.ende > :start AND b.id <> :ausschliessen")
    fun findKonflikteMitLockOhne(
        raumId: String,
        datum: String,
        start: String,
        ende: String,
        ausschliessen: String,
    ): List<Buchung>

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Buchung b WHERE b.raumId = :raumId AND b.datum = :datum AND b.start < :ende AND b.ende > :start")
    fun hatKonflikte(
        raumId: String,
        datum: String,
        start: String,
        ende: String,
    ): Boolean
}
