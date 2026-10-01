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

Le build annonce ce qu'il a trouvé — `CAS 001 → 020 (18 textes)` — et signale
quatre choses :

- les **trous dans la numérotation**, hors numéros déclarés sans suite ;
- les CAS **sans date** ;
- toute **date qui recule** par rapport au CAS précédent — l'archive étant
  classée par numéro, une date qui remonte le temps est presque toujours une
  erreur de saisie ;
- les CAS **sans question de clôture**, presque toujours un texte collé sans sa
  dernière ligne. Un site statique affiche ses fichiers sans rien
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
| `sources` | Optionnel. Liste de références, affichées sous la question. Voir ci-dessous. |

### Les sources

Un CAS part d'un fait réel. Quand ce fait est chiffré, le lecteur doit pouvoir
le vérifier depuis la page, sans partir en recherche :

```yaml
sources:
  - titre: "Chang et al., « Use of Straighteners… », JNCI, 2022"
    url: "https://academic.oup.com/jnci/article/114/12/1636/6759686"
  - "https://www.nih.gov/news-events/news-releases/…"
```

Une URL seule suffit : le domaine sert alors de libellé. Une URL invalide
**casse le build**.

Mais le build ne regarde que la *forme* de l'adresse. Une URL parfaitement
écrite peut pointer sur une page supprimée — c'est arrivé au CAS 022, dont la
source sur les 3 000 milliards de francs CFA a disparu après coup. D'où une
commande à part :

```bash
npm run liens
```

Elle interroge vraiment chaque source et distingue trois choses, parce que les
confondre fait retirer des sources vivantes :

| | |
| --- | --- |
| `✗ 404` | la page a disparu. La commande sort en erreur. |
| `? 403` | le serveur refuse les robots. À ouvrir dans un navigateur. |
| `~` | le proxy réseau local bloque la sortie. Rien n'a été vérifié. |

Elle est **hors du build** à dessein : elle dépend du réseau, et un
déploiement ne doit pas échouer parce qu'un serveur lointain a toussé. À
lancer après avoir ajouté des sources, et de temps en temps sur tout.

Les références se placent **après** la question de clôture, en petit et en
discret. L'ordre n'est pas négociable : la question est le dernier mot du
texte, l'appareil critique se lit une fois le texte fini. Elles ne partent pas
dans le bouton « copier le texte » — ce qu'on copie, c'est le CAS tel qu'il est
publié ailleurs. Elles alimentent en revanche le `citation` du JSON-LD.

Un témoignage n'a pas de sources, et le bloc ne s'affiche simplement pas.

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

Tous les autres sont datés par l'auteur. Les CAS 015 à 019 ont fait un
aller-retour : leurs dates d'arrivée dans le dépôt se sont révélées être leurs
vraies dates de parution, sauf pour le 019, dont le frontmatter portait le
11 septembre alors qu'il paraît avec le 018. Le contrôle de cohérence ci-dessous
a servi aux deux passages.

`formaterDate` corrige au passage `Intl`, qui écrit « 1 septembre » là où le
français demande « 1er septembre ».

**Deux dates, à ne pas confondre.** Celle du frontmatter est la date de
*parution du texte* : elle s'affiche sous le titre, part dans
`article:published_time` et dans `datePublished`. La date de *dernière
modification de la page*, elle, est une autre chose — elle est calculée par
`lib/revision.ts` à partir de l'historique git, et c'est elle seule qui
alimente le `lastmod` du sitemap et `dateModified`.

Les mélanger a un coût réel. Chaque CAS a été réécrit plusieurs fois par le
gabarit — le bouton partager, la largeur de la colonne, le pied de page qui
reprend la question ont tous régénéré le HTML des textes d'août. Un sitemap
qui annonce « modifié le 1er septembre » une page dont le contenu a changé le
21 apprend à Google que nos dates sont fausses ; il cesse alors de les lire
sur *tout* le fichier, et le site perd son seul signal de recrawl.

`lib/revision.ts` échoue en silence : sans git, ou sur un clone trop court
pour remonter jusqu'au fichier, il retombe sur la date du gabarit puis sur la
date de parution, et n'invente jamais une date « maintenant » qui changerait
à chaque build.

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

### Renvoyer à un autre CAS

Écris-le en toutes lettres, en **capitales**, et le lien se fait tout seul :

| Dans le texte | Mène à |
| --- | --- |
| `le CAS 013`, `le CAS #15`, `le CAS n° 13` | la page de ce CAS |
| `d'autres CAS`, `les autres CAS` | l'archive `/cas/` |
| `Ce CAS`, `en tout cas`, `dans ce cas` | rien, c'est du texte |

