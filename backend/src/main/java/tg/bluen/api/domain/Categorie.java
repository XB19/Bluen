package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Categorie extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String slug;

    @NotBlank
    @Pattern(regexp = "solaire|allinone|gpl", message = "Famille inconnue")
    @Column(nullable = false)
    private String famille;

    @Column(columnDefinition = "text")
    private String description;

    private int ordre;
}
