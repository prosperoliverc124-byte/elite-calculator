/* ============================================
   ELITE CALCULATOR — MAIN APP LOGIC
   Handles: loading screen, mode switching,
   standard calculator, info modal, toast
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     1. INITIALIZE LUCIDE ICONS
  ======================================== */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

    /* Loading screen is handled by inline
     script in app.html — no code needed here */
  /* ========================================
     3. MODE SWITCHING
     
     WHY: We have 10 calculator modes but
     only one should be visible at a time.
     When a tab is clicked, we hide the
     current mode and show the selected one.
  ======================================== */
  var modeTabs = document.querySelectorAll('.mode-tab');
  var calcModes = document.querySelectorAll('.calc-mode');

  modeTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var selectedMode = this.getAttribute('data-mode');

      /* Remove active from all tabs */
      modeTabs.forEach(function(t) {
        t.classList.remove('active');
      });

      /* Add active to clicked tab */
      this.classList.add('active');

      /* Hide all mode panels */
      calcModes.forEach(function(mode) {
        mode.classList.remove('active');
      });

      /* Show selected mode panel */
      var targetMode = document.getElementById('mode-' + selectedMode);
      if (targetMode) {
        targetMode.classList.add('active');
      }

      /* Scroll the active tab into view */
      this.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });

      /* Re-initialize icons for new mode */
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      /* Show toast notification */
      showToast('Switched to ' + this.querySelector('span').textContent);
    });
  });

  /* ========================================
     4. INFO MODAL
     
     WHY: The info button in the top right
     opens a popup with details about the app.
  ======================================== */
  var infoBtn = document.getElementById('info-btn');
  var infoModal = document.getElementById('info-modal');
  var infoClose = document.getElementById('info-close');

  if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', function() {
      infoModal.classList.add('open');
    });
  }

  if (infoClose && infoModal) {
    infoClose.addEventListener('click', function() {
      infoModal.classList.remove('open');
    });
  }

  /* Close modal when clicking overlay background */
  if (infoModal) {
    infoModal.addEventListener('click', function(e) {
      if (e.target === infoModal) {
        infoModal.classList.remove('open');
      }
    });
  }

  /* ========================================
     5. TOAST NOTIFICATION
     
     WHY: When user switches modes or does
     an action, a small notification pops up
     briefly at the bottom of the screen.
  ======================================== */
  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toast-text');
  var toastTimeout;

  function showToast(message) {
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      toast.classList.remove('show');
    }, 2000);
  }

  /* Make showToast available globally so
     other JS files can use it */
  window.showToast = showToast;

  /* ========================================
     6. STANDARD CALCULATOR ENGINE
     
     WHY: This is the core calculator logic.
     It tracks what the user types, handles
     operators, calculates results, and
     updates the display.
     
     HOW: We store the current number being
     typed, the previous number, and the
     selected operator. When equals is pressed
     we combine them.
  ======================================== */

  /* Calculator State */
  var currentInput = '0';
  var previousInput = '';
  var operator = null;
  var shouldResetScreen = false;
  var lastExpression = '';

  /* Display Elements */
  var displayResult = document.getElementById('calc-result');
  var displayExpression = document.getElementById('calc-expression');
  var displayHistory = document.getElementById('calc-history');

  /* ---- UPDATE DISPLAY ---- */
  function updateDisplay() {
    if (!displayResult) return;

    /* Format number with commas for readability */
    var formatted = formatNumber(currentInput);
    displayResult.textContent = formatted;

    /* Adjust font size based on length */
    displayResult.classList.remove('small', 'tiny');
    if (formatted.length > 12) {
      displayResult.classList.add('tiny');
    } else if (formatted.length > 8) {
      displayResult.classList.add('small');
    }
  }

  /* ---- FORMAT NUMBER ---- */
  function formatNumber(numStr) {
    if (numStr === 'Error' || numStr === 'Infinity' || numStr === '-Infinity') {
      return 'Error';
    }

    /* Handle negative numbers */
    var isNegative = numStr.startsWith('-');
    var cleanNum = isNegative ? numStr.slice(1) : numStr;

    /* Split integer and decimal parts */
    var parts = cleanNum.split('.');
    var intPart = parts[0];
    var decPart = parts.length > 1 ? '.' + parts[1] : '';

    /* Add commas to integer part */
    var withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (isNegative ? '-' : '') + withCommas + decPart;
  }

  /* ---- HANDLE NUMBER INPUT ---- */
  function inputNumber(value) {
    if (shouldResetScreen) {
      currentInput = value;
      shouldResetScreen = false;
    } else {
      /* Prevent multiple leading zeros */
      if (currentInput === '0' && value !== '.') {
        currentInput = value;
      } else {
        /* Prevent multiple decimals */
        if (value === '.' && currentInput.includes('.')) return;

        /* Limit input length */
        if (currentInput.length >= 15) return;

        currentInput = currentInput + value;
      }
    }

    updateDisplay();
    }  /* ---- HANDLE OPERATOR ---- */
  function inputOperator(op) {
    /* If there's a pending operation, calculate it first */
    if (operator !== null && !shouldResetScreen) {
      calculate();
    }

    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;

    /* Show expression on screen */
    var opSymbol = getOperatorSymbol(op);
    if (displayExpression) {
      displayExpression.textContent = formatNumber(previousInput) + ' ' + opSymbol;
    }

    /* Highlight the active operator button */
    highlightOperator(op);
  }

  /* ---- GET OPERATOR SYMBOL ---- */
  function getOperatorSymbol(op) {
    switch(op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  }

  /* ---- HIGHLIGHT ACTIVE OPERATOR ---- */
  function highlightOperator(op) {
    /* Remove highlight from all operator buttons */
    var opButtons = document.querySelectorAll(
      '#mode-standard .calc-btn.operator'
    );

    opButtons.forEach(function(btn) {
      btn.classList.remove('active-op');
    });

    /* Add highlight to the selected one */
    opButtons.forEach(function(btn) {
      if (btn.getAttribute('data-value') === op) {
        btn.classList.add('active-op');
      }
    });
  }

  /* ---- CLEAR OPERATOR HIGHLIGHT ---- */
  function clearOperatorHighlight() {
    var opButtons = document.querySelectorAll(
      '#mode-standard .calc-btn.operator'
    );

    opButtons.forEach(function(btn) {
      btn.classList.remove('active-op');
    });
  }

  /* ---- CALCULATE RESULT ---- */
  function calculate() {
    if (operator === null || previousInput === '') return;

    var prev = parseFloat(previousInput);
    var curr = parseFloat(currentInput);
    var result;

    switch(operator) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '*':
        result = prev * curr;
        break;
      case '/':
        if (curr === 0) {
          result = 'Error';
        } else {
          result = prev / curr;
        }
        break;
      default:
        return;
    }

    /* Build expression string for history */
    var opSymbol = getOperatorSymbol(operator);
    lastExpression = formatNumber(previousInput) + ' ' + opSymbol + ' ' + formatNumber(currentInput);

    /* Show expression in history */
    if (displayHistory) {
      displayHistory.textContent = lastExpression;
    }

    /* Handle the result */
    if (result === 'Error') {
      currentInput = 'Error';
    } else {
      /* Round to avoid floating point errors
         like 0.1 + 0.2 = 0.30000000004 */
      result = parseFloat(result.toPrecision(12));
      currentInput = result.toString();
    }

    /* Clear expression line */
    if (displayExpression) {
      displayExpression.textContent = '';
    }

    operator = null;
    previousInput = '';
    shouldResetScreen = true;

    clearOperatorHighlight();
    updateDisplay();
  }

  /* ---- CLEAR (AC) ---- */
  function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    lastExpression = '';

    if (displayExpression) {
      displayExpression.textContent = '';
    }

    if (displayHistory) {
      displayHistory.textContent = '';
    }

    clearOperatorHighlight();
    updateDisplay();
  }

  /* ---- BACKSPACE ---- */
  function backspace() {
    if (currentInput === 'Error') {
      clearCalculator();
      return;
    }

    if (shouldResetScreen) return;

    if (currentInput.length === 1 || 
        (currentInput.length === 2 && currentInput.startsWith('-'))) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
  }

  /* ---- PERCENT ---- */
  function percent() {
    if (currentInput === 'Error') return;

    var num = parseFloat(currentInput);

    if (operator && previousInput) {
      /* If in middle of operation, calculate
         percent of previous number.
         Example: 200 + 10% = 200 + 20 */
      var prev = parseFloat(previousInput);
      num = prev * (num / 100);
    } else {
      /* Just divide by 100 */
      num = num / 100;
    }

    num = parseFloat(num.toPrecision(12));
    currentInput = num.toString();
    updateDisplay();
  }

  /* ========================================
     7. BUTTON CLICK HANDLERS
     
     WHY: We need to connect each button
     on the calculator to its function.
     Instead of adding click handlers to
     each button individually, we add ONE
     handler to the entire button container
     and check which button was clicked.
     This is called "event delegation".
  ======================================== */
  var standardMode = document.getElementById('mode-standard');

  if (standardMode) {
    standardMode.addEventListener('click', function(e) {
      /* Find the actual button that was clicked */
      var button = e.target.closest('.calc-btn');
      if (!button) return;

      /* Add click animation */
      button.style.transform = 'scale(0.93)';
      setTimeout(function() {
        button.style.transform = '';
      }, 100);

      var action = button.getAttribute('data-action');
      var value = button.getAttribute('data-value');

      /* Route to correct function */
      if (value && !action) {
        /* Number button */
        inputNumber(value);
      } else if (action === 'operator') {
        inputOperator(value);
      } else if (action === 'equals') {
        calculate();
      } else if (action === 'clear') {
        clearCalculator();
      } else if (action === 'backspace') {
        backspace();
      } else if (action === 'percent') {
        percent();
      }
    });
  }

  /* ========================================
     8. KEYBOARD SUPPORT
     
     WHY: Desktop users should be able to
     type numbers and operators on their
     keyboard instead of clicking buttons.
  ======================================== */
  document.addEventListener('keydown', function(e) {
    /* Only work when standard mode is active */
    var standardPanel = document.getElementById('mode-standard');
    if (!standardPanel || !standardPanel.classList.contains('active')) return;

    var key = e.key;

    /* Numbers */
    if (/^[0-9.]$/.test(key)) {
      e.preventDefault();
      inputNumber(key);
      return;
    }

    /* Operators */
    if (key === '+' || key === '-') {
      e.preventDefault();
      inputOperator(key);
      return;
    }

    if (key === '*' || key === 'x' || key === 'X') {
      e.preventDefault();
      inputOperator('*');
      return;
    }

    if (key === '/') {
      e.preventDefault();
      inputOperator('/');
      return;
    }

    /* Equals */
    if (key === '=' || key === 'Enter') {
      e.preventDefault();
      calculate();
      return;
    }

    /* Backspace */
    if (key === 'Backspace') {
      e.preventDefault();
      backspace();
      return;
    }

    /* Clear */
    if (key === 'Escape' || key === 'Delete') {
      e.preventDefault();
      clearCalculator();
      return;
    }

    /* Percent */
    if (key === '%') {
      e.preventDefault();
      percent();
      return;
    }
  });  /* ========================================
     9. SUB-PANEL SWITCHERS
     
     WHY: Finance, Health, DateTime, Everyday,
     Developer, and Grade modes each have
     sub-panels (like Loan, ROI, Tip inside
     Finance). We need to switch between
     these sub-panels when their tab is clicked.
     
     This one function handles ALL of them
     using a reusable pattern.
  ======================================== */

  function setupSubPanelSwitcher(categoryContainerId, dataAttribute, panelPrefix) {
    var container = document.getElementById(categoryContainerId);
    if (!container) return;

    var buttons = container.querySelectorAll('.unit-cat-btn');

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var selected = this.getAttribute(dataAttribute);

        /* Remove active from all buttons in this group */
        buttons.forEach(function(b) {
          b.classList.remove('active');
        });

        /* Add active to clicked button */
        this.classList.add('active');

        /* Hide all panels in this group */
        var allPanels = document.querySelectorAll(
          '[id^="' + panelPrefix + '"]'
        );

        allPanels.forEach(function(panel) {
          panel.classList.remove('active');
        });

        /* Show selected panel */
        var targetPanel = document.getElementById(
          panelPrefix + selected
        );

        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* Initialize all sub-panel switchers */
  setupSubPanelSwitcher('finance-categories', 'data-finance', 'finance-');
  setupSubPanelSwitcher('health-categories', 'data-health', 'health-');
  setupSubPanelSwitcher('datetime-categories', 'data-datetime', 'datetime-');
  setupSubPanelSwitcher('everyday-categories', 'data-everyday', 'everyday-');
  setupSubPanelSwitcher('dev-categories', 'data-dev', 'dev-');
  setupSubPanelSwitcher('grade-categories', 'data-grade', 'grade-');

  /* ========================================
     10. KEYBOARD SHORTCUTS FOR MODE SWITCHING
     
     WHY: Power users can press number keys
     1-9 and 0 while holding Alt to quickly
     switch between calculator modes.
  ======================================== */
  var modeShortcuts = {
    '1': 'standard',
    '2': 'scientific',
    '3': 'currency',
    '4': 'units',
    '5': 'finance',
    '6': 'health',
    '7': 'datetime',
    '8': 'everyday',
    '9': 'developer',
    '0': 'grade'
  };

  document.addEventListener('keydown', function(e) {
    /* Alt + number switches mode */
    if (e.altKey && modeShortcuts[e.key]) {
      e.preventDefault();

      var targetMode = modeShortcuts[e.key];

      /* Find and click the matching tab */
      var targetTab = document.querySelector(
        '.mode-tab[data-mode="' + targetMode + '"]'
      );

      if (targetTab) {
        targetTab.click();
      }
    }

    /* Escape closes info modal */
    if (e.key === 'Escape') {
      var infoModal = document.getElementById('info-modal');
      if (infoModal && infoModal.classList.contains('open')) {
        infoModal.classList.remove('open');
      }
    }
  });

  /* ========================================
     11. PAGE TRANSITION FROM HOME
     
     WHY: When user arrives from landing page,
     the body might have opacity 0 from the
     page transition effect. We reset it.
  ======================================== */
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease';

  /* ========================================
     12. PREVENT DOUBLE TAP ZOOM ON MOBILE
     
     WHY: On mobile, rapid tapping calculator
     buttons can trigger the browser's zoom.
     We prevent this for a smoother experience.
  ======================================== */
  var calcApp = document.getElementById('calc-app');

  if (calcApp) {
    calcApp.addEventListener('touchend', function(e) {
      /* Only prevent on calculator buttons */
      if (e.target.closest('.calc-btn')) {
        e.preventDefault();

        /* Still trigger the click */
        e.target.closest('.calc-btn').click();
      }
    });
  }

  /* ========================================
     13. INITIAL DISPLAY
     Make sure calculator shows 0 on load
  ======================================== */
  updateDisplay();

  /* ========================================
     14. CONSOLE MESSAGE
  ======================================== */
  console.log(
    '%c⚡ Elite Calculator App',
    'color: #00FF88; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%cAll systems operational. 10 modes ready.',
    'color: #A0A0A0; font-size: 11px;'
  );

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
