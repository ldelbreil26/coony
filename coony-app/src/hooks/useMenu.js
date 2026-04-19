import { useCallback, useState } from "react";
import { useEnfantSelectionne } from "../state/enfantSelectionne";
import { useSessionParent } from "../state/sessionParent";
import { listerEnfantsDuParent } from "../data/repositories/enfant.repo";
import { router, useFocusEffect } from "expo-router";

/**
 * Hook gérant la logique du menu de sélection.
 *
 * Charge la liste des enfants du parent connecté à chaque focus de l'écran,
 * et expose les navigations vers les tableaux de bord parent et enfant.
 *
 * @returns {Object}   L'état et les handlers du menu.
 * @returns {Array}    .enfants                - Liste des profils enfants associés au parent.
 * @returns {Function} .allerDashboardParent   - Navigue vers le tableau de bord parent.
 * @returns {Function} .allerDashboardEnfant   - Sélectionne un enfant et navigue vers son tableau de bord.
 * @returns {Object}   .router                 - Instance du router expo-router.
 */
export function useMenu() {
    const { parentConnecte } = useSessionParent();
    const { setEnfantSelectionne } = useEnfantSelectionne();
    const [enfants, setEnfants] = useState([]);

    const chargerEnfants = async () => {
        try {
            if (!parentConnecte?.id_parent) return;
            const resultat = await listerEnfantsDuParent(parentConnecte.id_parent);
            setEnfants(resultat);
        } catch (error) {
            console.error("Erreur chargement enfants :", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            chargerEnfants();
        }, [parentConnecte])
    );

    const allerDashboardParent = () => {
        router.push("/tableau_de_bord_parent");
    };

    const allerDashboardEnfant = (enfant) => {
        setEnfantSelectionne(enfant);
        router.push("/tableau_de_bord_enfant");
    };

    return {
        allerDashboardEnfant,
        allerDashboardParent,
        enfants,
        router,
    };
}