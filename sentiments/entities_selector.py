import pandas as pd
import json

""" Script de sélection et de regroupement des entitées

Suite à l'extraction des entitées avec entities_extractor.ipynb on éffectue
un trie à la main de ces entitées.

On regroupe aussi les entitées entres elles
exemple: "covid" "coronavirus" "virus" "pandémie" sont regroupés sous l'entitée "covid"

J'ai aussi rajouté à la main des entités qui me parraissaient pertinente directement 
dans le fichiers final: entities_final.json

"""

# chargement des entités extraite avec spaCy
entities = pd.read_csv("./entities/entities.csv")['0']

# chargement des entités traité par first_pass()
entities_saved = pd.read_csv('./entities/entities_0.csv')['entities'].values.tolist()

# chargement des entités traité par second_pass()
entities_saved_lower = pd.read_csv('./entities/entities_1.csv')['entities'].values.tolist()


def selection():
  """ 
  Présente dans la console les entitées pour faire une sélection
  Il faut saisir 1 pour garder l'entitée n'importe quoi d'autre sinon
  
  Met en minuscule et enlève les doublons
  """
  print(entities_saved)

  i = 1
  for ent in entities:
    ent = ent.replace('\n',' ').lower()
    if ent not in entities_saved:
      print(f"{i} - {ent}")
      if input() == '1':
        entities_saved.append(ent)
      i += 1

  pd.DataFrame(entities_saved, columns=['entities']).to_csv("./entities/entities_0.csv",index=False)

def regroupement():
  """
  Présente dans la console les entitées pour faire un regroupement
  Deux possibilités:
    - appuyer sur entrée sans rien saisir: créer un regroupement avec l'entitée en titre
    - saisir un titre de regroupement: ajoute l'entitée au regroupement saisi (créer le regroupement s'il n'existe pas)
  """
  group = {}
  for ent in entities_saved_lower:
    print(ent)
    title = input()
    if title == '':
      group[ent] = []
    else:
      if title in group:
        group[title].append(ent)
      else:
        group[title] = [ent, title]
  with open('./entities/entities_2.json', 'w', encoding="utf8") as fout:
    json.dump(group, fout, ensure_ascii=False)


selection()
regroupement()