La capitale est le signal : l'auteur écrit « CAS » pour la série et « cas »
pour le mot courant. On ne touche jamais au second — « en tout cas » reste une
locution, pas un lien.

Pourquoi pas un lien Markdown écrit à la main : `[d'autres CAS](/cas/)` se
retrouverait tel quel dans le bouton « copier », qui prend le fichier brut. Le
texte publié ailleurs porterait une syntaxe de balisage. Les renvois sont donc
reconnus au rendu (`lib/renvois.ts`), et les fichiers restent lisibles tels
quels.

Deux garde-fous : un renvoi vers un CAS qui n'existe pas (les 011 et 012 sont
sans suite) reste du texte plutôt que de mener à une 404, et un CAS ne se lie
jamais à lui-même.

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

Le build lit l'historique git pour dater les pages (voir « Les dates »). Si les
`lastmod` du sitemap se mettent à pointer tous la même date, c'est que le clone
de build est trop court pour remonter jusqu'aux fichiers de contenu : le repli
est correct, mais moins précis.

Pour vérifier avant de pousser que le build passera là-bas, reproduire ses
conditions — installation depuis le lockfile, rien d'autre :

```bash
rm -rf node_modules out .next && npm ci && npm run build
```

## Référencement

Trois choses portent l'indexation, et aucune n'est cosmétique :

- **`app/sitemap.ts`** ne déclare que l'URL et `lastmod`. `changefreq` et
  `priority` ont été retirés : Google les ignore depuis des années, et le
  `changefreq: yearly` qui traînait sur les CAS invitait les autres robots à
  ne plus repasser. Chaque page porte sa propre date : l'accueil et l'archive
  bougent à chaque parution, `/philosophie/` et `/à-propos/` seulement quand on
  les édite.
- **`lib/schema.ts`** produit le JSON-LD, injecté par
  `components/DonneesStructurees`. Sans lui, Google n'avait que du HTML sobre
  et des balises Open Graph — qui servent aux réseaux sociaux, pas à
  l'indexation. Un CAS se déclare `BlogPosting` daté et signé, rattaché par
  `isPartOf` au `Blog` de `/cas/` ; l'archive énumère les 19 textes, ce qui
  donne au robot un chemin de découverte en plus du maillage interne.
- **Le maillage** : l'accueil ne pointe que le dernier CAS, tous les autres
  passent par `/cas/`. Chaque texte est donc à deux clics de la racine — c'est
  court, mais ça repose entièrement sur l'archive.

## Direction artistique

Le registre est celui d'une **revue imprimée** : une serif qui porte, des
filets plutôt que des cadres, des compositions asymétriques, et de l'air.
Aucune carte, aucune ombre, aucun dégradé — ce qui sépare, c'est un trait.

### Deux encres, et pas une de plus

Les couleurs sont nommées par **rôle**, jamais par teinte : un seul jeu de noms
sert les deux thèmes. Tout est déclaré dans `app/globals.css`.

