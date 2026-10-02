package tg.bluen.api.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import tg.bluen.api.domain.Demande;
import tg.bluen.api.domain.Statut;

@NoRepositoryBean
public interface DemandeRepository<T extends Demande> extends JpaRepository<T, Long> {

    Page<T> findByStatut(Statut statut, Pageable pageable);

    long countByStatut(Statut statut);

    List<T> findTop5ByOrderByCreatedAtDesc();

    List<T> findByCreatedAtAfter(Instant since);
}
