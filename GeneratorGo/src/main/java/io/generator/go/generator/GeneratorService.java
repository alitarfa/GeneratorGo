package io.generator.go.generator;

import com.theokanning.openai.OpenAiApi;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import io.generator.go.file.FileReader;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@AllArgsConstructor
public class GeneratorService {

  private final List<FileReader> fileProcessors;
  private final OpenAiApi openAiApi;
  private static final String COMMAND_COMPETENCY = "Utilisez ce dossier de model de dossier de compétance \n";
  private static final String COMMAND_CV = "pour créer un autre dossier de compétance pour ce CV \n";
  private static final String COMMAND = "en format PDF \n";
  private static final String MODEL = "gpt-3.5-turbo";

  public ChatCompletionResult compute(MultipartFile cvFile, MultipartFile competencyFile) {

    var cvContent = getFileContentAsString(cvFile);
    var competencyContent = getFileContentAsString(competencyFile);

    var request = ChatCompletionRequest.builder()
        .model(MODEL)
        .messages(List.of(buildChatMessage(cvContent, competencyContent)))
        .build();

    return openAiApi.createChatCompletion(request).blockingGet();
  }

  private String getFileContentAsString(MultipartFile multipartFile) {
    return fileProcessors.stream()
        .filter(fileReader -> fileReader.supports(multipartFile.getContentType()))
        .findFirst()
        .orElseThrow(() -> new FileException(
            String.format("The file type %s is not supported", multipartFile.getContentType())))
        .process(multipartFile);
  }

  private ChatMessage buildChatMessage(String cvContent, String competencyContent) {
    var chatMessage = new ChatMessage();
    var contentChat = COMMAND_COMPETENCY
        + competencyContent
        + COMMAND_CV
        + COMMAND
        + cvContent;
    chatMessage.setContent(contentChat);
    chatMessage.setRole(ChatMessageRole.USER.value());
    return chatMessage;
  }
}
