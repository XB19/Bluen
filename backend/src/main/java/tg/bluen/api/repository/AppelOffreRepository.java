package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.AppelOffre;

public interface AppelOffreRepository extends JpaRepository<AppelOffre, Long> {

    List<AppelOffre> findByActifTrueOrderByDateLimiteDesc();

    long countByActifTrueAndStatut(AppelOffre.Statut statut);
}
