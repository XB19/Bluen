package tg.bluen.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import tg.bluen.api.domain.Statut;

public final class FormDtos {

    private FormDtos() {
    }

    public record DevisRequest(
            @NotBlank @Size(min = 2, max = 120, message = "Nom requis (min. 2 caractères)") String nom,
            @NotBlank(message = "Email requis") @Email(message = "Email invalide") String email,
            @NotBlank(message = "Téléphone requis") @Size(max = 30) String telephone,
            @Size(max = 160) String entreprise,
            @Size(max = 160) String produit,
            @NotBlank(message = "Message requis") @Size(max = 5000) String message) {
    }

    public record ContactRequest(
            @NotBlank(message = "Nom requis") @Size(max = 120) String nom,
            @NotBlank(message = "Email requis") @Email(message = "Email invalide") String email,
            @Size(max = 30) String telephone,
            @NotBlank(message = "Message requis") @Size(max = 5000) String message) {
    }

    public record CandidatureRequest(
            @NotBlank(message = "Requis") @Size(max = 80) String nom,
            @NotBlank(message = "Requis") @Size(max = 80) String prenom,
            @NotBlank(message = "Email requis") @Email(message = "Email invalide") String email,
            @Size(max = 30) String telephone,
            @NotBlank(message = "Requis") @Size(max = 40) String domaine,
            @Size(max = 200) String offre,
            @NotBlank @Size(min = 50, max = 5000, message = "Minimum 50 caractères requis") String message) {
    }

    public record StatutUpdate(Statut statut, @Size(max = 5000) String notes) {
    }
}
