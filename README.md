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

Le build annonce ce qu'il a trouvé — `CAS 001 → 008 (8 textes)` — et signale les
trous dans la numérotation. Un site statique affiche ses fichiers sans rien
réclamer : un CAS jamais déposé ne manque à personne au build, il manque en
ligne. Ce relevé est là pour s'en apercevoir avant de publier.

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

`/a-propos` est en Markdown, dans `content/pages/a-propos.md`. Son frontmatter
attend `titre`, `chapo` et, si besoin, `description` (balises meta).

`/philosophie` n'a pas de texte à elle : le manifeste de la série est un CAS
comme les autres — le **#014** — et la page lui donne la place d'une page de
référence, atteignable depuis la navigation. Pour changer de texte de
référence, modifier la constante `REFERENCE` dans `app/philosophie/page.tsx`.

### La question de clôture

Elle varie d'un CAS à l'autre : « avons-nous trouvé ça normal ? », « allons-nous
encore trouver ça normal ? », ou une reformulation propre au texte. La
reconnaissance porte donc sur la forme générale — une dernière ligne qui ouvre
sur « à quel moment » et se ferme sur un point d'interrogation — et non sur une
phrase figée. Écris la tienne normalement, elle sera détachée et composée en
serif italique.

### Typographie du texte

Deux conventions tenues dans tous les fichiers :

- **apostrophes typographiques** (`’`), jamais droites ;
- **espace insécable** dans les milliers (`300 000`), sinon le nombre se coupe
  en fin de ligne — y compris dans l'extrait, qui part sur l'affiche de partage.

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

## Déploiement

Le site est en ligne sur **https://a-quel-moment.slaega.com**, déclaré dans
`lib/site.ts` (`site.url`).

Cette valeur sert de base aux URLs absolues des balises Open Graph, du canonical
et du sitemap. Une erreur ici ne casse pas le site : elle casse silencieusement
tous les aperçus au partage, ce qui ne se voit qu'en collant un lien quelque
part. À vérifier si le domaine change.

### Vercel

L'hébergement est sur Vercel, branché sur ce dépôt : **pousser sur la branche
par défaut suffit à redéployer**. `vercel.json` versionne la configuration de
build plutôt que de la laisser vivre dans le tableau de bord.

Rien d'autre à lancer à la main. `npm run build` déclenche `prebuild`, donc les
affiches de partage sont régénérées à chaque déploiement — c'est pourquoi
`public/og/` n'a pas besoin d'être committé.

Pour vérifier avant de pousser que le build passera là-bas, reproduire ses
conditions — installation depuis le lockfile, rien d'autre :

```bash
rm -rf node_modules out .next && npm ci && npm run build
```

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

La marque est **bicolore** : un « S » presque noir (`#111111`) et un « L »
orange (`#FF5A00`), sur fond transparent. L'orange tient sur n'importe quel
fond ; le noir, lui, disparaît sur le thème sombre. D'où deux fichiers :

| Fichier | Usage |
| --- | --- |
| `public/slaega-mark.png` | La marque d'origine — thème clair |
| `public/slaega-mark-sur-sombre.png` | Le noir remplacé par la couleur du texte — thème sombre et affiches de partage |

La variante est **dérivée**, pas dessinée à la main :

```bash
npm run logo
```

Le script ne touche qu'au noir. Les pixels d'anticrénelage sont des mélanges
des deux teintes : les traiter au seuil laisserait un liseré noir sur chaque
bord, donc chaque pixel est projeté sur le segment noir→orange pour retrouver
sa proportion, puis recomposé. La transparence n'est jamais modifiée.

**Après tout remplacement du logo d'origine, relancer `npm run logo`** — sinon
le thème sombre continue d'afficher l'ancienne variante.

Sur le site, les deux images sont posées et le CSS montre la bonne (`.si-clair`
/ `.si-sombre`). Le serveur ne peut pas savoir quel thème la personne utilise :
trancher en JavaScript provoquerait un écart d'hydratation et un clignotement.
Les affiches, elles, sont toujours sombres et prennent donc toujours la
variante.

Les dimensions sont relues dans l'en-tête du PNG : aucune taille à saisir, le
ratio est respecté partout. Sans fichier de logo, tout retombe sur un logotype
typographique et `npm run og` le signale.

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
