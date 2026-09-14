# À quel moment

Le site de la série **CAS**, signée Slaega. Chaque CAS part d'un fait réel et se
termine par la même question : *« À quel moment avons-nous trouvé ça normal ? »*

Site statique — Next.js (App Router) en `output: "export"`, contenu en Markdown,
aucune base de données, aucun CMS. Ajouter un CAS = ajouter un fichier.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # génère le site statique dans out/
npm start        # sert out/ pour vérifier le résultat du build
```

## Ajouter un CAS

Créer `content/cas/cas-015.md` :

```yaml
---
numero: 15
titre: "Le titre du CAS"
date: "2026-09-20"
categorie: "quotidien"
extrait: "La phrase qui accroche — elle sert aussi de titre au partage."
---

Le texte, en paragraphes courts.

À quel moment avons-nous trouvé ça normal ?
```

Rien d'autre à faire : l'archive, la page du CAS, la navigation précédent/suivant,
le filtre par catégorie et le sitemap se mettent à jour au build.

### Le frontmatter

| Champ | Rôle |
| --- | --- |
| `numero` | Numéro de la série. Donne l'URL (`/cas/015/`) et l'ordre de tri. |
| `titre` | Titre affiché en haut du CAS et dans l'archive. |
| `date` | Format `YYYY-MM-DD`. |
| `categorie` | Libre — sert au filtre de l'archive (santé, emploi, éducation, économie, philosophie, quotidien…). |
| `extrait` | Une ou deux phrases. Sert de titre Open Graph : c'est ce qu'on voit quand le lien est partagé. |
| `brouillon` | Optionnel. `true` affiche un bandeau « Brouillon » sur la page du CAS. |

### La signature

La phrase finale est détectée automatiquement et sortie du corps du texte pour
être composée en serif italique, détachée. Écris-la simplement comme dernière
ligne du fichier — les variantes de ponctuation et de casse sont reconnues.

## Modifier les pages éditoriales

`/philosophie` et `/a-propos` sont aussi en Markdown, dans `content/pages/`.
Leur frontmatter attend `titre`, `chapo` et, si besoin, `description` (balises meta).

La page `/philosophie` reprend en plus le CAS de référence — le **#014** — juste
en dessous du manifeste. Pour changer de référence, modifier la constante
`REFERENCE` dans `app/philosophie/page.tsx`.

## Les affiches de partage

Chaque CAS a sa propre image d'aperçu — une affiche 1200 × 630 reprenant la
bande rouge, le numéro, le titre, l'extrait et la signature.

Elles sont fabriquées au build par `scripts/generer-og.mjs` (satori pour la mise
en page, resvg pour le PNG), et déposées dans `public/og/`. Le script tourne tout
seul : `npm run build` déclenche `prebuild`, et `npm run dev` le lance aussi.
Pour le relancer à la main :

```bash
npm run og
```

`public/og/` est ignoré par git : les affiches sont régénérées à chaque build,
il n'y a rien à committer. Ajouter un CAS suffit à créer la sienne.

Le gabarit se trouve dans la fonction `affiche()` du script — mêmes couleurs, mêmes
polices que le site. La taille du titre descend par paliers quand il s'allonge,
pour qu'une accroche longue reste dans le cadre.

## Avant de déployer

Renseigner le domaine final dans `lib/site.ts` (`site.url`) : il sert de base aux
URLs absolues des balises Open Graph, du canonical et du sitemap.

Le build produit `out/`, un dossier de fichiers statiques — déployable tel quel
sur Vercel, Netlify, GitHub Pages ou n'importe quel hébergeur.

## Direction artistique

Les couleurs sont nommées par **rôle**, jamais par teinte : un seul jeu de noms
sert les deux thèmes.

| Rôle | Clair | Sombre |
| --- | --- | --- |
| `fond` | `#F7F5F1` | `#0B0B0C` |
| `encre` (texte) | `#16130F` | `#F2F0EC` |
| `discret` (texte secondaire) | `#6A6660` | `#86837E` |
| `trait` (filets) | `#E0DCD3` | `#232326` |
| `rouge` (bandes, grands numéros) | `#B7291E` | `#C8362B` |
| `rouge-vif` (liens, survols, petites mentions) | `#A8241A` | `#EE6A5E` |

Deux rouges, parce qu'un seul ne peut pas tenir les deux emplois : celui des
bandes et des grands numéros peut être sombre et dense, celui des petits textes
doit rester lisible sur son fond. Tout est déclaré dans `app/globals.css`.

Corps et titres en **Inter**, signature en **Lora** italique.

### Le moment de la journée

Le site porte la question « à quel moment » : il y répond en changeant avec
l'heure de la personne qui le lit.

| Moment | Heures | Effet |
| --- | --- | --- |
| Aurore | 06h – 12h | Thème clair, papier réchauffé |
| Zénith | 12h – 18h | Thème clair, papier neutre |
| Crépuscule | 18h – 06h | Thème sombre, fond légèrement refroidi |

Le rouge, lui, ne bouge jamais : c'est l'identité de la série.

L'heure est forcément lue **côté navigateur** — un export statique est servi tel
quel à toute heure et sous tous les fuseaux. Le script de `lib/theme.ts` pose
`data-moment` et `data-theme` sur `<html>` avant le premier rendu.

Un choix explicite de thème l'emporte toujours : la teinte du moment continue de
s'appliquer, mais sans forcer le sombre le soir.

### Clair et sombre

Sans choix explicite, le site suit la préférence système — et le crépuscule. La bascule dans l'en-tête impose
un choix, retenu dans `localStorage` (`aqm-theme`).

Deux détails valent d'être connus avant de toucher à ce mécanisme :

- Un script minuscule dans `<head>` (`lib/theme.ts`) applique le thème **avant
  le premier rendu**. Sans lui, qui a choisi le clair voit le site s'afficher en
  sombre le temps que React s'hydrate.
- L'icône de la bascule (lune ou soleil) est pilotée en CSS, pas en JavaScript.
  Le serveur ne peut pas savoir quel thème la personne utilise : décider en JS
  provoquerait un écart d'hydratation et un clignotement.

Le bloc `@theme` est en mode `inline` — sans ça, Tailwind figerait les couleurs
au build et la bascule n'aurait aucun effet.

Les affiches de partage restent sombres dans tous les cas : ce sont des images
figées, elles portent l'identité de la série.

### Le logo Slaega

Le logotype actuel est **provisoire** : le vrai logo n'a pas pu être récupéré
depuis slaega.com pendant la construction du site.

Pour le mettre en place, remplacer le contenu du `<svg>` de
`components/LogoSlaega.tsx` par celui du logo officiel, en gardant
`fill="currentColor"` — c'est ce qui le fait suivre le thème sans avoir à
fournir deux fichiers. L'en-tête et le pied de page passent tous les deux par
ce composant, il n'y a rien d'autre à changer.

Les affiches de partage ont leur propre marque, dans `scripts/generer-og.mjs` :
satori ne peut pas lire un composant React. Elle s'y remplace par une `<img>` en
data URI, largeur et hauteur fournies.

## Structure

```
app/                 pages (accueil, /cas, /cas/[numero], /philosophie, /a-propos)
components/          en-tête, pied de page, archive filtrable, bouton copier…
content/cas/         un fichier .md par CAS
content/pages/       pages éditoriales
lib/cas.ts           lecture des CAS, rendu Markdown, détection de la signature
lib/pages.ts         lecture des pages éditoriales
lib/site.ts          nom, domaine, navigation
scripts/             génération des affiches Open Graph
```
