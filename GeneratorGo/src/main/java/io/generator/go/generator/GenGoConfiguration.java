package io.generator.go.generator;

import com.theokanning.openai.OpenAiApi;
import com.theokanning.openai.service.OpenAiService;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GenGoConfiguration {

  @Value("${generator.secret.token}")
  private String token;

  @Bean
  public OpenAiApi openAiApi() {
    return OpenAiService.buildApi(token, Duration.ofMinutes(10));
  }

}
