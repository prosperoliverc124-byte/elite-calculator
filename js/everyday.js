/* ============================================
   ELITE CALCULATOR — EVERYDAY MODE
   
   Handles 3 everyday calculators:
   1. Fuel Cost Calculator
   2. Electricity Bill Estimator
   3. Data Usage Tracker
   
   These solve the small daily calculations
   that everyone does badly in their head.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     HELPERS
  ======================================== */
  function getVal(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    return parseFloat(el.value);
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showCard(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function formatNum(num, decimals) {
    if (isNaN(num) || !isFinite(num)) return '—';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals || 2
    });
  }

  /* ========================================
     1. FUEL COST CALCULATOR
     
     FORMULAS:
     Fuel Needed = Distance / Efficiency
     Total Cost = Fuel Needed × Price Per Liter
     
     WHERE:
     Distance = how far you're driving (km)
     Efficiency = how many km per liter your car gets
     Price = cost of one liter of fuel
     
     WHY:
     Planning a road trip? Moving to a new
     city? Need to budget for your commute?
     This tells you exactly how much fuel
     you'll need and what it will cost.
     No more guessing at the pump.
  ======================================== */
  var fuelCalcBtn = document.getElementById('fuel-calc-btn');

  if (fuelCalcBtn) {
    fuelCalcBtn.addEventListener('click', function() {
      var distance = getVal('fuel-distance');
      var efficiency = getVal('fuel-efficiency');
      var price = getVal('fuel-price');

      /* Validate */
      if (isNaN(distance) || isNaN(efficiency) || isNaN(price)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (distance <= 0 || efficiency <= 0 || price <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      /* Calculate */
      var fuelNeeded = distance / efficiency;
      var totalCost = fuelNeeded * price;

      /* Display results */
      setText('fuel-liters', formatNum(fuelNeeded, 2) + ' liters');
      setText('fuel-cost', formatNum(totalCost, 2));

      showCard('fuel-result');

      if (window.showToast) {
        window.showToast('Fuel cost calculated ⛽');
      }
    });
  }

  /* ========================================
     2. ELECTRICITY BILL ESTIMATOR
     
     FORMULAS:
     Daily kWh = (Watts × Hours) / 1000
     Daily Cost = Daily kWh × Price Per kWh
     Monthly Cost = Daily Cost × 30
     Yearly Cost = Daily Cost × 365
     
     WHERE:
     Watts = power consumption of appliance
     Hours = how many hours per day you use it
     Price = your electricity rate per kWh
     
     WHY:
     That air conditioner running all night —
     how much is it actually costing you?
     That old fridge — should you replace it?
     This calculator shows exactly how much
     each appliance costs you per day, month,
     and year. Knowledge is power (pun intended).
  ======================================== */
  var elecCalcBtn = document.getElementById('elec-calc-btn');

  if (elecCalcBtn) {
    elecCalcBtn.addEventListener('click', function() {
      var watts = getVal('elec-watts');
      var hours = getVal('elec-hours');
      var rate = getVal('elec-rate');

      /* Validate */
      if (isNaN(watts) || isNaN(hours) || isNaN(rate)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (watts <= 0 || hours <= 0 || rate <= 0) {
        if (window.showToast) {
          window.showToast('Values must be positive');
        }
        return;
      }

      if (hours > 24) {
        if (window.showToast) {
          window.showToast('Hours cannot exceed 24');
        }
        return;
      }

      /* Calculate
         Convert watts to kilowatts first (÷ 1000)
         because electricity is billed in kWh */
      var dailyKwh = (watts * hours) / 1000;
      var dailyCost = dailyKwh * rate;
      var monthlyCost = dailyCost * 30;
      var yearlyCost = dailyCost * 365;

      /* Display results */
      setText('elec-daily', formatNum(dailyCost, 2));
      setText('elec-monthly', formatNum(monthlyCost, 2));
      setText('elec-yearly', formatNum(yearlyCost, 2));

      showCard('elec-result');

      if (window.showToast) {
        window.showToast('Electricity cost calculated ⚡');
      }
    });
  }

  /* ========================================
     3. DATA USAGE TRACKER
     
     FORMULAS:
     Data Remaining = Plan - Used
     Daily Average = Used / Days
     Projected Usage = Daily Average × 30
     
     STATUS:
     If projected usage > plan = "Over limit ⚠️"
     If projected usage ≤ plan = "On track ✓"
     
     WHY:
     Running out of mobile data before the
     month ends is frustrating and expensive.
     This calculates your daily usage rate
     and predicts whether you'll run out.
     No more surprise data charges.
  ======================================== */
  var dataCalcBtn = document.getElementById('data-calc-btn');

  if (dataCalcBtn) {
    dataCalcBtn.addEventListener('click', function() {
      var plan = getVal('data-plan');
      var used = getVal('data-used');
      var daysIn = getVal('data-days');

      /* Validate */
      if (isNaN(plan) || isNaN(used) || isNaN(daysIn)) {
        if (window.showToast) {
          window.showToast('Please fill in all fields');
        }
        return;
      }

      if (plan <= 0 || daysIn <= 0) {
        if (window.showToast) {
          window.showToast('Plan and days must be positive');
        }
        return;
      }

      if (used < 0) {
        if (window.showToast) {
          window.showToast('Usage cannot be negative');
        }
        return;
      }

      if (daysIn > 31) {
        if (window.showToast) {
          window.showToast('Days cannot exceed 31');
        }
        return;
      }

      /* Calculate */
      var remaining = plan - used;
      var dailyAvg = used / daysIn;
      var projected = dailyAvg * 30;

      /* Determine status */
      var status;
      var statusColor;

      if (remaining <= 0) {
        status = '🚨 Data exhausted!';
        statusColor = '#FF4444';
      } else if (projected > plan) {
        /* Calculate by how much */
        var overBy = projected - plan;
        status = '⚠️ Over limit by ' + formatNum(overBy, 2) + ' GB';
        statusColor = '#FFB800';
      } else {
        var underBy = plan - projected;
        status = '✓ On track — ' + formatNum(underBy, 2) + ' GB spare';
        statusColor = '#00FF88';
      }

      /* Display results */
      setText('data-remaining', formatNum(remaining, 2) + ' GB');
      setText('data-avg', formatNum(dailyAvg, 2) + ' GB/day');
      setText('data-projected', formatNum(projected, 2) + ' GB/month');
      setText('data-status', status);

      /* Color the status */
      var statusEl = document.getElementById('data-status');
      if (statusEl) {
        statusEl.style.color = statusColor;
      }

      /* Color the remaining based on amount */
      var remainEl = document.getElementById('data-remaining');
      if (remainEl) {
        if (remaining <= 0) {
          remainEl.style.color = '#FF4444';
        } else if (remaining < plan * 0.2) {
          remainEl.style.color = '#FFB800';
        } else {
          remainEl.style.color = '#00FF88';
        }
      }

      showCard('data-result');

      if (window.showToast) {
        window.showToast('Data usage analyzed 📊');
      }
    });
  }

  /* ========================================
     ENTER KEY SUPPORT
  ======================================== */
  var everydayInputPairs = [
    { inputs: ['fuel-distance', 'fuel-efficiency', 'fuel-price'], btn: 'fuel-calc-btn' },
    { inputs: ['elec-watts', 'elec-hours', 'elec-rate'], btn: 'elec-calc-btn' },
    { inputs: ['data-plan', 'data-used', 'data-days'], btn: 'data-calc-btn' }
  ];

  everydayInputPairs.forEach(function(pair) {
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
  ======================================== */
  var allEverydayInputs = document.querySelectorAll(
    '#mode-everyday input[type="number"]'
  );

  allEverydayInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    });
  });

  /* ========================================
     SELECT ALL ON FOCUS
  ======================================== */
  allEverydayInputs.forEach(function(input) {
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
