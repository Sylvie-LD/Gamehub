header.ejs
avec la correction, on vérifie si game.cssFile et game.jsFile existent avant de les inclure dynamiquement,
ma version était trop limitée et ne rendait pas correctement le css du jeu sans css.
De plus la variable générique (href) était peu claire. Et je lui ai mis des parametres inutiles au lieu d'appeler la propriété cssFIle

```
<% if (typeof game !== "undefined" && game.cssFile) { %>

<link rel="stylesheet" href="/css/<%= game.cssFile %>" />
<% } %>
```

Au lieu de :

```
<% if (typeof href !== "undefined") { %>

<link rel="stylesheet" href="/css/<%= href %>" />
<% } %>
```

Nom des variables :

Première version (game.cssFile) :
La variable game.cssFile est explicite. Elle indique clairement qu’il s’agit d’un fichier CSS associé à un jeu spécifique. Cela améliore la compréhension du code.
Deuxième version (href) :
La variable href est ambiguë. Son nom suggère qu’elle pourrait être une URL, mais son contexte n’est pas clair (à quoi se rapporte-t-elle ? Pourquoi "href" ?).

Logique métier :

Première version :
Vérifie si l’objet game existe et s’il contient une clé cssFile. Cela suit une logique métier précise : chaque jeu peut avoir un fichier CSS personnalisé.
Deuxième version :
Vérifie seulement si href est défini. Cela ne donne aucune information sur le contexte ou la raison pour laquelle cette vérification est effectuée.

Extensibilité :

Première version :
Elle est extensible et cohérente. Par exemple, vous pouvez appliquer le même principe pour inclure des fichiers JS (game.jsFile) ou tout autre type de ressources liées à un jeu.
Deuxième version :
L’utilisation de href n’encourage pas cette extensibilité. Si vous devez inclure des fichiers JS, vous devrez probablement utiliser une autre variable et changer la logique, ce qui rend le code moins cohérent.

# index.js

// la correction propose de créer une variable globale qui gère les variables locales :app.locals.games = games, permettant de ne pas répéter l'appel à la variable {games} dans les render

# fichiers.ejs

dans chaque fichier ejs j'avais mis un parametre devenu inutile puisque game est appelé dans le header : {href:game.cssFile}. Dans ma version je n'appelais pas game dans le header donc je devais l'appeler dans chaque fichier nécessitant un css

```
<%- include("partials/header", {href:game.cssFile}) %>
```

Pas de paramètre puisque game est appelé dans le header.ejs

```
<%- include("partials/header") %>
```

# Appel des fichiers JS

- la correction propose de le mettre dans le header, avec le **defer** solution plus moderne

```
<% if (typeof game !== "undefined" && game.jsFile) { %>
    <script defer src="/js/<%= game.jsFile %>"></script>
    <% } %>
```

- je l'ai appelé dans le footer avec la meme erreur que pour les fichiers css

```
<% if (typeof src !== "undefined") { %>
  <script src="/js/<%= game.name %>.js"></script>
<% } %>
```

La deuxième solution avec defer est généralement meilleure, car elle optimise le chargement des scripts en permettant un téléchargement parallèle tout en différant l'exécution.
La condition game.jsFile est plus explicite et maintenable que typeof src !== "undefined".
une structure d’objet (game.jsFile), est plus facile à contrôler dans un environnement complexe.
