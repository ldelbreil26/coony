import * as Crypto from "expo-crypto";

export async function hashMotDePasse(motDePasse) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    motDePasse
  );
}