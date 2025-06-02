const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Modèle Mongoose pour les avis
const Avis = mongoose.model("Avis", {
  pseudo: String,
  message: String,
  date: { type: Date, default: Date.now },
});

// Middleware
app.use(cors());
app.use(express.json());

// Sert les fichiers statiques (CSS, JS, images) depuis 'public'
app.use(express.static("public"));

// ➕ Sert la page HTML `avis.html` depuis le dossier `pages`
app.get("/avis", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "avis.html"));
});

// API – Récupérer tous les avis
app.get("/api/avis", async (req, res) => {
  try {
    const avis = await Avis.find();
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des avis" });
  }
});

// API – Ajouter un avis
app.post("/api/avis", async (req, res) => {
  const { pseudo, message } = req.body;
  if (!pseudo || !message) {
    return res.status(400).json({ error: "Pseudo et message requis" });
  }

  try {
    const avis = new Avis({ pseudo, message });
    await avis.save();
    res.status(201).json(avis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'avis" });
  }
});

// API – Supprimer un avis (protégé par code)
app.delete("/api/avis/:id", async (req, res) => {
  const { code } = req.body;

  if (code !== process.env.DELETE_CODE) {
    return res.status(403).json({ error: "Code de validation incorrect" });
  }

  try {
    await Avis.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur en ligne : http://localhost:${PORT}`)
);
