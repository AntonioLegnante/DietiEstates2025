package com.DietiEstates2025.DietiEstates2025;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*") // Configura secondo le tue esigenze
public class ImageController {

    // Usa application.properties per configurare il path
    @Value("${upload.dir:uploads/}")
    private String uploadDir;

    @Value("${nginx.base.url:http://localhost:8081/images}")
    private String nginxBaseUrl;

    // Formati immagine supportati
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "bmp"
    );

    // Limite dimensione file (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {

        // Validazione file vuoto
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Il file è vuoto"));
        }

        // Validazione dimensione
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Il file supera la dimensione massima di 10MB")
            );
        }

        // Validazione estensione
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("Formato file non supportato. Usa: " + ALLOWED_EXTENSIONS)
            );
        }

        try {
            // Genera un nome unico mantenendo l'estensione originale
            String extension = getFileExtension(originalFilename);
            String fileName = UUID.randomUUID().toString() + "." + extension;

            // Crea la directory se non esiste
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Salva il file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Genera URL accessibile via Nginx
            String fileUrl = nginxBaseUrl + "/" + fileName;

            // Risposta con dettagli del file
            ImageUploadResponse response = new ImageUploadResponse(
                    fileName,
                    fileUrl,
                    file.getSize(),
                    file.getContentType()
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nel salvataggio del file: " + e.getMessage()));
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // Validazione nome file per sicurezza (evita path traversal)
            if (filename.contains("..") || filename.contains("/")) {
                return ResponseEntity.badRequest().build();
            }

            Path path = Paths.get(uploadDir).resolve(filename);

            // Verifica che il file esista
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(path);

            // Imposta il Content-Type appropriato
            String contentType = getContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deleteImage(@PathVariable String filename) {
        try {
            // Validazione nome file
            if (filename.contains("..") || filename.contains("/")) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Nome file non valido"));
            }

            Path path = Paths.get(uploadDir).resolve(filename);

            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            Files.delete(path);
            return ResponseEntity.ok(new SuccessResponse("File eliminato con successo"));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nell'eliminazione del file"));
        }
    }

    // Metodi helper
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

    // Classi per le risposte JSON
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

        // Getters
        public String getFilename() { return filename; }
        public String getUrl() { return url; }
        public long getSize() { return size; }
        public String getContentType() { return contentType; }
    }

    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() { return error; }
    }

    static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }
}
