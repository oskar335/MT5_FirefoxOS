$(document).ready(function() {
  var $hintPanel = $("#hintPanel");
  var $content = $("#content, #footer"); 
  var $helpButton = $("#help");
  var $hintNavigator = $("#hintCarouselNavigator");
  var $hintContainer = $("#hintCarouselInner");
  var hintNavigatorHTML = '';
  var hintContainerHTML = '';

  // HINTS contient toutes les astuces à afficher
  var HINTS = [
    {
      img: "img/smile.png",
      caption: "<strong>Bienvenue</strong> sur l'aide ! <strong>Faites défiler</strong> pour voir les astuces ou <strong>tapez</strong> sur la croix pour sortir"
    },
    {
      img: "img/glyphicon-source.png",
      caption: "<strong>Tapez</strong> sur le dossier pour voir les musiques locales ou sur le globe pour voir les musiques sur le serveur"
    },
    {
      img: "img/swipe_delete.png",
      caption: "<strong>Glissez</strong> pour supprimer les musiques MT5"
    }
  ];

  // On alimente le carousel en hints
  for (var i = 0; i < HINTS.length; i++) {
    hintNavigatorHTML = '<li data-target="#hintCarousel" data-slide-to="'+i+'"';
    hintContainerHTML = '<div class="item';
    if (i == 0) {
      hintNavigatorHTML += ' class="active"';
      hintContainerHTML += ' active';
    }
    hintNavigatorHTML += '></li>';
    hintContainerHTML += '"><img src="'+HINTS[i].img+'" /><div class="carousel-caption"><p>'+HINTS[i].caption+'</p></div></div>';

    $hintNavigator.append(hintNavigatorHTML);
    $hintContainer.append(hintContainerHTML);
  }

  $("#help").on("click", function() {
      $hintPanel.toggle();
      $content.toggleClass("darker");
      $helpButton.toggleClass("active");
      $helpButton.find("span").toggleClass("glyphicon-question-sign").toggleClass("glyphicon-remove");
  });
});
