package com.DietiEstates2025.DietiEstates2025;

import io.minio.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String bucketName;

    public void init() {
        try {
            // Crea il bucket se non esiste
            boolean found = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );

            if (!found) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
            }

            // Imposta SEMPRE il bucket come pubblico (anche se già esiste)
            String policy = String.format(
                    "{\n" +
                            "    \"Version\": \"2012-10-17\",\n" +
                            "    \"Statement\": [\n" +
                            "        {\n" +
                            "            \"Effect\": \"Allow\",\n" +
                            "            \"Principal\": {\"AWS\": \"*\"},\n" +
                            "            \"Action\": [\"s3:GetObject\"],\n" +
                            "            \"Resource\": [\"arn:aws:s3:::%s/*\"]\n" +
                            "        }\n" +
                            "    ]\n" +
                            "}", bucketName);

            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(policy)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Errore inizializzazione MinIO", e);
        }
    }

    public String uploadFile(@NotNull MultipartFile file) throws Exception {
        // 🔹 Genera nome unico con controllo estensione
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) { // punto trovato
                extension = originalFilename.substring(dotIndex);
            } else {
                extension = ".jpg"; // fallback default
            }
        } else {
            extension = ".jpg"; // fallback default
        }

        String fileName = UUID.randomUUID().toString() + extension;

        // Upload su MinIO
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        // Ritorna URL pubblico
        return getPublicUrl(fileName);
    }

    // NUOVO METODO: Upload multiplo per gallery images
    public List<String> uploadMultipleFiles(List<MultipartFile> files) throws Exception {
        List<String> urls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return urls;
        }

        // Limita a massimo 5 file
        int maxFiles = Math.min(files.size(), 5);

        for (int i = 0; i < maxFiles; i++) {
            MultipartFile file = files.get(i);
            if (file != null && !file.isEmpty()) {
                try {
                    String url = uploadFile(file);
                    urls.add(url);
                } catch (Exception e) {
                    // Log dell'errore ma continua con gli altri file
                    System.err.println("Errore upload file " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }
        }

        return urls;
    }

    // NUOVO METODO: Elimina più file
    public void deleteMultipleFiles(List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) {
            return;
        }

        for (String url : fileUrls) {
            try {
                // Estrai il nome del file dall'URL /images/filename.jpg
                String fileName = url.replace("/images/", "");
                deleteFile(fileName);
            } catch (Exception e) {
                System.err.println("Errore eliminazione file " + url + ": " + e.getMessage());
            }
        }
    }

    public String getPublicUrl(String fileName) {
        return String.format("/images/%s", fileName);
    }

    public InputStream downloadFile(String fileName) throws Exception {
        return minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
        );
    }

    public void deleteFile(String fileName) throws Exception {
        minioClient.removeObject(
                RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .build()
        );
    }
}
