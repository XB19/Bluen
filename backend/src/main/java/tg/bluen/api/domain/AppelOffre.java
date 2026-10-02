package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "appels_offres")
public class AppelOffre extends BaseEntity {

    public enum Statut { OUVERT, EN_COURS, FERME }

    @NotBlank
    @Column(nullable = false, unique = true)
    private String reference;

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "text")
    private String description;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateLimite;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.OUVERT;

    private String fichierUrl;

    private boolean actif = true;
}
