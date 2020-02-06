package com.redclone.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RedcloneApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(RedcloneApplication.class, args);
	}

}
