const CLIENT_ID = "1356693934012891176";
const REDIRECT_URI = "http://127.0.0.1:5500/pages/serveur.html";

// Génère une URL d'authentification avec un paramètre `state` aléatoire
function genererUrlOAuth2() {
    const state = crypto.randomUUID();
    localStorage.setItem("oauth2_state", state);

    return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify+guilds&state=${state}`;
}

// Redirige vers Discord OAuth2 au clic
document.getElementById("discord-login").addEventListener("click", () => {
    window.location.href = genererUrlOAuth2();
});

// Au chargement de la page
window.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById("user-info");
    container.innerHTML = `<p>Chargement...</p>`;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const returnedState = urlParams.get("state");
    const savedState = localStorage.getItem("oauth2_state");

    // Vérifie la présence d’un code OAuth2 et d’un state correct
    if (code && returnedState && returnedState === savedState) {
        try {
            const response = await fetch(`https://discord-oauth-6z2s.onrender.com/api/discord-oauth?code=${code}`);
            const data = await response.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.removeItem("oauth2_state");

                // Supprime les paramètres d'URL
                window.history.replaceState({}, "", "serveur.html");
                afficherInfosUtilisateur(data.user);
            } else {
                alert("Erreur d'authentification : " + data.error);
                container.innerHTML = `<p>Erreur d'authentification.</p>`;
            }
        } catch (err) {
            console.error("Erreur lors de la requête OAuth :", err);
            alert("Erreur lors de l'échange du code.");
            container.innerHTML = `<p>Erreur lors de l'échange du code.</p>`;
        }
    } else {
        if (code && returnedState !== savedState) {
            alert("État de sécurité invalide, possible tentative d'injection !");
            return;
        }

        // Si déjà connecté (stocké dans localStorage)
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            afficherInfosUtilisateur(user);
        } else {
            container.innerHTML = `<p>Non connecté.</p>`;
        }
    }
});

// Affiche les infos de l’utilisateur
function afficherInfosUtilisateur(user) {
    const container = document.getElementById("user-info");
    const avatarURL = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

    container.innerHTML = `
        <p>Connecté en tant que <strong>${user.username}#${user.discriminator}</strong></p>
        <img src="${avatarURL}" alt="Avatar" style="width: 80px; border-radius: 50%;">
    `;
}
