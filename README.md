# BLUEN Togo — site vitrine et tableau de bord

Site de BLUEN SAS (solutions solaires, éclairage public All-In-One, Gas to Power) avec un tableau de bord d'administration.

- **Frontend** : React 19, Vite, React Router, Framer Motion, Lucide (`src/`)
- **Backend** : Spring Boot 4, Java 17, Spring Security (JWT), JPA (`backend/`)
- **Base de données** : PostgreSQL 17

## Lancer avec Docker

```bash
cp .env.example .env   # puis renseigner DB_PASSWORD, JWT_SECRET et ADMIN_PASSWORD
docker compose up -d --build
```

Le site est disponible sur http://localhost et le tableau de bord sur http://localhost/admin
(identifiant `ADMIN_USERNAME`, mot de passe `ADMIN_PASSWORD`).

Les données sont conservées dans des volumes Docker : `pgdata` (base), `uploads` (images) et `cv` (CV des candidats, jamais exposés publiquement).

## Lancer en développement

Prérequis : Node 22+, Java 17, PostgreSQL avec une base `bluen`.

```bash
# Backend (http://localhost:8080)
cd backend
DB_PASSWORD=<mot de passe postgres> ./mvnw spring-boot:run

# Frontend (http://localhost:5173, /api est relayé vers le backend)
npm install
npm run dev
```

Au premier démarrage, le backend crée le compte administrateur et le contenu initial (catalogue, réalisations, partenaires, bons plans).

## Variables d'environnement du backend

| Variable | Rôle | Défaut (développement) |
|---|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Connexion PostgreSQL | `jdbc:postgresql://localhost:5432/bluen`, `postgres` |
| `JWT_SECRET` | Signature des jetons (32 caractères min.) | valeur de développement |
| `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Compte admin initial | `admin` / `admin@bluen.tg` |
| `CORS_ORIGINS` | Origines autorisées | `http://localhost:5173,http://localhost:4173` |
| `NOTIFICATION_EMAIL`, `MAIL_FROM` | Destinataire et expéditeur des notifications | `contact@bluen.tg` |
| `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` | Serveur SMTP (optionnel) | désactivé |

En production, définir obligatoirement `DB_PASSWORD`, `JWT_SECRET` et `ADMIN_PASSWORD`.
