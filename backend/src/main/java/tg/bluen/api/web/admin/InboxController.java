package tg.bluen.api.web.admin;

import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.domain.Candidature;
import tg.bluen.api.domain.Demande;
import tg.bluen.api.domain.DemandeDevis;
import tg.bluen.api.domain.MessageContact;
import tg.bluen.api.domain.Statut;
import tg.bluen.api.dto.FormDtos.StatutUpdate;
import tg.bluen.api.dto.PageResponse;
import tg.bluen.api.repository.CandidatureRepository;
import tg.bluen.api.repository.DemandeDevisRepository;
import tg.bluen.api.repository.DemandeRepository;
import tg.bluen.api.repository.MessageContactRepository;
import tg.bluen.api.service.StorageService;

public abstract class InboxController<T extends Demande> {

    private final DemandeRepository<T> repository;

    protected InboxController(DemandeRepository<T> repository) {
        this.repository = repository;
    }

    @GetMapping
    public PageResponse<T> list(@RequestParam(required = false) Statut statut,
                                @RequestParam(defaultValue = "1") int page,
                                @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return PageResponse.from(statut == null ? repository.findAll(pageable) : repository.findByStatut(statut, pageable));
    }

    @PatchMapping("/{id}")
    public T update(@PathVariable Long id, @Valid @RequestBody StatutUpdate req) {
        T item = find(id);
        if (req.statut() != null) {
            item.setStatut(req.statut());
        }
        if (req.notes() != null) {
            item.setNotes(req.notes());
        }
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        T item = find(id);
        repository.delete(item);
        afterDelete(item);
    }

    protected void afterDelete(T item) {
    }

    private T find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Élément introuvable"));
    }

    @RestController
    @RequestMapping("/api/admin/devis")
    public static class Devis extends InboxController<DemandeDevis> {
        public Devis(DemandeDevisRepository repo) {
            super(repo);
        }
    }

    @RestController
    @RequestMapping("/api/admin/messages")
    public static class Messages extends InboxController<MessageContact> {
        public Messages(MessageContactRepository repo) {
            super(repo);
        }
    }

    @RestController
    @RequestMapping("/api/admin/candidatures")
    public static class Candidatures extends InboxController<Candidature> {

        private final CandidatureRepository candidatures;
        private final StorageService storage;

        public Candidatures(CandidatureRepository repo, StorageService storage) {
            super(repo);
            this.candidatures = repo;
            this.storage = storage;
        }

        @Override
        protected void afterDelete(Candidature c) {
            if (c.isAvecCv()) {
                storage.deletePrivate(c.getCvFichier());
            }
        }

        @GetMapping("/{id}/cv")
        public ResponseEntity<Resource> cv(@PathVariable Long id) {
            Candidature c = candidatures.findById(id)
                    .filter(Candidature::isAvecCv)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun CV pour cette candidature"));
            String nom = c.getCvNom() != null ? c.getCvNom() : "cv" + c.getCvFichier().substring(c.getCvFichier().lastIndexOf('.'));
            return ResponseEntity.ok()
                    .contentType(MediaTypeFactory.getMediaType(c.getCvFichier()).orElse(MediaType.APPLICATION_OCTET_STREAM))
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                            .filename(nom, StandardCharsets.UTF_8).build().toString())
                    .body(storage.loadPrivate(c.getCvFichier()));
        }
    }
}
