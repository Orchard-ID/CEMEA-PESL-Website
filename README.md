# Site web des CEMEA de Basse-Normandie pour le PESL

[Node.js]: https://nodejs.org/en/ "Node.js"
[NNodeAtlas]: https//node-atlas.js.org/ "NodeAtlas"
[NPM]: https://www.npmjs.com/ "Node Package Manager"
[Git]: https://git-scm.com/ "Git"





## Avant-propos ##

Ce dépôt contient l'intégralité du code source permettant de mettre en ligne le site web CEMEA PESL. Celui-ci fonctionne avec [NodeAtlas] qui est un module [NPM] tournant sous [Node.js].





## Règle de développement ##

### Flot ###

Quand vous aurez récupérer le dépôt sur votre machine, [respectez ce flot pour le versionnement](https://blog.lesieur.name/comprendre-et-utiliser-git-avec-vos-projets/).

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
$ git clone https://github.com/Orchard-ID/Website.git
```

puis initialisez la branche de développement :

```bash
git checkout develop
```

puis installer [NodeAtlas] et les autres module [NPM] dont dépend le projet dans le dossier projet :

```bash
$ cd Website
$ npm install
```

puis lancez le site avec la commande :

```bash
$ npm start
```

ou lancez `server.na` en double cliquant dessus :
- en expliquant à votre OS que les fichiers `.na` sont lancé par défaut par `node`,
- en étant sur que votre variable d'environnement `NODE_PATH` pointe bien sur le dossier des `node_modules` globaux.

Les version française et internationale du site seront accessible aux adresses suivantes :

- *http://localhost:7777/*

Vous pouvez également lancez le débogeur [Node.js] dans Chrome avec la commande :

```bash
$ npm test
```

il vous suffit ensuite d'atteindre l'url de debug proposé par la console.





## Environnement de pré-production ##

### Rejoindre ###

L'environnement de préproduction est visible à l'adresse : 

- https://cemea-pesl-website-haeresis.c9users.io/

L'ensemble des fichiers est listé ici :

- https://preview.c9users.io/haeresis/cemea-pesl-website

### Démarrer le serveur ###

Il est possible que le serveur ne tourne pas, dans ce cas il faut le lancer en vous rendant à l'adresse :

- https://ide.c9.io/haeresis/cemea-pesl-website

Et en lançant dans la console (onglet "bash") la commande

```bash
$ nodeatlas --webconfig webconfig.staging.json
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

- `[Adresse à définir]`

### Redémarrer le serveur ###

Le serveur tourne forcément. Pour le redémarrez il faut repérer dans la liste des applications Node.js de `forever` laquelle est la notre :

```bash
forever list
```

Pour la repérer, il faut trouver celle avec `--path .../orchard-id.com/` et récupérer son code en amont.

Exemple : pour le retour suivant

```bash
                                                                                                                                                                                                                                                                                                                            pid     id       logfile                                                          uptime
data: [0] ev-3 /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/.nvm/versions/node/v6.9.5/bin/node /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/.nvm/versions/node/v6.9.5/lib/node_modules/node-atlas/ --path /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/orchard-id.com/ --webconfig webconfig.production.json 	24827   24833    /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/.forever/ev-3.log 0:2:56:55.421
```

le site est la ligne `[0]` car on a `--path .../orchard-id.com/` et le code en amont est `ev-3`.

Il faut alors utiliser

```bash
forever restart ev-3
```

**Si le serveur est down** (et que l'entrée ou que l'entrée n'est pas dans forver)

Pour le démarrez utilisez la commande suivante :

```bash
forever start /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/.nvm/versions/node/v6.9.5/lib/node_modules/node-atlas/ --path /home/clients/2005ddd98a72fd1b0e0f75fcf662b8a9/orchard-id.com/ --webconfig webconfig.production.json
```

*Note : la version de Node.js peut être différente.*

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

L'application Node.js tourne sous son propre serveur HTTP sur le port `7777`. Pour qu'il puisse répondre publiquement sur Internet par le port 80, il faut que le serveur apache qui tourne sur ce port redirige les demandes. Pour cela on utilise :

```bash
RewriteEngine On
RewriteRule "^(.*)$" "http://localhost:7777/$1" [L,P]
```

on peut également forcer toute les demandes de `orchard-id.com` vers `www.orchard-id.com` avec

```bash
RewriteEngine on
RewriteCond %{HTTP_HOST} ^orchard-id\.com
RewriteRule ^(.*)$ http://www.orchard-id.com$1 [R=permanent,L]
```
