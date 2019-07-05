$(document).ready(function() {

  var click_sound = new Audio('./assets/audios/sounds/interface/click.mp3');
  var message_prompt_in = new Audio('./assets/audios/sounds/interface/message_prompt.mp3');
  var main_music = new Audio('./assets/audios/musics/main_music.mp3');
  var pokemons_list = data_pokemons.pokemons.lang_FR;
  var id_tab = Object.keys(pokemons_list);

  var app_already_started = false;

  preloadImages(data_images, startApplication);


  function startApplication() {
    loadDataPokemon(4);
    if (!app_already_started) {
      $('#home_page').show();
      $('#home_page').append('<img src="./assets/images/pokemon_ball.png">');
      setTimeout(function() {
        $('#home_page').html('');
        $('#pokemon_page').show();
        $('#home_page').fadeOut(2000);
      }, 5000);
      app_already_started = true;
    }
  }


  /* ---------------------
     ------- CLICK -------
     --------------------- */

  // Clic sur le bouton de favoris
  $(".header #pokefav").click(function() {
    promptMessage("003");
  });

  // Clic sur le bouton de retour
  $(".header #back_arrow").click(function() {
    promptMessage("003");
  });

  // Clic sur la flèche "pokémon précedent"
  $("#previous_pokemon").click(function() {
    click_sound.play();
    let current_number = parseInt($("#pokemon_page_title #pokemon_number").text());
    let previous_number = (current_number <= id_tab[1]) ? id_tab[id_tab.length-1] : current_number-1;
    loadDataPokemon(previous_number);
  });

  // Clic sur la flèche "pokémon suivant"
  $("#next_pokemon").click(function() {
    click_sound.play();
    let current_number = parseInt($("#pokemon_page_title #pokemon_number").text());
    let next_number = (current_number == id_tab[id_tab.length-1]) ? id_tab[1] : current_number+1;
    loadDataPokemon(next_number);
  });

  // Clic sur l'image pokémon pour le changement shiny/normal
  $(".block_img_pokemon .img_pokemon").click(function() {
    if (isImageExist($("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").attr("src")) &&
        isImageExist($("#pokemon_page_current .block_img_pokemon #img_pokemon_shiny").attr("src"))) {
      if ($("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").is(":visible")) {
        $("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").fadeOut(200);
        $("#pokemon_page_current .block_img_pokemon #img_pokemon_shiny").fadeIn(200);
      } else {
        $("#pokemon_page_current .block_img_pokemon #img_pokemon_shiny").fadeOut(200);
        $("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").fadeIn(200);
      }
    }
  });

  // Clic sur le bloc message
  $("#message_prompt").click(function() {
    $("#message_prompt").fadeOut(300);
  });

  /* ---------------------
     ----- FUNCTIONS -----
     --------------------- */

  // Reset de la fiche pokémon
  function resetDataPokemon() {
    $("#pokemon_page_current .block_types").html('');
    $("#pokemon_page_current #pokemon_abilities").html('');
    $("#pokemon_page_title #pokemon_evolutions table tr").html('');
    $("#pokemon_page_current .block_img_pokemon #img_pokemon_shiny").hide();
    $("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").show();
  }

  // Chargement de la fiche pokémon sélectionnée
  function loadDataPokemon(number) {
    if (pokemons_list[number] === undefined) {
      promptMessage("001");
      return false;
    }
    $("#pokemon_page_current").fadeOut(150, function() {
      resetDataPokemon();
      let current_pokemon_number = pokemons_list[number].number;
      let current_pokemon_name = pokemons_list[number].name;
      let current_pokemon_desc = pokemons_list[number].description;
      let current_pokemon_weight = pokemons_list[number].weight;
      let current_pokemon_size = pokemons_list[number].size;
      let current_pokemon_stats = pokemons_list[number].stats;
      let current_pokemon_abilities = pokemons_list[number].abilities;

      $("#pokemon_page_current").data('pokemon-id', current_pokemon_number);
      setPokemonName(number);
      setPokemonEvolutions(number);
      $("#pokemon_page_current .block_img_pokemon #img_pokemon_normal").attr("src", "./assets/images/pokemons/normal/"+current_pokemon_number+"_"+replaceAccent(current_pokemon_name)+".png");
      $("#pokemon_page_current .block_img_pokemon #img_pokemon_shiny").attr("src", "./assets/images/pokemons/shiny/"+current_pokemon_number+"_"+current_pokemon_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")+".png");
      setPokemonType(number);
      setPokemonAbilities(number);
      miniatureOnClick();
      $("#pokemon_page_current #pokemon_description span").text(current_pokemon_desc);
      $("#pokemon_page_current #pokemon_weight span").text(current_pokemon_weight+"kg");
      $("#pokemon_page_current #pokemon_size span").text(current_pokemon_size+"m")
      $('img').on('dragstart', function(event) { event.preventDefault(); });
      $("#pokemon_page_current").fadeIn(150);
    });
    return true;
  }

  // Ecriture du nom du pokémon courant et de son id, dans les blocs correspondants
  function setPokemonName(pokemon_id) {
    let current_pokemon_number = pokemons_list[pokemon_id].number;
    let current_pokemon_name = pokemons_list[pokemon_id].name;
    $("#pokemon_page_title #pokemon_number").text(current_pokemon_number);
    $("#pokemon_page_title #pokemon_name").text(current_pokemon_name.toUpperCase());
  }

  // Création de la liste des évolutions du pokémon courant
  function setPokemonEvolutions(pokemon_id) {
    let current_pokemon_evolutions = pokemons_list[pokemon_id].evolutions;

    for (var i = 0; i < current_pokemon_evolutions.id.length; i++) {
      if (pokemons_list[parseInt(current_pokemon_evolutions.id[i])] === undefined) {
        $("#pokemon_page_title #pokemon_evolutions table tr").append('<td><img class="pokemon_evol" src="./assets/images/pokemons/miniatures/default.png" alt=""></td>');
        if (current_pokemon_evolutions.level[i+1] !== undefined) {
          $("#pokemon_page_title #pokemon_evolutions table tr").append("<td><span>➤ "+current_pokemon_evolutions.level[i+1]+" ➤</span></td>");
        }
      }else {
        let miniature = current_pokemon_evolutions.id[i]+'_'+pokemons_list[parseInt(current_pokemon_evolutions.id[i])].name;
        $("#pokemon_page_title #pokemon_evolutions table tr").append('<td><img class="pokemon_evol" data-pokemon-id="'+current_pokemon_evolutions.id[i]+'" src="./assets/images/pokemons/miniatures/'+replaceAccent(miniature)+'.png" alt=""></td>');
        if (current_pokemon_evolutions.level[i+1] !== undefined) {
          $("#pokemon_page_title #pokemon_evolutions table tr").append("<td><span>➤ "+current_pokemon_evolutions.level[i+1]+" ➤</span></td>");
        }
      }
    }
  }

  function setPokemonType(pokemon_id) {
    let current_pokemon_types = pokemons_list[pokemon_id].types;
    let background_image = "./assets/images/backgrounds/bg_pokemon_"+current_pokemon_types[0]+".jpg";
    if (isImageExist(background_image)) {
      $("#pokemon_page").css("background", "url('"+background_image+"')");
    } else {
      $("#pokemon_page").css("background", "url('./assets/images/backgrounds/bg_pokemon_default.jpg')");
    }
    for (var i = 0; i < current_pokemon_types.length; i++) {
      let url = "./assets/images/types/"+current_pokemon_types[i]+".png";
      if (isImageExist(url)) {
        $("#pokemon_page_current .block_types").append('<img id="type'+i+'" src="'+url+'" alt="">');
      } else {
        $("#pokemon_page_current .block_types").append('<img id="type'+i+'" src="./assets/images/types/inconnu.png" alt="">');
      }
    }
  }

  function setPokemonAbilities(pokemon_id) {
    let current_pokemon_abilities = pokemons_list[pokemon_id].abilities;
    for (var i = 0; i < current_pokemon_abilities.length; i++) {
      $("#pokemon_page_current #pokemon_abilities").append('<div>'+upperFirstLetter(current_pokemon_abilities[i])+'<div>');
    }
  }

  // Création du bloc message et de son contenu
  function promptMessage(errorCode) {
    let title = null;
    let message = null;
    let message_selected = null;
    switch (errorCode) {
      case "001":
        title = ERROR_TITLE_POKEMON_DOESNT_EXIST;
        message = ERROR_MESSAGES_POKEMON_DOESNT_EXIST;
        break;
      case "002":
        title = ERROR_TITLE_PAGE_DOESNT_EXIST;
        message = ERROR_MESSAGES_PAGE_DOESNT_EXIST;
        break;
      case "003":
        title = ERROR_TITLE_UNAVAILABLE_OPTION;
        message = ERROR_MESSAGES_UNAVAILABLE_OPTION;
        break;
    }
    message_selected = message[getRandomIntInclusive(0, message.length)];
    message_prompt_in.play();
    $("#message_prompt").fadeIn(200, function() {
      $("#message_prompt #warning_block").css("animation-name", "message_prompt_in");
      $("#message_prompt #warning_block .title").text(title);
      $("#message_prompt #warning_block .message").html(message_selected);
    });
  }

  // Génération d'un nombre aléatoire compris dans une intervale
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min));
  }

  // Clic sur un pokémon de la liste d'évolutions
  function miniatureOnClick() {
    $(".pokemon_evol").click(function() {
      let number = parseInt($(this).data('pokemon-id'));
      if (number === parseInt($('#pokemon_number').text())) {
        return false;
      }
      click_sound.play();
      loadDataPokemon(number);
    });
  }

  // Remplace les accents d'une chaîne de caractères
  function replaceAccent(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  function upperFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function isImageExist(url) {
    if (data_images.indexOf(url)) {
      return true;
    }
    console.log(data_images.indexOf(url));
    return false;
  }
});
