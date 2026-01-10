package com.DietiEstates2025.DietiEstates2025.Config;

import com.DietiEstates2025.DietiEstates2025.JWT.JwtAuthenticationFilter;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ENDPOINT PUBBLICI
                        .requestMatchers("/auth/login", "/auth/registrazione", "/auth/cambiaPassword", "/auth/google-login", "/auth/google-register").permitAll()
                        .requestMatchers("/api/immobili/ricerca").permitAll()
                        .requestMatchers("/", "/index.html", "/static/**", "/favicon.ico", "/assets/**", "/vite.svg", "/manifest.json").permitAll()

                        // ENDPOINT PROTETTI PER AMMINISTRATORI
                        .requestMatchers("/auth/aggiungiAgente").hasAuthority("Amministratore")

                        // ENDPOINT SPECIFICI AUTENTICATI
                        .requestMatchers(
                                "/api/immobili",
                                "/chat/openChat",
                                "/chat/getChat",
                                "/chat/addMessage",
                                "/chat/retrieveChatsUser",
                                "/chat/retrieveChatsAgent",
                                "/chat/makeOffer",
                                "/chat/acceptOffer",
                                "/chat/rejectOffer",
                                "/chat/counterOffer",
                                "/chat/getOffers"
                        ).authenticated()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}