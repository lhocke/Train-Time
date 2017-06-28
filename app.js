// Initialize Firebase
var config = {
  apiKey: "AIzaSyDRuZ84r0hML2QgPe5iPdGfdBjyMYk-N-c",
  authDomain: "ride-a-train-143cc.firebaseapp.com",
  databaseURL: "https://ride-a-train-143cc.firebaseio.com",
  projectId: "ride-a-train-143cc",
  storageBucket: "ride-a-train-143cc.appspot.com",
  messagingSenderId: "561049671726"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#submit-button').on('click', function(){
  event.preventDefault();

  var newRoute = $('#train-route').val().trim();
  var newDestination = $('#train-destination').val().trim();
  var newStart = $('#train-start').val().trim();
  console.log(newStart);
  var newFrequency = $('#train-frequency').val().trim();

  database.ref().push({
    route : newRoute,
    destination : newDestination,
    start : newStart,
    frequency : newFrequency,
    startedAt : firebase.database.ServerValue.TIMESTAMP
  })

  // console.log('attempt to push')

  $('#train-route').val('');
  $('#train-destination').val('');
  $('#train-start').val('');
  $('#train-frequency').val('')

})

database.ref().on('child_added', function(snap){
  console.log(snap.val().start)
  var routeInfo = $('<tr>');
  var displayRoute = $('<td>').append(snap.val().route);
  var displayDestination = $('<td>').append(snap.val().destination);
  var displayFrequency = $('<td>').append(snap.val().frequency);
  var startTime = moment(snap.val().start,"HH:mm")
  console.log(startTime)
  
  var currentTime = moment()
  console.log(currentTime)

  var frequencyUpdate = moment(startTime).subtract(1, "days");
  var currentTime = moment();
  var timeDifference = moment().diff(moment(frequencyUpdate), "minutes");
  var timeRemainder = timeDifference % snap.val().frequency;
  var timeUntil = snap.val().frequency - timeRemainder;
  var next = moment().add(timeUntil, "minutes")

  console.log(next)
  
  var displayNext = $('<td>').append(moment(next).format("h:mm a"));
  var displayMinutes = $('<td>').append(timeUntil);



  routeInfo.append(displayRoute, displayDestination, displayFrequency, displayNext, displayMinutes)
  console.log(routeInfo)
  $('#schedule').append(routeInfo)
})