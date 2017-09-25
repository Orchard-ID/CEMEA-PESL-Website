# Site web des CEMEA-PESL #

[Node.js]: https://nodejs.org/en/ "Node.js"
[NodeAtlas]: https//node-atlas.js.org/ "NodeAtlas"
[npm]: https://www.npmjs.com/ "Node Package Manager"
[Git]: https://git-scm.com/ "Git"





## Avant-propos ##

Ce dépôt contient l'intégralité du code source permettant de mettre en ligne le site web https://www.cemea-pesl.fr/. Celui-ci fonctionne avec [NodeAtlas] qui est un module [npm] tournant sous [Node.js].

Il peut servir d'inspiration pour créer d'autres sites.





## Règle de développement ##

### Flot ###

Quand vous aurez récupéré le dépôt sur votre machine, [respectez ce flot pour le versionnement](https://blog.lesieur.name/comprendre-et-utiliser-git-avec-vos-projets/).

### Conventions ###

Quand vous devrez ajouter, modifier ou supprimer du code, [respectez ces conventions](https://blog.lesieur.name/conventions-html-css-js-et-architecture-front-end/).





## Environnement de développement ##

### Installation ###

Pour modifier le site avec un rendu en temps réel, il vous faudra :

1. installer [Node.js] sur votre poste de développement ainsi que [Git] :

   - [Télécharger Node.js](https://nodejs.org/en/download/)
   - [Télécharger Git](https://git-scm.com/downloads)

2. installer [NodeAtlas] en global sur votre poste de développement :
   
   ```bash
   $ npm install -g node-atlas
   ```

3. récupérer la structure du site sur votre poste de développement depuis le dépôt `Orchard-ID/CEMEA-PESL-Website` sur la branche `develop` :

   ```bash
   $ cd </chemin/vers/votre/espace/de/travail/>
   $ git clone https://github.com/Orchard-ID/CEMEA-PESL-Website.git
   ```

4. récupérer un jeu de donnée pour le site sur votre poste de développement depuis le dépôt `Orchard-ID/Data` sur la branche `develop` :
   
   ```bash
   $ cd </chemin/vers/votre/espace/de/travail/>
   $ git clone https://github.com/Orchard-ID/Data.git
   ```

5. initialiser le dossier `CEMEA-PESL-Website` :
  
   ```bash
   $ cd </chemin/vers/votre/espace/de/travail/>CEMEA-PESL-Website
   $ npm install
   ```



### Version standard ###

Lancer le site avec la commande :

```bash
$ cd </chemin/vers/votre/espace/de/travail/>CEMEA-PESL-Website
$ npm run start # ou `$ node-atlas --browse`
```

Le site sera accessible à l'adresse suivante :

- *http://localhost:7772/*



### Version rechargement à chaud ###

Lancer le site avec browserSync pour recharger votre navigateur à chaud lors des changements dans les fichiers du dossier `assets` avec la commande :

```bash
$ cd </chemin/vers/votre/espace/de/travail/>CEMEA-PESL-Website
$ npm run watch # ou `$ node server.na --browse`
```

Le site sera accessible à l'adresse suivante :

- *http://localhost:57772/*



### Version débogue ###

Lancer le débogeur [Node.js] dans Chrome avec la commande :

```bash
$ cd </chemin/vers/votre/espace/de/travail/>CEMEA-PESL-Website
$ npm run debug # ou `$ node --inspect server.na --browse`
```

Le site sera accessible à l'adresse de debug proposée par la console.





## Environnement de pré-production ##

L'environnement de pré-production est visible à l'adresse :

- https://staging.orchard-id.com/

Et se trouve sur l'hébergement web `orchard-nodejs`.



### (Re)démarrer le site ###

1. se mettre dans l'environnement du site avec la commande :
   
   ```bash
   nvm use 6.11.0
   ```

2. vérifier que le site tourne avec la commande :

   ```bash
   forever list
   ```
   
   et trouver l'entrée

   ```bash
   XXXX /home/clients/xxx...xxx/.nvm/versions/node/v6.11.0/bin/node /home/clients/xxx...xxx/.nvm/versions/node/v6.11.0/bin/node-atlas --    path /home/clients/xxx...xxx/staging.orchard-id.com/ --webconfig webconfig.staging.json
   ```

3. démarrer le serveur **si l'entrée précédente n'est pas dans la liste** avec la commande :
   
   ```bash
   forever start /home/clients/xxx...xxx/.nvm/versions/node/v6.11.0/bin/node-atlas --path /home/clients/xxx...xxx/staging.orchard-id.com/ --webconfig webconfig.staging.json
   ```
   
   ou si l'entrée est dans la liste, repérer la valeur de `XXXX` et utiliser la commande
   
   ```bash
   forever restart XXXX # par ex. si XXXX vaut eg-v, la commande sera `forever restart eg-v`
   ```

### Mettre à jour le site ###

Pour mettre à jour le site avec la dernière version (`master`) prète à tourner, utilisez Git.

```bash
$ cd /home/clients/xxx...xxx/staging.orchard-id.com/
$ git checkout develop
$ git pull
```

puis redémarrez avec

```bash
forever restart XXXX
```

### Serveur frontal ###

L'application [Node.js] tourne sous son propre serveur HTTP sur le port `7772`. Pour qu'il puisse répondre publiquement sur Internet par le port 80, il faut que le serveur Apache qui tourne redirige les demandes de `staging.orchard-id.com` sur ce port. Pour cela on utilise le Gist `staging.orchard-id.com`.

La configuration pour rediriger `staging.orchard-id.com` est dans le fichier serveur `/home/clients/xxx...xxx/.htaccess`
