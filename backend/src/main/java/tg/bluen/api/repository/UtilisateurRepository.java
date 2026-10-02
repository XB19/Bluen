package tg.bluen.api.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.Utilisateur;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(Utilisateur.Role role);
}
