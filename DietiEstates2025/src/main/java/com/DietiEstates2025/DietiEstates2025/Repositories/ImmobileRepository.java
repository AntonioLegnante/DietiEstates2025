package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImmobileRepository extends JpaRepository<Immobile, Integer> {
    @Query("""
    SELECT i FROM Immobile i
    WHERE (:localita IS NULL 
          OR LOWER(i.indirizzo) LIKE LOWER(CONCAT('%', :localita, '%'))
          OR LOWER(i.citta) LIKE LOWER(CONCAT('%', :localita, '%')))
                 
    AND ((i.prezzo <= :maxPrezzo AND i.prezzo >= :minPrezzo) 
        OR (:maxPrezzo IS NULL AND i.prezzo >= :minPrezzo) 
        OR (:minPrezzo IS NULL AND i.prezzo <= :maxPrezzo)
        OR (:minPrezzo IS NULL AND :maxPrezzo IS NULL))
            
    AND (
        (:affitta = TRUE AND i.affitto = TRUE)
        OR (:vendita = TRUE AND i.vendita = TRUE)
        OR (:affitta = FALSE AND :vendita = FALSE)
     )
     
     AND (:numeroStanze IS NULL OR i.numeroStanze >= :numeroStanze)
     
     AND (:dimensione IS NULL OR i.dimensione >= :dimensione)
     
     AND (:piano IS NULL OR i.piano = :piano)
     
     AND (:classeEnergetica IS NULL OR i.classeEnergetica = :classeEnergetica)
     
     AND (:numeroBagni IS NULL OR i.numeroBagni >= :numeroBagni)
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
            @Param("classeEnergetica") String classeEnergetica,
            @Param("numeroBagni") Integer numeroBagni
    );
}