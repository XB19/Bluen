package tg.bluen.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import tg.bluen.api.domain.Utilisateur;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(@NotBlank(message = "Champ requis") String identifiant,
                               @NotBlank(message = "Champ requis") String password) {
    }

    public record RegisterRequest(
            @NotBlank(message = "Nom requis") String nom,
            @NotBlank(message = "Prénom requis") String prenom,
            @NotBlank @Size(min = 3, max = 40, message = "Minimum 3 caractères") String username,
            @NotBlank @Email(message = "Email invalide") String email,
            @NotBlank @Size(min = 8, message = "Minimum 8 caractères") String password) {
    }

    public record UserDto(Long id, String nom, String prenom, String username, String email,
                          Utilisateur.Role role, boolean actif, Instant createdAt) {

        public static UserDto from(Utilisateur u) {
            return new UserDto(u.getId(), u.getNom(), u.getPrenom(), u.getUsername(), u.getEmail(),
                    u.getRole(), u.isActif(), u.getCreatedAt());
        }
    }

    public record AuthResponse(String token, UserDto user) {
    }

    public record UserUpdate(Utilisateur.Role role, Boolean actif) {
    }
}
