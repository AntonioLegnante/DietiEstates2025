package com.DietiEstates2025.DietiEstates2025;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(properties = "spring.profiles.active=test")
@ActiveProfiles("test")
class DietiEstates2025ApplicationTests {

	@MockBean
	private MinioService minioService;

	@Test
	void contextLoads() {
	}

}
