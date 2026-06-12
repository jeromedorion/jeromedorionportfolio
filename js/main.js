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
// Sommaire collant (.sommaire) des pages projets
// Construit automatiquement à partir des titres <h2> des
// sections, et surligne la section visible au défilement.
// ==========================================================
const sommaire = document.querySelector(".sommaire");

if (sommaire) {
  const sections = document.querySelectorAll(".contenu-projet .bloc h2");

  sections.forEach((titre, i) => {
    const section = titre.closest("section");

    // identifiant d'ancre à partir du titre (sans accents ni espaces)
    if (!section.id) {
      section.id = titre.textContent
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // retire les accents
        .replace(/[^a-z0-9]+/g, "-")     // espaces et symboles -> tirets
        .replace(/^-|-$/g, "");
    }

    const lien = document.createElement("a");
    lien.href = "#" + section.id;
    lien.textContent = titre.textContent;
    sommaire.appendChild(lien);
  });

  // Surligne le lien de la section actuellement à l'écran
  if ("IntersectionObserver" in window) {
    const observateurSommaire = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            sommaire.querySelectorAll("a").forEach((a) => {
              a.classList.toggle(
                "actif",
                a.getAttribute("href") === "#" + entree.target.id
              );
            });
          }
        });
      },
      // la section "active" est celle dans le tiers supérieur de l'écran
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach((titre) =>
      observateurSommaire.observe(titre.closest("section"))
    );
  }
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

          if (video.dataset.son === "oui") {
            // Vidéo avec son : on tente la lecture audio ; si le
            // navigateur la refuse (aucune interaction encore), on
            // se rabat sur la lecture en sourdine.
            video.muted = false;
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          } else {
            const lecture = video.play();
            if (lecture) {
              lecture.catch(() => {}); // ignore un éventuel refus du navigateur
            }
          }
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.4 } // démarre quand 40 % de la vidéo est visible
  );

  videos.forEach((v) => observateurVideos.observe(v));
}
