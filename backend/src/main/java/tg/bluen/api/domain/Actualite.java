package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "actualites")
public class Actualite extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    private String categorie;

    private String image;

    @Column(columnDefinition = "text")
    private String resume;

    @Column(columnDefinition = "text")
    private String contenu;

    private boolean publie = true;
}
