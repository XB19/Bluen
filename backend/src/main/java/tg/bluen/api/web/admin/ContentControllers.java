package tg.bluen.api.web.admin;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tg.bluen.api.domain.Actualite;
import tg.bluen.api.domain.AppelOffre;
import tg.bluen.api.domain.BonPlan;
import tg.bluen.api.domain.Categorie;
import tg.bluen.api.domain.OffreEmploi;
import tg.bluen.api.domain.Partenaire;
import tg.bluen.api.domain.Produit;
import tg.bluen.api.domain.Realisation;
import tg.bluen.api.repository.ActualiteRepository;
import tg.bluen.api.repository.AppelOffreRepository;
import tg.bluen.api.repository.BonPlanRepository;
import tg.bluen.api.repository.CategorieRepository;
import tg.bluen.api.repository.OffreEmploiRepository;
import tg.bluen.api.repository.PartenaireRepository;
import tg.bluen.api.repository.ProduitRepository;
import tg.bluen.api.repository.RealisationRepository;
import tg.bluen.api.service.Slugs;

public final class ContentControllers {

    private ContentControllers() {
    }

    @RestController
    @RequestMapping("/api/admin/categories")
    public static class Categories extends CrudController<Categorie> {

        private final CategorieRepository categories;
        private final ProduitRepository produits;

        public Categories(CategorieRepository categories, ProduitRepository produits) {
            super(categories, Sort.by("famille", "ordre", "nom"));
            this.categories = categories;
            this.produits = produits;
        }

        @Override
        protected void beforeSave(Categorie c) {
            c.setSlug(Slugs.unique(StringUtils.hasText(c.getSlug()) ? c.getSlug() : c.getNom(),
                    s -> categories.findBySlug(s).filter(o -> !o.getId().equals(c.getId())).isPresent()));
        }

        @Override
        protected void beforeDelete(Categorie c) {
            long n = produits.countByCategorieId(c.getId());
            if (n > 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Impossible de supprimer : " + n + " produit(s) utilisent cette catégorie.");
            }
        }
    }

    @RestController
    @RequestMapping("/api/admin/produits")
    public static class Produits extends CrudController<Produit> {

        private final ProduitRepository produits;
        private final CategorieRepository categories;

        public Produits(ProduitRepository produits, CategorieRepository categories) {
            super(produits, Sort.by("ordre", "nom"));
            this.produits = produits;
            this.categories = categories;
        }

        @Override
        protected void beforeSave(Produit p) {
            p.setCategorie(categories.findById(p.getCategorie().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Catégorie introuvable")));
            p.setSlug(Slugs.unique(StringUtils.hasText(p.getSlug()) ? p.getSlug() : p.getNom(),
                    s -> produits.findBySlug(s).filter(o -> !o.getId().equals(p.getId())).isPresent()));
        }
    }

    @RestController
    @RequestMapping("/api/admin/realisations")
    public static class Realisations extends CrudController<Realisation> {
        public Realisations(RealisationRepository repo) {
            super(repo, Sort.by(Sort.Direction.DESC, "date"));
        }
    }

    @RestController
    @RequestMapping("/api/admin/actualites")
    public static class Actualites extends CrudController<Actualite> {
        public Actualites(ActualiteRepository repo) {
            super(repo, Sort.by(Sort.Direction.DESC, "date"));
        }
    }

    @RestController
    @RequestMapping("/api/admin/appels-offres")
    public static class AppelsOffres extends CrudController<AppelOffre> {
        public AppelsOffres(AppelOffreRepository repo) {
            super(repo, Sort.by(Sort.Direction.DESC, "dateLimite"));
        }
    }

    @RestController
    @RequestMapping("/api/admin/bons-plans")
    public static class BonsPlans extends CrudController<BonPlan> {
        public BonsPlans(BonPlanRepository repo) {
            super(repo, Sort.by("ordre", "id"));
        }
    }

    @RestController
    @RequestMapping("/api/admin/offres-emploi")
    public static class OffresEmploi extends CrudController<OffreEmploi> {
        public OffresEmploi(OffreEmploiRepository repo) {
            super(repo, Sort.by(Sort.Direction.DESC, "createdAt"));
        }
    }

    @RestController
    @RequestMapping("/api/admin/partenaires")
    public static class Partenaires extends CrudController<Partenaire> {
        public Partenaires(PartenaireRepository repo) {
            super(repo, Sort.by("ordre", "nom"));
        }
    }
}
