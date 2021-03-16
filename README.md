# Assistant Messenger

## Objectifs

### 1. Récupération des messages

Il faut dans un premier temps que je récupère les informations à propos des messages d'une conversation Messenger.

- emojis
- auteur
- heure d'envoie
- contenu

### 2 Traitement des messages

Utilisation de plotly.js pour tracer l'évolution des différents critères au cours du temps.

### 3 Analyse du contenu pour obtenir les mots clé / sujet de conversation

## Avancement

### 08/02/2021

Je n'arrive plus à faire fonctionner facebook-chat-api. Facebook demande une double authantification mal géré par la librairie.
J'utilise alors puppeteer pour charger les pages comme dans un navigateur et récupérer le contenu des conversations dans le code source des pages.

C'est plutôt en bonne voie. Je suis en train de regarder du côté des expressions régulières pour extraire facilement les données que je veux.

Je suis limite niveau planning, il faut pas que je traine sinon des imprévus pourront être fortement embêtant. Heureusement les vacances arrivent.

### 16/03/2021

Objectifs 1 et 2 remplies (possible d'améliorer l'affichages des histogrammes en fusionnant certains)

Phase 3: plusieurs choix

- NLP : Topic / Text analysis
- Deep learning: surentrainement de BERT
- Analyse des sentiments

## Description des fichiers

main.js est le script est le fichier de test du scrapping.

\server contient le server express qui renvoi les messages scrapping.js est le script qui récupère tous les messages

\site contient le site VueJS qui affiche ces messages

## Principales dépendances

- Puppeteer: `npm i puppeteer`
- Crypto: `npm i crypto`
- Plotly: `npm i plotly.js-dist`
- ExpressJS
- VueJS

## Captures du site

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt1.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt2.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt3.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt4.PNG?raw=true)
