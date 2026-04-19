/**
 * Valide les champs obligatoires d’un objet.
 * Vérifie les valeurs undefined, null ou chaîne vide.
 *
 * @param {Object} fields - Paires clé/valeur à valider
 * @param {Object} options
 * @param {Object} options.message - message d'erreur custom
 * @returns {Object} résultat
 * @returns {boolean} résultat.valid - true si tous les champs sont remplis
 * @returns {string[]} résultat.missing - Liste des champs manquants
 * @returns {string|null} résultat.message - Message d’erreur prêt pour l’UI
 */
export function validateRequiredFields(fields, options = {}) {
  const message = options.message || "Champs manquants";

  const missing = Object.entries(fields)
    .filter(([, value]) => {
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    })
    .map(([key]) => key);

  return {
    valid: missing.length === 0,
    missing,
    message:
      missing.length > 0
        ? options.message
          ? options.message
          : missing.join(", ")
        : null,
  };
}

/**
 * Valide une valeur avec un pattern prédéfini ou custom.
 *
 * @param {string} value - Valeur à valider
 * @param {RegExp|string} pattern - Regex ou clé de regexPatterns
 * @param {Object} options
 * @param {Object} options.patterns - dictionnaire de regex custom
 * @param {Object} options.message  - message d'erreur custom 
 * @returns {boolean}
 */
export function validatePattern(value, pattern, options = {}) {
  const patterns = options.patterns || {};
  const message  = options.message  || "Format invalide";

  const regexPatterns = {
    "dateISO": /^\d{4}-\d{2}-\d{2}$/,
    "email": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  const resolvedPattern =
    pattern instanceof RegExp
      ? pattern
      : patterns[pattern] || regexPatterns[pattern];

  if (!resolvedPattern) {
    return { valid: false, message: "Pattern inconnu" };
  }

  if (typeof value !== "string") {
    return { valid: false, message: "Valeur invalide" };
  }

  if (!resolvedPattern.test(value)) {
    return { valid: false, message };
  }

  return { valid: true, message: null };
}