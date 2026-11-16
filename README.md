# Le Cartel — lecartel.art

Site statique généré à partir de fichiers Markdown, avec [Astro](https://astro.build).
Chaque article est un fichier `.md` ; le site se reconstruit à partir de ces fichiers.

## Démarrer

```bash
npm install
npm run dev       # site de travail sur http://localhost:4321 (les brouillons sont visibles)
npm run build     # génère le site final dans dist/ + l’index de recherche
npm run preview   # sert dist/ pour vérifier avant mise en ligne
```

Node 22.23 ou plus récent est requis.

## Écrire un article

Créer un fichier dans `src/content/articles/`. Le nom du fichier devient l’adresse :
`beaubourg-monument-historique.md` → `lecartel.art/articles/beaubourg-monument-historique/`.

```markdown
---
titre: "Beaubourg classé : comment une utopie devient un monument"
chapo: "Le chapeau, deux ou trois phrases."
rubrique: essais            # critiques | essais | enquetes | design | histoire | psyche
sujet: Architecture         # affiché après la rubrique : « Essai · Architecture »
date: 2026-11-15
auteur: "Prénom Nom"
une: false                  # true = article à la une de l’accueil (le plus récent l’emporte)
dossier: faut-il-bruler-le-louvre   # facultatif : nom du fichier du dossier
brouillon: false            # true = visible en local, absent du site publié
image:                      # facultatif
  src: ./images/beaubourg.jpg       # sans src : un emplacement gris légendé s’affiche
  alt: "Description de l’image pour les lecteurs d’écran"
  legende: "Renzo Piano et Richard Rogers, <i>Centre Pompidou</i>, 1977."
  credit: "© Photographe"
cartel:                     # le bloc « Cartel » en marge de l’article
  - titre: Centre Pompidou
    lieu: Paris, 4ᵉ
    dates: fermé jusqu’en 2030
    details: facultatif
tags: [Architecture, Patrimoine]
---

Le texte en Markdown.
```

Les images se rangent à côté des articles, par exemple dans `src/content/articles/images/`. Elles sont redimensionnées et converties automatiquement.

### Les conventions de mise en page

| Pour obtenir… | écrire |
|---|---|
| Un intertitre | `## Le musée comme crypte` |
| Une note en marge | `…se souvenir.[^1]` puis, n’importe où : `[^1]: Roland Barthes, *La Chambre claire*, 1980.` |
| Une citation mise en exergue (grande, en couleur) | `> [!exergue] Une phrase forte tirée du texte.` |
| Une citation ordinaire | `> Le texte cité.` |
| Une image légendée façon cartel | `![Texte alternatif](./images/oeuvre.jpg "Artiste \| Titre, date \| © Crédit")` |
| Un séparateur | `---` (sur une ligne seule, entre deux paragraphes) |

La lettrine du premier paragraphe est automatique. Les notes s’affichent dans la marge droite sur grand écran, et après le texte sur mobile.

## Les autres contenus

- **Le cartel de la semaine** : `src/content/cartels/*.md`. Champs : `titre`, `chapo`, `date`, `auteur`, `artiste`, `oeuvre`, `technique`, `details` (liste), `mention`, `image`. Le plus récent apparaît sur l’accueil.
- **Les dossiers** : `src/content/dossiers/*.md`. Un article y est rattaché par `dossier: nom-du-fichier`. `accueil: true` le met en avant sur l’accueil ; `encadre` ajoute la liste latérale (dates de conférences, etc.).
- **L’agenda** : `src/content/agenda.yaml`. Un événement disparaît tout seul après sa date de fin, au build suivant.
- **Les pages simples** (À propos, Mentions légales) : `src/pages/*.md`.
- **Les rubriques** : `src/data/rubriques.ts`. **Le nom du site, la lettre, les réseaux** : `src/data/site.ts`.
- **Les couleurs et polices** : variables en tête de `src/styles/global.css` (`--accent` pour le bleu).

Une erreur dans l’en-tête d’un article (rubrique inconnue, date mal écrite, dossier inexistant) bloque le build avec un message qui indique le fichier et le champ : c’est voulu.

## Mettre en ligne

Le dossier `dist/` est un site statique : il s’héberge gratuitement sur Netlify, Cloudflare Pages ou Vercel en reliant le dépôt Git. Réglages : commande `npm run build`, dossier de sortie `dist`.

**Reconstruire le site chaque nuit** (tâche planifiée de l’hébergeur, ou un « deploy hook » appelé par un cron) : la date du jour dans l’en-tête et l’agenda sont calculés au moment du build.

## À brancher

- **La lettre** : renseigner l’adresse du formulaire (Brevo, Buttondown…) dans `newsletterAction` de `src/data/site.ts`. Le formulaire est désactivé tant qu’elle est vide.
- **Mesure d’audience** : rien n’est installé (pas de cookies, donc pas de bandeau). Si besoin, préférer un outil sans cookies.
- **Mentions légales** : obligatoires, à compléter.

## Structure

```
src/
  content/            ← tout le contenu éditorial (Markdown + agenda.yaml)
  content.config.ts   ← le schéma des champs de chaque type de contenu
  data/               ← rubriques, réglages du site
  lib/rehype-cartel.js← notes en marge, exergues, légendes d’images
  components/ layouts/ pages/ styles/
```

## Aperçu sur GitHub Pages

Chaque push sur `main` (et chaque nuit à 4 h 17 UTC) publie un aperçu sur
https://glimow.github.io/lecartel/ via `.github/workflows/pages.yml`.
Le chemin `/lecartel` est géré par les variables `SITE_URL` et `BASE_PATH` :
dans les composants, écrire les liens internes avec `lien('/chemin/')` (`src/lib/lien.ts`).
