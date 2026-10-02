package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.Actualite;

public interface ActualiteRepository extends JpaRepository<Actualite, Long> {

    List<Actualite> findByPublieTrueOrderByDateDesc();
}
