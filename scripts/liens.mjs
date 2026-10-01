/**
 * Vérifie que chaque source citée sous un CAS répond encore.
 *
 * Le contrôle du build ne regarde que la forme de l'URL — il attrape une
 * adresse mal écrite, jamais une page supprimée. Or une source morte sous un
 * texte qui s'appuie dessus est pire que pas de source : le lecteur qui
 * clique pour vérifier tombe sur une 404 et conclut qu'on a inventé le
 * chiffre.
 *
 * Ce contrôle est volontairement hors du build : il dépend du réseau, et un
 * déploiement ne doit pas échouer parce qu'un serveur lointain a toussé. À
 * lancer après avoir ajouté des sources, et de temps en temps sur tout.
 *
 *   npm run liens
 *
 * Ne sort en erreur que sur une page vraiment disparue (404, 410). Tout le
 * reste est signalé sans faire échouer : un 403 veut presque toujours dire
 * qu'un serveur refuse les robots, et un proxy d'entreprise refuse tout —
 * conclure « lien mort » dans ces cas-là ferait retirer des sources
 * parfaitement vivantes.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DOSSIER = path.join(process.cwd(), "content", "cas");
const DELAI = 20000;
const AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";

function sourcesDeTousLesCas() {
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .flatMap((fichier) => {
      const { data } = matter(fs.readFileSync(path.join(DOSSIER, fichier), "utf8"));
      const liste = Array.isArray(data.sources) ? data.sources : [];
      return liste.map((s) => ({
        fichier,
        url: typeof s === "string" ? s : s?.url,
        titre: typeof s === "string" ? null : s?.titre,
      }));
    })
    .filter((s) => typeof s.url === "string" && s.url !== "");
}

/**
 * Certains serveurs refusent HEAD alors que la page existe. On réessaie donc
 * en GET avant de conclure, pour ne pas déclarer morte une source vivante.
 */
async function interroger(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(DELAI),
        headers: { "user-agent": AGENT, accept: "text/html,*/*" },
      });
      if (r.status === 405 || r.status === 501) continue;
      // Un proxy d'egress refuse avant d'avoir touché le serveur : sa réponse
      // ne dit rien de la page. Il le signale dans cet en-tête.
      const refusProxy = r.headers.get("x-deny-reason");
      return { statut: r.status, arrivee: r.url, refusProxy };
    } catch (e) {
      if (method === "GET") return { erreur: e.cause?.code ?? e.name ?? String(e) };
    }
  }
  return { erreur: "sans réponse" };
}

const sources = sourcesDeTousLesCas();
if (sources.length === 0) {
  console.log("Aucune source déclarée.");
  process.exit(0);
}

console.log(`${sources.length} source(s) à vérifier.\n`);

const morts = [];
const douteux = [];
let bloques = 0;

for (const s of sources) {
  const r = await interroger(s.url);
  const cas = s.fichier.replace(/^cas-|\.md$/g, "");
  const ligne = (marque, quoi) => console.log(`  ${marque}  CAS ${cas}  ${quoi}`);

  if (r.refusProxy) {
    bloques += 1;
    ligne("~", `bloqué par le proxy réseau (${r.refusProxy}) — la page n'a pas été jointe`);
  } else if (r.erreur) {
    douteux.push({ ...s, cas, ...r });
    ligne("?", `injoignable : ${r.erreur}`);
    console.log(`      ${s.url}`);
  } else if (r.statut === 404 || r.statut === 410) {
    morts.push({ ...s, cas, ...r });
    ligne("✗", `${r.statut} — la page n'existe plus`);
    console.log(`      ${s.url}`);
  } else if (r.statut >= 400) {
    douteux.push({ ...s, cas, ...r });
    // 401/403/429 : le serveur filtre les robots. À ouvrir dans un navigateur.
    ligne("?", `${r.statut} — refus du serveur, à vérifier dans un navigateur`);
    console.log(`      ${s.url}`);
  } else {
    const deplace = r.arrivee && r.arrivee !== s.url;
    ligne("✓", `${r.statut}${deplace ? `  → ${r.arrivee}` : ""}`);
  }
}

console.log("");
if (bloques > 0) {
  console.log(
    `${bloques} source(s) non vérifiée(s) : le proxy réseau d'ici bloque la sortie.\n` +
      `Relance « npm run liens » depuis une machine qui a accès à Internet.`,
  );
}
if (douteux.length > 0) {
  console.log(`${douteux.length} source(s) à ouvrir à la main :`);
  for (const d of douteux) console.log(`  CAS ${d.cas} — ${d.titre ?? d.url}`);
}
if (morts.length > 0) {
  console.log(`\n${morts.length} source(s) morte(s). À remplacer ou à retirer :`);
  for (const m of morts) console.log(`  CAS ${m.cas} — ${m.titre ?? m.url}`);
  process.exit(1);
}
if (bloques === 0 && douteux.length === 0) console.log("Toutes les sources répondent.");
