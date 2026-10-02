package tg.bluen.api.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import tg.bluen.api.domain.BonPlan;

public interface BonPlanRepository extends JpaRepository<BonPlan, Long> {

    List<BonPlan> findByActifTrueOrderByOrdreAscIdAsc();
}
