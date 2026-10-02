package tg.bluen.api.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    Optional<Categorie> findBySlug(String slug);

    List<Categorie> findByFamilleOrderByOrdreAscNomAsc(String famille);
}
