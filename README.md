# Site du RJAEC — Réseau des Jeunes Architectes et Entrepreneurs du Congo

Site statique (HTML / CSS / JS) : aucune installation, aucun build.

## Modifier
- **Textes** → `index.html` (sections : Accueil, À propos, Nos actions, Avantages, ExPoBaT, Partenaires, Galerie, Inscription, Pied de page).
- **Couleurs** → variables `:root` en haut de `style.css` (`--navy`, `--blue`, `--gold`).
- **Photos** → dossier `assets/` (remplace un fichier en gardant le même nom, ou change le `src` dans `index.html`).
- **Réseaux sociaux** → cherche `class="social"` dans `index.html` et corrige chaque lien `href` (Facebook, LinkedIn et Telegram sont à compléter).
- **Logo BG_Organics** → ajoute `assets/logo-bg-organics.png` et, dans `index.html`, remplace le bloc `partner__logo--text` de BG_Organics par `<div class="partner__logo"><img src="assets/logo-bg-organics.png" alt="BG_Organics"></div>`.

## Recevoir les inscriptions par e-mail
Dans `script.js`, en haut, la ligne `const FORM_ENDPOINT = ''`.
1. Crée un formulaire gratuit sur https://formspree.io avec l'adresse rjaecongo@gmail.com.
2. Colle l'adresse fournie entre les guillemets (ex. `https://formspree.io/f/xxxxxxx`).
Sans cela, le bouton ouvre l'e-mail de la personne, déjà rempli, vers rjaecongo@gmail.com.

## Publier
1. Dépose les fichiers dans un dépôt GitHub (à la racine : `index.html`, `style.css`, `script.js`, `vercel.json`, dossier `assets`).
2. Sur vercel.com : *Add New → Project* → importe le dépôt → *Deploy* (Preset : Other).
3. Chaque modification sur GitHub redéploie le site automatiquement.
