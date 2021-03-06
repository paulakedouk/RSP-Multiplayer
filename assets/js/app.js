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

var connectionsRef = database.ref('/connections');
var connectedRef = database.ref('.info/connected');

connectedRef.on('value', function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

connectionsRef.on('value', function(snap) {
  var test = $('#watchers').text(snap.numChildren());
});

// database.ref('/turn');

// function listeners() {
//   database.ref('/players/').on('value', function(snapshot) {
//     if (player1 == undefined && player2 == undefined) {
//       var container = $('.container');
//       var $h1 = $('<h1>').text('Please wait until other players finish, then refresh screen.');
//       container.empty().append($h1);
//       throw new Error('Please wait until other players finish, then refresh screen.');
//     }
//   });
// }

// listeners();

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

  // Reset the input form
  $('#player1-input').val('');
  player1.name = playerName;
  player1.win = initialNum;
  player1.lose = initialNum;

  // Save the new player info in Firebase
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

  // Reset the input form
  $('#player1-input').val('');
  player2.name = playerName;
  player2.win = initialNum;
  player2.lose = initialNum;

  // Save the new player info in Firebase
  database.ref('/players/player2').push({
    name: player2.name,
    win: player2.win,
    choice: player2.choice,
    lose: player2.lose,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

// When the user is logged in, show a message to the other player
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

// Firebase watcher
database.ref('/players/player1').on('child_added', function(snapshot) {
  // Take player's name
  var player1Name = $('.player1-name').text(snapshot.val().name);
  $('.greeting-player1').empty();

  // When then player click on the hand
  $('.hands-player1').click(function() {
    var value = $(this)[0];
    var choice = $(value).attr('data-choice');
    $(value)
      .find('img')
      .addClass('hands-selected');

    database.ref('/players/player1').set({
      name: player1.name,
      win: player1.win,
      choice: choice,
      lose: player1.lose
    });
    checkChoices();
  });
});

database.ref('/players/player2').on('child_added', function(snapshot) {
  var player2Name = $('.player2-name').text(snapshot.val().name);
  $('.player2-name').text(snapshot.val().name);
  $('.greeting-player2').empty();

  $('.hands-player2').click(function() {
    var value = $(this)[0];
    var choice = $(value).attr('data-choice');
    $(value)
      .find('img')
      .addClass('hands-selected');

    database.ref('/players/player2').set({
      name: player2.name,
      win: player2.win,
      choice: choice,
      lose: player2.lose
    });
    checkChoices();
  });
});

function score() {
  database.ref('/players/player1').on('value', function(snapshot) {
    console.log(snapshot.val().win);
    $('.player1-point').text(snapshot.val().win);
  });

  database.ref('/players/player2').on('value', function(snapshot) {
    console.log(snapshot.val().win);
    $('.player2-point').text(snapshot.val().win);
  });
}

function checkChoices() {
  var player1Choice;
  var player2Choice;

  database
    .ref('/players/player1')
    .once('value')
    .then(function(snapshot) {
      player1Choice = snapshot.val().choice;

      database
        .ref('/players/player2')
        .once('value')
        .then(function(snapshot) {
          player2Choice = snapshot.val().choice;
          var win = snapshot.val().win;

          if (player1Choice !== undefined && player2Choice !== undefined) {
            console.log(player1Choice, player2Choice);
            if (player1Choice === 'rock' && player2Choice === 'scissors') {
              addWin('P1');
              score();
            } else if (player1Choice === 'scissors' && player2Choice === 'rock') {
              addWin('P2');
              score();
            } else if (player1Choice === 'paper' && player2Choice === 'rock') {
              addWin('P1');
              score();
            } else if (player1Choice === 'scissors' && player2Choice === 'paper') {
              addWin('P1');
              score();
            } else if (player1Choice === 'rock' && player2Choice === 'paper') {
              addWin('P2');
              score();
            } else if (player1Choice === 'paper' && player2Choice === 'scissors') {
              addWin('P2');
              score();
            } else if (player1Choice === player2Choice) {
            }
          }
        });
    });
}

function addWin(player) {
  if (player == 'P1') {
    setTimeout(function() {
      $('.hands-player1, .hands-player2')
        .find('img')
        .removeClass('hands-selected');
    }, 2000);
    database.ref('/players/player1').update({
      name: player1.name,
      win: player1.win + 1,
      choice: player1.choice,
      lose: player1.lose
    });
  } else {
    setTimeout(function() {
      $('.hands-player1, .hands-player2')
        .find('img')
        .removeClass('hands-selected');
    }, 2000);
    database.ref('/players/player2').update({
      name: player2.name,
      win: player2.win + 1,
      choice: player2.choice,
      lose: player2.lose
    });
  }
}
