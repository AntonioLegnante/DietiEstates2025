package com.DietiEstates2025.DietiEstates2025.JWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * Questo metodo viene eseguito per OGNI richiesta HTTP
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // PASSO 1: Estrai il token JWT dall'header Authorization
            String jwt = getJwtFromRequest(request);

            // PASSO 2: Se c'è un token E è valido
            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {

                // PASSO 3: Estrai lo username dal token
                String username = jwtTokenProvider.getUsernameFromToken(jwt);

                // PASSO 4: Carica i dettagli dell'utente dal database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // PASSO 5: Crea un oggetto Authentication
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // Credenziali (non servono, già autenticato)
                                userDetails.getAuthorities()  // Ruoli dell'utente
                        );

                // PASSO 6: Aggiungi dettagli della richiesta
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // PASSO 7: Salva l'autenticazione nel SecurityContext
                // QUESTO è il passaggio CHIAVE che dice a Spring "questo utente è autenticato!"
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("✅ Utente autenticato: " + username);
            }

        } catch (Exception e) {
            System.out.println("❌ Errore nell'autenticazione JWT: " + e.getMessage());
        }

        // PASSO 8: Continua con la catena dei filtri
        // (passa al prossimo filtro o al controller)
        filterChain.doFilter(request, response);
    }

    /**
     * Estrae il token JWT dall'header Authorization
     * Header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5..."
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Controlla che l'header esista e inizi con "Bearer "
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // Ritorna solo il token (rimuove "Bearer ")
            return bearerToken.substring(7);
        }

        return null;
    }
}
