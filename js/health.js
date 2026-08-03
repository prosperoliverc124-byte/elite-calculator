/* ============================================
   ELITE CALCULATOR — HEALTH MODE
   
   Handles 4 health calculators:
   1. BMI (Body Mass Index)
   2. BMR (Basal Metabolic Rate)
   3. Water Intake
   4. Calorie Burn
   
   All formulas are medically recognized
   standards used by health professionals
   worldwide. Results are for general
   awareness only — not medical advice.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     HELPER: GET INPUT VALUE
  ======================================== */
  function getVal(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    return parseFloat(el.value);
  }

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
     1. BMI CALCULATOR
     
     FORMULA:
     BMI = weight(kg) / height(m)²
     
     CLASSIFICATIONS (WHO Standard):
     Below 18.5     = Underweight
     18.5 – 24.9    = Normal weight
     25.0 – 29.9    = Overweight
     30.0 and above = Obese
     
     WHY BMI matters:
     It's the quickest way to check if your
     body weight is in a healthy range
     relative to your height. Not perfect
     for athletes (muscle weighs more than
     fat), but excellent for general health
     awareness.
  ======================================== */
  var bmiCalcBtn = document.getElementById('bmi-calc-btn');

  if (bmiCalcBtn) {
    bmiCalcBtn.addEventListener('click', function() {
      var weight = getVal('bmi-weight');
      var heightCm = getVal('bmi-height');

      /* Validate */
      if (isNaN(weight) || isNaN(heightCm)) {
        if (window.showToast) {
          window.showToast('Please fill in both fields');
        }
        return;
      }

      if (weight <= 0 || heightCm <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      /* Reasonable range check */
      if (weight < 10 || weight > 500) {
        if (window.showToast) {
          window.showToast('Weight seems unrealistic');
        }
        return;
      }

      if (heightCm < 50 || heightCm > 300) {
        if (window.showToast) {
          window.showToast('Height seems unrealistic');
        }
        return;
      }

      /* Convert cm to meters */
      var heightM = heightCm / 100;

      /* Calculate BMI */
      var bmi = weight / (heightM * heightM);
      bmi = parseFloat(bmi.toFixed(1));

      /* Determine classification */
      var classification;
      var classColor;

      if (bmi < 18.5) {
        classification = 'Underweight';
        classColor = '#00D4FF';
      } else if (bmi < 25) {
        classification = 'Normal weight ✓';
        classColor = '#00FF88';
      } else if (bmi < 30) {
        classification = 'Overweight';
        classColor = '#FFB800';
      } else {
        classification = 'Obese';
        classColor = '#FF4444';
      }

      /* Display results */
      setText('bmi-value', bmi.toString());
      setText('bmi-class', classification);

      /* Color the classification */
      var bmiClassEl = document.getElementById('bmi-class');
      if (bmiClassEl) {
        bmiClassEl.style.color = classColor;
      }

      /* Position the BMI indicator on the bar
         The bar represents BMI 10 to 40
         We map the BMI value to a percentage
         position on the bar */
      var indicator = document.getElementById('bmi-indicator');
      if (indicator) {
        var minBmi = 10;
        var maxBmi = 40;
        var percentage = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;

        /* Clamp between 2% and 98% so indicator
           stays visible on the bar */
        percentage = Math.max(2, Math.min(98, percentage));

        indicator.style.left = percentage + '%';
      }

      showCard('bmi-result');

      if (window.showToast) {
        window.showToast('BMI: ' + bmi + ' — ' + classification);
      }
    });
  }

  /* ========================================
     2. BMR CALCULATOR
     
     FORMULA (Mifflin-St Jeor Equation):
     
     Male:
     BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) + 5
     
     Female:
     BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) - 161
     
     WHY Mifflin-St Jeor:
     It's the most accurate BMR formula
     according to the American Dietetic
     Association. More accurate than the
     older Harris-Benedict equation.
     
     BMR = calories your body burns at
     complete rest (just to keep you alive).
     
     To get daily calories needed, multiply
     BMR by an activity factor:
     - Sedentary:        BMR × 1.2
     - Light exercise:   BMR × 1.375
     - Moderate:         BMR × 1.55
     - Very active:      BMR × 1.725
     - Extra active:     BMR × 1.9
  ======================================== */
  var bmrCalcBtn = document.getElementById('bmr-calc-btn');

  if (bmrCalcBtn) {
    bmrCalcBtn.addEventListener('click', function() {
      var gender = document.getElementById('bmr-gender');
      var age = getVal('bmr-age');
      var weight = getVal('bmr-weight');
      var heightCm = getVal('bmr-height');

      /* Validate */
      if (!gender || isNaN(age) || isNaN(weight) || isNaN(heightCm)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (age <= 0 || weight <= 0 || heightCm <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      /* Reasonable range checks */
      if (age < 1 || age > 150) {
        if (window.showToast) {
          window.showToast('Age seems unrealistic');
        }
        return;
      }

      /* Calculate BMR using Mifflin-St Jeor */
      var bmr;
      var genderVal = gender.value;

      if (genderVal === 'male') {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
      }

      bmr = Math.round(bmr);

      /* Calculate daily needs at different activity levels */
      var lightCals = Math.round(bmr * 1.375);
      var moderateCals = Math.round(bmr * 1.55);
      var activeCals = Math.round(bmr * 1.725);

      /* Display results */
      setText('bmr-value', bmr.toLocaleString() + ' cal/day');
      setText('bmr-light', lightCals.toLocaleString() + ' cal/day');
      setText('bmr-moderate', moderateCals.toLocaleString() + ' cal/day');
      setText('bmr-active', activeCals.toLocaleString() + ' cal/day');

      showCard('bmr-result');

      if (window.showToast) {
        window.showToast('BMR calculated');
      }
    });
  }  /* ========================================
     3. WATER INTAKE CALCULATOR
     
     FORMULA:
     Base intake = weight(kg) × 0.033 liters
     
     Then adjusted by activity level:
     - Sedentary:  base × 1.0
     - Light:      base × 1.2
     - Moderate:   base × 1.4
     - Very Active: base × 1.6
     
     WHY:
     Most people are chronically dehydrated
     and don't know it. This gives a
     personalized daily water target based
     on body weight and how much you move.
     
     The 0.033 multiplier comes from the
     general medical recommendation of
     roughly 33ml of water per kg of body
     weight per day.
  ======================================== */
  var waterCalcBtn = document.getElementById('water-calc-btn');

  if (waterCalcBtn) {
    waterCalcBtn.addEventListener('click', function() {
      var weight = getVal('water-weight');
      var activitySelect = document.getElementById('water-activity');

      /* Validate */
      if (isNaN(weight)) {
        if (window.showToast) {
          window.showToast('Please enter your weight');
        }
        return;
      }

      if (weight <= 0) {
        if (window.showToast) {
          window.showToast('Weight must be positive');
        }
        return;
      }

      if (weight < 10 || weight > 500) {
        if (window.showToast) {
          window.showToast('Weight seems unrealistic');
        }
        return;
      }

      /* Base water intake */
      var baseIntake = weight * 0.033;

      /* Adjust for activity level */
      var activityMultiplier = 1.0;
      if (activitySelect) {
        switch(activitySelect.value) {
          case 'sedentary':
            activityMultiplier = 1.0;
            break;
          case 'light':
            activityMultiplier = 1.2;
            break;
          case 'moderate':
            activityMultiplier = 1.4;
            break;
          case 'active':
            activityMultiplier = 1.6;
            break;
          default:
            activityMultiplier = 1.0;
        }
      }

      var totalLiters = baseIntake * activityMultiplier;
      totalLiters = parseFloat(totalLiters.toFixed(2));

      /* Calculate glasses (1 glass = 250ml) */
      var glasses = Math.round((totalLiters * 1000) / 250);

      /* Display results */
      setText('water-liters', totalLiters + ' liters');
      setText('water-glasses', glasses + ' glasses');

      showCard('water-result');

      if (window.showToast) {
        window.showToast('Stay hydrated! 💧');
      }
    });
  }

  /* ========================================
     4. CALORIE BURN CALCULATOR
     
     FORMULA:
     Calories = MET × weight(kg) × duration(hours)
     
     MET (Metabolic Equivalent of Task):
     A standardized way to measure exercise
     intensity. Walking = 3.5, Running = 8.0,
     etc. Higher MET = more intense = more
     calories burned.
     
     These MET values come from the
     "Compendium of Physical Activities"
     published by the American College of
     Sports Medicine.
  ======================================== */
  var calCalcBtn = document.getElementById('cal-calc-btn');

  /* MET values for each exercise type */
  var metValues = {
    'walking':  3.5,
    'running':  8.0,
    'cycling':  6.0,
    'swimming': 7.0,
    'gym':      5.0,
    'yoga':     2.5
  };

  if (calCalcBtn) {
    calCalcBtn.addEventListener('click', function() {
      var exerciseSelect = document.getElementById('cal-exercise');
      var duration = getVal('cal-duration');
      var weight = getVal('cal-weight');

      /* Validate */
      if (!exerciseSelect || isNaN(duration) || isNaN(weight)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (duration <= 0 || weight <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      /* Get MET value for selected exercise */
      var exerciseType = exerciseSelect.value;
      var met = metValues[exerciseType] || 3.5;

      /* Convert duration from minutes to hours */
      var durationHours = duration / 60;

      /* Calculate calories burned */
      var caloriesBurned = met * weight * durationHours;
      caloriesBurned = Math.round(caloriesBurned);

      /* Display results */
      setText('cal-burned', caloriesBurned.toLocaleString() + ' calories');

      /* Add exercise context */
      var calBurnedEl = document.getElementById('cal-burned');
      if (calBurnedEl) {
        var exerciseName = exerciseSelect.options[exerciseSelect.selectedIndex].text;
        calBurnedEl.textContent = caloriesBurned.toLocaleString() + ' cal';
      }

      showCard('cal-result');

      if (window.showToast) {
        var exerciseName2 = exerciseSelect.options[exerciseSelect.selectedIndex].text;
        window.showToast(exerciseName2 + ': ' + caloriesBurned + ' cal burned 🔥');
      }
    });
  }

  /* ========================================
     ENTER KEY SUPPORT FOR ALL HEALTH INPUTS
     
     Pressing Enter in any input field
     triggers the calculate button for
     that particular health calculator.
  ======================================== */
  var healthInputPairs = [
    { inputs: ['bmi-weight', 'bmi-height'], btn: 'bmi-calc-btn' },
    { inputs: ['bmr-age', 'bmr-weight', 'bmr-height'], btn: 'bmr-calc-btn' },
    { inputs: ['water-weight'], btn: 'water-calc-btn' },
    { inputs: ['cal-duration', 'cal-weight'], btn: 'cal-calc-btn' }
  ];

  healthInputPairs.forEach(function(pair) {
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
     PREVENT INVALID INPUT
     
     Blocks 'e' key and negative sign on
     all number inputs in health mode.
     You can't have negative weight or
     negative height.
  ======================================== */
  var allHealthInputs = document.querySelectorAll(
    '#mode-health input[type="number"]'
  );

  allHealthInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'e' || e.key === 'E' || e.key === '-') {
        e.preventDefault();
      }
    });
  });

  /* ========================================
     SELECT ALL ON FOCUS
  ======================================== */
  allHealthInputs.forEach(function(input) {
    input.addEventListener('focus', function() {
      var self = this;
      setTimeout(function() {
        self.select();
      }, 50);
    });
  });

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
