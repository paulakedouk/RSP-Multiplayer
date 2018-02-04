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

$('#player1-submit').on('click', function(event) {
  event.preventDefault();

  // Get the input value for name
  var playerName = $('#player1-input')
    .val()
    .trim();

  // console.log(playerName);

  $('#player1-input').val('');
  player1.name = playerName;
  player1.win = initialNum;
  player1.lose = initialNum;

  // Save the new price in Firebase
  database.ref('/players/player1').push({
    name: player1.name,
    win: player1.win,
    lose: player1.lose,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  logged();
});

$('#player2-submit').on('click', function(event) {
  event.preventDefault();

  // Get player name
  var playerName = $('#player2-input')
    .val()
    .trim();

  // console.log(playerName);

  $('#player1-input').val('');
  player2.name = playerName;
  player2.win = initialNum;
  player2.lose = initialNum;

  database.ref('/players/player2').push({
    name: player2.name,
    win: player2.win,
    lose: player2.lose,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

function logged() {
  //   $('.greeting-player1').hide();
  //   $('.greeting-player2').hide();
  if (player1.name !== '') {
    $('.greeting-player1').hide();
    $('.form-player2').hide();

    $('.player2-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');
  } else if (player2.name !== '') {
    $('.greeting-player2').hide();
    $('.form-player1').hide();

    $('.player1-waiting')
      .text('Waiting for another player!')
      .addClass('waiting');

    $('.greeting-player1').css('position', 'initial');
    $('.player2-waiting').prepend('.player1-waiting');
  }
}

database.ref('/players/player1').on('child_added', function(snapshot) {
  console.log(snapshot.val().name);
  console.log(snapshot.val());

  $('.player1-name').text(snapshot.val().name);
  $('.greeting-player1').empty();
});

database.ref('/players/player2').on('child_added', function(snapshot) {
  console.log(snapshot.val().name);
  console.log(snapshot.val());

  $('.player2-name').text(snapshot.val().name);
  $('.greeting-player2').empty();
});

// var game = {
//   playerUpdate: function() {
//     database.ref('/players/player1').on('value', function(snapshot) {
//       if (snapshot.val()) {
//         player1.name = snapshot.val().name;
//         logged();
//       }
//     });
//     database.ref('/players/player2').on('value', function(snapshot) {
//       if (snapshot.val()) {
//         player2.name = snapshot.val().name;
//         logged();
//       }
//     });
//   },

//   start: function() {
//     database.ref('/players').on('value', function(snapshot) {
//       if (
//         snapshot
//           .child('player1')
//           .child('name')
//           .val() &&
//         snapshot
//           .child('player2')
//           .child('name')
//           .val()
//       ) {
//         console.log('both logged');
//         $('.player2-waiting').empty();
//       }
//     });
//   }
// };
