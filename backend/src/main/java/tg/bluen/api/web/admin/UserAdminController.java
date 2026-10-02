package tg.bluen.api.web.admin;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.domain.Utilisateur;
import tg.bluen.api.dto.AuthDtos.UserDto;
import tg.bluen.api.dto.AuthDtos.UserUpdate;
import tg.bluen.api.repository.UtilisateurRepository;

@RestController
@RequestMapping("/api/admin/utilisateurs")
public class UserAdminController {

    private final UtilisateurRepository users;

    public UserAdminController(UtilisateurRepository users) {
        this.users = users;
    }

    @GetMapping
    public List<UserDto> list() {
        return users.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(UserDto::from).toList();
    }

    @PatchMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody UserUpdate req, @AuthenticationPrincipal Jwt jwt) {
        Utilisateur u = find(id);
        boolean soiMeme = isSelf(u, jwt);
        if (soiMeme && (req.role() == Utilisateur.Role.CLIENT || Boolean.FALSE.equals(req.actif()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne pouvez pas retirer vos propres droits.");
        }
        if (req.role() != null) {
            u.setRole(req.role());
        }
        if (req.actif() != null) {
            u.setActif(req.actif());
        }
        return UserDto.from(users.save(u));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        Utilisateur u = find(id);
        if (isSelf(u, jwt)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous ne pouvez pas supprimer votre propre compte.");
        }
        users.delete(u);
    }

    private static boolean isSelf(Utilisateur u, Jwt jwt) {
        return u.getId().equals(jwt.<Number>getClaim("uid").longValue());
    }

    private Utilisateur find(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
    }
}
