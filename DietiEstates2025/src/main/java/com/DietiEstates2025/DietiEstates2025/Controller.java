package com.DietiEstates2025.DietiEstates2025;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//da rimuovere
@RestController
@RequestMapping("api/v1")
public class Controller {

    @GetMapping
    public List<Utenti> helloworld() {
        return List.of(new Utenti());
    }
}
