package com.DietiEstates2025.DietiEstates2025;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

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

                // Imposta il bucket come pubblico
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
            }
        } catch (Exception e) {
            throw new RuntimeException("Errore inizializzazione MinIO", e);
        }
    }

    public String uploadFile(@NotNull MultipartFile file) throws Exception {
        // Genera nome unico
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
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

    public String getPublicUrl(String fileName) {
        return String.format("http://localhost:9000/%s/%s", bucketName, fileName);
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