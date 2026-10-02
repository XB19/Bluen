package tg.bluen.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "demandes_devis")
public class DemandeDevis extends Demande {

    private String entreprise;

    private String produit;
}
