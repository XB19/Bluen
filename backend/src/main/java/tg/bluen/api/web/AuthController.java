package tg.bluen.api.web;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.domain.Utilisateur;
import tg.bluen.api.dto.AuthDtos.AuthResponse;
import tg.bluen.api.dto.AuthDtos.LoginRequest;
import tg.bluen.api.dto.AuthDtos.RegisterRequest;
import tg.bluen.api.dto.AuthDtos.UserDto;
import tg.bluen.api.repository.UtilisateurRepository;
import tg.bluen.api.service.TokenService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository users;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokens;

    public AuthController(UtilisateurRepository users, PasswordEncoder passwordEncoder, TokenService tokens) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.tokens = tokens;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        String id = req.identifiant().trim();
        Utilisateur user = users.findByUsernameIgnoreCaseOrEmailIgnoreCase(id, id)
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Identifiants incorrects. Veuillez réessayer."));
        if (!user.isActif()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ce compte est désactivé.");
        }
        return new AuthResponse(tokens.issue(user), UserDto.from(user));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(@Valid @RequestBody RegisterRequest req) {
        if (users.existsByUsernameIgnoreCase(req.username().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet identifiant est déjà utilisé.");
        }
        if (users.existsByEmailIgnoreCase(req.email().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé.");
        }
        Utilisateur u = new Utilisateur();
        u.setNom(req.nom().trim());
        u.setPrenom(req.prenom().trim());
        u.setUsername(req.username().trim());
        u.setEmail(req.email().trim().toLowerCase());
        u.setPassword(passwordEncoder.encode(req.password()));
        return UserDto.from(users.save(u));
    }

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal Jwt jwt) {
        return users.findById(jwt.<Number>getClaim("uid").longValue())
                .filter(Utilisateur::isActif)
                .map(UserDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expirée"));
    }
}
