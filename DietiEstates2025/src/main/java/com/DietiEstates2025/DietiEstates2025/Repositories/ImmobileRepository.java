package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImmobileRepository extends JpaRepository<Immobile, Integer> {
    @Query("""
        SELECT i FROM Immobile i
        WHERE (:localita IS NULL OR i.indirizzo LIKE %:localita%)
        OR (i.prezzo <= :maxPrezzo AND i.prezzo >= :minPrezzo)
         OR (
         (:affitta IS NOT NULL AND :affitta = TRUE AND i.affitto = TRUE)
            OR (:vendita IS NOT NULL AND :vendita = TRUE AND i.vendita = TRUE)
            OR (:affitta IS NULL AND :vendita IS NULL)
         )
         OR (:numeroStanze IS NULL OR i.numeroStanze = :numeroStanze)
         OR (:dimensione IS NULL OR i.dimensione = :dimensione)
         OR (:piano IS NULL OR i.piano = :piano)
         OR (:classeEnergetica IS NULL OR i.classeEnergetica = :classeEnergetica)
    """)
    List<Immobile> ricercaAvanzata(
            @Param("localita") String localita,
            @Param("minPrezzo") Double minPrezzo,
            @Param("maxPrezzo") Double maxPrezzo,
            @Param("affitta") Boolean affitta,
            @Param("vendita") Boolean vendita,
            @Param("numeroStanze") Integer numeroStanze,
            @Param("dimensione") String dimensione,
            @Param("piano") String piano,
            @Param("classeEnergetica") String classeEnergetica
    );
}
