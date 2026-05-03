# Tricount

Clone simplifié de l'application [Tricount](https://tricount.com/) — gestion et partage de dépenses en groupe.

## Fonctionnalités

- Inscription / connexion par e-mail
- Création de projets avec invitation de participants
- Ajout de dépenses (montant, date, payeur, bénéficiaires)
- Visualisation des dépenses par projet
- Acceptation d'invitations à un projet

## Stack technique

| Couche | Techno |
|---|---|
| Frontend | Angular 21 (standalone components, signals) |
| Style | Tailwind CSS 4 |
| Backend / BDD | Supabase (Auth, PostgreSQL, RLS) |
| Langage | TypeScript |
| Tests unitaires | Vitest + Angular TestBed |

## Architecture

```
src/app/
├── core/
│   ├── guards/          # authGuard
│   └── services/        # auth, project, expense, profile, layout, supabase
├── features/
│   ├── auth/            # login, register
│   ├── expenses/        # add-expense
│   ├── profiles/        # display-profile
│   └── projects/        # project-list, add-project, display-project
└── shared/
    ├── components/      # app-layout, auth-layout, notification
    └── models/          # types TypeScript
```

Les composants sont **standalone**, la réactivité est gérée par les **signals** Angular, et le lazy loading est utilisé sur toutes les routes.

## Lancer le projet

```bash
npm install
npm start        # ng serve → http://localhost:4200
npm test         # vitest (16 fichiers, ~54 tests)
```

## Base de données

Le backend Supabase est déjà configuré (schéma, RLS, triggers). Les variables d'environnement sont à renseigner dans `src/environments/environment.ts` :

```ts
export const environment = {
  supabaseUrl: 'https://<project>.supabase.co',
  supabaseKey: '<anon-key>',
};
```
