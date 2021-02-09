# Assistant Messenger

## Objectifs

### 1. Récupération des messages

Il faut dans un premier temps que je récupère les informations à propos des messages d'une conversation Messenger.
-emojis
-auteur
-heure d'envoie
-contenu

### 2 Traitement des messages

Utilisation de plotly.js pour tracer l'évolution des différents critères au cours du temps.

### 3 Analyse du contenu pour obtenir les mots clé / sujet de conversation

## Avancé

### 08/02/2021

Je n'arrive plus à faire fonctionner facebook-chat-api. Facebook demande une double authantification mal géré par la librairie.
J'utilise alors puppeteer pour charger les pages comme dans un navigateur et récupérer le contenu des conversations dans le code source des pages.

C'est plutôt en bonne voie. Je suis en train de regarder du côté des expressions régulières pour extraire facilement les données que je veux.

Je suis limite niveau planning, il faut pas que je traine sinon des imprévus pourront être fortement embêtant. Heureusement les vacances arrivent.

## Description des fichiers

main.js est le script principale actuellement en debug, je fais mes test deçu.
Il permet actuellement d'accéder à mon compte messenger et de changer de conversation.

getHash.js et crypto.js me permettent d'éviter de mettre mon mot de passe dans le code source et donc sur github.
