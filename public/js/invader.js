// Vocabulaire :
//  - Une PROPRIÉTÉ, c'est une sorte de variable rangée dans un objet (qui appartient à l'objet)
//  - Une MÉTHODE, c'est une fonction rangée dans un objet (qui appartient à l'objet). On pourrait dire qu'une méthode, c'est
//    à la fois une propriété et une fonction.
//  - Un MODULE, c'est un objet qui sert à bien ranger notre code (variables et fonctions).
//    Ça permet de faciliter les développements en :
//      - Réduisant les risques de conflit de nommage (2 trucs différents qui s'appellent pareil).
//      - Facilitant le fait de transporter nos "variables" et "fonctions" plus facilement dans nos différents bouts de code.
//      - Permet aux développeurs de mieux s'y retrouver dans le code et de limiter la création des bugs.
const app = {
  // On va définir des propriétés contenant la taille de la grille et des pixels
  gridSize: 8,
  pixelSize: 30,
  styles: ["grey", "black", "yellow", "green"],
  // Cette propriété 'chosenStyle" sera mise à jour à chaque fois qu'on changera de couleur dans la palette, mais par défaut,
  // on se mettra sur le black.
  chosenStyle: "black",

  init: function () {
    app.createForm(); // Rempli le formulaire de config
    app.drawBoard(); // Crée la grille
    app.createPallet(); // Crée la palette de couleur
  },

  createForm: function () {
    // On récupère le formulaire à remplir => LE PREMIER ÉLÉMENT de la page qui a la classe configuration
    const form = document.querySelector(".configuration");

    // On construit un input pour change la taille de la grille
    const inputGridSize = document.createElement("input");
    inputGridSize.type = "number";
    inputGridSize.id = "gridSize";
    inputGridSize.placeholder = "Taille de la grille";
    inputGridSize.min = "1";
    form.append(inputGridSize);

    // On construit un input pour change la taille des pixels
    const inputPixelSize = document.createElement("input");
    inputPixelSize.type = "number";
    inputPixelSize.id = "pixelSize";
    inputPixelSize.placeholder = "Taille des pixels";
    inputPixelSize.min = "1";
    form.append(inputPixelSize);

    // On construit un bouton pour valider le fomulaire
    const button = document.createElement("button");
    button.textContent = "Valider";
    form.append(button);

    // On ajoute un event listener sur le formulaire pour traiter sa validation
    form.addEventListener("submit", app.handleSubmit);
  },

  drawBoard: function () {
    // Il va falloir récupérer l'élément du DOM invader à remplir
    const invader = document.getElementById("invader");

    // Au cas où on avait déjà une grille, on va vider l'élément invader avant de lui donner ses nouvelles lignes => une sorte de reset
    invader.innerHTML = "";

    // On va devoir boucler pour créer les lignes puis les cellules dans les lignes
    // Et on va bien mettre les lignes dans invader
    for (let rowIndex = 0; rowIndex < app.gridSize; rowIndex++) {
      // On crée la ligne avec la classe row et on l'ajoute à invader
      const row = document.createElement("div");
      row.classList.add("row");
      invader.append(row);

      // Maintenant qu'on a une ligne, on lui ajoute des cellules
      for (let cellIndex = 0; cellIndex < app.gridSize; cellIndex++) {
        // On crée la cellule avec la classe cell et on l'ajoute à row
        const cell = document.createElement("div");
        cell.classList.add("cell", "cell--grey");
        cell.style.width = app.pixelSize + "px";
        cell.style.height = app.pixelSize + "px";
        row.append(cell);

        // On a la cellule, on va directement pouvoir lui mettre un écouteur d'évènement
        // Pas besoin de refaire de selection dans le DOM...
        cell.addEventListener("click", app.handlePixelClick);
      }
    }
  },

  createPallet: function () {
    // On crée un div pour la palette de couleurs et on l'ajoute après la grille
    const pallet = document.createElement("div");
    pallet.id = "pallet";
    // <div id="pallet"></div>

    // Je choisi de mettre la palette juste après l'invader dans mon HTML
    document.getElementById("invader").after(pallet);

    // Pour chaque app.styles, on crée un bouton dans la palette
    // La boucle for...of est une boucle optimisé pour les tableaux.
    for (const style of app.styles) {
      // On crée une pastille avec la classe "pallet-color" et la classe "pallet-color--" + style
      const color = document.createElement("a");
      color.classList.add("pallet-color", "pallet-color--" + style);
      // <a class="pallet-color pallet-color--yellow"></a>

      // On lui ajoute un dataset qui permettra plus tard (lors du click sur la couleur de la palette), de récupérer facilement
      // la nouvelle couleur demandée
      // color.setAttribute("data-name", style);
      color.dataset.name = style;
      // <a class="pallet-color pallet-color--yellow" data-name="yellow"></a>

      pallet.append(color);

      color.addEventListener("click", app.handleColorClick);
    }
  },

  handleSubmit: function (event) {
    // On empêche le comportement par défaut du formulaire
    event.preventDefault();

    // On va récupérer la valeur de l'input
    const newGridSize = parseInt(document.getElementById("gridSize").value);

    // Quand on récupère une valeur d'un formulaire, il faudrait TOUJOURS faire une vérification de la valeur au passage
    // Nous on veut un nombre entier supérieur à 0. Si ce n'est pas le cas, on fera un message d'erreur.
    // NaN (Not a Number), c'est une valeur assez exceptionnelle. On ne peut pas faire de == ou === NaN, le seul moyen
    // de vérifier si une valeur est NaN ou non, c'est la fonction isNaN()...
    // Les opérateurs logiques :
    //     && => veut dire ET : if (condition1 && condition2) {...} => on entre dans le if que si les 2 conditions sont bonnes
    //     || => veut dire OU : if (condition1 || condition2) {...} => on entre dans le if si AU MOINS UNE DES 2 conditions est bonnes
    if (isNaN(newGridSize) || newGridSize <= 0) {
      alert(
        "La taille de la grille doit être un nombre entier supérieur à 0 !!!"
      );

      // Le return sert à mettre fin à la fonction, et donc à ne pas essayer de tenter de redessiner la grille en cas d'erreur.
      return;
    }

    const newPixelSize = parseInt(document.getElementById("pixelSize").value);

    if (isNaN(newPixelSize) || newPixelSize <= 0) {
      alert(
        "La taille des pixels doit être un nombre entier supérieur à 0 !!!"
      );
      return;
    }

    // Si on a réussi à atteindre cette ligne, ça veut dire qu'on a bien un nombre valide, et donc au travail pour générer la nouvelle grille.
    // On a déjà une fonction pour dessiner la grille. Cette fonction se base sur la variable globale gridSize (ligne 2 du fichier).
    // On doit donc d'abord mettre à jour la variable gridSize puis relancer la fonction qui dessine la grille.
    app.gridSize = newGridSize;
    app.pixelSize = newPixelSize;
    app.drawBoard();
  },

  /**
   * Fait ce qui doit être fait quand on clique sur une cellule => ici, changer de couleur
   *
   * @param {Event} event
   */
  handlePixelClick: function (event) {
    // On récupère la cellule cliquée
    // event.currentTarget me donne l'élément du DOM que j'ai surveillé et qui a été utilisé pour déclancher cette fonction
    //     => en gros, il me donne la cellule sur laquelle j'ai cliqué.
    const cell = event.currentTarget;

    // Avant d'ajouter la bonne couleur sur le pixel, ça serait bien d'enlever toutes les autres
    cell.className = "cell";

    // Ajoute la bonne couleur sur le pixels
    cell.classList.add("cell--" + app.chosenStyle);
  },

  handleColorClick: function (event) {
    // Récupérer la couleur correspondant à la pastille cliquée, et stocker le choix quelque part
    // pour pouvoir appliquer la bonne couleur quand plus tard on cliquera sur les pixels.
    const color = event.currentTarget;

    app.chosenStyle = color.dataset.name;
  },
};

// Contrairement à quand on appelle des fonctions nommées (function nonDeLaFonction() { ... }), avec les modules,
// on ne peut appeler nos méthodes (ou notre objet en général), qu'après la création de l'objet
// app.init();
// Ici, on n'exécute pas directement la fonction app.init, on va plutot demander au navigateur de surveiller que le
// DOM soit complètement chargé, et à ce moment uniquement, il viendra exécuter la fonction app.init.
// C'est une BONNE PRATIQUE
document.addEventListener("DOMContentLoaded", app.init);
