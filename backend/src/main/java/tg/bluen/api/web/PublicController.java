package tg.bluen.api.web;

import jakarta.persistence.criteria.Join;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.domain.Actualite;
import tg.bluen.api.domain.AppelOffre;
import tg.bluen.api.domain.BonPlan;
import tg.bluen.api.domain.Categorie;
import tg.bluen.api.domain.OffreEmploi;
import tg.bluen.api.domain.Partenaire;
import tg.bluen.api.domain.Produit;
import tg.bluen.api.domain.Realisation;
import tg.bluen.api.dto.PageResponse;
import tg.bluen.api.repository.ActualiteRepository;
import tg.bluen.api.repository.AppelOffreRepository;
import tg.bluen.api.repository.BonPlanRepository;
import tg.bluen.api.repository.CategorieRepository;
import tg.bluen.api.repository.OffreEmploiRepository;
import tg.bluen.api.repository.PartenaireRepository;
import tg.bluen.api.repository.ProduitRepository;
import tg.bluen.api.repository.RealisationRepository;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final ProduitRepository produits;
    private final CategorieRepository categories;
    private final RealisationRepository realisations;
    private final ActualiteRepository actualites;
    private final AppelOffreRepository appelsOffres;
    private final PartenaireRepository partenaires;
    private final BonPlanRepository bonsPlans;
    private final OffreEmploiRepository offres;

    public PublicController(ProduitRepository produits, CategorieRepository categories,
                            RealisationRepository realisations, ActualiteRepository actualites,
                            AppelOffreRepository appelsOffres, PartenaireRepository partenaires,
                            BonPlanRepository bonsPlans, OffreEmploiRepository offres) {
        this.produits = produits;
        this.categories = categories;
        this.realisations = realisations;
        this.actualites = actualites;
        this.appelsOffres = appelsOffres;
        this.partenaires = partenaires;
        this.bonsPlans = bonsPlans;
        this.offres = offres;
    }

    @GetMapping("/produits")
    public PageResponse<Produit> produits(@RequestParam(required = false) String famille,
                                          @RequestParam(required = false) String categorie,
                                          @RequestParam(required = false) String q,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "8") int size) {
        Specification<Produit> spec = filtre(famille, categorie, q)
                .and((root, query, cb) -> cb.isTrue(root.get("actif")));
        return PageResponse.from(produits.findAll(spec,
                PageRequest.of(Math.max(page - 1, 0), Math.min(Math.max(size, 1), 100), Sort.by("ordre", "nom"))));
    }

    static Specification<Produit> filtre(String famille, String categorie, String q) {
        Specification<Produit> spec = Specification.unrestricted();
        if (StringUtils.hasText(famille)) {
            spec = spec.and((root, query, cb) -> {
                Join<Produit, Categorie> cat = root.join("categorie");
                return cb.equal(cat.get("famille"), famille);
            });
        }
        if (StringUtils.hasText(categorie)) {
            spec = spec.and((root, query, cb) -> {
                Join<Produit, Categorie> cat = root.join("categorie");
                return cb.equal(cat.get("slug"), categorie);
            });
        }
        if (StringUtils.hasText(q)) {
            String like = "%" + q.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> {
                Join<Produit, Categorie> cat = root.join("categorie");
                return cb.or(
                        cb.like(cb.lower(root.get("nom")), like),
                        cb.like(cb.lower(cat.get("nom")), like),
                        cb.like(cb.lower(root.get("description")), like));
            });
        }
        return spec;
    }

    @GetMapping("/produits/vedettes")
    public List<Produit> vedettes() {
        List<Produit> vedettes = produits.findTop4ByActifTrueAndVedetteTrueOrderByOrdreAscNomAsc();
        return vedettes.isEmpty()
                ? produits.findTop4ByActifTrueAndDisponibiliteOrderByOrdreAscNomAsc(Produit.Disponibilite.DISPONIBLE)
                : vedettes;
    }

    @GetMapping("/produits/categories")
    public List<Categorie> categories(@RequestParam String famille) {
        return categories.findByFamilleOrderByOrdreAscNomAsc(famille);
    }

    @GetMapping("/produits/{slug}")
    public Map<String, Object> produit(@PathVariable String slug) {
        Produit produit = produits.findBySlugAndActifTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produit introuvable."));
        return Map.of("produit", produit,
                "similaires", produits.findTop4ByActifTrueAndCategorieFamilleAndSlugNotOrderByOrdreAscNomAsc(produit.getFamille(), slug));
    }

    @GetMapping("/realisations")
    public List<Realisation> realisations() {
        return realisations.findByPublieeTrueOrderByDateDesc();
    }

    @GetMapping("/actualites")
    public List<Actualite> actualites() {
        return actualites.findByPublieTrueOrderByDateDesc();
    }

    @GetMapping("/appels-offres")
    public List<AppelOffre> appelsOffres() {
        return appelsOffres.findByActifTrueOrderByDateLimiteDesc();
    }

    @GetMapping("/partenaires")
    public List<Partenaire> partenaires() {
        return partenaires.findAllByOrderByOrdreAscNomAsc();
    }

    @GetMapping("/bons-plans")
    public List<BonPlan> bonsPlans() {
        return bonsPlans.findByActifTrueOrderByOrdreAscIdAsc();
    }

    @GetMapping("/offres-emploi")
    public List<OffreEmploi> offresEmploi() {
        return offres.findByPublieeTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/offres-emploi/{id}")
    public OffreEmploi offreEmploi(@PathVariable Long id) {
        return offres.findById(id).filter(OffreEmploi::isPubliee)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offre introuvable ou expirée."));
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of("produits", produits.countByActifTrue(), "realisations", realisations.countByPublieeTrue());
    }
}
