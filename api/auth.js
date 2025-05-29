const CLIENT_ID = "1356693934012891176";
const REDIRECT_URI = encodeURIComponent("http://127.0.0.1:5500/pages/index.html");

const DISCORD_OAUTH2_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;

document.getElementById("discord-login").addEventListener("click", () => {
    window.location.href = DISCORD_OAUTH2_URL;
});

window.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      // ✅ On envoie bien le code au backend
      const response = await fetch(`https://discord-oauth-6z2s.onrender.com/api/discord-oauth?code=${code}`);
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/pages/serveur.html';
      } else {
        alert("Erreur d'authentification : " + data.error);
      }
    } catch (err) {
      console.error("Erreur lors de l'échange du code :", err);
      alert("Une erreur est survenue.");
    }
  }
});
