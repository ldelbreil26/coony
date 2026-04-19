/**
 * @file validator.js
 * @description Fonctions utilitaires pour la validation des données à travers l'application.
 * Ces aides garantissent que les données saisies via l'UI sont conformes aux formats attendus
 * avant d'être traitées par la couche de mappage ou persistées dans la base de données.
 */

/**
 * Valide les champs obligatoires dans un objet.
 * Vérifie si les valeurs sont indéfinies, nulles ou des chaînes vides.
 *
 * @param {Object} fields - Paires clé/valeur à valider.
 * @param {Object} [options={}] - Options de validation.
 * @param {string} [options.message] - Message d'erreur personnalisé.
 * @returns {Object} Résultat de la validation.
 * @returns {boolean} result.valid - Vrai si tous les champs sont remplis.
 * @returns {string[]} result.missing - Liste des clés de champs manquants.
 * @returns {string|null} result.message - Message d'erreur prêt pour l'UI.
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
 * Valide une valeur par rapport à un motif regex prédéfini ou personnalisé.
 *
 * @param {string} value - La valeur à valider.
 * @param {RegExp|string} pattern - Un objet RegExp ou une clé du registre interne regexPatterns.
 * @param {Object} [options={}] - Options de validation.
 * @param {Object} [options.patterns] - Dictionnaire de motifs regex personnalisés supplémentaires.
 * @param {string} [options.message] - Message d'erreur personnalisé en cas d'échec de la validation.
 * @returns {Object} Résultat de la validation.
 * @returns {boolean} result.valid - Vrai si la valeur correspond au motif.
 * @returns {string|null} result.message - Message d'erreur si invalide, sinon null.
 */
export function validatePattern(value, pattern, options = {}) {
  const patterns = options.patterns || {};
  const message  = options.message  || "Format invalide";

  /**
   * Registre interne des motifs regex courants.
   */
  const regexPatterns = {
    "dateISO": /^\d{4}-\d{2}-\d{2}$/,
    "email": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  const resolvedPattern =
    pattern instanceof RegExp
      ? pattern
      : patterns[pattern] || regexPatterns[pattern];

  if (!resolvedPattern) {
    return { valid: false, message: "Motif inconnu" };
  }

  if (typeof value !== "string") {
    return { valid: false, message: "Valeur invalide" };
  }

  if (!resolvedPattern.test(value)) {
    return { valid: false, message };
  }

  return { valid: true, message: null };
}
