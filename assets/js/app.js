// Two players
// Each one can login
// Player one choses and change to player two
// Player two choses and show who wins
// Resets and given points
// If user close that tab, desconect and remove data from database

$(document).on('ready', function() {
  var config = {
    apiKey: 'AIzaSyDKvdgS0aaKWGmtKBAVEycngq1zbCPpMSE',
    authDomain: 'rps-multiplayer-b342f.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-b342f.firebaseio.com',
    projectId: 'rps-multiplayer-b342f',
    storageBucket: '',
    messagingSenderId: '1042505507601'
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var player;
  var opponent;
});
