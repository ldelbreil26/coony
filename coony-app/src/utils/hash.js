import * as Crypto from "expo-crypto";

/**
 * Hache un mot de passe en utilisant l'algorithme SHA-256.
 *
 * @param {string} motDePasse - Le mot de passe en clair à hacher.
 * @returns {Promise<string>} Une promesse résolvant vers le hash SHA-256 en hexadécimal.
 *
 * @example
 * const hash = await hashMotDePasse("monMotDePasse");
 */
export async function hashMotDePasse(motDePasse) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    motDePasse
  );
}