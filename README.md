# Frontend Gestion Personnes

Frontend web développé en **React** qui consomme un backend RESTful JAX-RS pour la gestion complète des personnes (CRUD + recherche).

Ce projet fait partie d’un travail full-stack réalisé dans le cadre des TPs sur les services web REST avec JAX-RS (année universitaire 2025-2026).

## Fonctionnalités réalisées

- Affichage dynamique de la liste des personnes dans un tableau responsive
- Ajout d’une personne via modal avec validation des champs
- Modification d’une personne (modal pré-remplie)
- Suppression avec confirmation
- Recherche en temps réel par nom
- Compteur total de personnes
- Design moderne dark mode avec effet glassmorphism et glow

## Technologies utilisées

- **React 18** + **Vite** (build tool rapide)
- **Bootstrap 5** + **react-bootstrap** (UI responsive et modals)
- **Axios** (appels HTTP vers le backend REST)
- CSS personnalisé (`AppTheme.css`) pour le thème sombre, gradients, blur et ombres

## Communication avec le backend REST

Le frontend communique **exclusivement** via des requêtes HTTP avec le backend JAX-RS déployé sur Tomcat (port 8082) :

- `GET  /rest/personnes` → liste
- `PUT  /rest/personnes/add/{nom}/{age}` → ajout
- `PUT  /rest/personnes/update/{id}/{nom}/{age}` → modification
- `DELETE /rest/personnes/remove/{id}` → suppression

Aucun accès direct à la base de données.

**Backend correspondant** :  
🔗 https://github.com/ChaimaAyed20/gestion-personnes-backend

## Installation & Lancement

```bash
git clone https://github.com/ton-username/gestion-personnes-frontend.git
cd gestion-personnes-frontend
npm install
npm run dev
