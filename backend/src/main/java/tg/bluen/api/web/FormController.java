package tg.bluen.api.web;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tg.bluen.api.domain.Candidature;
import tg.bluen.api.domain.DemandeDevis;
import tg.bluen.api.domain.MessageContact;
import tg.bluen.api.dto.FormDtos.CandidatureRequest;
import tg.bluen.api.dto.FormDtos.ContactRequest;
import tg.bluen.api.dto.FormDtos.DevisRequest;
import tg.bluen.api.repository.CandidatureRepository;
import tg.bluen.api.repository.DemandeDevisRepository;
import tg.bluen.api.repository.MessageContactRepository;
import tg.bluen.api.service.NotificationService;
import tg.bluen.api.service.StorageService;

@RestController
@RequestMapping("/api")
public class FormController {

    private final DemandeDevisRepository devis;
    private final MessageContactRepository messages;
    private final CandidatureRepository candidatures;
    private final NotificationService notifications;
    private final StorageService storage;

    public FormController(DemandeDevisRepository devis, MessageContactRepository messages,
                          CandidatureRepository candidatures, NotificationService notifications,
                          StorageService storage) {
        this.devis = devis;
        this.messages = messages;
        this.candidatures = candidatures;
        this.notifications = notifications;
        this.storage = storage;
    }

    @PostMapping("/devis")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> devis(@Valid @RequestBody DevisRequest req) {
        DemandeDevis d = new DemandeDevis();
        d.setNom(req.nom().trim());
        d.setEmail(req.email().trim());
        d.setTelephone(req.telephone().trim());
        d.setEntreprise(req.entreprise());
        d.setProduit(req.produit());
        d.setMessage(req.message().trim());
        devis.save(d);
        notifications.nouveauDevis(d);
        return Map.of("id", d.getId());
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> contact(@Valid @RequestBody ContactRequest req) {
        MessageContact m = new MessageContact();
        m.setNom(req.nom().trim());
        m.setEmail(req.email().trim());
        m.setTelephone(req.telephone());
        m.setMessage(req.message().trim());
        messages.save(m);
        notifications.nouveauMessage(m);
        return Map.of("id", m.getId());
    }

    @PostMapping(value = "/candidatures", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> candidature(@Valid @RequestBody CandidatureRequest req) {
        return enregistrer(req, null);
    }

    @PostMapping(value = "/candidatures", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> candidatureAvecCv(@Valid @ModelAttribute CandidatureRequest req,
                                               @RequestPart(name = "cv", required = false) MultipartFile cv) {
        return enregistrer(req, cv);
    }

    private Map<String, Long> enregistrer(CandidatureRequest req, MultipartFile cv) {
        Candidature c = new Candidature();
        c.setNom(req.nom().trim());
        c.setPrenom(req.prenom().trim());
        c.setEmail(req.email().trim());
        c.setTelephone(req.telephone());
        c.setDomaine(req.domaine());
        c.setOffre(req.offre());
        c.setMessage(req.message().trim());
        if (cv != null && !cv.isEmpty()) {
            c.setCvFichier(storage.storeCv(cv));
            c.setCvNom(cv.getOriginalFilename());
        }
        candidatures.save(c);
        notifications.nouvelleCandidature(c);
        return Map.of("id", c.getId());
    }
}
