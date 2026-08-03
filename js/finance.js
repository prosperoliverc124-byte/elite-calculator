/* ============================================
   ELITE CALCULATOR — FINANCE MODE
   
   Handles 6 financial calculators:
   1. Loan/Mortgage Calculator
   2. Compound Interest Calculator
   3. ROI (Return on Investment)
   4. Discount Calculator
   5. Tip Splitter
   6. Tax Calculator
   
   Each calculator takes user input, runs
   the financial formula, and displays
   the result in a clean result card.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     HELPER: FORMAT MONEY
     
     Takes a number and returns it as a
     nice money string with commas and
     2 decimal places.
     
     Example: 12345.6 → "12,345.60"
  ======================================== */
  function formatMoney(num) {
    if (isNaN(num) || !isFinite(num)) return '—';

    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /* ========================================
     HELPER: GET INPUT VALUE
     
     Safely gets a number from an input field.
     Returns NaN if the field is empty or
     contains invalid text.
  ======================================== */
  function getInputValue(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var val = parseFloat(el.value);
    return val;
  }

  /* ========================================
     HELPER: SHOW RESULT CARD
     
     Makes a result card visible with a
     smooth animation. Results are hidden
     by default (style="display:none" in HTML).
  ======================================== */
  function showResult(id) {
    var el = document.getElementById(id);
    if (el) {
      el.style.display = 'flex';
    }
  }

  /* ========================================
     HELPER: SET RESULT TEXT
     
     Puts a value into a result display element.
  ======================================== */
  function setResult(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
  }

  /* ========================================
     1. LOAN / MORTGAGE CALCULATOR
     
     FORMULA (Monthly Payment):
     M = P × [r(1+r)^n] / [(1+r)^n - 1]
     
     WHERE:
     M = monthly payment
     P = principal (loan amount)
     r = monthly interest rate (annual / 12 / 100)
     n = total number of months
     
     WHY this formula:
     This is the standard amortization formula
     used by every bank in the world. It
     calculates equal monthly payments that
     will fully pay off the loan by the end
     of the term.
  ======================================== */
  var loanCalcBtn = document.getElementById('loan-calc-btn');

  if (loanCalcBtn) {
    loanCalcBtn.addEventListener('click', function() {
      var principal = getInputValue('loan-amount');
      var annualRate = getInputValue('loan-rate');
      var months = getInputValue('loan-term');

      /* Validate all inputs */
      if (isNaN(principal) || isNaN(annualRate) || isNaN(months)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (principal <= 0 || annualRate < 0 || months <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      var monthlyPayment;
      var totalPayment;
      var totalInterest;

      if (annualRate === 0) {
        /* Zero interest — simple division */
        monthlyPayment = principal / months;
        totalPayment = principal;
        totalInterest = 0;
      } else {
        /* Monthly interest rate */
        var r = annualRate / 100 / 12;

        /* Calculate monthly payment using formula */
        var rPowN = Math.pow(1 + r, months);
        monthlyPayment = principal * (r * rPowN) / (rPowN - 1);
        totalPayment = monthlyPayment * months;
        totalInterest = totalPayment - principal;
      }

      /* Display results */
      setResult('loan-monthly', '$' + formatMoney(monthlyPayment));
      setResult('loan-total', '$' + formatMoney(totalPayment));
      setResult('loan-interest', '$' + formatMoney(totalInterest));
      showResult('loan-result');

      if (window.showToast) {
        window.showToast('Loan calculated');
      }
    });
  }

  /* ========================================
     2. COMPOUND INTEREST CALCULATOR
     
     FORMULA:
     A = P × (1 + r/n)^(n×t)
     
     WHERE:
     A = final amount
     P = principal (initial investment)
     r = annual interest rate (as decimal)
     n = compounds per year
     t = time in years
     
     WHY compound interest matters:
     It's the difference between your money
     growing slowly and growing explosively.
     Albert Einstein reportedly called it
     "the eighth wonder of the world."
  ======================================== */
  var compCalcBtn = document.getElementById('comp-calc-btn');

  if (compCalcBtn) {
    compCalcBtn.addEventListener('click', function() {
      var principal = getInputValue('comp-principal');
      var annualRate = getInputValue('comp-rate');
      var time = getInputValue('comp-time');
      var frequency = getInputValue('comp-frequency');

      /* Validate */
      if (isNaN(principal) || isNaN(annualRate) || isNaN(time) || isNaN(frequency)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (principal <= 0 || annualRate < 0 || time <= 0 || frequency <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      /* Calculate compound interest */
      var r = annualRate / 100;
      var futureValue = principal * Math.pow(1 + r / frequency, frequency * time);
      var interestEarned = futureValue - principal;

      /* Display results */
      setResult('comp-future', '$' + formatMoney(futureValue));
      setResult('comp-earned', '$' + formatMoney(interestEarned));
      showResult('comp-result');

      if (window.showToast) {
        window.showToast('Compound interest calculated');
      }
    });
  }

  /* ========================================
     3. ROI CALCULATOR
     
     FORMULA:
     ROI = ((Final - Initial) / Initial) × 100
     
     WHERE:
     Final = what your investment is worth now
     Initial = what you originally put in
     
     WHY:
     ROI tells you the percentage gain or loss
     on an investment. Positive = profit.
     Negative = loss.
  ======================================== */
  var roiCalcBtn = document.getElementById('roi-calc-btn');

  if (roiCalcBtn) {
    roiCalcBtn.addEventListener('click', function() {
      var initial = getInputValue('roi-initial');
      var final = getInputValue('roi-final');

      /* Validate */
      if (isNaN(initial) || isNaN(final)) {
        if (window.showToast) {
          window.showToast('Please fill in both fields');
        }
        return;
      }

      if (initial === 0) {
        if (window.showToast) {
          window.showToast('Initial investment cannot be zero');
        }
        return;
      }

      /* Calculate ROI */
      var profit = final - initial;
      var roiPercent = (profit / Math.abs(initial)) * 100;

      /* Display results */
      var roiFormatted = roiPercent.toFixed(2) + '%';
      var profitFormatted = '$' + formatMoney(Math.abs(profit));

      /* Add + or - sign and color indication */
      if (profit >= 0) {
        setResult('roi-percent', '+' + roiFormatted);
        setResult('roi-profit', '+' + profitFormatted);
      } else {
        setResult('roi-percent', '-' + Math.abs(roiPercent).toFixed(2) + '%');
        setResult('roi-profit', '-' + profitFormatted);
      }

      showResult('roi-result');

      if (window.showToast) {
        window.showToast('ROI calculated');
      }
    });
  }

  /* ========================================
     4. DISCOUNT CALCULATOR
     
     FORMULA:
     Savings = Original × (Discount / 100)
     Final Price = Original - Savings
     
     WHY:
     Everyone shops. Everyone sees "25% OFF!"
     But most people can't quickly calculate
     the actual final price in their head.
     This does it instantly.
  ======================================== */
  var discCalcBtn = document.getElementById('disc-calc-btn');

  if (discCalcBtn) {
    discCalcBtn.addEventListener('click', function() {
      var original = getInputValue('disc-original');
      var discountPercent = getInputValue('disc-percent');

      /* Validate */
      if (isNaN(original) || isNaN(discountPercent)) {
        if (window.showToast) {
          window.showToast('Please fill in both fields');
        }
        return;
      }

      if (original <= 0) {
        if (window.showToast) {
          window.showToast('Price must be positive');
        }
        return;
      }

      if (discountPercent < 0 || discountPercent > 100) {
        if (window.showToast) {
          window.showToast('Discount must be 0-100%');
        }
        return;
      }

      /* Calculate discount */
      var savings = original * (discountPercent / 100);
      var finalPrice = original - savings;

      /* Display results */
      setResult('disc-savings', '$' + formatMoney(savings));
      setResult('disc-final', '$' + formatMoney(finalPrice));
      showResult('disc-result');

      if (window.showToast) {
        window.showToast('Discount calculated');
      }
    });  /* ========================================
     5. TIP SPLITTER
     
     FORMULA:
     Tip Amount = Bill × (Tip% / 100)
     Total = Bill + Tip Amount
     Per Person = Total / Number of People
     
     WHY:
     Splitting a restaurant bill with tip
     between friends is one of the most
     common real-world calculations that
     people struggle with. This handles it
     instantly — no awkward mental math at
     the table.
  ======================================== */
  var tipCalcBtn = document.getElementById('tip-calc-btn');

  if (tipCalcBtn) {
    tipCalcBtn.addEventListener('click', function() {
      var bill = getInputValue('tip-bill');
      var tipPercent = getInputValue('tip-percent');
      var people = getInputValue('tip-people');

      /* Validate */
      if (isNaN(bill) || isNaN(tipPercent) || isNaN(people)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (bill <= 0) {
        if (window.showToast) {
          window.showToast('Bill must be positive');
        }
        return;
      }

      if (tipPercent < 0) {
        if (window.showToast) {
          window.showToast('Tip cannot be negative');
        }
        return;
      }

      if (people < 1) {
        people = 1;
      }

      /* Round people to whole number
         You can't split between 2.5 people */
      people = Math.round(people);

      /* Calculate tip */
      var tipAmount = bill * (tipPercent / 100);
      var totalBill = bill + tipAmount;
      var perPerson = totalBill / people;

      /* Display results */
      setResult('tip-amount', '$' + formatMoney(tipAmount));
      setResult('tip-total', '$' + formatMoney(totalBill));
      setResult('tip-each', '$' + formatMoney(perPerson));
      showResult('tip-result');

      /* Add context to per person */
      var tipEachEl = document.getElementById('tip-each');
      if (tipEachEl && people > 1) {
        tipEachEl.textContent = '$' + formatMoney(perPerson) + ' × ' + people;
      }

      if (window.showToast) {
        window.showToast('Tip calculated');
      }
    });
  }

  /* ========================================
     6. TAX CALCULATOR
     
     FORMULA:
     Tax Amount = Amount × (Tax Rate / 100)
     Total = Amount + Tax Amount
     
     WHY:
     Sales tax, VAT, service tax — taxes
     are added to almost everything you buy.
     Knowing the final price before you get
     to the register saves embarrassment and
     helps with budgeting.
  ======================================== */
  var taxCalcBtn = document.getElementById('tax-calc-btn');

  if (taxCalcBtn) {
    taxCalcBtn.addEventListener('click', function() {
      var amount = getInputValue('tax-amount');
      var taxRate = getInputValue('tax-rate');

      /* Validate */
      if (isNaN(amount) || isNaN(taxRate)) {
        if (window.showToast) {
          window.showToast('Please fill in both fields');
        }
        return;
      }

      if (amount <= 0) {
        if (window.showToast) {
          window.showToast('Amount must be positive');
        }
        return;
      }

      if (taxRate < 0) {
        if (window.showToast) {
          window.showToast('Tax rate cannot be negative');
        }
        return;
      }

      /* Calculate tax */
      var taxAmount = amount * (taxRate / 100);
      var totalAfterTax = amount + taxAmount;

      /* Display results */
      setResult('tax-value', '$' + formatMoney(taxAmount));
      setResult('tax-total', '$' + formatMoney(totalAfterTax));
      showResult('tax-result');

      if (window.showToast) {
        window.showToast('Tax calculated');
      }
    });
  }

  /* ========================================
     ENTER KEY SUPPORT FOR ALL FINANCE INPUTS
     
     WHY: When user fills in the fields and
     presses Enter, it should trigger the
     calculate button automatically instead
     of requiring them to tap the button.
     
     HOW: We find all form inputs inside
     each finance panel and add a keydown
     listener that clicks the calculate
     button when Enter is pressed.
  ======================================== */
  var financeInputPairs = [
    { inputs: ['loan-amount', 'loan-rate', 'loan-term'], btn: 'loan-calc-btn' },
    { inputs: ['comp-principal', 'comp-rate', 'comp-time'], btn: 'comp-calc-btn' },
    { inputs: ['roi-initial', 'roi-final'], btn: 'roi-calc-btn' },
    { inputs: ['disc-original', 'disc-percent'], btn: 'disc-calc-btn' },
    { inputs: ['tip-bill', 'tip-percent', 'tip-people'], btn: 'tip-calc-btn' },
    { inputs: ['tax-amount', 'tax-rate'], btn: 'tax-calc-btn' }
  ];

  financeInputPairs.forEach(function(pair) {
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
     PREVENT INVALID INPUT ON ALL FIELDS
     
     Blocks the 'e' key on number inputs
     because typing '1e5' in a number field
     creates confusing scientific notation.
  ======================================== */
  var allFinanceInputs = document.querySelectorAll(
    '#mode-finance input[type="number"]'
  );

  allFinanceInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    });
  });

  /* ========================================
     SELECT ALL ON FOCUS
     
     When user taps any finance input field,
     select all text so they can immediately
     type a new number.
  ======================================== */
  allFinanceInputs.forEach(function(input) {
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
  }
