package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.OffreEmploi;

public interface OffreEmploiRepository extends JpaRepository<OffreEmploi, Long> {

    List<OffreEmploi> findByPublieeTrueOrderByCreatedAtDesc();

    long countByPublieeTrue();
}
