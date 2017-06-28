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
console.log(currentTime);

$('#submit-button').on('click', function(event){
  event.preventDefault();

  if ($('input').val() === ('')) {
    alert("Please Fill All Text Boxes")
    return false
  }

  var newRoute = $('#train-route').val().trim();
  var newDestination = $('#train-destination').val().trim();
  var newStart = $('#train-start').val().trim();
  // console.log(newStart);
  var newFrequency = $('#train-frequency').val().trim();

  database.ref().push({
    route : newRoute,
    destination : newDestination,
    start : newStart,
    frequency : newFrequency,
    startedAt : firebase.database.ServerValue.TIMESTAMP
  })

  // console.log('attempt to push')
  $('input').val('')
  // $('#train-route').val('');
  // $('#train-destination').val('');
  // $('#train-start').val('');
  // $('#train-frequency').val('')

})

database.ref().on('child_added', buildSchedule),function(err){
  console.log(err.code)};

function buildSchedule(snap){
  var routeInfo = $('<tr>');
  var displayRoute = $('<td>').append(snap.val().route);
  var displayDestination = $('<td>').append(snap.val().destination);
  var displayFrequency = $('<td>').append(snap.val().frequency);
  var startTime = moment(snap.val().start,"HH:mm")
  startTime = moment()
  // console.log(startTime)
  
  var currentTime = moment()
  // console.log(currentTime)

  if (currentTime.isBefore(startTime)){
    next = startTime;
    // console.log(next);
    timeUntil = moment(next).toNow;
    // console.log(timeUntil);
    console.log("first")
  }

  // else {
    // var frequencyUpdate = moment(startTime);
    // console.log(frequencyUpdate)
    var currentTime = moment();
    var timeDifference = moment().diff(moment(startTime), "minutes");
    console.log(timeDifference)
    var timeRemainder = timeDifference % snap.val().frequency;
    console.log(timeRemainder)
    var timeUntil = snap.val().frequency - timeRemainder;
    console.log(timeUntil)
    var next = moment().add(timeUntil, "minutes");
    console.log(next)
    // console.log("second")

  // }




  // console.log(next)
  
  var displayNext = $('<td>').append(moment(next).format("h:mm a"));
  var displayMinutes = $('<td>').append(timeUntil);



  routeInfo.append(displayRoute, displayDestination, displayFrequency, displayNext, displayMinutes)
  // console.log(routeInfo)
  $('#schedule').append(routeInfo);
  // setInterval(buildSchedule, 30000);
}

