export const REGLES_RECOMMANDATIONS = [
  {
    // Colère forte
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
    // Colère moyenne
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
    // Tristesse forte
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
    // Tristesse légère
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
    // Angoisse forte
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
    // Angoisse moyenne
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
    // Joie forte
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
    // Calme global
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

export function matchRecommandation(idEmotion, intensite, idSignal) {
  // On cherche la première règle qui valide toutes les conditions
  const match = REGLES_RECOMMANDATIONS.find(regle => {
    const isEmotionOK = regle.id_emotion === idEmotion;
    const isIntensiteOK = regle.intensites_valides.includes(intensite);
    const isSignalOK = regle.signaux_valides.includes(idSignal);

    return isEmotionOK && isIntensiteOK && isSignalOK;
  });

  // Si on trouve une correspondance, on retourne la réponse formatée
  if (match) {
    return match.reponse;
  }

  // Fallback par défaut si aucune règle stricte n'a matché
  // (très important pour ne pas crasher l'application si l'enfant donne une combinaison rare)
  return {
    titre: "Je vois ce que tu ressens.",
    message: "Prends le temps d'écouter ton corps.",
    proposition: "Je te propose de te poser un instant.",
    idMiniJeu: 2 // Renvoie vers "Pause calme" par défaut
  };
}