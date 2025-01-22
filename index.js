import express from "express";
import path from "path";
import { games } from "./games.js";
// console.log(games);
const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// pages url

app.get("/", (req, res) => {
  res.render(`index`, { games });
});

app.get("/game/:gameName", (req, res) => {
  const game = games.find(
    (game) => game.name.toLowerCase() === req.params.gameName.toLowerCase()
  );
  //console.log(game.name); // pour voir l'objet récupéré

  if (!game) {
    return res.status(404).render(`error404`, { games });
  }

  res.render(game.name, { game, games });
});

// ecoute du port
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Listening at http://localhost:${port}`);
});
