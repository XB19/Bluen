package tg.bluen.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class Demande extends BaseEntity {

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String email;

    private String telephone;

    @Column(columnDefinition = "text", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.NOUVEAU;

    @Column(columnDefinition = "text")
    private String notes;
}
