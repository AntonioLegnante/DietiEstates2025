package com.DietiEstates2025.DietiEstates2025.JWT;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider  {

    // CHIAVE SEGRETA - deve essere lunga almeno 256 bit (32 caratteri)
    // IN PRODUZIONE mettila in application.properties!
    private final String JWT_SECRET = "questaeunachiavelungaeSegretaPERfirmareImieiTokenJWTinModoSicuro123";

    // Durata del token: 24 ore in millisecondi
    private final long JWT_EXPIRATION = 86400000;

    /**
     * GENERA UN NUOVO TOKEN JWT
     *
     * @param authentication - contiene le informazioni dell'utente autenticato
     * @return String - il token JWT
     */
    public String generateToken(Authentication authentication) {

        // 1. Prendi lo username dall'oggetto Authentication
        String username = authentication.getName();

        System.out.println(authentication.getAuthorities());

        String ruolo = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        System.out.println(ruolo);
        //String ruoli = GrantedAuthority.getAuthority(authentication.getAuthorities().toArray()[0]);

        // 2. Prendi la data e ora ADESSO
        Date adesso = new Date();

        // 3. Calcola quando scade (adesso + 24 ore)
        Date scadenza = new Date(adesso.getTime() + JWT_EXPIRATION);

        // 4. Crea la chiave di firma (dalla stringa segreta)
        SecretKey chiave = Keys.hmacShaKeyFor(
                JWT_SECRET.getBytes(StandardCharsets.UTF_8)
        );

        // 5. COSTRUISCI IL TOKEN
        String token = Jwts.builder()
                .setSubject(username)       // ✅ Salva il ruolo nel token// CHI è l'utente
                .claim("roles", ruolo)
                .setIssuedAt(adesso)            // QUANDO è stato creato
                .setExpiration(scadenza)        // QUANDO scade
                .signWith(chiave)            // FIRMA con la chiave segreta
                .compact();                  // CREA la stringa finale

        return token;
    }

    /**
     * LEGGE LO USERNAME DAL TOKEN
     *
     * @param token - il token JWT
     * @return String - lo username contenuto nel token
     */
    public String getUsernameFromToken(String token) {

        // 1. Crea la stessa chiave usata per firmare
        SecretKey chiave = Keys.hmacShaKeyFor(
                JWT_SECRET.getBytes(StandardCharsets.UTF_8)
        );

        // 2. ANALIZZA il token (lo "apre" e verifica la firma)
        Claims contenuto = Jwts.parserBuilder()
                .setSigningKey(chiave)              // Verifica con la chiave
                .build()
                .parseClaimsJws(token)        // Leggi il token
                .getBody();                   // Prendi i dati dentro

        // 3. Ritorna lo username (il "subject")
        return contenuto.getSubject();
    }

    /**
     * CONTROLLA SE IL TOKEN È VALIDO
     *
     * @param token - il token JWT da controllare
     * @return boolean - true se valido, false se non valido/scaduto
     */
    public boolean validateToken(String token) {
        try {
            // Prova ad analizzare il token
            SecretKey chiave = Keys.hmacShaKeyFor(
                    JWT_SECRET.getBytes(StandardCharsets.UTF_8)
            );

            Jwts.parserBuilder()
                    .setSigningKey(chiave)
                    .build()
                    .parseClaimsJws(token);

            // Se arriviamo qui, il token è valido!
            return true;

        } catch (ExpiredJwtException e) {
            // Token scaduto
            System.out.println("Token scaduto");
            return false;
        } catch (MalformedJwtException e) {
            // Token malformato
            System.out.println("Token non valido");
            return false;
        } catch (Exception e) {
            // Altro errore
            System.out.println("Errore nel validare il token");
            return false;
        }
    }
}