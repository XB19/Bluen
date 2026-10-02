package tg.bluen.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "candidatures")
public class Candidature extends Demande {

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String domaine;

    private String offre;

    @JsonIgnore
    private String cvFichier;

    private String cvNom;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public boolean isAvecCv() {
        return cvFichier != null;
    }
}
