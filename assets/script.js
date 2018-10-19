var config = {
    apiKey: "AIzaSyAPiIHUid__0AVgiMw-AT8OBDZzLAMjwpo",
    authDomain: "train-scheduler-6e728.firebaseapp.com",
    databaseURL: "https://train-scheduler-6e728.firebaseio.com",
    projectId: "train-scheduler-6e728",
    storageBucket: "train-scheduler-6e728.appspot.com",
    messagingSenderId: "84108257172"
};
firebase.initializeApp(config);

let database = firebase.database();

function currentTime(){
    let now = moment().format('MMMM Do YYYY, hh:mm:ss a');
    $('#current-time').text(now);
}

setInterval(currentTime,1000);

$('#add-train').on('click',function(event){
    event.preventDefault();
    
    let trainName = $('#name-input').val().trim();
    let destination = $('#dest-input').val().trim();
    let firstTime = moment($('#time-input').val(), 'HH:mm').format('X');
    console.log(firstTime);
    let frequency = parseInt($('#freq-input').val().trim());

    if(!trainName){
        alert("Name your train!");
    }else if(!destination){
        alert("Enter a destination!");
    }else if(firstTime === 'Invalid date'){
        alert('Set a start time!');
    }else if(!frequency){
        alert('Set a frequency!');
    }else{
        let newTrain = {
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        };
        database.ref().push(newTrain);

        $('#name-input').val("");
        $('#dest-input').val("")
        $('#time-input').val("")
        $('#freq-input').val("")
    }
});

database.ref().on('child_added', function (childSnapshot){
    console.log(childSnapshot.val());

    let trainName = childSnapshot.val().trainName;
    let destination = childSnapshot.val().destination;
    let firstTime = childSnapshot.val().firstTime;
    let frequency = parseInt(childSnapshot.val().frequency);

    let firstTimeConverted = moment(firstTime, "X").subtract(1,'years');

    let timeDifference = moment().diff(firstTimeConverted, 'minutes');

    let tRemainder = timeDifference%frequency;

    let minutesAway = frequency - tRemainder;

    let nextArrival = moment().add(minutesAway, 'minutes');

    let newRow = $('<tr>').append(
        $('<td>').text(trainName),
        $('<td>').text(destination),
        $('<td>').text(frequency),
        $('<td>').text(moment(nextArrival).format('hh:mm a')),
        $('<td>').text(minutesAway)
    );

    $('#train-table').append(newRow);
});

