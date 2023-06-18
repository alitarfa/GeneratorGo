package io.generator.go.file;

import io.generator.go.generator.FileException;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@Slf4j
public class PdfReader implements FileReader {

  @Override
  public String process(MultipartFile multipartFile) {
    try (var document = PDDocument.load(multipartFile.getInputStream())) {
      var stripper = new PDFTextStripper();
      return stripper.getText(document);
    } catch (Exception exception) {
      log.error("error while reading pdf", exception);
      throw new FileException("error while reading pdf");
    }
  }

  @Override
  public boolean supports(String contentType) {
    return contentType.equalsIgnoreCase("application/pdf");
  }
}
