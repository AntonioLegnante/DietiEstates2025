package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//:affitta IS NULL OR
//:acquisto IS NULL OR
public interface ImmobileRepository extends JpaRepository<Immobile, Integer> {
    @Query("""
        SELECT i FROM Immobile i
        WHERE (:localita IS NULL OR i.indirizzo LIKE %:localita%)
        AND (:prezzo IS NULL OR i.prezzo <= :prezzo)
        AND (:affitta IS NULL OR i.affitto = :affitta) 
        AND (:acquisto IS NULL OR i.vendita = :acquisto) 
    """)
    List<Immobile> ricercaAvanzata(
            @Param("localita") String localita,
            @Param("prezzo") Double prezzo,
            @Param("affitta") Boolean affitta,
            @Param("acquisto") Boolean acquisto
    );
}
