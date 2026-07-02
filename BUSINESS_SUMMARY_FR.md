# CLIGOO — Résumé pour les décideurs

*Une présentation en langage clair, destinée aux interlocuteurs non techniques.*

---

## Ce qu'est CLIGOO

CLIGOO (« Click & Goo ») est un **service de livraison de repas halal pour la France** — pensez à UberEats ou Deliveroo, mais conçu spécifiquement autour des **restaurants certifiés halal**. Les clients commandent, les restaurants préparent, les livreurs livrent, et l'entreprise prélève une commission sur chaque commande.

Deux éléments le distinguent :
- **La confiance halal** — chaque restaurant affiche clairement sa certification halal (AVS, ARGML, Mosquée de Paris, etc.), un véritable argument de vente pour le public ciblé.
- **Les appels vidéo en direct** — un client peut appeler son livreur en visio directement dans l'application (par ex. « Je suis au 3ᵉ étage, porte bleue »). La plupart des grands concurrents ne le proposent pas.

L'application fonctionne **en français et en anglais**.

---

## Qui peut faire quoi

**Les clients (le grand public)** — Parcourir les restaurants, filtrer par cuisine / note / temps de livraison, consulter les menus, ajouter des articles au panier, passer commande, payer, **suivre la commande en direct** (en préparation → en route → livrée), **appeler le livreur en visio**, et consulter leur historique de commandes.

**Les restaurants** — Un tableau de bord pour se mettre en ligne/hors ligne, voir les commandes entrantes, consulter le chiffre d'affaires du jour, et accepter/mettre à jour les commandes. *(Affiche actuellement des données de démonstration, pas encore connecté aux commandes réelles.)*

**Les livreurs** — Un tableau de bord pour se mettre en ligne, voir les courses disponibles, les accepter, consulter les gains, et finaliser les livraisons. *(Également des données de démonstration pour l'instant.)*

**Les administrateurs (l'entreprise)** — Un panneau de contrôle affichant le chiffre d'affaires total, le nombre de commandes, les restaurants et livreurs actifs, les notes, et la validation des nouveaux restaurants. *(Données de démonstration pour l'instant.)*

---

## Ce qui a été réalisé jusqu'à présent

**L'expérience client fonctionne réellement, de bout en bout.** Un client peut s'inscrire, parcourir 8 restaurants de démonstration, composer une commande, payer, et suivre sa « livraison » avec la fonction d'appel vidéo opérationnelle. Le moteur en coulisses qui calcule l'addition — coût des plats, frais de service, frais de livraison, pourboire, et la répartition de l'argent entre le restaurant, le livreur et la plateforme — est développé et testé.

- ✅ Côté client : fonctionnel et testé
- ✅ Inscription / connexion (y compris « Se connecter avec Google ») : fonctionnel
- ✅ Appels vidéo : fonctionnels
- ✅ La logique de répartition de l'argent : fonctionnelle et vérifiée
- ⚠️ Tableaux de bord restaurant, livreur et administrateur : conçus et d'apparence complète, mais affichent des **données de démonstration** — pas encore reliés aux commandes réelles
- ❌ Paiements réels : pas encore connectés — l'application simule la répartition des paiements mais ne débite pas réellement les cartes et ne rémunère pas réellement les restaurants/livreurs

---

## Ce qui reste à faire (pour devenir une véritable entreprise lançable)

1. **Le traitement réel des paiements** — la principale lacune. Aujourd'hui, l'application *calcule* qui doit être payé et combien, mais aucun argent réel ne circule. Connecter un prestataire de paiement (Stripe) est la priorité nº 1.
2. **Relier les tableaux de bord aux données réelles** — faire en sorte que les écrans restaurant, livreur et administrateur affichent les *vraies* commandes en direct au lieu de données de démonstration.
3. **Des rôles et autorisations appropriés** — distinguer de façon sécurisée les clients, les livreurs et les restaurateurs, chacun n'ayant accès qu'à ce qui le concerne.
4. **De vrais restaurants et de vraies images** — remplacer les 8 restaurants de démonstration et les photos génériques par de vrais restaurants intégrés, avec leurs menus et leurs photos.
5. **Renforcement de la sécurité** — les ajustements standards d'avant-lancement pour gérer en toute sécurité les données clients et l'argent réels.
6. **Un suivi de livraison réel** — remplacer la carte « livreur sur le plan » simulée par un suivi GPS réel.

---

## Le potentiel — comment faire évoluer l'application

- **Inscription en autonomie** pour les restaurants et les livreurs (les formulaires existent mais ne s'envoient pas encore), afin de croître sans configuration manuelle.
- **Notifications** — « Votre commande est en route », « Nouvelle commande reçue ».
- **Notes et avis** — instaurer la confiance entre clients, restaurants et livreurs.
- **Promotions et fidélité** — codes de réduction, offres de première commande, points de fidélité (les offres sont affichées mais pas encore fonctionnelles).
- **Plusieurs villes** — actuellement centré sur Paris ; la structure permet l'expansion dans toute la France.
- **Analyses commerciales** — de vrais graphiques sur le chiffre d'affaires, les restaurants les plus performants, les heures de pointe.
- **Les appels vidéo comme argument marketing** — un véritable facteur de différenciation qui mérite d'être mis en avant.

---

## À retenir en une phrase

> **CLIGOO est un prototype fonctionnel de livraison de repas halal dont le parcours client est entièrement opérationnel et testé. Pour en faire une entreprise active, il reste principalement à connecter les paiements réels, à relier les tableaux de bord restaurant/livreur/administrateur aux commandes en direct, et à intégrer de vrais restaurants.**
