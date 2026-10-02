package tg.bluen.api.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import tg.bluen.api.domain.Produit;

public interface ProduitRepository extends JpaRepository<Produit, Long>, JpaSpecificationExecutor<Produit> {

    Optional<Produit> findBySlug(String slug);

    Optional<Produit> findBySlugAndActifTrue(String slug);

    List<Produit> findTop4ByActifTrueAndVedetteTrueOrderByOrdreAscNomAsc();

    List<Produit> findTop4ByActifTrueAndDisponibiliteOrderByOrdreAscNomAsc(Produit.Disponibilite disponibilite);

    List<Produit> findTop4ByActifTrueAndCategorieFamilleAndSlugNotOrderByOrdreAscNomAsc(String famille, String slug);

    long countByCategorieId(Long categorieId);

    long countByActifTrue();
}
