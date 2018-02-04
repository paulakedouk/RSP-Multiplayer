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

database.ref('/players').on(
  'value',
  function(snapshot) {
    console.log(snapshot);
  },
  function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  }
);

$('#add-name').on('click', function(event) {
  event.preventDefault();

  // Get player name
  var playerName = $('#name-input')
    .val()
    .trim();

  var greeting = $('.greeting');
  greeting.empty();

  // Show greeting
  var hi = $('<h3>').text(playerName);

  $('.player-name')
    .append(hi)
    .append($('<h4>'));

  // Save the new price in Firebase
  database.ref('/players').set({
    name: playerName
  });

  console.log(playerName);
});

// database.ref('/players').on('value', function(snapshot) {
//   if (snapshot.child('player').exists()) {
//     console.log('player exist');

//     player = snapshot.val().player;
//     playerName = name;
//   } else {
//     console.log("player doesn't exist");
//   }
// });
