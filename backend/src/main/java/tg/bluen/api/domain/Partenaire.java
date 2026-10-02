package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "partenaires")
public class Partenaire extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String nom;

    @Size(max = 4)
    private String initiales;

    @Column(columnDefinition = "text")
    private String description;

    private String pays;

    private String logo;

    private int ordre;
}
