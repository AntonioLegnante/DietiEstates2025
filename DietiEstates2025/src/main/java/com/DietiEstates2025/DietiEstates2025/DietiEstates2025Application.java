package com.DietiEstates2025.DietiEstates2025;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
public class DietiEstates2025Application {

	public static void main(String[] args) {

		ApplicationContext context = SpringApplication.run(DietiEstates2025Application.class, args);

		// ✅ Recupera il bean MinioService gestito da Spring
		MinioService minioService = context.getBean(MinioService.class);

		try {
			// Inizializza bucket
			minioService.init();
			System.out.println("✅ Bucket inizializzato");

			// Crea un file di prova
			byte[] content = "Contenuto di prova".getBytes();
			MultipartFile file = new MultipartFile() {
				@Override
				public String getName() {
					return "file";
				}

				@Override
				public String getOriginalFilename() {
					return "prova.txt";
				}

				@Override
				public String getContentType() {
					return "text/plain";
				}

				@Override
				public boolean isEmpty() {
					return content.length == 0;
				}

				@Override
				public long getSize() {
					return content.length;
				}

				@Override
				public byte[] getBytes() throws IOException {
					return content;
				}

				@Override
				public InputStream getInputStream() throws IOException {
					return new ByteArrayInputStream(content);
				}

				@Override
				public void transferTo(java.io.File dest) throws IOException, IllegalStateException {
					throw new UnsupportedOperationException("Non supportato in test");
				}
			};

			// ✅ Upload del file
			String url = minioService.uploadFile(file);
			System.out.println("📤 File caricato su MinIO: " + url);

			// ✅ Download e stampa
			String fileName = url.substring(url.lastIndexOf("/") + 1);
			try (InputStream downloaded = minioService.downloadFile(fileName)) {
				byte[] buffer = downloaded.readAllBytes();
				System.out.println("📥 Contenuto scaricato: " + new String(buffer));
			}

			// ✅ Elimina il file
			minioService.deleteFile(fileName);
			System.out.println("🗑️ File eliminato con successo!");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
