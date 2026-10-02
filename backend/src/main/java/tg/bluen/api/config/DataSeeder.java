package tg.bluen.api.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tg.bluen.api.domain.Actualite;
import tg.bluen.api.domain.AppelOffre;
import tg.bluen.api.domain.BonPlan;
import tg.bluen.api.domain.Caracteristique;
import tg.bluen.api.domain.Categorie;
import tg.bluen.api.domain.Partenaire;
import tg.bluen.api.domain.Produit;
import tg.bluen.api.domain.Realisation;
import tg.bluen.api.domain.Utilisateur;
import tg.bluen.api.repository.ActualiteRepository;
import tg.bluen.api.repository.AppelOffreRepository;
import tg.bluen.api.repository.BonPlanRepository;
import tg.bluen.api.repository.CategorieRepository;
import tg.bluen.api.repository.PartenaireRepository;
import tg.bluen.api.repository.ProduitRepository;
import tg.bluen.api.repository.RealisationRepository;
import tg.bluen.api.repository.UtilisateurRepository;
import tg.bluen.api.service.Slugs;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String IMG = "/images/";

    private final AppProperties props;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository users;
    private final CategorieRepository categories;
    private final ProduitRepository produits;
    private final RealisationRepository realisations;
    private final ActualiteRepository actualites;
    private final AppelOffreRepository appels;
    private final PartenaireRepository partenaires;
    private final BonPlanRepository bonsPlans;

    public DataSeeder(AppProperties props, PasswordEncoder passwordEncoder, UtilisateurRepository users,
                      CategorieRepository categories, ProduitRepository produits, RealisationRepository realisations,
                      ActualiteRepository actualites, AppelOffreRepository appels, PartenaireRepository partenaires,
                      BonPlanRepository bonsPlans) {
        this.props = props;
        this.passwordEncoder = passwordEncoder;
        this.users = users;
        this.categories = categories;
        this.produits = produits;
        this.realisations = realisations;
        this.actualites = actualites;
        this.appels = appels;
        this.partenaires = partenaires;
        this.bonsPlans = bonsPlans;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (users.countByRole(Utilisateur.Role.ADMIN) == 0) {
            Utilisateur admin = new Utilisateur();
            admin.setNom("BLUEN");
            admin.setPrenom("Administrateur");
            admin.setUsername(props.admin().username());
            admin.setEmail(props.admin().email());
            admin.setPassword(passwordEncoder.encode(props.admin().password()));
            admin.setRole(Utilisateur.Role.ADMIN);
            users.save(admin);
            log.warn("Compte administrateur créé : '{}'. Changez le mot de passe par défaut via ADMIN_PASSWORD.", admin.getUsername());
        }
        if (categories.count() == 0 && produits.count() == 0) {
            seedCatalogue();
        }
        if (realisations.count() == 0) {
            seedRealisations();
        }
        if (actualites.count() == 0) {
            seedActualites();
        }
        if (appels.count() == 0) {
            seedAppels();
        }
        if (partenaires.count() == 0) {
            seedPartenaires();
        }
        if (bonsPlans.count() == 0) {
            seedBonsPlans();
        }
    }

    private Categorie categorie(String nom, String famille, int ordre) {
        Categorie c = new Categorie();
        c.setNom(nom);
        c.setSlug(Slugs.of(nom));
        c.setFamille(famille);
        c.setOrdre(ordre);
        return categories.save(c);
    }

    private void produit(Categorie categorie, String nom, String description, Produit.Disponibilite disponibilite,
                         String image, String... caracs) {
        Produit p = new Produit();
        p.setNom(nom);
        p.setSlug(Slugs.of(nom));
        p.setCategorie(categorie);
        p.setDescription(description);
        p.setDisponibilite(disponibilite);
        p.setVedette(true);
        p.setImages(new ArrayList<>(List.of(IMG + "produits/" + image)));
        List<Caracteristique> list = new ArrayList<>();
        for (int i = 0; i + 1 < caracs.length; i += 2) {
            list.add(new Caracteristique(caracs[i], caracs[i + 1]));
        }
        p.setCaracteristiques(list);
        produits.save(p);
    }

    private void seedCatalogue() {
        Map<String, Categorie> c = new HashMap<>();
        c.put("panneaux", categorie("Panneaux solaires", "solaire", 1));
        c.put("batteries", categorie("Batteries", "solaire", 2));
        c.put("onduleurs", categorie("Onduleurs", "solaire", 3));
        categorie("Accessoires", "solaire", 4);
        c.put("eclairage", categorie("Éclairage solaire", "allinone", 1));
        categorie("GPL / Générateurs", "gpl", 1);
        categorie("Groupes électrogènes", "gpl", 2);

        produit(c.get("panneaux"), "Panneau monocristallin 450W",
                "Haute performance, idéal pour installations résidentielles.",
                Produit.Disponibilite.DISPONIBLE, "panneau-monocristallin-450w.jpg",
                "Puissance", "450 Wc", "Technologie", "Monocristallin",
                "Garantie", "12 ans produit / 25 ans rendement", "Dimensions", "2090 x 1045 x 35 mm");
        produit(c.get("batteries"), "Batterie lithium 5kWh",
                "Stockage longue durée, faible entretien.",
                Produit.Disponibilite.DISPONIBLE, "batterie-lithium-5kwh.jpg",
                "Puissance", "5 kWh", "Technologie", "Lithium Fer Phosphate", "Garantie", "10 ans", "Poids", "22 kg");
        produit(c.get("onduleurs"), "Onduleur hybride 5kVA",
                "Compatible réseau et solaire, pour foyers et PME.",
                Produit.Disponibilite.SUR_COMMANDE, "onduleur-hybride-5kva.jpg",
                "Puissance", "5 kVA", "Technologie", "Hybride", "Garantie", "5 ans");
        produit(c.get("eclairage"), "Lampadaire solaire LED 60W",
                "Éclairage public autonome, détection de mouvement.",
                Produit.Disponibilite.RUPTURE, "lampadaire-solaire-led-60w.jpg");
    }

    private void realisation(String titre, String lieu, LocalDate date, String image, String description) {
        Realisation r = new Realisation();
        r.setTitre(titre);
        r.setLieu(lieu);
        r.setDate(date);
        r.setImage(IMG + image);
        r.setDescription(description);
        realisations.save(r);
    }

    private void seedRealisations() {
        realisation("Installation résidentielle 3kW", "Lomé", LocalDate.of(2026, 3, 4), "panneau-ciel.jpg",
                "Kit solaire complet pour une résidence familiale.");
        realisation("Solution énergétique PME", "Kara", LocalDate.of(2026, 1, 5), "realisations/solution-energetique-pme.jpg",
                "Onduleur hybride et batteries pour un atelier.");
        realisation("Éclairage public solaire", "Tsévié", LocalDate.of(2025, 11, 3), "realisations/eclairage-public-solaire.jpg",
                "12 lampadaires solaires installés sur l'axe principal.");
    }

    private void actualite(String titre, LocalDate date, String categorie, String image, String resume, String contenu) {
        Actualite a = new Actualite();
        a.setTitre(titre);
        a.setDate(date);
        a.setCategorie(categorie);
        a.setImage(IMG + image);
        a.setResume(resume);
        a.setContenu(contenu);
        actualites.save(a);
    }

    private void seedActualites() {
        actualite("Installation réussie d'une centrale solaire 100 kWc pour une usine à Lomé", LocalDate.of(2026, 7, 22),
                "Projet", "toiture-industrielle.jpg",
                "BLUEN SAS a finalisé l'installation d'une centrale solaire industrielle de 100 kWc pour une usine de "
                        + "transformation alimentaire à Lomé, réduisant de 60% la facture énergétique du client.",
                "Le projet, réalisé en 6 semaines, comprend 220 panneaux monocristallins 450W, un système de batteries "
                        + "LiFePO4 de 200 kWh et deux onduleurs hybrides. Le client bénéficie désormais d'une autonomie "
                        + "énergétique complète pendant les heures de pointe et d'une réduction significative de sa dépendance "
                        + "au réseau CEET. BLUEN SAS assure la maintenance préventive trimestrielle du système.");
        actualite("BLUEN SAS signe un partenariat stratégique avec le Groupe ZENER", LocalDate.of(2026, 6, 15),
                "Partenariat", "poignee-main.jpg",
                "BLUEN SAS renforce sa position sur le marché ouest-africain en officialisant son partenariat avec le "
                        + "Groupe ZENER, leader régional de la distribution d'énergie.",
                "C'est une étape majeure dans le développement de BLUEN SAS. La signature de ce partenariat avec le Groupe "
                        + "ZENER permet à BLUEN d'accéder à un réseau de distribution étendu au Togo, au Bénin et en "
                        + "Guinée-Bissau. Ce partenariat ouvre également la voie à des projets conjoints dans le domaine du "
                        + "Gas to Power, renforçant ainsi l'offre complémentaire solaire-GPL de BLUEN SAS.");
    }

    private void appel(String ref, String titre, String description, LocalDate date, AppelOffre.Statut statut) {
        AppelOffre a = new AppelOffre();
        a.setReference(ref);
        a.setTitre(titre);
        a.setDescription(description);
        a.setDateLimite(date);
        a.setStatut(statut);
        appels.save(a);
    }

    private void seedAppels() {
        appel("AO-2026-001", "Fourniture et installation d'un système solaire hybride 50kWc",
                "BLUEN SAS lance un appel d'offres pour la fourniture et l'installation d'un système solaire hybride de "
                        + "50 kWc pour le compte d'une entreprise industrielle à Lomé. Les soumissionnaires doivent justifier "
                        + "d'au moins 3 ans d'expérience dans le domaine.",
                LocalDate.of(2026, 7, 31), AppelOffre.Statut.OUVERT);
        appel("AO-2026-002", "Installation de 20 lampadaires solaires All-In-One — Commune de Tsévié",
                "Dans le cadre de l'électrification de la voie principale de Tsévié, BLUEN SAS recherche des partenaires "
                        + "qualifiés pour la fourniture et l'installation de 20 lampadaires solaires All-In-One de 60W avec "
                        + "détection de mouvement et autonomie de 3 nuits.",
                LocalDate.of(2026, 8, 15), AppelOffre.Statut.EN_COURS);
        appel("AO-2026-003", "Contrat PPA — Production d'énergie solaire pour hôpital régional",
                "Dans le cadre d'un Power Purchase Agreement, BLUEN SAS recherche un partenaire financier pour le "
                        + "déploiement d'une centrale solaire de 30 kWc sur le toit de l'hôpital régional de Kara. Production "
                        + "déléguée sur 10 ans avec garantie de performance.",
                LocalDate.of(2026, 7, 2), AppelOffre.Statut.FERME);
    }

    private void partenaire(int ordre, String nom, String initiales, String description, String pays) {
        Partenaire p = new Partenaire();
        p.setOrdre(ordre);
        p.setNom(nom);
        p.setInitiales(initiales);
        p.setDescription(description);
        p.setPays(pays);
        partenaires.save(p);
    }

    private void seedPartenaires() {
        partenaire(1, "Zener Togo", "ZT", "Partenaire stratégique au Togo pour la distribution et l'installation de solutions solaires.", "Togo");
        partenaire(2, "Zener Bénin", "ZB", "Extension du réseau Zener au Bénin, couvrant les besoins en énergie propre de la région.", "Bénin");
        partenaire(3, "Zener Guinée-Bissau", "ZG", "Présence en Guinée-Bissau pour accompagner les projets d'électrification solaire locaux.", "Guinée-Bissau");
        partenaire(4, "PLS", "PLS", "Partenaire logistique et de services pour le déploiement des équipements énergétiques.", "Afrique de l'Ouest");
        partenaire(5, "PGS", "PGS", "Spécialiste en gestion et supervision de projets d'énergie renouvelable en Afrique.", "Afrique de l'Ouest");
    }

    private void bonPlan(int ordre, String titre, String badge, String image, String description, String lien) {
        BonPlan b = new BonPlan();
        b.setOrdre(ordre);
        b.setTitre(titre);
        b.setBadge(badge);
        b.setImage(image == null ? null : IMG + "zencard/" + image);
        b.setDescription(description);
        b.setLien(lien);
        bonsPlans.save(b);
    }

    private void seedBonsPlans() {
        bonPlan(1, "ZenCard — Offre Spéciale", "ZenCard", "zencard_pub2.jpg", null, null);
        bonPlan(2, "ZenCard — Promotion Exclusive", "ZenCard", "zencard_pub3.jpg", null, null);
        bonPlan(3, "ZenCard — Bon Plan #5", "ZenCard", "zencard_pub5.jpg", null, null);
        bonPlan(4, "ZenCard — Bon Plan #6", "ZenCard", "zencard_pub6.jpg", null, null);
        bonPlan(5, "ZenCard — Bon Plan #7", "ZenCard", "zencard_pub7.jpg", null, null);
        bonPlan(6, "ZenCard — Édition Spéciale", "ZenCard", "zencard_pub5b.jpg", null, null);
        bonPlan(7, "ZenCard — Offre Limitée", "ZenCard", "zencard_pub6b.jpg", null, null);
        bonPlan(8, "ZenCard — Le Produit", "ZenCard", "zencard_product.jpg", null, null);
        bonPlan(9, "Formation Gratuite : Maîtrisez Excel pour les RH", "Bon Plan", null,
                "Kapi Consult vous offre un accès gratuit à sa formation en ligne \"Excel pour les professionnels RH\" pour tout abonnement...",
                "https://kapiconsult.tg/articles/formation-gratuite-maitrisez-excel-pour-les-rh-69b2408f8940d");
    }
}
