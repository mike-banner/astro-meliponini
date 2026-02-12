document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ DOM entièrement chargé.");

  const boutons = document.querySelectorAll('.open-modal-famille');
  console.log(`🔍 ${boutons.length} bouton(s) avec la classe .open-modal-famille trouvé(s).`);

  let boutonClique = null;

  boutons.forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      boutonClique = this;
      console.log("🖱️ Bouton cliqué :", boutonClique);
    });
  });

  jQuery(document).on('elementor/popup/show', function () {
    if (!boutonClique) {
      console.warn("⚠️ Aucun bouton cliqué avant l'ouverture du popup.");
      return;
    }

    // Récupération de l'ID du bouton cliqué
    const boutonId = boutonClique.id;
    console.log("🔎 ID du bouton cliqué :", boutonId);

    // Récupération de data-famille-nom et data-famille-button
    const familleNom = boutonClique.getAttribute('data-famille-nom') || "";
    const familleButtonUrl = boutonClique.getAttribute('data-famille-button') || "";
    console.log("🏷️ Nom de la famille :", familleNom);
    console.log("🔗 URL pour le bouton miel :", familleButtonUrl);

    // Map des IDs de posts par ID bouton
    let postId = null;
    switch (boutonId) {
      case 'melipona':
        postId = 13885;
        break;
      case 'tetragonisca':
        postId = 12298;
        break;
      case 'scaptotrigona':
        postId = 13955;
        break;
      case 'apis':
        postId = 21407; // Exemple, à adapter
        break;
      default:
        console.warn(`⚠️ ID de bouton non reconnu dans le switch : ${boutonId}`);
    }

    if (!postId) {
      console.error("❌ postId introuvable pour cet ID de bouton.");
      return;
    }

    // Sélection des éléments dans le popup/modal
    const elementInfo = document.querySelector('.elementor-popup-modal .famille-info');
    const elementNom = document.querySelector('.elementor-popup-modal .famille-nom');
    const boutonMielWrapper = document.querySelector('.elementor-popup-modal .famille-miel');
    const boutonMielLink = boutonMielWrapper?.querySelector('a');

    if (!elementInfo) {
      console.error("❌ Élément .famille-info introuvable dans le popup.");
      return;
    }
    if (!elementNom) {
      console.warn("⚠️ Élément .famille-nom introuvable dans le popup.");
    }
    if (!boutonMielLink) {
      console.warn("⚠️ Élément lien dans .famille-miel introuvable dans le popup.");
    }

    // Injection du nom de la famille
    if (elementNom) {
      elementNom.textContent = familleNom;
      elementNom.style.color = '#d48f32'; // Exemple de couleur, à adapter
      console.log("🎨 Nom de la famille injecté et stylisé.");
    }

    // Mise à jour du lien du bouton miel
    if (boutonMielLink && familleButtonUrl) {
      boutonMielLink.setAttribute('href', familleButtonUrl);
      // boutonMielLink.setAttribute('target', '_blank'); // décommente si besoin ouverture dans un nouvel onglet
      console.log("🔗 Lien du bouton .famille-miel mis à jour :", familleButtonUrl);
    }

    // Requête API REST pour récupérer le contenu de l'article
    const apiUrl = `/wp-json/wp/v2/posts/${postId}`;
    console.log("🌐 Appel API vers :", apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`❌ Erreur API pour l'article ${postId} : ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("✅ Contenu récupéré depuis l'API :", data);
        const contenu = data.content.rendered || "<p>Contenu vide</p>";
        elementInfo.innerHTML = contenu;
        console.log("🧠 Contenu injecté dans le modal.");
      })
      .catch(error => {
        console.error("🚨 Erreur lors de la récupération du contenu :", error);
        elementInfo.textContent = "Erreur lors du chargement du contenu.";
      });
  });
});

