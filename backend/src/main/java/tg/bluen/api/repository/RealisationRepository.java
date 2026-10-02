package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.Realisation;

public interface RealisationRepository extends JpaRepository<Realisation, Long> {

    List<Realisation> findByPublieeTrueOrderByDateDesc();

    long countByPublieeTrue();
}
