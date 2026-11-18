package com.inventory.controller;

import com.inventory.service.TranslationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/translations")
@CrossOrigin(origins = "http://localhost:5173")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @GetMapping("/{language}")
    public Map<String, String> getTranslations(
            @PathVariable String language) {

        return translationService.getTranslations(language);
    }
}