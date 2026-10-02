package tg.bluen.api.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

public final class Slugs {

    private Slugs() {
    }

    public static String of(String text) {
        String slug = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isEmpty() ? "element" : slug;
    }

    public static String unique(String text, Predicate<String> taken) {
        String base = of(text);
        String slug = base;
        int i = 2;
        while (taken.test(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }
}
