package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Caracteristique {

    @NotBlank
    @Column(nullable = false)
    private String label;

    @NotBlank
    @Column(nullable = false)
    private String valeur;
}
