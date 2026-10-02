package tg.bluen.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import tg.bluen.api.config.AppProperties;
import tg.bluen.api.domain.Candidature;
import tg.bluen.api.domain.DemandeDevis;
import tg.bluen.api.domain.MessageContact;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final AppProperties props;

    public NotificationService(ObjectProvider<JavaMailSender> mailSender, AppProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    @Async
    public void nouveauDevis(DemandeDevis d) {
        envoyer("[BLUEN TOGO] Nouvelle demande de devis — " + d.getNom(), """
                Nouvelle demande de devis reçue :

                Client : %s
                Téléphone : %s
                Email : %s
                Entreprise : %s
                Produit : %s

                Message :
                %s
                """.formatted(d.getNom(), d.getTelephone(), d.getEmail(),
                valeur(d.getEntreprise(), "Non renseignée"), valeur(d.getProduit(), "Non précisé"), d.getMessage()));
    }

    @Async
    public void nouveauMessage(MessageContact m) {
        envoyer("[BLUEN TOGO] Message de " + m.getNom(), """
                De : %s
                Email : %s
                Téléphone : %s

                %s
                """.formatted(m.getNom(), m.getEmail(), valeur(m.getTelephone(), "—"), m.getMessage()));
    }

    @Async
    public void nouvelleCandidature(Candidature c) {
        envoyer("[BLUEN] Nouvelle candidature — " + c.getPrenom() + " " + c.getNom(), """
                Nouvelle candidature reçue :

                Nom : %s %s
                Email : %s
                Téléphone : %s
                Domaine : %s
                Poste visé : %s
                CV joint : %s

                Message :
                %s
                """.formatted(c.getPrenom(), c.getNom(), c.getEmail(), valeur(c.getTelephone(), "—"), c.getDomaine(),
                valeur(c.getOffre(), "Candidature spontanée"), c.isAvecCv() ? "oui (à télécharger depuis le tableau de bord)" : "non",
                c.getMessage()));
    }

    private void envoyer(String sujet, String corps) {
        JavaMailSender sender = mailSender.getIfAvailable();
        String destinataire = props.notifications().destinataire();
        if (sender == null || !StringUtils.hasText(destinataire)) {
            log.info("Notification non envoyée (SMTP non configuré) : {}", sujet);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(props.notifications().expediteur());
        message.setTo(destinataire);
        message.setSubject(sujet);
        message.setText(corps);
        try {
            sender.send(message);
        } catch (MailException e) {
            log.warn("Échec de l'envoi de la notification « {} » : {}", sujet, e.getMessage());
        }
    }

    private static String valeur(String v, String defaut) {
        return StringUtils.hasText(v) ? v : defaut;
    }
}
