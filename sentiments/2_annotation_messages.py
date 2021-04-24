import json
import random
import pandas as pd
import numpy as np

"""  Script d'annotation des messages

Présente dans la console un message et attentand une valeur:
 - 1        pour messages "positif"
 - 0 ou 2   pour messages "négatif"
 - exit     pour arrété le processus d'annotation
si autre chose est écrit le message n'est pas considéré

Stock les messages annotés dans un fichier csv: ./messages/messages.csv

Rq: L'ensemble des messages déjà annotés sont dans ./messages/messages0.csv

"""

# recupération des messages scrappés
with open('./messages/BDE_8223.json', encoding="utf8") as f:
  data = json.load(f)

# index des messages déjà présenté
indices = []

txt = -1  # texte entré par l'utilisateur
n = 0     # nombre de messages présentés
L = []    # liste des messages déjà annotés
rd = -1   # index parmis la base de messages
while txt != 'exit':

    # récupération d'un messages valide (pas de lien ni de gif ni de msg trop court)
    is_msg_ok = False
    while(not(is_msg_ok)):
      rd = random.randint(0,len(data))
      while(rd in indices):
        rd = random.randint(0,len(data))
      msg = data[rd]['what'].replace('\n',' ')
      is_msg_ok = data[rd]['whatType'] == "Texte" and len(msg) > 2
    
    # affichage du message des feedback éventuelle associé
    print(f"{n}: {msg}")
    feed = data[rd]['feedback']
    auteur = data[rd]['who']
    if(len(feed)):
        print(feed)

    # prise de l'annotation (ou autre)
    txt = input()
    
    # ajout du message si entrée console (txt) correcte
    if(n != 0 and (txt == '1' or txt == '2' or txt == '0')):
      if(txt == '2'):
        txt = '0'
      L.append([msg,auteur,int(txt)])
      indices.append(rd)
    n += 1


df = pd.DataFrame(np.array(L),columns=['messages','auteur','sentiments'])

df_csv = df.to_csv(r'./messages/messages.csv',index=False)