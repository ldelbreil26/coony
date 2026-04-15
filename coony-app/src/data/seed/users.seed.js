import { hashMotDePasse } from "../../utils/hash";
import { nowSqlite } from "../../utils/date";

import {
  selectParentByEmail,
  insertParent,
  selectEnfantsByParent,
  insertEnfant,
} from "../sqlite/queries";

// -------------------- USERS SEED --------------------

export async function seedUsers() {
  const email = "lydie@test.com";

  let parent = await selectParentByEmail(email);
  if (!parent) {
    const hash = await hashMotDePasse("123456");
    const date = nowSqlite();

    await insertParent(email, hash, date);

    parent = await selectParentByEmail(email);
  }

  const idParent = parent?.id_parent;
  if (!idParent) return;

  const enfants = await selectEnfantsByParent(idParent);
  if (enfants.length === 0) {
    const date = nowSqlite();

    await insertEnfant(idParent, "Laura", "2016-04-12", date);
    await insertEnfant(idParent, "Elsa", "2018-11-03", date);
  }

  console.log("Users seed terminé");
}