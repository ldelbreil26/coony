import {
  insertParent,
  selectParentByEmail,
  selectParentLogin,
} from "../sqlite/queries";
import { hashMotDePasse } from "../../utils/hash";
import { nowSqlite } from "../../utils/date";

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