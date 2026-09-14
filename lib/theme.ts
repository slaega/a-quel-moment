export const CLE_THEME = "aqm-theme";

/**
 * Posé dans <head>, avant le premier rendu : sans lui, une personne ayant
 * choisi le thème clair verrait le site s'afficher en sombre le temps que
 * React s'hydrate.
 */
export const SCRIPT_THEME = `try{var t=localStorage.getItem("${CLE_THEME}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
