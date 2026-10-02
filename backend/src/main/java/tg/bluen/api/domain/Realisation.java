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
@Table(name = "realisations")
public class Realisation extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String titre;

    @NotBlank
    @Column(nullable = false)
    private String lieu;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    private String puissance;

    private String image;

    @Column(columnDefinition = "text")
    private String description;

    private boolean publiee = true;
}
