export const CLE_THEME = "aqm-theme";

export type Moment = "aurore" | "zenith" | "crepuscule";

/**
 * Posé dans <head>, avant le premier rendu.
 *
 * Il fait deux choses. Il applique le thème retenu — sans ça, qui a choisi le
 * clair verrait le site s'afficher en sombre le temps que React s'hydrate. Et
 * il détermine le moment de la journée : le site ne peut pas le savoir au
 * build, un export statique est servi tel quel à toute heure et sous tous les
 * fuseaux.
 *
 * Il tranche toujours entre "light" et "dark", jamais rien : décider ici évite
 * une bataille de spécificité entre la teinte du moment et la préférence
 * système, qui se disputeraient les mêmes variables.
 */
export const SCRIPT_THEME = `try{var d=document.documentElement,c=localStorage.getItem("${CLE_THEME}"),h=new Date().getHours(),m=h<6?"crepuscule":h<12?"aurore":h<18?"zenith":"crepuscule";d.dataset.moment=m;d.dataset.theme=c==="light"||c==="dark"?c:m==="crepuscule"||matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}`;
