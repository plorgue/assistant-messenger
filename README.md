# Assistant Messenger

## Objectifs

### 1. Récupérer les messages d'une conversation Messenger

Il faut plusieurs informations autour de chaque message:

- l'auteur,
- l'heure d'envoie,
- les réactions,
- le contenu.

8225 on était récupéré sur une de mes conversations.

### 2 Traiter ces messages et afficher des graphiques sympa

Utilisation de plotly.js pour tracer l'évolution des différents critères au cours du temps.
On peut visualiser:

- la fréquence de réception messages,
- la fréquence de réaction sous les messages
- la fréquence de réaction typée "sérieuse"
- le nombre de message envoyer par chaque personne

### 3 Analyse du contenu - sentiments

L'analyse du contenu se base sur de l'analyse de sentiments.
D'un côté on associe à chaque messages un sentiment positif 1 ou négatif 0 et de l'autre on extrait de chaque message les entités citées (personnes, lieux, objets/concepts marquant). Ainsi on obtient une correspondance sentiment / entité. En comptant le nombre de sentiment positif / négatif associé à chaque entité puis en faisant la différence on peut classer les entités de la plus apprécié à la plus décrié.

Les résultats de cette partie ne sont pas affichés sur le site.

## Techniques

La récupération des messages se fait au travers d'une api accessible par un serveur Express. Le messages sont extraits directement des pages web des conversation Messenger grace à un navigateur Headless: Puppeteer.

L'affichage se fait grace à un site one-page en VueJS. Les graphiques sont dessinés avec la librairie Plotly.

L'analyse de sentiment est développé en Python avec la plateforme TensorFlow. Je me suis inspiré du travail de [Theophile Blard](https://github.com/TheophileBlard/french-sentiment-analysis-with-bert) pour fine tune un model [camembert](https://huggingface.co/jplu/tf-camembert-base) pré-entrainé. J'ai utilisé différent jeu de données: [tweets FR](https://www.kaggle.com/hbaflast/french-twitter-sentiment-analysis), [commentaire allocine](https://github.com/huggingface/datasets/blob/master/datasets/allocine/dummy/allocine/1.0.0/dummy_data.zip)
L'extraction des entitées des messages et faites grossièrement avec spaCy puis retraité et améliroé à la main.

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

<!--
### Les branches

La seule différence entre les branches `main` et `main_light` et que `main_light` n'a pas de dossier `sentiment/models_weights`. Les poids du modèle fine-tuned sont stockés dans un fihier .h5 volumunieux > 100Mb.
-->

## Les dossiers

\server contient l'api qui envoi les messages scrapés

\site contient le site VueJS qui traite et affiche ces messages

\sentiements contient les scripts permettant l'analyse de sentiements d'un jeu de messages provenant d'une conversation

### Installation et tests

<!--
Pour tester le projet il faut:

- avoir node d'installé et un gestionnaire de paquet (j'utilise npm)
- avoir un compte Facebook et des conversations de groupe sur Messenger (les conversations avec un seul autre interlocuteur ne sont pas compatible)
- avoir installé Vue CLI : `npm install -g @vue/cli`

Pour cloner le projet:

- Avec le modèle fine-tuned (banche `main`)
  Il faut avoir installer l'extension [lfs](https://git-lfs.github.com/) (Large File Storage) de git sinon `git lfs install`
  Utiliser le git bash pour clone (personnelement avec powershell cela ne marche pas):
  `git clone git@github.com:plorgue/assistant-messenger.git`

- Sans le modèle fine-tuned (branche `main_light`)
  `git clone -b main_light --single-branch git@github.com:plorgue/assistant-messenger.git`

Procédure pour tester la partie site, server:

- cloner le dépot
- exécuter la commande `npm install` dans les répertoires `site\` et `server\`
- exécuter simultanément (dans deux invites de commande): `npm run serve` et `node server.js` respectivement dans les repertoires `site\` et `server\`
- ouvrir son navigateur et aller à l'adresse: http://localhost:8080/
Procédure pour tester la partie analyse de sentiment

- avoir [python](https://www.python.org/downloads/) installé
- avoir [pip](https://pip.pypa.io/en/stable/installing/) installé
- avoir installé les librairies suivantes: `numpy`,`pandas`,`matplotlib`,`sklearn`,`seaborn`,`tensorflow`,`transformers`, sur l'environnement
- pour visualisé les notebooks dans VS Code il faut installé
   - [numpy](https://numpy.org/install/): `pip install numpy`
  - [pandas](https://pandas.pydata.org/pandas-docs/stable/getting_started/install.html#installing-from-pypi): `pip install pandas`
  - [matplotlib]
  - [sklearn]
  - [seaborn]
  - [tensorflow]
  - [transformers]

 ### Warning

Ce projet est avant tout destiné à un usage personnel donc les url des conversations que je souhaite analyser sont associés à un bouton sur le côté droit et un code PIN me suffit pour appeler l'api. ( pas besoin de rentrer le mot de passe de 36 caractères ni de coller le lien de la conv qui m'intéresse )
Je suis rapidement en train d'ajouter une fonctionnalités "visiteur" pour pouvoir analyser une conversation sur un autre compte Facebook (en entrant mot de passe FB et identifiant) -->

<!-- De plus n'ayant pas testé avec d'autres comptes Facebook que le mien je ne suis pas sur que le scrapping de page Messenger de ces autres comptes fonctionne (si le compte n'est pas configuré en français, pas sur que ça marche par exemple) -->

## Déploiement

### Le site

Prérequis :

- Avoir [Node.js](https://nodejs.org/fr/download/) installé
- Avoir un gestionnaire de paquet JS installé, j’utilise [NPM](https://www.npmjs.com/get-npm)
- Avoir installer [VueCLI](https://cli.vuejs.org/): `npm install -g @vue/cli`

Procédure :

- Cloner le dépôt GitHub
- Exécuter la commande `npm install` successivement dans les deux répertoires `server/` et `site/`
- Pour lancer l’API exécuter : `node .\server.js` dans le répertoire `server/`
- Pour lancer le serveur local permettant de visionner le site Vue exécuter npm run serve dans le répertoire `site/`
- Dans un navigateur Edge, Chrome, ou Firefox (il est peu probable que ça fonctionne avec Internet Explorer) entrer l’url : http://localhost:8080

### L'analyse de sentiment

Pour exécuter les Notebook sur sa machine :

- Avoir un environnement [Anaconda](https://www.anaconda.com/products/individual) actif sur lequel est installé le package [Jupyter](https://jupyter.org/install)
- Utiliser un éditeur de texte compatible comme VS Code ou JupyterLab
- Pour exécuter les notebooks sur GPU il faut installé CUDA et TensorFlow pour GPU. Attention il faut que les versions de Python, CUDA et TensorFlow soit compatible.
  La documentation [TensorFlow](https://www.tensorflow.org/install/gpu?hl=fr) explique la procédure d’installation

Pour exécuter les Notebook sur Google Colab :

- Aller sur [ce lien](https://drive.google.com/drive/folders/1T5XByZEZQSSdvy4AgS_hwhB8zq7rSDE_?usp=sharing) Google Drive
- Ouvrir les Notebooks avec Google Colab
- Pour les exécuter il faut modifier la variable `chemin_dossier_contenant_projet` avec le chemin dans votre Drive du dossier contenant le dossier `sentiments/`
