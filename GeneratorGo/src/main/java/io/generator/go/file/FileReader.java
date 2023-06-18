package io.generator.go.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileReader {

  String process(MultipartFile multipartFile);

  boolean supports(String contentType);
}
