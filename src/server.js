const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const raizProjeto = path.join(__dirname, "..");

app.get("/", (req, res) => {
  res.sendFile(path.join(raizProjeto, "index.html"));
});

app.use("/CSS", express.static(path.join(raizProjeto, "CSS")));
app.use("/JS", express.static(path.join(raizProjeto, "JS")));

app.get("/api/status", (req, res) => {
  res.json({
    servidor: "Agenda SOE",
    funcionando: true
  });
});

const servidor = app.listen(PORT, () => {
  console.log(`Servidor da Agenda SOE funcionando em http://localhost:${PORT}`);
});

servidor.on("error", erro => {
  console.error("Erro ao iniciar o servidor da Agenda SOE:", erro.message);
  process.exitCode = 1;
});
