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
var currentTime = moment();
// console.log(currentTime);

$('#submit-button').on('click', function(event){
  event.preventDefault();

  if ($('input').val() === ('')) {
    // change alert to another option
    alert("Please Fill All Text Boxes")
    return false
  }

  var newRoute = $('#train-route').val().trim();
  var newDestination = $('#train-destination').val().trim();
  var newStart = $('#train-start').val().trim();
  var newFrequency = $('#train-frequency').val().trim();

  database.ref().push({
    route : newRoute,
    destination : newDestination,
    start : newStart,
    frequency : newFrequency,
    startedAt : firebase.database.ServerValue.TIMESTAMP
  })

  $('input').val('')

})
// updates start time at mignight each day
if (currentTime === moment().startOf("day")){
  database.ref("child", function(snap){
    var startReset = moment(snap.val().start).add(1, 'd');
    database.ref("child").update({
      start : startReset
    })
  })
}

database.ref().on('child_added', buildSchedule),function(err){
  console.log(err.code)};

// if (currentTime === moment().startOf('minute')){
//   console.log("new minute!")
//   // database.ref("child", buildSchedule)
// }
// database.ref().on('child_changed', buildSchedule),function(err){
//   console.log(err.code);}

// take information stored in database and create table
function buildSchedule(snap, prevChildKey){
  var routeInfo = $('<tr>');
  var displayRoute = $('<td>').append(snap.val().route);
  var displayDestination = $('<td>').append(snap.val().destination);
  var displayFrequency = $('<td>').append(snap.val().frequency);
  var startTime = moment(snap.val().start,"HH:mm");
  // console.log(moment(snap.val().start))
  // console.log(startTime)
  
  var currentTime = moment();

  if (currentTime.isBefore(startTime)){
    var next = startTime;
    timeUntil = moment(next).diff(moment(),"minutes");
    console.log("first")
  }

  else{
    // var currentTime = moment();
    var timeDifference = moment().diff(moment(startTime), "minutes");
    var timeRemainder = timeDifference % snap.val().frequency;
    var timeUntil = snap.val().frequency - timeRemainder;
    next = moment().add(timeUntil, "minutes");

  }
  
  var displayNext = $('<td>').append(moment(next).format("h:mm a"));
  var displayMinutes = $('<td>').append(timeUntil);



  routeInfo.append(displayRoute, displayDestination, displayFrequency, displayNext, displayMinutes);
  // console.log(routeInfo)
  $('#schedule').append(routeInfo);
  // setInterval(buildSchedule, 30000);
}

