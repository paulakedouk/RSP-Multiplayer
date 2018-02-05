//  Firebase Database Section
var config = {
  apiKey: 'AIzaSyDKvdgS0aaKWGmtKBAVEycngq1zbCPpMSE',
  authDomain: 'rps-multiplayer-b342f.firebaseapp.com',
  databaseURL: 'https://rps-multiplayer-b342f.firebaseio.com',
  projectId: 'rps-multiplayer-b342f',
  storageBucket: '',
  messagingSenderId: '1042505507601'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var logic = {
  rock: {
    rock: 'tie',
    paper: 'lose',
    scissors: 'win'
  },
  paper: {
    rock: 'win',
    paper: 'tie',
    scissors: 'lose'
  },
  scissors: {
    rock: 'lose',
    paper: 'win',
    scissors: 'tie'
  }
};

var initialNum = 0;

var player1 = {
  name: '',
  choice: '',
  win: initialNum,
  lose: initialNum
};

var player2 = {
  name: '',
  choice: '',
  win: initialNum,
  lose: initialNum
};

// Listen to the click of the player1 form
$('#player1-submit').on('click', function(event) {
  event.preventDefault();

  // Get the input value for name
  var playerName = $('#player1-input')
    .val()
    .trim();

  var player1Choice;

  $('#player1-input').val('');
  player1.name = playerName;
  player1.win = initialNum;
  player1.lose = initialNum;

  // Save the new price in Firebase
  database.ref('/players/player1').push({
    name: player1.name,
    win: player1.win,
    choice: player1.choice,
    lose: player1.lose,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  logged();
});

// Listen to the click of the player2 form
$('#player2-submit').on('click', function(event) {
  event.preventDefault();

  // Get player name
  var playerName = $('#player2-input')
    .val()
    .trim();

  $('#player1-input').val('');
  player2.name = playerName;
  player2.win = initialNum;
  player2.lose = initialNum;

  database.ref('/players/player2').push({
    name: player2.name,
    win: player2.win,
    choice: player2.choice,
    lose: player2.lose,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// when the user is logged in, show a message to the other player
function logged() {
  // Check if the player name exist
  if (player1.name !== '') {
    // Then hide the form
    $('.greeting-player1').hide();
    $('.form-player2').hide();

    // Add a text to wait player2
    $('.player2-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');
  } else if (player2.name !== '') {
    // Hide the form
    $('.greeting-player2').hide();
    $('.form-player1').hide();

    // Add a text to wait player1
    $('.player1-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');

    $('.greeting-player1').css('position', 'initial');
    $('.player2-waiting').prepend('.player1-waiting');
  }
}

database.ref('/players/player1').on('child_added', function(snapshot) {
  var player1Name = $('.player1-name').text(snapshot.val().name);
  $('.greeting-player1').empty();

  $('.hands-player1').click(function() {
    var value = $(this)[0];
    var choice = $(value).attr('data-choice');
    player1Chosen = $('.group-player1').html(value);

    database.ref('/players/player1').set({
      name: player1.name,
      win: player1.win,
      choice: choice,
      lose: player1.lose
    });
  });
});

database.ref('/players/player2').on('child_added', function(snapshot) {
  var player2Name = $('.player2-name').text(snapshot.val().name);
  $('.player2-name').text(snapshot.val().name);
  $('.greeting-player2').empty();

  $('.hands-player2').click(function() {
    var value = $(this)[0];
    console.log(value);
    var choice = $(value).attr('data-choice');
    player2Chosen = $('.group-player2').html(value);

    database.ref('/players/player2').set({
      name: player2.name,
      win: player2.win,
      choice: choice,
      lose: player2.lose
    });
  });
});
