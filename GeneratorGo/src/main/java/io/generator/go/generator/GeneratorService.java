package io.generator.go.generator;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import io.generator.go.file.FileReader;
import java.time.Duration;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@AllArgsConstructor
public class GeneratorService {

  private final List<FileReader> fileProcessors;
  private static final String COMMAND = "Je veux générer un dossier de compétance pour ce cv merci de me donner un text sous format de pdf";
  private static final String SPACER = "\n";
  private static final String MODEL = "gpt-3.5-turbo";

  public ChatCompletionResult compute(MultipartFile multipartFile) {
    var fileContent = fileProcessors.stream()
        .filter(fileReader -> fileReader.supports(multipartFile.getContentType()))
        .findFirst()
        .orElseThrow(() -> new FileException(
            String.format("Le fichier %s n'est pas supporté", multipartFile.getContentType())))
        .process(multipartFile);

    var request = ChatCompletionRequest.builder()
        .model(MODEL)
        .messages(List.of(buildChatMessage(fileContent)))
        .build();

    var api = OpenAiService.buildApi(
        "Ai",
        Duration.ofMinutes(5));

    return api.createChatCompletion(request).blockingGet();
  }

  @NotNull
  private static ChatMessage buildChatMessage(String fileContent) {
    var chatMessage = new ChatMessage();
    chatMessage.setContent(COMMAND + SPACER + fileContent);
    chatMessage.setRole(ChatMessageRole.USER.value());
    return chatMessage;
  }
}
