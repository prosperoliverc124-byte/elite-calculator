/* ============================================
   ELITE CALCULATOR — SCIENTIFIC MODE
   
   Handles: trigonometry (sin, cos, tan),
   logarithms (log, ln), powers (x², x³, xⁿ),
   square root, factorial, absolute value,
   constants (π, e), parentheses, and full
   arithmetic within scientific mode.
   
   The scientific calculator works independently
   from the standard calculator. It has its own
   display, its own state, and its own buttons.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     SCIENTIFIC CALCULATOR STATE
     
     We store everything the user types as
     a string expression. When they press
     equals, we evaluate the full expression.
     
     Example: user types "sin(45) + 2 × 3"
     We build that string, then calculate it.
  ======================================== */
  var sciExpression = '';
  var sciLastResult = '';

  /* Display elements */
  var sciResultDisplay = document.getElementById('sci-result');
  var sciExpressionDisplay = document.getElementById('sci-expression');
  var sciHistoryDisplay = document.getElementById('sci-history');

  /* ========================================
     UPDATE SCIENTIFIC DISPLAY
     
     Shows the current expression being built
     and the result after calculation.
  ======================================== */
  function updateSciDisplay() {
    if (!sciResultDisplay) return;

    if (sciExpression === '') {
      sciResultDisplay.textContent = '0';
    } else {
      sciResultDisplay.textContent = sciExpression;
    }

    /* Adjust font size for long expressions */
    sciResultDisplay.classList.remove('small', 'tiny');
    if (sciExpression.length > 14) {
      sciResultDisplay.classList.add('tiny');
    } else if (sciExpression.length > 9) {
      sciResultDisplay.classList.add('small');
    }
  }

  /* ========================================
     SCIENTIFIC FUNCTIONS
     
     Each function takes a number and returns
     the mathematical result. We use these
     when evaluating the expression.
  ======================================== */

  /* ---- FACTORIAL ----
     5! = 5 × 4 × 3 × 2 × 1 = 120
     Only works with positive whole numbers */
  function factorial(n) {
    n = Math.round(n);

    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;

    var result = 1;
    for (var i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  /* ---- SAFE EVALUATE ----
     Evaluates a mathematical expression string.
     
     WHY not just use eval()?
     eval() is dangerous because it can run
     any JavaScript code, not just math.
     But for a calculator with controlled input,
     we sanitize the expression first to make
     it safe, then evaluate it.
     
     We replace our display symbols with
     actual JavaScript math operations. */
  function safeEvaluate(expr) {
    try {
      /* Replace display symbols with JS math */
      var processed = expr;

      /* Handle factorial first (before other replacements)
         Find patterns like "5!" and replace with factorial(5) */
      processed = processed.replace(
        /(\d+\.?\d*)!/g,
        'factorial($1)'
      );

      /* Replace trig functions
         We convert degrees to radians because
         JavaScript's Math.sin expects radians
         but most humans think in degrees */
      processed = processed.replace(
        /sin\(([^)]+)\)/g,
        'Math.sin(($1) * Math.PI / 180)'
      );

      processed = processed.replace(
        /cos\(([^)]+)\)/g,
        'Math.cos(($1) * Math.PI / 180)'
      );

      processed = processed.replace(
        /tan\(([^)]+)\)/g,
        'Math.tan(($1) * Math.PI / 180)'
      );

      /* Replace logarithms */
      processed = processed.replace(/log\(/g, 'Math.log10(');
      processed = processed.replace(/ln\(/g, 'Math.log(');

      /* Replace square root */
      processed = processed.replace(/√\(/g, 'Math.sqrt(');

      /* Replace absolute value */
      processed = processed.replace(/abs\(/g, 'Math.abs(');

      /* Replace constants */
      processed = processed.replace(/π/g, 'Math.PI');
      processed = processed.replace(/e(?![a-zA-Z])/g, 'Math.E');

      /* Replace × and ÷ with JS operators */
      processed = processed.replace(/×/g, '*');
      processed = processed.replace(/÷/g, '/');

      /* Replace power notation x^ with Math.pow */
      processed = processed.replace(
        /(\d+\.?\d*)\^(\d+\.?\d*)/g,
        'Math.pow($1,$2)'
      );

      /* Make factorial function available */
      var factorialFunc = factorial;

      /* Create a safe evaluation function */
      var calcFunction = new Function(
        'Math', 'factorial',
        'return (' + processed + ');'
      );

      var result = calcFunction(Math, factorialFunc);

      /* Check for valid result */
      if (typeof result !== 'number' || isNaN(result)) {
        return 'Error';
      }

      if (!isFinite(result)) {
        return 'Infinity';
      }

      /* Round to avoid floating point noise */
      result = parseFloat(result.toPrecision(12));

      return result.toString();

    } catch (error) {
      return 'Error';
    }
  }  /* ========================================
     HANDLE SCIENTIFIC BUTTON CLICKS
     
     WHY: Every button in scientific mode
     adds something to the expression string.
     Numbers add digits. Functions add their
     name with an opening parenthesis.
     Operators add math symbols.
  ======================================== */
  var scientificMode = document.getElementById('mode-scientific');

  if (scientificMode) {
    scientificMode.addEventListener('click', function(e) {
      var button = e.target.closest('.calc-btn');
      if (!button) return;

      /* Add click animation */
      button.style.transform = 'scale(0.93)';
      setTimeout(function() {
        button.style.transform = '';
      }, 100);

      var action = button.getAttribute('data-action');
      var value = button.getAttribute('data-value');

      /* ---- SCIENTIFIC FUNCTION BUTTONS ---- */
      if (action === 'sci') {
        handleSciFunction(value);
        return;
      }

      /* ---- NUMBER BUTTONS ---- */
      if (action === 'sci-num') {
        /* Prevent multiple decimals in current number */
        if (value === '.') {
          var lastNum = sciExpression.match(/[\d.]+$/);
          if (lastNum && lastNum[0].includes('.')) return;
        }
        sciExpression += value;
        updateSciDisplay();
        return;
      }

      /* ---- OPERATOR BUTTONS ---- */
      if (action === 'sci-op') {
        var opSymbol;
        switch(value) {
          case '*': opSymbol = '×'; break;
          case '/': opSymbol = '÷'; break;
          case '+': opSymbol = '+'; break;
          case '-': opSymbol = '-'; break;
          default: opSymbol = value;
        }

        /* Prevent double operators */
        var lastChar = sciExpression.slice(-1);
        if ('×÷+-'.includes(lastChar)) {
          sciExpression = sciExpression.slice(0, -1);
        }

        sciExpression += opSymbol;
        updateSciDisplay();
        return;
      }

      /* ---- EQUALS ---- */
      if (action === 'sci-equals') {
        if (sciExpression === '') return;

        var result = safeEvaluate(sciExpression);

        /* Show expression in history */
        if (sciHistoryDisplay) {
          sciHistoryDisplay.textContent = sciExpression + ' =';
        }

        /* Show result */
        sciLastResult = result;
        sciExpression = result;

        if (sciResultDisplay) {
          sciResultDisplay.textContent = formatSciResult(result);

          sciResultDisplay.classList.remove('small', 'tiny');
          if (result.length > 14) {
            sciResultDisplay.classList.add('tiny');
          } else if (result.length > 9) {
            sciResultDisplay.classList.add('small');
          }
        }

        if (sciExpressionDisplay) {
          sciExpressionDisplay.textContent = '';
        }

        return;
      }

      /* ---- CLEAR ---- */
      if (action === 'sci-clear') {
        sciExpression = '';
        sciLastResult = '';

        if (sciResultDisplay) {
          sciResultDisplay.textContent = '0';
          sciResultDisplay.classList.remove('small', 'tiny');
        }
        if (sciExpressionDisplay) {
          sciExpressionDisplay.textContent = '';
        }
        if (sciHistoryDisplay) {
          sciHistoryDisplay.textContent = '';
        }
        return;
      }

      /* ---- BACKSPACE ---- */
      if (action === 'sci-backspace') {
        if (sciExpression.length > 0) {
          /* Check if last part is a function name
             like "sin(" — remove the whole thing */
          var funcMatch = sciExpression.match(
            /(sin|cos|tan|log|ln|abs|√)\($/
          );

          if (funcMatch) {
            sciExpression = sciExpression.slice(
              0, -(funcMatch[0].length)
            );
          } else {
            sciExpression = sciExpression.slice(0, -1);
          }

          updateSciDisplay();
        }
        return;
      }

      /* ---- PERCENT ---- */
      if (action === 'sci-percent') {
        if (sciExpression === '') return;

        var numMatch = sciExpression.match(/[\d.]+$/);
        if (numMatch) {
          var num = parseFloat(numMatch[0]);
          var percentVal = (num / 100).toString();
          sciExpression = sciExpression.slice(
            0, -numMatch[0].length
          ) + percentVal;
          updateSciDisplay();
        }
        return;
      }
    });
  }

  /* ========================================
     HANDLE SCIENTIFIC FUNCTIONS
     
     Each function adds its notation to the
     expression string. Some add text with
     an opening parenthesis (like "sin(").
     Others insert a value (like π = 3.14159).
  ======================================== */
  function handleSciFunction(value) {
    switch(value) {
      /* Trig functions — add function name + ( */
      case 'sin':
        sciExpression += 'sin(';
        break;
      case 'cos':
        sciExpression += 'cos(';
        break;
      case 'tan':
        sciExpression += 'tan(';
        break;

      /* Logarithms */
      case 'log':
        sciExpression += 'log(';
        break;
      case 'ln':
        sciExpression += 'ln(';
        break;

      /* Square root */
      case 'sqrt':
        sciExpression += '√(';
        break;

      /* Powers */
      case 'pow':
        /* x² — square the last number */
        var lastNum = sciExpression.match(/[\d.]+$/);
        if (lastNum) {
          sciExpression += '^2';
        }
        break;

      case 'cube':
        /* x³ — cube the last number */
        var lastNumCube = sciExpression.match(/[\d.]+$/);
        if (lastNumCube) {
          sciExpression += '^3';
        }
        break;

      case 'pow-n':
        /* xⁿ — custom power */
        sciExpression += '^';
        break;

      /* Constants */
      case 'pi':
        sciExpression += 'π';
        break;
      case 'e':
        sciExpression += 'e';
        break;

      /* Parentheses */
      case '(':
        sciExpression += '(';
        break;
      case ')':
        sciExpression += ')';
        break;

      /* Factorial */
      case 'fact':
        var lastNumFact = sciExpression.match(/[\d.]+$/);
        if (lastNumFact) {
          sciExpression += '!';
        }
        break;

      /* Absolute value */
      case 'abs':
        sciExpression += 'abs(';
        break;

      default:
        break;
    }

    updateSciDisplay();
  }

  /* ========================================
     FORMAT SCIENTIFIC RESULT
     
     Makes the result more readable by
     adding commas and limiting decimals.
  ======================================== */
  function formatSciResult(result) {
    if (result === 'Error' || result === 'Infinity') {
      return result;
    }

    var num = parseFloat(result);

    /* Very large or very small numbers
       get shown in scientific notation */
    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 0.0001 && num !== 0)) {
      return num.toExponential(6);
    }

    /* Regular numbers get formatted nicely */
    var str = num.toString();
    var parts = str.split('.');
    var intPart = parts[0];
    var decPart = parts.length > 1 ? '.' + parts[1] : '';

    /* Add commas */
    var isNeg = intPart.startsWith('-');
    var absInt = isNeg ? intPart.slice(1) : intPart;
    var withCommas = absInt.replace(
      /\B(?=(\d{3})+(?!\d))/g, ','
    );

    return (isNeg ? '-' : '') + withCommas + decPart;
  }

  /* ========================================
     KEYBOARD SUPPORT FOR SCIENTIFIC MODE
     
     Desktop users can type expressions
     directly using their keyboard.
  ======================================== */
  document.addEventListener('keydown', function(e) {
    var sciPanel = document.getElementById('mode-scientific');
    if (!sciPanel || !sciPanel.classList.contains('active')) return;

    var key = e.key;

    /* Numbers and decimal */
    if (/^[0-9.]$/.test(key)) {
      e.preventDefault();
      sciExpression += key;
      updateSciDisplay();
      return;
    }

    /* Operators */
    if (key === '+') {
      e.preventDefault();
      sciExpression += '+';
      updateSciDisplay();
      return;
    }
    if (key === '-') {
      e.preventDefault();
      sciExpression += '-';
      updateSciDisplay();
      return;
    }
    if (key === '*') {
      e.preventDefault();
      sciExpression += '×';
      updateSciDisplay();
      return;
    }
    if (key === '/') {
      e.preventDefault();
      sciExpression += '÷';
      updateSciDisplay();
      return;
    }

    /* Parentheses */
    if (key === '(' || key === ')') {
      e.preventDefault();
      sciExpression += key;
      updateSciDisplay();
      return;
    }

    /* Power */
    if (key === '^') {
      e.preventDefault();
      sciExpression += '^';
      updateSciDisplay();
      return;
    }

    /* Factorial */
    if (key === '!') {
      e.preventDefault();
      sciExpression += '!';
      updateSciDisplay();
      return;
    }

    /* Equals / Enter */
    if (key === '=' || key === 'Enter') {
      e.preventDefault();
      /* Trigger equals click */
      var eqBtn = document.querySelector(
        '[data-action="sci-equals"]'
      );
      if (eqBtn) eqBtn.click();
      return;
    }

    /* Backspace */
    if (key === 'Backspace') {
      e.preventDefault();
      var backBtn = document.querySelector(
        '[data-action="sci-backspace"]'
      );
      if (backBtn) backBtn.click();
      return;
    }

    /* Escape = Clear */
    if (key === 'Escape') {
      e.preventDefault();
      var clearBtn = document.querySelector(
        '[data-action="sci-clear"]'
      );
      if (clearBtn) clearBtn.click();
      return;
    }
  });

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
