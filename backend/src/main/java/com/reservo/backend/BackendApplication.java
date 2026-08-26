package com.reservo.backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@Slf4j
@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dbMigrator(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				java.util.List<String> tables = jdbcTemplate.queryForList("SHOW TABLES", String.class);
				log.info("Available tables in DB on startup: " + tables);
			} catch (Exception e) {
				log.warn("Could not list tables: " + e.getMessage());
			}
			log.info("Running automatic DB columns migration to LONGTEXT to support base64 uploads...");
			try {
				// Alter users kyc_document_url
				jdbcTemplate.execute("ALTER TABLE users MODIFY kyc_document_url LONGTEXT");
				log.info("Altered users.kyc_document_url to LONGTEXT successfully!");
			} catch (Exception e) {
				log.warn("Could not alter users.kyc_document_url: " + e.getMessage());
			}

			try {
				// Alter resorts image_url
				jdbcTemplate.execute("ALTER TABLE resorts MODIFY image_url LONGTEXT");
				log.info("Altered resorts.image_url to LONGTEXT successfully!");
			} catch (Exception e) {
				log.warn("Could not alter resorts.image_url: " + e.getMessage());
			}

			try {
				// Alter resorts gallery_urls
				jdbcTemplate.execute("ALTER TABLE resorts MODIFY gallery_urls LONGTEXT");
				log.info("Altered resorts.gallery_urls to LONGTEXT successfully!");
			} catch (Exception e) {
				log.warn("Could not alter resorts.gallery_urls: " + e.getMessage());
			}

			try {
				// Add video_urls if not exists, then alter to LONGTEXT
				try {
					jdbcTemplate.execute("ALTER TABLE resorts ADD COLUMN video_urls LONGTEXT");
					log.info("Added resorts.video_urls successfully!");
				} catch (Exception ex) {
					// Column might already exist, so alter it
					jdbcTemplate.execute("ALTER TABLE resorts MODIFY video_urls LONGTEXT");
					log.info("Altered resorts.video_urls to LONGTEXT successfully!");
				}
			} catch (Exception e) {
				log.warn("Could not handle resorts.video_urls: " + e.getMessage());
			}
		};
	}
}
