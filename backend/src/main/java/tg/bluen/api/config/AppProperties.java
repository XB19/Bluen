package tg.bluen.api.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Admin admin, String uploadsDir, String privateDir,
                            List<String> corsOrigins, Notifications notifications) {

    public record Jwt(String secret, long expirationHours) {
    }

    public record Admin(String username, String email, String password) {
    }

    public record Notifications(String destinataire, String expediteur) {
    }
}
