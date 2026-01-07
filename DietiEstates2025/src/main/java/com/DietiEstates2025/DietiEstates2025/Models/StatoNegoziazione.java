package com.DietiEstates2025.DietiEstates2025.Models;

public enum StatoNegoziazione {
    APERTA,         // La negoziazione è in corso
    CHIUSA_ACCETTATA, // Offerta accettata, negoziazione conclusa
    CHIUSA_RIFIUTATA, // Negoziazione chiusa senza accordo
    SOSPESA         // Temporaneamente sospesa
}