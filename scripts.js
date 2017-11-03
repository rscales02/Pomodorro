window.onload = function() {

    var timer = createTimer(document.getElementById('timer'));
    var on = true;
    //reduce break timer
    document.getElementById('lessBreak').addEventListener('click', function() {
        var timer = document.getElementById('breakClock');
        lessTime(timer);
    });
    //increase break timer
    document.getElementById('moreBreak').addEventListener('click', function() {
        var timer = document.getElementById('breakClock');
        moreTime(timer);
    });
    //reduce study timer
    document.getElementById('lessStudy').addEventListener('click', function() {
        var timer = document.getElementById('studyClock');
        lessTime(timer);
    });
    //increase study timer
    document.getElementById('moreStudy').addEventListener('click', function() {
        var timer = document.getElementById('studyClock');
        moreTime(timer);
    });
    //reset clock - missing functionality of resetting the countdown timer
    document.getElementById('reset').addEventListener('click', function() {
        document.getElementById('studyClock').value = 25;
        document.getElementById('breakClock').value = 5;
        updateClock();
        timer.setValues(5, 25);
    });
    //start/pause countdown - missing functionality of pause

    document.getElementById('countdown').addEventListener('click', function() {

        if (document.getElementById('studyClock').value == document.getElementById('timer').innerHTML) {
            timer.setValues(document.getElementById('breakClock').value, document.getElementById('studyClock').value);
            timer.start();
        } else if (!on) {
            timer.start();
            on = true;
        } else {
            timer.pause();
            on = false;
        }
    });


    updateClock();

};

function createTimer(el) {
    // The following is private state (hidden inside closure of createTimer function).

    // If this is set then timer is running, if not then it's either not running or paused.
    var interval = null;

    var breakSeconds;
    var studySeconds;

    var currentPhase = "study";
    var currentTime = studySeconds;

    var audio = new Audio('https://dl.dropbox.com/s/86ga919lk4vw0xt/chinese-gong.mp3?dl=0');

    var onTick = function() {
        var displayMinutes = (currentTime / 60) | 0;
        var displaySeconds = (currentTime % 60);
        var displayStudy = document.getElementById('study');
        var displayBreak = document.getElementById('break');


        displaySeconds = displaySeconds < 10 ? "0" + displaySeconds : displaySeconds;
        // Handle a tick.
        currentTime -= 1;
        if (currentTime <= 0) {
            // Buzzz.
            audio.play();
            // Invert phase.
            currentPhase = currentPhase == "study" ? "break" : "study";
            currentTime = currentPhase == "study" ? studySeconds : breakSeconds;
            displayStudy = currentPhase == "study" ? displayStudy.style.display = 'block' : displayStudy.style.display = "none";
            displayBreak = currentPhase != "study" ? displayBreak.style.display = 'block' : displayBreak.style.display = "none";
        }
        // el is also private value and comes from the createTimer function parameter. 
        el.innerHTML = displayMinutes + ":" + displaySeconds;
    };

    // These are essentially public values/functions or the "interface" for external code.
    var timer = {
        start: function() {
            // Only start if not running.
            if (!interval) {
                onTick();
                interval = setInterval(onTick, 1000);
            }
        },

        reset: function() {
            // If running stop it.
            this.pause();
            currentPhase = "study";
            currentTime = studySeconds;
        },

        pause: function() {
            // Can only pause if it's running.
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        },

        setValues: function(bMinutes, sMinutes) {
            breakSeconds = bMinutes * 60;
            studySeconds = sMinutes * 60;
            // We need to reset the timer if we change values.
            this.reset();
        }
    };

    return timer;
}

function updateClock() {
    document.getElementById('timer').innerHTML = document.getElementById('studyClock').value;
}

function moreTime(clock) {
    var timerVal = clock.value;
    timerVal = Number(timerVal);
    timerVal += 1;
    clock.value = timerVal;
    updateClock();
}

function lessTime(clock) {
    var timerVal = clock.value;
    if (timerVal >= 1) {
        timerVal -= 1;
        clock.value = timerVal;
        updateClock();
    } else {
        clock.value = timerVal;
    }
}