| Rôle | Clair | Sombre |
| --- | --- | --- |
| `fond` | `#F7F5F1` | `#0B0B0C` |
| `encre` (texte) | `#16130F` | `#F2F0EC` |
| `discret` (texte secondaire) | `#6A6660` | `#86837E` |
| `trait` (filets) | `#E0DCD3` | `#232326` |
| `rouge` (filets, numéros) | `#B7291E` | `#C8362B` |
| `rouge-vif` (petites mentions) | `#A8241A` | `#EE6A5E` |
| `seconde` (l'appareil) | `#17565E` | `#64BCC4` |

Les deux encres de couleur ne se mélangent pas, et c'est la règle la plus
utile du système :

- **le rouge est la voix de la série** — le point d'interrogation de la une,
  les numéros, le filet qui tient un article, la règle sous la question. Rien
  d'autre ;
- **la seconde encre est l'appareil** — catégories, sources, renvois d'un CAS
  à un autre, repères de navigation, actions.

Les confondre reviendrait à ce que la série parle de la même voix que ses
étiquettes. Le pétrole a été choisi parce qu'il est le complémentaire
chromatique du rouge de marque, et parce que rouge + bleu sur papier teinté
est le second encrage habituel des revues. Il tient **7,63:1 en clair** et
**8,93:1 en sombre** — AAA dans les deux thèmes.

Deux rouges, en revanche, parce qu'un seul ne peut pas tenir les deux emplois :
celui des filets et des grands numéros peut être sombre et dense, celui des
petits textes doit rester lisible sur son fond.

### Typographie

**Newsreader** (serif) porte les titres, le corps des CAS et la question de
clôture. **Inter** tient tout le reste : métadonnées, navigation, boutons.

Le corps d'un CAS est en serif parce que ces textes se lisent d'une traite et
le plus souvent sur téléphone : une grotesque d'interface fatigue sur quinze
paragraphes.

L'échelle est **fluide**, en `clamp()`, bornée sur 320 px d'un côté et
~1280 px de l'autre. Une échelle à paliers obligerait à choisir entre un titre
écrasé à 360 px et un titre qui saute brutalement à 768 px.

| Jeton | Emploi |
| --- | --- |
| `text-manchette` | la question, en une |
| `text-manchette-2` | titre d'un CAS, d'une page |
| `text-section` | titre de section, entrée de sommaire |
| `text-question` | la question de clôture, détachée |
| `text-chapo` | chapô, extrait mis en avant |
| `text-corps` | le corps d'un CAS |
| `text-meta` | métadonnées, légendes, interface |

La colonne de lecture vise **62 à 68 signes par ligne**
(`--container-lecture`). Au-delà, l'œil retrouve mal le début de la ligne
suivante ; en deçà, un texte long se hache en fragments.

Les pages de texte sont cadrées par `--container-article`, plus étroit que
l'en-tête : une colonne posée dans un cadre trop large paraît serrée même
quand elle ne l'est pas, parce que l'œil la compare au vide qui l'entoure.

### Les motifs

`app/globals.css` déclare quelques utilitaires qui portent les décisions :

| Utilitaire | Ce qu'il fait |
| --- | --- |
| `gouttiere` | le pas horizontal de toute page — 20 px à 320 px, de l'air ensuite |
| `manchette` | serif, interlettrage serré, équilibrage sur plusieurs lignes |
| `surtitre` | le petit label capitales qui nomme une section ou une catégorie |
| `filet-sommaire` | le trait qui court d'un label jusqu'au bord du bloc |
| `cible` | une zone tactile d'au moins 44 px, sans grossir ce qui est écrit |
| `lien-sobre` | un soulignement qui se révèle au survol |
| `chiffres` | chiffres alignés, pour les numéros et les compteurs |

### Mobile

La version téléphone n'est pas une réduction du bureau. Trois décisions lui
sont propres :

- **Le filet rouge d'un article est horizontal sous 768 px**, vertical
  au-dessus. Une bande à gauche mangerait la largeur de lecture sans rien
  tenir.
- **Les catégories de l'archive défilent horizontalement** plutôt que de
  former un pavé de treize boutons qui repousserait le sommaire sous la ligne
  de flottaison.
- **L'interlettrage de la navigation est resserré** sous 640 px : à pleine
  chasse, les trois entrées se coupent en deux lignes.
- **L'en-tête ne colle au haut de l'écran qu'à partir de 640 px.** Ses deux
  rangs font 121 px : collé sur un écran de 667 px, il prendrait 18 % de la
  hauteur pendant toute la lecture d'un texte. C'est le contraire de ce que
  demande une série qui se lit d'une traite sur téléphone.

Rien n'est escamoté derrière un menu : trois entrées tiennent sur une ligne
dès 320 px, et un bouton pour cacher trois mots coûterait un geste de plus.

Le fond de l'en-tête est **opaque**. Un bandeau translucide laissait
transparaître le texte qui défilait dessous, et une serif lue au travers d'un
voile se lit mal — c'est aussi le « glassmorphism systématique » qu'il fallait
éviter.

### Accessibilité

Tout ce qui se clique fait au moins 44 px de haut, sauf les liens pris dans
une phrase — les étirer casserait l'interligne, et WCAG 2.2 les exclut pour
cette raison. Les contrastes sont vérifiés dans le tableau ci-dessus. La page
courante est signalée par un filet rouge plutôt que par une couleur de texte,
pour que la lisibilité reste maximale. Les animations se limitent à des
changements de couleur et à deux filets qui s'allongent, et
`prefers-reduced-motion` les coupe toutes.

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
components/          en-tête, pied, sommaire, archive filtrable, sources, boutons…
content/cas/         un fichier .md par CAS
content/pages/       pages éditoriales
lib/cas.ts           lecture des CAS, rendu Markdown, détection de la signature
lib/pages.ts         lecture des pages éditoriales
lib/renvois.ts       les mentions « CAS 013 » / « d'autres CAS » en liens
lib/revision.ts      date de dernière modification des pages, prise dans git
lib/schema.ts        JSON-LD du site, de la série et des CAS
lib/site.ts          nom, domaine, navigation
scripts/             affiches Open Graph, typographie, contrôle des liens
```
