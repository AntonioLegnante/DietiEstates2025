package com.DietiEstates2025.DietiEstates2025;

import io.minio.*;
import io.minio.errors.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MinioServiceTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private MinioService minioService;

    private final String bucketName = "test-bucket";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(minioService, "bucketName", bucketName);
    }

    @Test
    void testInit_BucketNotExists_CreatesBucket() throws Exception {
        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(false);

        minioService.init();

        verify(minioClient).bucketExists(any(BucketExistsArgs.class));
        verify(minioClient).makeBucket(any(MakeBucketArgs.class));
        verify(minioClient).setBucketPolicy(any(SetBucketPolicyArgs.class));
    }

    @Test
    void testInit_BucketExists_DoesNotCreateBucket() throws Exception {
        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

        minioService.init();

        verify(minioClient).bucketExists(any(BucketExistsArgs.class));
        verify(minioClient, never()).makeBucket(any(MakeBucketArgs.class));
        verify(minioClient, never()).setBucketPolicy(any(SetBucketPolicyArgs.class));
    }

    @Test
    void testInit_ThrowsException_WrapsInRuntimeException() throws Exception {
        when(minioClient.bucketExists(any(BucketExistsArgs.class)))
                .thenThrow(new RuntimeException("Connection error"));

        RuntimeException exception = assertThrows(RuntimeException.class, minioService::init);

        assertTrue(exception.getMessage().contains("Errore inizializzazione MinIO"));
    }

    @Test
    void testUploadFile_Success() throws Exception {
        byte[] content = "test content".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                content
        );

        // Mock putObject correttamente
        when(minioClient.putObject(any(PutObjectArgs.class))).thenReturn(null);

        String url = minioService.uploadFile(file);

        assertNotNull(url);
        assertTrue(url.contains(bucketName));
        assertTrue(url.endsWith(".jpg"));
        verify(minioClient).putObject(any(PutObjectArgs.class));
    }

    @Test
    void testUploadFile_PreservesFileExtension() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                "test".getBytes()
        );

        when(minioClient.putObject(any(PutObjectArgs.class))).thenReturn(null);

        String url = minioService.uploadFile(file);

        assertTrue(url.endsWith(".pdf"));
    }

    @Test
    void testGetPublicUrl() {
        String fileName = "test-file.jpg";

        String url = minioService.getPublicUrl(fileName);

        assertEquals("http://localhost:9000/" + bucketName + "/" + fileName, url);
    }

    @Test
    void testDownloadFile_Success() throws Exception {
        String fileName = "test.jpg";
        InputStream expectedStream = new ByteArrayInputStream("test content".getBytes());

        // Creiamo un mock di GetObjectResponse
        GetObjectResponse mockResponse = mock(GetObjectResponse.class);
        when(mockResponse.readAllBytes()).thenReturn(expectedStream.readAllBytes());

        // Facciamo restituire il mock da getObject()
        when(minioClient.getObject(any(GetObjectArgs.class))).thenReturn(mockResponse);

        InputStream result = minioService.downloadFile(fileName);

        assertNotNull(result);
        // Possiamo leggere tutto il contenuto per confrontarlo
        byte[] content = result.readAllBytes();
        assertArrayEquals("test content".getBytes(), content);

        verify(minioClient).getObject(any(GetObjectArgs.class));
    }


    @Test
    void testDeleteFile_Success() throws Exception {
        String fileName = "test.jpg";
        doNothing().when(minioClient).removeObject(any(RemoveObjectArgs.class));

        minioService.deleteFile(fileName);

        verify(minioClient).removeObject(any(RemoveObjectArgs.class));
    }

    @Test
    void testDeleteFile_ThrowsException() throws Exception {
        String fileName = "test.jpg";
        doThrow(new RuntimeException("Delete failed"))
                .when(minioClient).removeObject(any(RemoveObjectArgs.class));

        assertThrows(Exception.class, () -> minioService.deleteFile(fileName));
    }
}
