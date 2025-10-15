package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.ImageController;
import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
public class ImmobileService {
/*
    @Autowired
    private MinioService minioService;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "bmp"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @PostConstruct
    public void init() {
        minioService.init();
    }

    private final ImmobileRepository immobileRepository;

    ImmobileService(ImmobileRepository immobileRepository) {
        this.immobileRepository = immobileRepository;
    }

    public void insertImmobile(MultipartFile file, Immobile immobile) {
        String fileUrl = minioService.uploadFile(file);

        ImageController.ImageUploadResponse response = new ImageController.ImageUploadResponse(
                originalFilename,
                fileUrl,
                file.getSize(),
                file.getContentType()
        );

        immobileRepository.save();
    }*/
}
