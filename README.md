# Assistant Messenger

## Objectifs

### 1. Récupérer les messages d'une conversation Messenger

Il faut plusieurs informations autour de chaque message:

- l'auteur,
- l'heure d'envoie,
- les réactions,
- le contenu.

### 2 Traiter ces messages et afficher des graphiques sympa

Utilisation de plotly.js pour tracer l'évolution des différents critères au cours du temps.
On peut visualiser:

- la fréquence de réception messages,
- la fréquence de réaction sous les messages
- la fréquence de réaction typée "sérieuse"
- qui parle le plus et dans quelle proportion ?

### 3 Analyse du contenu - NLP

🚧👷‍♂️ Travail en cours 👷‍♂️🚧

<!-- ## Avancement

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
-->

## Captures du site au 16 mars

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt1.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt2.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt3.PNG?raw=true)

![alt text](https://github.com/plorgue/assistant-messenger/blob/main/site/blob/capt4.PNG?raw=true)

## Description du dépot

### Les dossiers

\server contient l'api qui envoi les messages scrapés

\site contient le site VueJS qui traite et affiche ces messages

### Les dépendances

Site:

- Vue
- Plotly

Server:

- Express
- Puppeteer
- Cors
- (Crypto) ça dépend les versions

### Installation et tests

Pour tester le projet il faut:

- avoir node d'installé et un gestionnaire de paquet (j'utilise npm)
- avoir un compte Facebook et des conversations de groupe sur Messenger (les conversations avec un seul autre interlocuteur ne sont pas compatible)
- avoir installé Vue CLI : `npm install -g @vue/cli`
- ..avoir certainement autre chose que j'ai pas remarqué

Procédure pour tester:

- cloner le dépot
- exécuter la commande `npm install` dans les répertoires `site\` et `server\`
- exécuter simultanément (dans deux invites de commande): `npm run serve` et `node server.js` respectivement dans les repertoires `site\` et `server\`
- ouvrir son navigateur et aller à l'adresse: http://localhost:8080/

### Warning

Ce projet est avant tout destiné à un usage personnel donc les url des conversations que je souhaite analyser seront/sont associé à un bouton sur le côté droit et un code PIN me suffit pour appeler l'api. ( pas besoin de rentrer le mot de passe de 36 caractères ni de coller le lien de la conv qui m'intéresse )
J'ai rapidement ajouté ces fonctionnalités il se peut donc qu'elles ne fonctionnent pas totalement. (je devrais ajouter ces fonctionnalités demain normalement ^^)

De plus n'ayant pas testé avec d'autres comptes Facebook que le mien je ne suis pas sur que le scrapping de page Messenger de ces autres comptes fonctionne (si le compte n'est pas configuré en français, pas sur que ça marche par exemple)
