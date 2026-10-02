package tg.bluen.api.web.admin;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;
import tg.bluen.api.domain.BaseEntity;

public abstract class CrudController<T extends BaseEntity> {

    protected final JpaRepository<T, Long> repository;
    private final Sort sort;

    protected CrudController(JpaRepository<T, Long> repository, Sort sort) {
        this.repository = repository;
        this.sort = sort;
    }

    protected void beforeSave(T entity) {
    }

    protected void beforeDelete(T entity) {
    }

    @GetMapping
    public List<T> list() {
        return repository.findAll(sort);
    }

    @GetMapping("/{id}")
    public T get(@PathVariable Long id) {
        return find(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public T create(@Valid @RequestBody T entity) {
        entity.setId(null);
        beforeSave(entity);
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable Long id, @Valid @RequestBody T entity) {
        T existing = find(id);
        entity.setId(id);
        entity.setCreatedAt(existing.getCreatedAt());
        beforeSave(entity);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        T entity = find(id);
        beforeDelete(entity);
        repository.delete(entity);
    }

    private T find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Élément introuvable"));
    }
}
