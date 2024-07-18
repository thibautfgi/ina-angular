const ffmpeg = require("fluent-ffmpeg");
const cors = require('cors')
const express = require("express")

const app = express();
const port = 3000;

// Use CORS middleware
// peux me permette d'acepter des calls api que de certaine adresse cible
app.use(cors());

app.use(express.json()); 


// Route pour analyser la vidéo
app.post('/api/probe', (req, res) => {
    const videoPath = req.body.path;
  
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(metadata);
    });
});

// run le express/ldapjs server
app.listen(port, () => {
  console.log(`express.js est en marche sur le port : http://localhost:${port}`);
});

// permet d'envoye des tests sans demarer directement le server
module.exports = app;
