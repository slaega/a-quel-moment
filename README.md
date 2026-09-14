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

## Avant de déployer

Renseigner le domaine final dans `lib/site.ts` (`site.url`) : il sert de base aux
URLs absolues des balises Open Graph, du canonical et du sitemap.

Le build produit `out/`, un dossier de fichiers statiques — déployable tel quel
sur Vercel, Netlify, GitHub Pages ou n'importe quel hébergeur.

## Direction artistique

| Rôle | Valeur |
| --- | --- |
| Fond | `#0B0B0C` |
| Texte | `#F2F0EC` |
| Accent | `#C8362B` — numéro du CAS, phrase qui retourne le texte, liens actifs |
| Texte secondaire | `#86837E` |
| Filets | `#232326` |

Corps et titres en **Inter**, signature en **Lora** italique. Les jetons sont
définis en un seul endroit, le bloc `@theme` de `app/globals.css` : y changer une
valeur suffit à la propager partout.

## Structure

```
app/                 pages (accueil, /cas, /cas/[numero], /philosophie, /a-propos)
components/          en-tête, pied de page, archive filtrable, bouton copier…
content/cas/         un fichier .md par CAS
content/pages/       pages éditoriales
lib/cas.ts           lecture des CAS, rendu Markdown, détection de la signature
lib/pages.ts         lecture des pages éditoriales
lib/site.ts          nom, domaine, navigation
```
