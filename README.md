# Site web des CEMEA-PESL #

[Node.js]: https://nodejs.org/en/ "Node.js"
[NodeAtlas]: https//node-atlas.js.org/ "NodeAtlas"
[npm]: https://www.npmjs.com/ "Node Package Manager"
[Git]: https://git-scm.com/ "Git"





## Avant-propos ##

Ce dépôt contient l'intégralité du code source permettant de mettre en ligne le site web de CEMEA-PESL dans ses différenctes langues. Celui-ci fonctionne avec [NodeAtlas] qui est un module [npm] tournant sous [Node.js].

Il peut servir d'inspiration pour créer d'autres sites.





## Règle de développement ##

### Flot ###

Quand vous aurez récupéré le dépôt sur votre machine, [respectez ce flot pour le versionnement](https://blog.lesieur.name/comprendre-et-utiliser-git-avec-vos-projets/).

### Conventions ###

Quand vous devrez ajouter, modifier ou supprimer du code, [respectez ces conventions](https://blog.lesieur.name/conventions-html-css-js-et-architecture-front-end/).





## Environnement de développement ##

### Installation ###

Pour modifier le site avec un rendu en temps réel, il vous faudra installer [Node.js] sur votre poste de développement ainsi que [Git] :

- [Télécharger Node.js](https://nodejs.org/en/download/)
- [Télécharger Git](https://git-scm.com/downloads)

puis récupérer le dépôt en local sur votre machine :

```bash
$ cd </path/to/workspace/>
$ git clone https://github.com/Orchard-ID/CEMEA-PESL-Website.git
```

puis initialisez la branche de développement :

```bash
git checkout develop
```

puis installer [NodeAtlas] :

```bash
$ cd CEMEA-PESL-Website
$ npm install -g node-atlas
```

et les autres module [npm] dont dépend le projet dans le dossier projet :

```
$ npm install
```

puis lancez le site avec la commande :

```bash
$ npm run start
```

ou lancez `server.na` en double cliquant dessus :
- en expliquant à votre OS que les fichiers `.na` sont lancé par défaut par `node`,
- en étant sur que votre variable d'environnement `NODE_PATH` pointe bien sur le dossier des `node_modules` globaux.

Le site sera accessible à l'adresse suivante :

- *http://localhost:7772/*

Vous pouvez également lancez le débogeur [Node.js] dans Chrome pour la version française avec la commande :

```bash
$ npm run debug
```

il vous suffit ensuite d'atteindre l'url de debug proposé par la console.




### Rechargement à chaud ###

Vous pouvez utiliser browserSync pour recharger votre navigateur pour une modification d'un fichier frontal en lançant le site avec cette commande :

```bash
npm run watch
```

Le site sera disponible à l'adresse *http://localhost:57772/*






## Environnement de pré-production ##

### Rejoindre ###

L'environnement de préproduction est visible à l'adresse :

- https://website-haeresis.c9users.io/

L'ensemble des fichiers est listé ici :

- https://preview.c9users.io/haeresis/website

### Démarrer le serveur ###

Il est possible que le serveur ne tourne pas, dans ce cas il faut le lancer en vous rendant à l'adresse :

- https://ide.c9.io/haeresis/website

Et en lançant dans la console (onglet "bash") la commande

```bash
$ node-atlas --webconfig webconfig.staging.json
```

### Mettre à jour l'environnement ###

Pour mettre à jour l'environnement avec la version que vous souhaitez, utilisez git.

- Par exemple pour mettre à jour avec la dernière version de la branche `develop` :

   ```bash
$ git checkout develop
$ git pull
```

- Par exemple pour récupérer la version du commit `13b55fbdb8b4ba332becb15ebe54187464aae179`

   ```bash
$ git checkout 13b55fbdb8b4ba332becb15ebe54187464aae179
```





## Environnement de production ##

L'environnement de production est visible à l'adresse :

- http://www.cemea-pesl.org/

### Redémarrer le serveur ###

Tout d'abord il faut se mettre dans l'environnement du serveur avec la commande

```bash
nvm use 6.11.0
```

Le serveur tourne forcément. Pour le redémarrez il faut repérer dans la liste des applications [Node.js] de `forever` laquelle est la notre :

```bash
forever list
```

Si le code de l'application est `ev-3`, il faut alors utiliser

```bash
forever restart ev-3
```

**Si le serveur est down** (et que l'entrée ou que l'entrée n'est pas dans forever)

Pour le démarrez utilisez la commande suivante :

```bash
forever start <path-to-node-atlas> --path <path-to-orchard-id> --webconfig webconfig.production.json
```

### Mettre à jour l'environnement ###

Pour mettre à jour l'environnement avec la dernière version (`master`) prète à tourner, utilisez git.

```bash
$ git checkout master
$ git pull
```

puis redémarrez avec

```bash
forever restart ev-3
```

### Serveur frontal ###

L'application [Node.js] tourne sous son propre serveur HTTP sur le port `7772`. Pour qu'il puisse répondre publiquement sur Internet par le port 80, il faut que le serveur Apache qui tourne redirige les demandes de `cemea-pesl.org` sur ce port. Pour cela on utilise le gist `cemea-pesl.org`.

La configuration pour rediriger `cemea-pesl.org` est dans le dossier serveur `/cemea-pesl.org/.htaccess` (https://gist.github.com/Haeresis/6db2d89bc895d9c650b7a2825444d308)