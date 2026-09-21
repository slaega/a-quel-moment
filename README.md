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

Le build annonce ce qu'il a trouvé — `CAS 001 → 016 (14 textes)` — et signale
trois choses : les trous dans la numérotation, les CAS sans date, et toute date
qui recule par rapport au CAS précédent. L'archive étant classée par numéro, une
date qui remonte le temps est presque toujours une erreur de saisie. Un site statique affiche ses fichiers sans rien
réclamer : un CAS jamais déposé ne manque à personne au build, il manque en
ligne. Ce relevé est là pour s'en apercevoir avant de publier.

### Le frontmatter

| Champ | Rôle |
| --- | --- |
| `numero` | Numéro de la série. Donne l'URL (`/cas/015/`) et l'ordre de tri. |
| `titre` | Titre affiché en haut du CAS et dans l'archive. |
| `date` | Format `YYYY-MM-DD`. Date de **publication**, pas d'ajout au site. |
| `categorie` | Libre — sert au filtre de l'archive (santé, emploi, éducation, économie, philosophie, quotidien…). |
| `extrait` | Une ou deux phrases. Sert de titre Open Graph : c'est ce qu'on voit quand le lien est partagé. |
| `contribution` | Optionnel. Origine du texte quand il ne vient pas de l'auteur seul — affiché sous le titre. |
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

**Le pied de page reprend celle de la page lue**, pas une phrase figée : sur un
CAS qui demande « allons-nous encore trouver ça normal ? », le pied répondrait
sinon « avons-nous trouvé ça normal ? » à deux centimètres de l'article.

C'est pourquoi le pied vit dans `components/Gabarit.tsx` et non dans
`app/layout.tsx` : la mise en page racine ne sait pas quel texte est lu. Chaque
page passe la sienne ; à défaut, celle de la série s'affiche.

Elle varie d'un CAS à l'autre : « avons-nous trouvé ça normal ? », « allons-nous
encore trouver ça normal ? », ou une reformulation propre au texte. La
reconnaissance porte donc sur la forme générale — une dernière ligne qui ouvre
sur « à quel moment » et se ferme sur un point d'interrogation — et non sur une
phrase figée. Écris la tienne normalement, elle sera détachée et composée en
serif italique.

### Les dates

Les CAS 001 à 008 sont arrivés sans date : la leur est **reconstruite**, un par
jour en remontant depuis le 009 (7 septembre), daté par l'auteur.

Les CAS 015 à 018 n'ont **pas de date**, et c'est volontaire. Leurs jours d'ajout
au dépôt avaient d'abord servi de dates, jusqu'à ce que le CAS 019 — daté du
11 septembre par l'auteur — montre que ces jours-là venaient après lui dans le
calendrier alors qu'ils le précèdent dans la numérotation. Une date fausse vaut
moins que pas de date : elles ont été retirées, en attendant les vraies.

`formaterDate` corrige au passage `Intl`, qui écrit « 1 septembre » là où le
français demande « 1er septembre ».

### Typographie du texte

```bash
npm run typo
```

À lancer après chaque ajout ou modification d'un CAS. La commande dit ce
qu'elle a corrigé, et ne touche rien d'autre :

- **apostrophes typographiques** (`’`), jamais droites ;
- **espace insécable dans les milliers** (`41 304`), sinon le nombre se coupe
  en fin de ligne — y compris dans l'extrait, qui part sur l'affiche de partage ;
- **espace insécable avant le pourcentage** (`67,95 %`), même raison ;
- **espace insécable dans les guillemets** (`« mot »`), sinon un `«` reste seul
  en fin de ligne et un `»` seul en début de la suivante ;
- **guillemets droits convertis en chevrons** dans le corps du texte.

Le frontmatter ne reçoit que les quatre premières : les guillemets y délimitent
les valeurs YAML, les transformer casserait le fichier.

Les espaces avant `:`, `;`, `!` et `?` restent ordinaires : les corriger toutes
changerait chaque ligne pour un gain invisible.

### Un piège du Markdown, déjà neutralisé

Une ligne qui commence par un nombre suivi d'un point — `2013. J'étais admis
au CHU` — est une liste numérotée pour Markdown. Le paragraphe partait en
retrait sous une puce invisible.

Ces textes sont du français ordinaire, pas du Markdown : ce cas est désarmé
dans `lib/cas.ts`, il n'y a donc rien à échapper à la main. L'échappement ne
touche que le rendu ; le texte du bouton « copier » est pris du fichier
d'origine et reste intact.

Le revers : une vraie liste numérotée est impossible dans un CAS. Ça n'a pas
d'importance pour le format, et les pages éditoriales de `content/pages/`
passent par un autre chemin, où les listes fonctionnent normalement.

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

La colonne de lecture vise **environ 73 signes par ligne** à 20 px
(`--container-lecture`). Au-delà, l'œil retrouve mal le début de la ligne
suivante ; en deçà, un texte long se hache en fragments.

Les pages de texte sont cadrées par `--container-article`, plus étroit que
l'en-tête : une colonne posée dans un cadre trop large paraît serrée même
quand elle ne l'est pas, parce que l'œil la compare au vide qui l'entoure.

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
