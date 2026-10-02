package tg.bluen.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "produits")
public class Produit extends BaseEntity {

    public enum Disponibilite { DISPONIBLE, SUR_COMMANDE, RUPTURE }

    @Column(nullable = false, unique = true)
    private String slug;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String nom;

    @NotNull(message = "Catégorie requise")
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @Column(columnDefinition = "text")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Disponibilite disponibilite = Disponibilite.DISPONIBLE;

    private boolean vedette;

    private boolean actif = true;

    private int ordre;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produit_images", joinColumns = @JoinColumn(name = "produit_id"))
    @OrderColumn(name = "position")
    @Column(name = "url", nullable = false)
    private List<String> images = new ArrayList<>();

    @Valid
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "produit_caracteristiques", joinColumns = @JoinColumn(name = "produit_id"))
    @OrderColumn(name = "position")
    private List<Caracteristique> caracteristiques = new ArrayList<>();

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public String getFamille() {
        return categorie == null ? null : categorie.getFamille();
    }
}
