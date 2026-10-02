package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "offres_emploi")
public class OffreEmploi extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @NotBlank
    @Column(nullable = false)
    private String domaine;

    @NotBlank
    @Column(nullable = false)
    private String typeContrat;

    private String lieu;

    private LocalDate dateLimite;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String missions;

    @Column(columnDefinition = "text")
    private String profil;

    private boolean publiee = true;
}
