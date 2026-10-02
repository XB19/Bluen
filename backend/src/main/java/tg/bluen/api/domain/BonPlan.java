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
@Table(name = "bons_plans")
public class BonPlan extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @Size(max = 40)
    private String badge;

    private String image;

    @Column(columnDefinition = "text")
    private String description;

    private String lien;

    private int ordre;

    private boolean actif = true;
}
