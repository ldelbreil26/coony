/**
 * @module RecommendationService
 * @description Moteur de règles pour associer un état émotionnel à une recommandation (mini-jeu).
 * Ce service implémente la logique métier de l'application en transformant les réponses du 
 * questionnaire en actions concrètes pour l'enfant.
 */

/**
 * @typedef {Object} RecommandationReponse
 * @property {string} titre - Titre de la recommandation affiché à l'enfant.
 * @property {string} message - Message pédagogique expliquant l'émotion.
 * @property {string} proposition - Phrase d'introduction au mini-jeu.
 * @property {number} idMiniJeu - Identifiant du mini-jeu dans le catalogue.
 */

/**
 * @typedef {Object} RegleRecommandation
 * @property {number} id_emotion - ID de l'émotion (ex: 4 pour Colère).
 * @property {number[]} intensites_valides - Liste des niveaux d'intensité (1-5) concernés.
 * @property {number[]} signaux_valides - Liste des IDs de signaux corporels concernés.
 * @property {RecommandationReponse} reponse - La recommandation à retourner si la règle matche.
 */

/**
 * Catalogue des règles métier définissant les parcours de soin émotionnel.
 * @type {RegleRecommandation[]}
 */
export const REGLES_RECOMMANDATIONS = [
  {
    // Colère forte : Focus sur la respiration pour faire descendre la pression
    id_emotion: 4, 
    intensites_valides: [4, 5], 
    signaux_valides: [1, 4],
    reponse: {
      titre: "Tu te sens en colère.",
      message: "C’est une émotion qui peut être forte.",
      proposition: "On va respirer doucement ensemble pour calmer ton corps.",
      idMiniJeu: 1, // Respiration 4-4
    }
  },
  {
    // Colère moyenne : Moment de calme pour éviter l'escalade
    id_emotion: 4, 
    intensites_valides: [3], 
    signaux_valides: [4], // Corps tendu
    reponse: {
      titre: "Tu te sens un peu en colère.",
      message: "Ça peut arriver.",
      proposition: "On va prendre un petit moment tranquille.",
      idMiniJeu: 2, // Pause calme
    }
  },
  {
    // Tristesse forte : Besoin de réconfort et de sécurité
    id_emotion: 2, 
    intensites_valides: [4, 5], 
    signaux_valides: [5], // Fatigué (pour Fatigue / Corps lourd)
    reponse: {
      titre: "Tu te sens très triste.",
      message: "Ça peut être difficile parfois.",
      proposition: "On va prendre un moment pour te faire sentir en sécurité.",
      idMiniJeu: 3, // Cocon sécurité
    }
  },
  {
    // Tristesse légère : Diversion douce
    id_emotion: 2, 
    intensites_valides: [1, 2], 
    signaux_valides: [2, 6], // Normal ou "Je ne sais pas" (Rien de spécial)
    reponse: {
      titre: "Tu te sens un peu triste.",
      message: "Ça arrive parfois.",
      proposition: "On peut faire une petite activité agréable.",
      idMiniJeu: 4, // Activité douce
    }
  },
  {
    // Angoisse forte : Exercice d'ancrage (5-4-3-2-1) pour sortir de la tête
    id_emotion: 6, 
    intensites_valides: [4, 5], 
    signaux_valides: [3, 1], // Ventre serré OU Cœur rapide
    reponse: {
      titre: "Tu te sens inquiet.",
      message: "Ton corps essaie peut-être de te protéger.",
      proposition: "On va regarder autour de nous pour aider ton cerveau à se sentir en sécurité.",
      idMiniJeu: 5, // Exercice 5-4-3-2-1
    }
  },
  {
    // Angoisse moyenne : Respiration guidée
    id_emotion: 6, 
    intensites_valides: [3], 
    signaux_valides: [3], // Ventre serré
    reponse: {
      titre: "Tu te sens un peu inquiet.",
      message: "C’est normal parfois.",
      proposition: "On va respirer doucement ensemble.",
      idMiniJeu: 6, // Respiration lente
    }
  },
  {
    // Joie forte : Capitalisation sur l'émotion positive
    id_emotion: 1, 
    intensites_valides: [4, 5], 
    signaux_valides: [2], // Normal (pour "Bien")
    reponse: {
      titre: "Tu te sens très joyeux.",
      message: "C’est agréable de ressentir ça.",
      proposition: "On peut partager ce moment avec quelqu’un.",
      idMiniJeu: 7, // Partage positif
    }
  },
  {
    // Calme global : Entretien de la sérénité
    id_emotion: 3, 
    intensites_valides: [1, 2, 3, 4, 5], // Toutes les intensités
    signaux_valides: [2, 6], // Normal ou "Je ne sais pas"
    reponse: {
      titre: "Tu te sens calme.",
      message: "Ton corps est tranquille.",
      proposition: "On peut garder ce moment agréable.",
      idMiniJeu: 8, // Moment détente
    }
  }
];

/**
 * Sélectionne la recommandation la plus pertinente en fonction du profil émotionnel saisi.
 * 
 * L'algorithme procède en 3 étapes :
 * 1. Recherche d'un match précis (Emotion + Intensité + Signal Corporel).
 * 2. Si aucun match, recherche d'un match partiel (Emotion + Intensité uniquement).
 * 3. En dernier recours, retourne une recommandation générique sécurisante.
 * 
 * @param {number} idEmotion - ID de l'émotion choisie.
 * @param {number} intensite - Intensité ressentie (1 à 5).
 * @param {number} idSignal - ID du signal corporel identifié.
 * @returns {RecommandationReponse} La recommandation sélectionnée.
 */
export function matchRecommandation(idEmotion, intensite, idSignal) {
  // Tentative de match complet (Précision maximale)
  const match = REGLES_RECOMMANDATIONS.find(regle => {
    return (
      regle.id_emotion === idEmotion &&
      regle.intensites_valides.includes(intensite) &&
      regle.signaux_valides.includes(idSignal)
    );
  });

  if (match) return match.reponse;

  // Fallback 1 : Match sur l'intensité émotionnelle sans tenir compte du signal corporel
  const matchPartiel = REGLES_RECOMMANDATIONS.find(regle => {
    return (
      regle.id_emotion === idEmotion &&
      regle.intensites_valides.includes(intensite)
    );
  });

  if (matchPartiel) return matchPartiel.reponse;

  // Fallback 2 : Réponse générique par défaut (sécurité)
  return {
    titre: "Je vois ce que tu ressens.",
    message: "Prends le temps d'écouter ton corps.",
    proposition: "Je te propose de te poser un instant.",
    idMiniJeu: 1, // Exercice de base par défaut
  };
}