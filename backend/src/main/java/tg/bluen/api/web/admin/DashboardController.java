package tg.bluen.api.web.admin;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tg.bluen.api.domain.AppelOffre;
import tg.bluen.api.domain.Demande;
import tg.bluen.api.domain.DemandeDevis;
import tg.bluen.api.domain.Statut;
import tg.bluen.api.repository.ActualiteRepository;
import tg.bluen.api.repository.AppelOffreRepository;
import tg.bluen.api.repository.CandidatureRepository;
import tg.bluen.api.repository.DemandeDevisRepository;
import tg.bluen.api.repository.MessageContactRepository;
import tg.bluen.api.repository.OffreEmploiRepository;
import tg.bluen.api.repository.ProduitRepository;
import tg.bluen.api.repository.RealisationRepository;
import tg.bluen.api.repository.UtilisateurRepository;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private static final int MOIS = 6;

    private final ProduitRepository produits;
    private final RealisationRepository realisations;
    private final ActualiteRepository actualites;
    private final AppelOffreRepository appels;
    private final DemandeDevisRepository devis;
    private final MessageContactRepository messages;
    private final CandidatureRepository candidatures;
    private final UtilisateurRepository utilisateurs;
    private final OffreEmploiRepository offres;

    public DashboardController(ProduitRepository produits, RealisationRepository realisations,
                               ActualiteRepository actualites, AppelOffreRepository appels,
                               DemandeDevisRepository devis, MessageContactRepository messages,
                               CandidatureRepository candidatures, UtilisateurRepository utilisateurs,
                               OffreEmploiRepository offres) {
        this.offres = offres;
        this.produits = produits;
        this.realisations = realisations;
        this.actualites = actualites;
        this.appels = appels;
        this.devis = devis;
        this.messages = messages;
        this.candidatures = candidatures;
        this.utilisateurs = utilisateurs;
    }

    public record Point(String mois, long devis, long messages, long candidatures) {
    }

    public record Dashboard(Map<String, Long> compteurs, List<Point> evolution, List<DemandeDevis> derniersDevis) {
    }

    @GetMapping
    public Dashboard dashboard() {
        Map<String, Long> compteurs = new LinkedHashMap<>();
        compteurs.put("devisNouveaux", devis.countByStatut(Statut.NOUVEAU));
        compteurs.put("devisTotal", devis.count());
        compteurs.put("messagesNouveaux", messages.countByStatut(Statut.NOUVEAU));
        compteurs.put("candidaturesNouvelles", candidatures.countByStatut(Statut.NOUVEAU));
        compteurs.put("produits", produits.count());
        compteurs.put("realisations", realisations.count());
        compteurs.put("actualites", actualites.count());
        compteurs.put("appelsOuverts", appels.countByActifTrueAndStatut(AppelOffre.Statut.OUVERT));
        compteurs.put("utilisateurs", utilisateurs.count());
        compteurs.put("offresEmploi", offres.countByPublieeTrue());

        YearMonth debut = YearMonth.now(ZoneOffset.UTC).minusMonths(MOIS - 1);
        Instant since = debut.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Map<YearMonth, Long> d = parMois(devis.findByCreatedAtAfter(since));
        Map<YearMonth, Long> m = parMois(messages.findByCreatedAtAfter(since));
        Map<YearMonth, Long> c = parMois(candidatures.findByCreatedAtAfter(since));

        List<Point> evolution = new ArrayList<>();
        for (int i = 0; i < MOIS; i++) {
            YearMonth ym = debut.plusMonths(i);
            evolution.add(new Point(ym.toString(), d.getOrDefault(ym, 0L), m.getOrDefault(ym, 0L), c.getOrDefault(ym, 0L)));
        }
        return new Dashboard(compteurs, evolution, devis.findTop5ByOrderByCreatedAtDesc());
    }

    private static Map<YearMonth, Long> parMois(List<? extends Demande> items) {
        return items.stream().collect(Collectors.groupingBy(
                i -> YearMonth.from(i.getCreatedAt().atZone(ZoneOffset.UTC)), Collectors.counting()));
    }
}
