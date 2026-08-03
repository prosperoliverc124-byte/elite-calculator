/* ============================================
   ELITE CALCULATOR — GRADE & GPA MODE
   
   Handles 2 academic calculators:
   1. GPA Calculator (add courses, get GPA)
   2. Grade Needed Calculator
   
   Built specifically for Gen Z students
   who need to track their academic
   performance and plan their grades.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     HELPERS
  ======================================== */
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showCard(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function getVal(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    return parseFloat(el.value);
  }

  /* ========================================
     1. GPA CALCULATOR
     
     HOW GPA WORKS:
     GPA = Total Quality Points / Total Credits
     
     Quality Points = Grade Value × Credits
     
     Grade Values (Standard 4.0 Scale):
     A  = 4.0    B+ = 3.3    C+ = 2.3    D+ = 1.3
     A- = 3.7    B  = 3.0    C  = 2.0    D  = 1.0
                 B- = 2.7    C- = 1.7    F  = 0.0
     
     EXAMPLE:
     Course: Math     Grade: A (4.0)  Credits: 3
     Course: English  Grade: B (3.0)  Credits: 3
     
     Quality Points = (4.0 × 3) + (3.0 × 3) = 12 + 9 = 21
     Total Credits = 3 + 3 = 6
     GPA = 21 / 6 = 3.5
     
     WHY:
     GPA determines scholarships, graduate
     school admission, and job opportunities.
     Knowing your exact GPA helps you plan
     which grades you need in future courses
     to reach your target.
  ======================================== */

  /* ---- ADD COURSE ROW ----
     When user clicks "Add Course", we create
     a new row with name, grade, and credits */
  var gpaAddBtn = document.getElementById('gpa-add-btn');
  var gpaCoursesContainer = document.getElementById('gpa-courses');

  if (gpaAddBtn && gpaCoursesContainer) {
    gpaAddBtn.addEventListener('click', function() {

      var newRow = document.createElement('div');
      newRow.className = 'gpa-row';

      newRow.innerHTML = ''
        + '<input type="text" class="form-input gpa-name" placeholder="Course name" />'
        + '<select class="form-input gpa-grade">'
        +   '<option value="4.0">A</option>'
        +   '<option value="3.7">A-</option>'
        +   '<option value="3.3">B+</option>'
        +   '<option value="3.0">B</option>'
        +   '<option value="2.7">B-</option>'
        +   '<option value="2.3">C+</option>'
        +   '<option value="2.0">C</option>'
        +   '<option value="1.7">C-</option>'
        +   '<option value="1.3">D+</option>'
        +   '<option value="1.0">D</option>'
        +   '<option value="0.0">F</option>'
        + '</select>'
        + '<input type="number" class="form-input gpa-credits" placeholder="Credits" value="3" />';

      gpaCoursesContainer.appendChild(newRow);

      /* Re-initialize lucide icons for new row */
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      /* Focus the new course name input */
      var newNameInput = newRow.querySelector('.gpa-name');
      if (newNameInput) {
        newNameInput.focus();
      }

      if (window.showToast) {
        window.showToast('Course added');
      }
    });
  }

  /* ---- CALCULATE GPA ---- */
  var gpaCalcBtn = document.getElementById('gpa-calc-btn');

  if (gpaCalcBtn) {
    gpaCalcBtn.addEventListener('click', function() {

      var rows = document.querySelectorAll('#gpa-courses .gpa-row');

      if (rows.length === 0) {
        if (window.showToast) {
          window.showToast('Add at least one course');
        }
        return;
      }

      var totalQualityPoints = 0;
      var totalCredits = 0;
      var validCourses = 0;

      rows.forEach(function(row) {
        var gradeSelect = row.querySelector('.gpa-grade');
        var creditsInput = row.querySelector('.gpa-credits');

        if (!gradeSelect || !creditsInput) return;

        var gradeValue = parseFloat(gradeSelect.value);
        var credits = parseFloat(creditsInput.value);

        /* Skip rows with invalid credits */
        if (isNaN(credits) || credits <= 0) return;

        /* Calculate quality points for this course */
        var qualityPoints = gradeValue * credits;

        totalQualityPoints += qualityPoints;
        totalCredits += credits;
        validCourses++;
      });

      /* Validate we have at least one valid course */
      if (validCourses === 0 || totalCredits === 0) {
        if (window.showToast) {
          window.showToast('Enter valid credits for at least one course');
        }
        return;
      }

      /* Calculate GPA */
      var gpa = totalQualityPoints / totalCredits;
      gpa = parseFloat(gpa.toFixed(2));

      /* Determine GPA quality description */
      var gpaDescription;
      var gpaColor;

      if (gpa >= 3.7) {
        gpaDescription = "Dean's List 🌟";
        gpaColor = '#00FF88';
      } else if (gpa >= 3.3) {
        gpaDescription = 'Excellent';
        gpaColor = '#00FF88';
      } else if (gpa >= 3.0) {
        gpaDescription = 'Good';
        gpaColor = '#00D4FF';
      } else if (gpa >= 2.5) {
        gpaDescription = 'Above Average';
        gpaColor = '#00D4FF';
      } else if (gpa >= 2.0) {
        gpaDescription = 'Average';
        gpaColor = '#FFB800';
      } else if (gpa >= 1.0) {
        gpaDescription = 'Below Average';
        gpaColor = '#FFB800';
      } else {
        gpaDescription = 'Failing';
        gpaColor = '#FF4444';
      }

      /* Display results */
      var gpaText = gpa.toFixed(2) + ' / 4.0 — ' + gpaDescription;
      setText('gpa-value', gpaText);
      setText('gpa-credits-total', totalCredits + ' credits (' + validCourses + ' courses)');

      /* Color the GPA */
      var gpaValueEl = document.getElementById('gpa-value');
      if (gpaValueEl) {
        gpaValueEl.style.color = gpaColor;
      }

      showCard('gpa-result');

      if (window.showToast) {
        window.showToast('GPA: ' + gpa.toFixed(2));
      }
    });
  }

  /* ========================================
     2. GRADE NEEDED CALCULATOR
     
     FORMULA:
     Needed = (Target - Current × CurrentWeight)
              / RemainingWeight
     
     WHERE:
     Target = the final grade you want (e.g. 80%)
     Current = your grade so far (e.g. 72%)
     CurrentWeight = how much of the course
       is already graded (e.g. 60%)
     RemainingWeight = 100% - CurrentWeight
     
     EXAMPLE:
     You have 72% on work worth 60% of the course.
     You want a final grade of 80%.
     
     Remaining weight = 100% - 60% = 40%
     Needed = (80 - 72 × 0.6) / 0.4
     Needed = (80 - 43.2) / 0.4
     Needed = 36.8 / 0.4
     Needed = 92%
     
     You need 92% on remaining work.
     
     WHY:
     Every student asks "what do I need on
     the final to pass?" This answers it
     with exact math instead of guessing.
  ======================================== */
  var neededCalcBtn = document.getElementById('needed-calc-btn');

  if (neededCalcBtn) {
    neededCalcBtn.addEventListener('click', function() {
      var current = getVal('needed-current');
      var weight = getVal('needed-weight');
      var target = getVal('needed-target');

      /* Validate */
      if (isNaN(current) || isNaN(weight) || isNaN(target)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (current < 0 || current > 100) {
        if (window.showToast) {
          window.showToast('Current grade must be 0-100%');
        }
        return;
      }

      if (weight <= 0 || weight >= 100) {
        if (window.showToast) {
          window.showToast('Weight must be between 1-99%');
        }
        return;
      }

      if (target < 0 || target > 100) {
        if (window.showToast) {
          window.showToast('Target grade must be 0-100%');
        }
        return;
      }

      /* Calculate needed grade */
      var remainingWeight = (100 - weight) / 100;
      var currentWeightDecimal = weight / 100;
      var currentContribution = current * currentWeightDecimal;
      var needed = (target - currentContribution) / remainingWeight;

      /* Round to 1 decimal */
      needed = parseFloat(needed.toFixed(1));

      /* Determine feasibility */
      var neededText;
      var neededColor;

      if (needed > 100) {
        neededText = needed + '% — Not achievable 😔';
        neededColor = '#FF4444';
      } else if (needed < 0) {
        neededText = "0% — You've already passed! 🎉";
        neededColor = '#00FF88';
      } else if (needed > 90) {
        neededText = needed + '% — Very challenging 💪';
        neededColor = '#FFB800';
      } else if (needed > 70) {
        neededText = needed + '% — Achievable 👍';
        neededColor = '#00D4FF';
      } else {
        neededText = needed + '% — Very doable ✓';
        neededColor = '#00FF88';
      }

      /* Display results */
      setText('needed-score', neededText);

      /* Color the result */
      var neededScoreEl = document.getElementById('needed-score');
      if (neededScoreEl) {
        neededScoreEl.style.color = neededColor;
      }

      /* Show remaining weight info */
      var remainingPercent = (100 - weight).toFixed(0);
      setText('needed-remaining', remainingPercent + '% of course remaining');

      showCard('needed-result');

      if (window.showToast) {
        if (needed <= 0) {
          window.showToast("You've already passed! 🎉");
        } else if (needed > 100) {
          window.showToast('Target not achievable 😔');
        } else {
          window.showToast('You need ' + needed + '%');
        }
      }
    });
  }

  /* ========================================
     ENTER KEY SUPPORT
  ======================================== */
  var gradeInputPairs = [
    { inputs: ['needed-current', 'needed-weight', 'needed-target'], btn: 'needed-calc-btn' }
  ];

  gradeInputPairs.forEach(function(pair) {
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
     ENTER KEY IN GPA COURSE ROWS
     
     WHY: When user presses Enter in any
     GPA course input, calculate GPA
     automatically.
  ======================================== */
  if (gpaCoursesContainer) {
    gpaCoursesContainer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var calcBtn = document.getElementById('gpa-calc-btn');
        if (calcBtn) calcBtn.click();
      }
    });
  }

  /* ========================================
     PREVENT INVALID INPUT
  ======================================== */
  var allGradeInputs = document.querySelectorAll(
    '#mode-grade input[type="number"]'
  );

  allGradeInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    });
  });

  /* ========================================
     SELECT ALL ON FOCUS
  ======================================== */
  allGradeInputs.forEach(function(input) {
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
