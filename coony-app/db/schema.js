export const SCHEMA_SQL = `

PRAGMA foreign_keys = ON;

-- TABLES CATALOGUES --

CREATE TABLE IF NOT EXISTS catalogue_emotions (
    id_emotion INTEGER PRIMARY KEY,
    libelle    TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS catalogue_signaux_corporels (
    id_signal_corporel INTEGER PRIMARY KEY,
    libelle            TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS catalogue_couleurs (
    id_couleur INTEGER PRIMARY KEY,
    nom        TEXT NOT NULL UNIQUE,
    valeur_hex TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS catalogue_lieux (
    id_lieu INTEGER PRIMARY KEY,
    libelle TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS catalogue_mini_jeux (
    id_mini_jeu INTEGER PRIMARY KEY,

    type_mj TEXT NOT NULL,
    libelle TEXT NOT NULL UNIQUE
);

-- TABLES FONCTIONNELLES --

CREATE TABLE IF NOT EXISTS compte_parent (
    id_parent INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,

    cree_le TEXT NOT NULL,
    CHECK (
        cree_le GLOB '____-__-__ __:__:__'
        AND datetime(cree_le) IS NOT NULL
    )
);

CREATE TABLE IF NOT EXISTS profil_enfant (
    id_enfant INTEGER PRIMARY KEY,
    id_parent INTEGER NOT NULL,
    prenom TEXT NOT NULL,

    date_naissance TEXT NOT NULL
    CHECK (
        date_naissance GLOB '____-__-__'
        AND date(date_naissance) IS NOT NULL
    ),

    cree_le TEXT NOT NULL
    CHECK (
        cree_le GLOB '____-__-__ __:__:__'
        AND datetime(cree_le) IS NOT NULL
    ),

    FOREIGN KEY (id_parent)
        REFERENCES compte_parent(id_parent)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS questionnaire_emotionnel (
    id_questionnaire INTEGER PRIMARY KEY,
    id_enfant INTEGER NOT NULL,

    date_questionnaire TEXT NOT NULL
    CHECK (
        date_questionnaire GLOB '____-__-__ __:__:__'
        AND datetime(date_questionnaire) IS NOT NULL
    ),

    -- QUESTION 1 : ÉMOTION & INTENSITÉ
    id_emotion INTEGER NOT NULL,
    intensite_emotion INTEGER NOT NULL CHECK (intensite_emotion BETWEEN 1 AND 5),

    -- QUESTION 2 : ÉTAT CORPOREL
    id_signal_corporel INTEGER,

    -- QUESTION 3 : LIEU
    id_lieu INTEGER,

    -- QUESTION 4 : COULEUR
    id_couleur INTEGER,

    FOREIGN KEY (id_enfant)
        REFERENCES profil_enfant(id_enfant)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_emotion)
        REFERENCES catalogue_emotions(id_emotion)
        ON UPDATE CASCADE,

    FOREIGN KEY (id_signal_corporel)
        REFERENCES catalogue_signaux_corporels(id_signal_corporel)
        ON UPDATE CASCADE,

    FOREIGN KEY (id_lieu)
        REFERENCES catalogue_lieux(id_lieu)
        ON UPDATE CASCADE,

    FOREIGN KEY (id_couleur)
        REFERENCES catalogue_couleurs(id_couleur)
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS recommandation (
    id_recommandation INTEGER PRIMARY KEY,
    id_questionnaire INTEGER NOT NULL UNIQUE,

    cree_le TEXT NOT NULL
    CHECK (
        cree_le GLOB '____-__-__ __:__:__'
        AND datetime(cree_le) IS NOT NULL
    ),

    id_mini_jeu INTEGER NOT NULL,

    FOREIGN KEY (id_questionnaire)
        REFERENCES questionnaire_emotionnel(id_questionnaire)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_mini_jeu)
        REFERENCES catalogue_mini_jeux(id_mini_jeu)
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS session_minijeu (
    id_session INTEGER PRIMARY KEY,
    id_questionnaire INTEGER NOT NULL UNIQUE,

    id_mini_jeu INTEGER NOT NULL,
    realise_le TEXT NOT NULL
    CHECK (
        realise_le GLOB '____-__-__ __:__:__'
        AND datetime(realise_le) IS NOT NULL
    ),

    termine INTEGER NOT NULL DEFAULT 0 CHECK (termine IN (0, 1)),

    FOREIGN KEY (id_questionnaire)
        REFERENCES questionnaire_emotionnel(id_questionnaire)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_mini_jeu)
        REFERENCES catalogue_mini_jeux(id_mini_jeu)
        ON UPDATE CASCADE
)

`;
