data_images = new Array();
data_images.push('./assets/images/backgrounds/bg_pokemon_default.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_feu.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_eau.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_electrik.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_combat.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_insecte.jpg');
data_images.push('./assets/images/backgrounds/bg_pokemon_plante.jpg');
data_images.push('./assets/images/types/eau.png');
data_images.push('./assets/images/types/fee.png');
data_images.push('./assets/images/types/feu.png');
data_images.push('./assets/images/types/plante.png');
data_images.push('./assets/images/types/poison.png');
data_images.push('./assets/images/types/vol.png');
data_images.push('./assets/images/types/normal.png');
data_images.push('./assets/images/types/insecte.png');
data_images.push('./assets/images/pokemon_ball.png');

// Création des différents liens d'images pokémon (normal, shiny, miniatures)
for (var i = 0; i < Object.keys(data_pokemons.pokemons.lang_FR).length; i++) {
  current_pokemon = data_pokemons.pokemons.lang_FR[i];

  file_name = current_pokemon.number + "_" + current_pokemon.name.toLowerCase();
  data_images.push("./assets/images/pokemons/miniatures/" + file_name + ".png");
  data_images.push("./assets/images/pokemons/normal/" + file_name + ".png");
  data_images.push("./assets/images/pokemons/shiny/" + file_name + ".png");
}

// Fonction permettant de charger les images dans le cache
function preloadImages(urls, allImagesLoadedCallback){
  var loadedCounter = 0;
  var toBeLoadedNumber = urls.length;
  urls.forEach(function(url){
    preloadImage(url, function(){
      loadedCounter++;
      if(loadedCounter == toBeLoadedNumber){
        allImagesLoadedCallback();
      }
    });
  });
  function preloadImage(url, anImageLoadedCallback){
    var img = new Image();
    img.onload = anImageLoadedCallback;
    img.onerror = function() {console.log("error on : "+url)};
    img.src = url;
  }
}
