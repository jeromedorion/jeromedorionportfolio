// ==========================================================
// PORTFOLIO — JÉRÔME DORION
// Script principal : animations d'apparition au défilement
// ==========================================================

// Signale que le JS est actif : le CSS ne cache les éléments
// .reveler que dans ce cas (voir style.css).
document.documentElement.classList.add("js");

const elements = document.querySelectorAll(".reveler");

function toutReveler() {
  elements.forEach((el) => el.classList.add("visible"));
}

try {
  // Fait apparaître en douceur les éléments quand ils entrent dans la fenêtre
  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add("visible");
          observateur.unobserve(entree.target); // une seule fois
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observateur.observe(el));

  // Filet de sécurité : après 1 seconde, on révèle tout ce qui est
  // déjà dans l'écran, au cas où l'observateur n'aurait pas réagi.
  setTimeout(() => {
    elements.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("visible");
      }
    });
  }, 1000);
} catch (e) {
  // En cas de pépin, on affiche tout : le contenu passe avant l'animation.
  toutReveler();
}

// Met l'année courante dans le pied de page
const annee = document.querySelector("[data-annee]");
if (annee) {
  annee.textContent = new Date().getFullYear();
}

// ==========================================================
// Vidéos d'animation (.video-defilement)
// Lecture automatique quand la vidéo entre dans l'écran,
// pause quand elle en sort, et reprise du début à chaque retour.
// ==========================================================
const videos = document.querySelectorAll(".video-defilement");

if (videos.length > 0 && "IntersectionObserver" in window) {
  const observateurVideos = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        const video = entree.target;
        if (entree.isIntersecting) {
          video.currentTime = 0; // on repart du début à chaque apparition
          video.play();
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.4 } // démarre quand 40 % de la vidéo est visible
  );

  videos.forEach((v) => observateurVideos.observe(v));
}
