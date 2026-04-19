import {
  insertParent,
  selectParentByEmail,
  selectParentLogin,
} from "../sqlite/queries";
import { hashMotDePasse } from "../../utils/hash";
import { nowSqlite } from "../../utils/date";

/**
 * Crée un compte parent en base de données.
 *
 * Hache le mot de passe avant insertion. Lance une erreur explicite
 * si l'email est déjà associé à un compte existant.
 *
 * @param {string} email       - Adresse email du parent.
 * @param {string} motDePasse  - Mot de passe en clair (sera haché en SHA-256).
 * @returns {Promise<Object>}  Le profil parent créé.
 * @throws {Error} Si l'email est déjà utilisé ou en cas d'erreur base de données.
 */
export async function creerCompteParent(email, motDePasse) {
  const hash = await hashMotDePasse(motDePasse);
  const date = nowSqlite();

  try {
    await insertParent(email, hash, date);
  } catch (e) {
    if (e.message?.includes("UNIQUE") || e.message?.includes("1555")) {
      throw new Error("Cet email est déjà utilisé");
    }
    throw e;
  }

  return selectParentByEmail(email);
}

/**
 * Connecte un parent en vérifiant ses identifiants.
 *
 * Hache le mot de passe fourni et le compare à celui stocké en base.
 *
 * @param {string} email           - Adresse email du parent.
 * @param {string} motDePasseClair - Mot de passe en clair à vérifier.
 * @returns {Promise<Object|null>} Les données de session du parent, ou null si les identifiants sont incorrects.
 */
export async function connecterParent(email, motDePasseClair) {
  const hash = await hashMotDePasse(motDePasseClair);
  const parent = await selectParentLogin(email, hash);

  if (!parent) return null;

  return {
    id_parent: parent.id_parent,
    email: parent.email,
    cree_le: parent.cree_le,
  };
}