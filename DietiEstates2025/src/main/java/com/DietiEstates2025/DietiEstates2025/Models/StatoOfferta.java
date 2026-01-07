package com.DietiEstates2025.DietiEstates2025.Models;

public enum StatoOfferta {
    IN_ATTESA,      // L'offerta è stata inviata e attende risposta
    ACCETTATA,      // L'agente ha accettato l'offerta
    RIFIUTATA,      // L'agente ha rifiutato l'offerta
    CONTROFFERTA,   // L'agente ha fatto una controfferta
    RITIRATA        // L'utente ha ritirato l'offerta
}