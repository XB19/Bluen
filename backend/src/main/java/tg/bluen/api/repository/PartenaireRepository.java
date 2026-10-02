package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.Partenaire;

public interface PartenaireRepository extends JpaRepository<Partenaire, Long> {

    List<Partenaire> findAllByOrderByOrdreAscNomAsc();
}
