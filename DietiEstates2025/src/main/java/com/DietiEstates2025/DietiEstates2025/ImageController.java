package com.DietiEstates2025.DietiEstates2025;

import com.DietiEstates2025.DietiEstates2025.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        System.out.println("Guarda quanti Integrali!!!");
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Il file è vuoto"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Il file supera la dimensione massima di 10MB")
            );
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Formato file non supportato. Usa: " + ALLOWED_EXTENSIONS)
            );
        }

        try {
            String fileUrl = minioService.uploadFile(file);

            ImageUploadResponse response = new ImageUploadResponse(
                    originalFilename,
                    fileUrl,
                    file.getSize(),
                    file.getContentType()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nel salvataggio del file: " + e.getMessage()));
        }
    }


    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deleteImage(@PathVariable String filename) {
        try {
            minioService.deleteFile(filename);
            return ResponseEntity.ok(new SuccessResponse("File eliminato con successo"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nell'eliminazione del file"));
        }
    }

    private boolean isValidImageFile(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1).toLowerCase();
        }
        return "";
    }

    // Response classes
    static class ImageUploadResponse {
        private String filename;
        private String url;
        private long size;
        private String contentType;

        public ImageUploadResponse(String filename, String url, long size, String contentType) {
            this.filename = filename;
            this.url = url;
            this.size = size;
            this.contentType = contentType;
        }

        public String getFilename() { return filename; }
        public String getUrl() { return url; }
        public long getSize() { return size; }
        public String getContentType() { return contentType; }
    }

    static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
    }

    static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // Validazione nome file per sicurezza (evita path traversal)
            if (filename.contains("..") || filename.contains("/")) {
                return ResponseEntity.badRequest().build();
            }

            // Scarica il file da MinIO
            InputStream inputStream = minioService.downloadFile(filename);
            byte[] imageBytes = inputStream.readAllBytes();
            inputStream.close();

            // Determina il Content-Type in base all'estensione
            String contentType = getContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private String getContentType(String filename) {
        String extension = getFileExtension(filename);
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "bmp":
                return "image/bmp";
            default:
                return "application/octet-stream";
        }
    }
}