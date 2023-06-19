package io.generator.go.generator;

import com.theokanning.openai.completion.chat.ChatCompletionResult;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/completion")
@AllArgsConstructor
public class CompletionController {

  private final GeneratorService generatorService;

  @PostMapping()
  @CrossOrigin(origins = "*")
  public ChatCompletionResult compute(@RequestPart("cvFile") MultipartFile cvFile,
      @RequestPart("competencyFile") MultipartFile competencyFile) {
    return generatorService.compute(cvFile, competencyFile);
  }
}
