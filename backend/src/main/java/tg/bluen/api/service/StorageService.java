package tg.bluen.api.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.config.AppProperties;

@Service
public class StorageService {

    private static final Map<String, String> PUBLIC_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/gif", ".gif",
            "application/pdf", ".pdf");

    private static final Map<String, String> CV_TYPES = Map.of(
            "application/pdf", ".pdf",
            "application/msword", ".doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx");

    private static final long CV_MAX_BYTES = 5L * 1024 * 1024;

    private final Path publicRoot;
    private final Path privateRoot;

    public StorageService(AppProperties props) throws IOException {
        this.publicRoot = Path.of(props.uploadsDir()).toAbsolutePath().normalize();
        this.privateRoot = Path.of(props.privateDir()).toAbsolutePath().normalize();
        Files.createDirectories(publicRoot);
        Files.createDirectories(privateRoot);
    }

    public String store(MultipartFile file) {
        String extension = PUBLIC_TYPES.get(file.getContentType());
        if (file.isEmpty() || extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Format non supporté (JPG, PNG, WEBP, GIF ou PDF)");
        }
        return "/uploads/" + write(file, publicRoot, extension);
    }

    public String storeCv(MultipartFile file) {
        String extension = CV_TYPES.get(file.getContentType());
        if (file.isEmpty() || extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le CV doit être au format PDF, DOC ou DOCX");
        }
        if (file.getSize() > CV_MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le CV ne doit pas dépasser 5 Mo");
        }
        return write(file, privateRoot, extension);
    }

    public Resource loadPrivate(String name) {
        Path path = privateRoot.resolve(name).normalize();
        if (!path.startsWith(privateRoot) || !Files.isRegularFile(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier introuvable");
        }
        return new FileSystemResource(path);
    }

    public void deletePrivate(String name) {
        Path path = privateRoot.resolve(name).normalize();
        if (!path.startsWith(privateRoot)) {
            return;
        }
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Impossible de supprimer le fichier", e);
        }
    }

    private static String write(MultipartFile file, Path root, String extension) {
        String name = UUID.randomUUID() + extension;
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, root.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Échec de l'enregistrement du fichier", e);
        }
        return name;
    }
}
