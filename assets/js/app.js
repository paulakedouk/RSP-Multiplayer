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
  selected: '',
  win: initialNum,
  lose: initialNum
};

var player2 = {
  name: '',
  selected: '',
  win: initialNum,
  lose: initialNum
};

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
  $('#watchers').text(snap.numChildren());
});

database.ref('/players/').on(
  'value',
  function(snapshot) {
    // if (snapshot.child('player1').exists()) {
    //   console.log('Player exists');
    // } else {
    //   console.log('Player does NOT exist');
    // }
    // if (snapshot.child('player2').exists()) {
    //   console.log('Opponent exists');
    // } else {
    //   console.log('Opponent does NOT exist');
    // }
  },
  function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  }
);

function playerLogin() {
  $('#player1-submit').on('click', function(event) {
    event.preventDefault();

    // Get the input value for name
    var playerName = $('#player1-name')
      .val()
      .trim();

    console.log(playerName);

    $('#name-input').val('');
    player1.name = playerName;
    player1.win = initialNum;
    player1.lose = initialNum;

    // Save the new price in Firebase
    database.ref('/players/player1').set({
      name: player1.name,
      win: player1.win,
      lose: player1.lose
    });

    // var greeting = $('.greeting-player1');
    // greeting.empty();
    logged();

    // Change the HTML to reflect the new name

    $('.player-name')
      .append($('<h3>').text(playerName))
      .append($('<h4>'));
  });

  $('#player2-submit').on('click', function(event) {
    event.preventDefault();

    // Get player name
    var playerName = $('#player2-name')
      .val()
      .trim();

    console.log(playerName);

    $('#name-input').val('');
    player2.name = playerName;
    player2.win = initialNum;
    player2.lose = initialNum;

    database.ref('/players/player2').set({
      name: player2.name,
      win: player2.win,
      lose: player2.lose
    });

    // var greeting = $('.greeting-player2');
    // greeting.empty();
    logged();

    // Show greeting
    var hi = $('<h3>').text(playerName);

    $('.opponent-name')
      .append(hi)
      .append($('<h4>'));
  });
}

function logged() {
  //   $('.greeting-player1').hide();
  //   $('.greeting-player2').hide();
  if (player1.name !== '') {
    $('.greeting-player1').hide();
    $('.player2-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');
    $('.form-player2').hide();
    $('.player1-waiting').prepend(text);
  } else if (player2.name !== '') {
    $('.greeting-player2').hide();
    $('.player1-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');
    $('.greeting-player1').css('position', 'initial');
    $('.form-player1').hide();
    $('.player2-waiting').prepend(text);
  }
}

playerLogin();
