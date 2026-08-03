/* ============================================
   ELITE CALCULATOR — DATE & TIME MODE
   
   Handles 4 date/time calculators:
   1. Age Calculator
   2. Days Between Dates
   3. Countdown Timer
   4. Working Days Calculator
   
   All calculations use JavaScript's built-in
   Date object. No external libraries needed.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     HELPER: SET RESULT TEXT
  ======================================== */
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  /* ========================================
     HELPER: SHOW RESULT CARD
  ======================================== */
  function showCard(id) {
    var el = document.getElementById(id);
    if (el) {
      el.style.display = 'flex';
    }
  }

  /* ========================================
     HELPER: GET DATE VALUE
     
     Gets a Date object from a date input.
     Returns null if the input is empty or
     invalid.
  ======================================== */
  function getDateValue(id) {
    var el = document.getElementById(id);
    if (!el || !el.value) return null;

    var date = new Date(el.value);

    /* Check if date is valid */
    if (isNaN(date.getTime())) return null;

    return date;
  }

  /* ========================================
     1. AGE CALCULATOR
     
     HOW IT WORKS:
     1. Takes user's birthday
     2. Compares it to today's date
     3. Calculates exact years, months, days
     4. Also shows total months lived,
        total days lived, and days until
        next birthday
     
     WHY this is useful:
     Everyone knows their age in years,
     but knowing exact months and days lived
     gives perspective. And knowing days
     until next birthday is fun.
  ======================================== */
  var ageCalcBtn = document.getElementById('age-calc-btn');

  if (ageCalcBtn) {
    ageCalcBtn.addEventListener('click', function() {
      var birthday = getDateValue('age-birthday');

      /* Validate */
      if (!birthday) {
        if (window.showToast) {
          window.showToast('Please select your birthday');
        }
        return;
      }

      var today = new Date();

      /* Birthday can't be in the future */
      if (birthday > today) {
        if (window.showToast) {
          window.showToast('Birthday cannot be in the future');
        }
        return;
      }

      /* ---- CALCULATE EXACT AGE ----
         We can't just subtract years because
         we need to account for whether the
         birthday has passed this year or not */

      var years = today.getFullYear() - birthday.getFullYear();
      var months = today.getMonth() - birthday.getMonth();
      var days = today.getDate() - birthday.getDate();

      /* Adjust if day hasn't passed in current month */
      if (days < 0) {
        months--;
        /* Get days in previous month */
        var prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }

      /* Adjust if month hasn't passed in current year */
      if (months < 0) {
        years--;
        months += 12;
      }

      /* ---- TOTAL MONTHS LIVED ---- */
      var totalMonths = (years * 12) + months;

      /* ---- TOTAL DAYS LIVED ----
         Calculate by getting milliseconds difference
         and dividing by milliseconds in a day */
      var msPerDay = 24 * 60 * 60 * 1000;
      var totalDays = Math.floor((today - birthday) / msPerDay);

      /* ---- DAYS UNTIL NEXT BIRTHDAY ---- */
      var nextBirthday = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
      );

      /* If birthday already passed this year,
         use next year's date */
      if (nextBirthday <= today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      var daysUntilBirthday = Math.ceil(
        (nextBirthday - today) / msPerDay
      );

      /* ---- DISPLAY RESULTS ---- */
      var ageString = years + ' years';
      if (months > 0 || days > 0) {
        ageString += ', ' + months + ' months';
      }
      if (days > 0) {
        ageString += ', ' + days + ' days';
      }

      setText('age-years', ageString);
      setText('age-months', totalMonths.toLocaleString() + ' months');
      setText('age-days', totalDays.toLocaleString() + ' days');

      /* Special message if birthday is today */
      if (daysUntilBirthday === 365 || daysUntilBirthday === 366) {
        setText('age-next', '🎂 Happy Birthday! 🎉');
      } else {
        setText('age-next', daysUntilBirthday + ' days');
      }

      showCard('age-result');

      if (window.showToast) {
        window.showToast('You are ' + years + ' years old');
      }
    });
  }

  /* ========================================
     2. DAYS BETWEEN DATES
     
     HOW IT WORKS:
     1. Takes two dates from the user
     2. Calculates the difference in days
     3. Also converts to weeks and months
        for easier understanding
     
     WHY:
     How many days until my vacation?
     How long have I been at this job?
     How many days between two events?
     This answers all of those instantly.
  ======================================== */
  var betweenCalcBtn = document.getElementById('between-calc-btn');

  if (betweenCalcBtn) {
    betweenCalcBtn.addEventListener('click', function() {
      var startDate = getDateValue('between-start');
      var endDate = getDateValue('between-end');

      /* Validate */
      if (!startDate || !endDate) {
        if (window.showToast) {
          window.showToast('Please select both dates');
        }
        return;
      }

      /* Make sure start is before end
         If not, swap them automatically */
      if (startDate > endDate) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;
      }

      /* ---- CALCULATE DIFFERENCES ---- */
      var msPerDay = 24 * 60 * 60 * 1000;
      var totalDays = Math.round((endDate - startDate) / msPerDay);

      /* Calculate weeks and remaining days */
      var weeks = Math.floor(totalDays / 7);
      var remainDays = totalDays % 7;

      /* Calculate approximate months
         Using average days per month (30.44) */
      var approxMonths = (totalDays / 30.44).toFixed(1);

      /* ---- DISPLAY RESULTS ---- */
      setText('between-days', totalDays.toLocaleString() + ' days');

      var weeksText = weeks.toLocaleString() + ' weeks';
      if (remainDays > 0) {
        weeksText += ', ' + remainDays + ' days';
      }
      setText('between-weeks', weeksText);

      setText('between-months', approxMonths + ' months');

      showCard('between-result');

      if (window.showToast) {
        window.showToast(totalDays + ' days between dates');
      }
    });  /* ========================================
     3. COUNTDOWN TIMER
     
     HOW IT WORKS:
     1. User picks a target date
     2. Optionally names the event
     3. We calculate days, hours, and minutes
        remaining until that date
     4. Updates every minute to stay accurate
     
     WHY:
     Countdowns make waiting exciting.
     How many days until graduation?
     Until vacation? Until a product launch?
     Until a birthday? This answers it with
     a beautiful live display.
  ======================================== */
  var countdownCalcBtn = document.getElementById('countdown-calc-btn');
  var countdownInterval = null;

  if (countdownCalcBtn) {
    countdownCalcBtn.addEventListener('click', function() {
      var targetDate = getDateValue('countdown-date');
      var eventNameInput = document.getElementById('countdown-name');
      var eventName = eventNameInput ? eventNameInput.value.trim() : '';

      /* Validate */
      if (!targetDate) {
        if (window.showToast) {
          window.showToast('Please select a target date');
        }
        return;
      }

      /* Set time to end of target day */
      targetDate.setHours(23, 59, 59);

      var today = new Date();

      /* Check if date is in the past */
      if (targetDate < today) {
        setText('cd-days', '0');
        setText('cd-hours', '0');
        setText('cd-mins', '0');

        var eventEl = document.getElementById('cd-event');
        if (eventEl) {
          var pastText = eventName ? eventName + ' has passed!' : 'This date has already passed!';
          eventEl.textContent = pastText;
        }

        showCard('countdown-result');
        return;
      }

      /* ---- CALCULATE COUNTDOWN ---- */
      function updateCountdown() {
        var now = new Date();
        var diff = targetDate - now;

        /* If countdown is complete */
        if (diff <= 0) {
          setText('cd-days', '0');
          setText('cd-hours', '0');
          setText('cd-mins', '0');

          var doneEl = document.getElementById('cd-event');
          if (doneEl) {
            var doneText = eventName ? '🎉 ' + eventName + ' is here!' : '🎉 The day has arrived!';
            doneEl.textContent = doneText;
          }

          /* Stop updating */
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
          return;
        }

        /* Convert milliseconds to days, hours, minutes */
        var msPerMinute = 60 * 1000;
        var msPerHour = 60 * msPerMinute;
        var msPerDay = 24 * msPerHour;

        var days = Math.floor(diff / msPerDay);
        var hours = Math.floor((diff % msPerDay) / msPerHour);
        var mins = Math.floor((diff % msPerHour) / msPerMinute);

        setText('cd-days', days.toString());
        setText('cd-hours', hours.toString());
        setText('cd-mins', mins.toString());
      }

      /* Run immediately */
      updateCountdown();

      /* Show event name */
      var cdEventEl = document.getElementById('cd-event');
      if (cdEventEl) {
        if (eventName) {
          cdEventEl.textContent = 'Until ' + eventName;
        } else {
          /* Format the target date nicely */
          var options = { year: 'numeric', month: 'long', day: 'numeric' };
          var formatted = targetDate.toLocaleDateString('en-US', options);
          cdEventEl.textContent = 'Until ' + formatted;
        }
      }

      showCard('countdown-result');

      /* Clear any existing interval */
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      /* Update every 60 seconds */
      countdownInterval = setInterval(updateCountdown, 60000);

      if (window.showToast) {
        window.showToast('Countdown started ⏱️');
      }
    });
  }

  /* ========================================
     4. WORKING DAYS CALCULATOR
     
     HOW IT WORKS:
     1. Takes start and end dates
     2. Counts only Monday through Friday
     3. Excludes Saturday and Sunday
     4. Shows working days, weekend days,
        and total days
     
     WHY:
     Project deadlines, salary calculations,
     and time-off planning all depend on
     working days — not calendar days.
     "You have 30 days" means very different
     things depending on how many are weekends.
  ======================================== */
  var workCalcBtn = document.getElementById('work-calc-btn');

  if (workCalcBtn) {
    workCalcBtn.addEventListener('click', function() {
      var startDate = getDateValue('work-start');
      var endDate = getDateValue('work-end');

      /* Validate */
      if (!startDate || !endDate) {
        if (window.showToast) {
          window.showToast('Please select both dates');
        }
        return;
      }

      /* Swap if start is after end */
      if (startDate > endDate) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;
      }

      /* ---- COUNT WORKING DAYS ----
         Loop through each day from start to end.
         If it's Monday-Friday (day 1-5), count it.
         Saturday = 6, Sunday = 0 */
      var workingDays = 0;
      var weekendDays = 0;
      var totalDays = 0;

      /* Create a copy so we don't modify the original */
      var current = new Date(startDate);

      while (current <= endDate) {
        totalDays++;
        var dayOfWeek = current.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          /* Sunday (0) or Saturday (6) */
          weekendDays++;
        } else {
          /* Monday (1) through Friday (5) */
          workingDays++;
        }

        /* Move to next day */
        current.setDate(current.getDate() + 1);
      }

      /* ---- DISPLAY RESULTS ---- */
      setText('work-days', workingDays.toLocaleString() + ' days');
      setText('work-weekends', weekendDays.toLocaleString() + ' days');
      setText('work-total', totalDays.toLocaleString() + ' days');

      showCard('work-result');

      if (window.showToast) {
        window.showToast(workingDays + ' working days');
      }
    });
  }

  /* ========================================
     SET DEFAULT DATES
     
     WHY: When user opens date/time mode,
     the date inputs are empty. We set
     sensible defaults so they can quickly
     test the calculators.
     
     - Age: empty (user must enter birthday)
     - Between: today and 30 days from now
     - Countdown: 30 days from now
     - Working: today and 30 days from now
  ======================================== */
  function setDefaultDates() {
    var today = new Date();
    var future = new Date();
    future.setDate(today.getDate() + 30);

    /* Format as YYYY-MM-DD for input[type="date"] */
    function formatDateInput(date) {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    var todayStr = formatDateInput(today);
    var futureStr = formatDateInput(future);

    /* Set defaults only if fields are empty */
    var fields = [
      { id: 'between-start', value: todayStr },
      { id: 'between-end', value: futureStr },
      { id: 'countdown-date', value: futureStr },
      { id: 'work-start', value: todayStr },
      { id: 'work-end', value: futureStr }
    ];

    fields.forEach(function(field) {
      var el = document.getElementById(field.id);
      if (el && !el.value) {
        el.value = field.value;
      }
    });
  }

  /* ========================================
     AUTO-INITIALIZE ON MODE SWITCH
     
     Sets default dates when user switches
     to date/time mode.
  ======================================== */
  var datetimeMode = document.getElementById('mode-datetime');

  if (datetimeMode) {
    var dtObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (datetimeMode.classList.contains('active')) {
            setDefaultDates();
          }
        }
      });
    });

    dtObserver.observe(datetimeMode, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* ========================================
     ENTER KEY SUPPORT
  ======================================== */
  var dtInputPairs = [
    { inputs: ['age-birthday'], btn: 'age-calc-btn' },
    { inputs: ['between-start', 'between-end'], btn: 'between-calc-btn' },
    { inputs: ['countdown-date', 'countdown-name'], btn: 'countdown-calc-btn' },
    { inputs: ['work-start', 'work-end'], btn: 'work-calc-btn' }
  ];

  dtInputPairs.forEach(function(pair) {
    pair.inputs.forEach(function(inputId) {
      var input = document.getElementById(inputId);
      var btn = document.getElementById(pair.btn);

      if (input && btn) {
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            btn.click();
          }
        });
      }
    });
  });

  /* ========================================
     CLEANUP COUNTDOWN ON MODE SWITCH
     
     WHY: If user starts a countdown and
     switches to another mode, we should
     stop the interval to save resources.
     When they come back, they can restart.
  ======================================== */
  if (datetimeMode) {
    var cleanupObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (!datetimeMode.classList.contains('active')) {
            if (countdownInterval) {
              clearInterval(countdownInterval);
              countdownInterval = null;
            }
          }
        }
      });
    });

    cleanupObserver.observe(datetimeMode, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* Run defaults on page load */
  setDefaultDates();

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
}
