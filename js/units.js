/* ============================================
   ELITE CALCULATOR — UNIT CONVERTER
   
   Converts between units across 10 categories:
   Length, Weight, Temperature, Speed, Volume,
   Area, Data, Energy, Pressure, Time
   
   HOW IT WORKS:
   Every unit in a category has a "base factor".
   To convert from unit A to unit B:
   1. Multiply A by its factor to get base value
   2. Divide base value by B's factor to get result
   
   Example (Length, base = meters):
   1 km = 1000 meters (factor: 1000)
   1 mile = 1609.34 meters (factor: 1609.34)
   So 5 km = 5 × 1000 / 1609.34 = 3.107 miles
   
   Temperature is special — it uses formulas
   instead of simple multiplication.
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     UNIT DATABASE
     
     Each category has a list of units.
     Each unit has:
     - name: what the user sees
     - factor: multiplier to convert to base unit
     
     The first unit in each list is the
     "base unit" with factor 1.
  ======================================== */
  var unitData = {

    length: {
      name: 'Length',
      base: 'Meter',
      units: {
        'mm':   { name: 'Millimeter',  factor: 0.001 },
        'cm':   { name: 'Centimeter',  factor: 0.01 },
        'm':    { name: 'Meter',       factor: 1 },
        'km':   { name: 'Kilometer',   factor: 1000 },
        'in':   { name: 'Inch',        factor: 0.0254 },
        'ft':   { name: 'Foot',        factor: 0.3048 },
        'yd':   { name: 'Yard',        factor: 0.9144 },
        'mi':   { name: 'Mile',        factor: 1609.344 },
        'nm':   { name: 'Nautical Mile', factor: 1852 }
      }
    },

    weight: {
      name: 'Weight',
      base: 'Kilogram',
      units: {
        'mg':   { name: 'Milligram',   factor: 0.000001 },
        'g':    { name: 'Gram',        factor: 0.001 },
        'kg':   { name: 'Kilogram',    factor: 1 },
        'ton':  { name: 'Metric Ton',  factor: 1000 },
        'oz':   { name: 'Ounce',       factor: 0.0283495 },
        'lb':   { name: 'Pound',       factor: 0.453592 },
        'st':   { name: 'Stone',       factor: 6.35029 }
      }
    },

    temperature: {
      name: 'Temperature',
      base: 'Celsius',
      units: {
        'c':  { name: 'Celsius',    factor: 'special' },
        'f':  { name: 'Fahrenheit', factor: 'special' },
        'k':  { name: 'Kelvin',     factor: 'special' }
      }
    },

    speed: {
      name: 'Speed',
      base: 'Meters/sec',
      units: {
        'ms':   { name: 'Meters/sec',    factor: 1 },
        'kmh':  { name: 'Km/hour',       factor: 0.277778 },
        'mph':  { name: 'Miles/hour',    factor: 0.44704 },
        'kn':   { name: 'Knots',         factor: 0.514444 },
        'fps':  { name: 'Feet/sec',      factor: 0.3048 },
        'mach': { name: 'Mach',          factor: 343 }
      }
    },

    volume: {
      name: 'Volume',
      base: 'Liter',
      units: {
        'ml':     { name: 'Milliliter',    factor: 0.001 },
        'l':      { name: 'Liter',         factor: 1 },
        'gal':    { name: 'US Gallon',     factor: 3.78541 },
        'qt':     { name: 'US Quart',      factor: 0.946353 },
        'pt':     { name: 'US Pint',       factor: 0.473176 },
        'cup':    { name: 'US Cup',        factor: 0.236588 },
        'floz':   { name: 'US Fluid Oz',   factor: 0.0295735 },
        'tbsp':   { name: 'Tablespoon',    factor: 0.0147868 },
        'tsp':    { name: 'Teaspoon',      factor: 0.00492892 },
        'm3':     { name: 'Cubic Meter',   factor: 1000 },
        'igal':   { name: 'UK Gallon',     factor: 4.54609 }
      }
    },

    area: {
      name: 'Area',
      base: 'Sq Meter',
      units: {
        'mm2':  { name: 'Sq Millimeter', factor: 0.000001 },
        'cm2':  { name: 'Sq Centimeter', factor: 0.0001 },
        'm2':   { name: 'Sq Meter',      factor: 1 },
        'km2':  { name: 'Sq Kilometer',  factor: 1000000 },
        'ha':   { name: 'Hectare',       factor: 10000 },
        'ac':   { name: 'Acre',          factor: 4046.86 },
        'ft2':  { name: 'Sq Foot',       factor: 0.092903 },
        'in2':  { name: 'Sq Inch',       factor: 0.00064516 },
        'mi2':  { name: 'Sq Mile',       factor: 2590000 },
        'yd2':  { name: 'Sq Yard',       factor: 0.836127 }
      }
    },

    data: {
      name: 'Data',
      base: 'Byte',
      units: {
        'bit':  { name: 'Bit',       factor: 0.125 },
        'b':    { name: 'Byte',      factor: 1 },
        'kb':   { name: 'Kilobyte',  factor: 1024 },
        'mb':   { name: 'Megabyte',  factor: 1048576 },
        'gb':   { name: 'Gigabyte',  factor: 1073741824 },
        'tb':   { name: 'Terabyte',  factor: 1099511627776 },
        'pb':   { name: 'Petabyte',  factor: 1125899906842624 }
      }
    },

    energy: {
      name: 'Energy',
      base: 'Joule',
      units: {
        'j':    { name: 'Joule',         factor: 1 },
        'kj':   { name: 'Kilojoule',     factor: 1000 },
        'cal':  { name: 'Calorie',       factor: 4.184 },
        'kcal': { name: 'Kilocalorie',   factor: 4184 },
        'wh':   { name: 'Watt Hour',     factor: 3600 },
        'kwh':  { name: 'Kilowatt Hour', factor: 3600000 },
        'btu':  { name: 'BTU',           factor: 1055.06 },
        'ev':   { name: 'Electron Volt', factor: 1.602e-19 }
      }
    },

    pressure: {
      name: 'Pressure',
      base: 'Pascal',
      units: {
        'pa':   { name: 'Pascal',        factor: 1 },
        'kpa':  { name: 'Kilopascal',    factor: 1000 },
        'bar':  { name: 'Bar',           factor: 100000 },
        'psi':  { name: 'PSI',           factor: 6894.76 },
        'atm':  { name: 'Atmosphere',    factor: 101325 },
        'mmhg': { name: 'mmHg',          factor: 133.322 },
        'torr': { name: 'Torr',          factor: 133.322 }
      }
    },

    time: {
      name: 'Time',
      base: 'Second',
      units: {
        'ms':   { name: 'Millisecond',  factor: 0.001 },
        'sec':  { name: 'Second',       factor: 1 },
        'min':  { name: 'Minute',       factor: 60 },
        'hr':   { name: 'Hour',         factor: 3600 },
        'day':  { name: 'Day',          factor: 86400 },
        'wk':   { name: 'Week',         factor: 604800 },
        'mo':   { name: 'Month (30d)',  factor: 2592000 },
        'yr':   { name: 'Year (365d)',  factor: 31536000 }
      }
    }
  };

  /* ========================================
     DOM ELEMENTS
  ======================================== */
  var unitFromSelect = document.getElementById('unit-from');
  var unitToSelect = document.getElementById('unit-to');
  var unitFromAmount = document.getElementById('unit-amount-from');
  var unitToAmount = document.getElementById('unit-amount-to');
  var unitFormula = document.getElementById('unit-formula');
  var unitCatButtons = document.querySelectorAll('#unit-categories .unit-cat-btn');

  /* Track currently selected category */
  var currentCategory = 'length';

  /* ========================================
     POPULATE UNIT DROPDOWNS
     
     When a category is selected, we fill
     the From and To dropdowns with the
     units available in that category.
  ======================================== */
  function populateUnitDropdowns(category) {
    if (!unitFromSelect || !unitToSelect) return;

    var categoryData = unitData[category];
    if (!categoryData) return;

    /* Clear existing options */
    unitFromSelect.innerHTML = '';
    unitToSelect.innerHTML = '';

    /* Add new options */
    var unitKeys = Object.keys(categoryData.units);

    unitKeys.forEach(function(key) {
      var unit = categoryData.units[key];

      var option1 = document.createElement('option');
      option1.value = key;
      option1.textContent = unit.name + ' (' + key + ')';
      unitFromSelect.appendChild(option1);

      var option2 = document.createElement('option');
      option2.value = key;
      option2.textContent = unit.name + ' (' + key + ')';
      unitToSelect.appendChild(option2);
    });

    /* Set default selections (first and second unit) */
    if (unitKeys.length >= 2) {
      unitFromSelect.value = unitKeys[0];
      unitToSelect.value = unitKeys[1];
    }

    /* Clear result */
    if (unitToAmount) unitToAmount.value = '';
    if (unitFormula) {
      unitFormula.textContent = 'Enter a value to convert';
    }
  }

  /* ========================================
     TEMPERATURE CONVERSION
     
     Temperature can't use simple multiplication.
     Each conversion needs its own formula.
  ======================================== */
  function convertTemperature(value, from, to) {
    if (from === to) return value;

    /* First convert to Celsius */
    var celsius;

    switch(from) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'k':
        celsius = value - 273.15;
        break;
      default:
        return NaN;
    }

    /* Then convert from Celsius to target */
    switch(to) {
      case 'c':
        return celsius;
      case 'f':
        return (celsius * 9 / 5) + 32;
      case 'k':
        return celsius + 273.15;
      default:
        return NaN;
    }
  }

  /* ========================================
     CONVERT UNITS
     
     The main conversion function.
     Uses the factor-based system for most
     units, and special formulas for temperature.
  ======================================== */
  function convertUnits() {
    if (!unitFromSelect || !unitToSelect || !unitFromAmount || !unitToAmount) return;

    var from = unitFromSelect.value;
    var to = unitToSelect.value;
    var amount = parseFloat(unitFromAmount.value);

    /* Validate input */
    if (isNaN(amount)) {
      unitToAmount.value = '';
      if (unitFormula) {
        unitFormula.textContent = 'Enter a value to convert';
      }
      return;
    }

    var categoryData = unitData[currentCategory];
    if (!categoryData) return;

    var result;

    /* Temperature uses special formulas */
    if (currentCategory === 'temperature') {
      result = convertTemperature(amount, from, to);
    } else {
      /* Standard factor-based conversion */
      var fromFactor = categoryData.units[from].factor;
      var toFactor = categoryData.units[to].factor;

      /* Convert: amount × fromFactor / toFactor */
      var baseValue = amount * fromFactor;
      result = baseValue / toFactor;
    }

    /* Format result */
    if (isNaN(result)) {
      unitToAmount.value = 'Error';
      return;
    }

    /* Smart decimal formatting */
    var formatted;
    if (Math.abs(result) >= 1000000) {
      formatted = result.toExponential(4);
    } else if (Math.abs(result) >= 100) {
      formatted = parseFloat(result.toPrecision(8)).toString();
    } else if (Math.abs(result) >= 1) {
      formatted = parseFloat(result.toPrecision(8)).toString();
    } else if (result === 0) {
      formatted = '0';
    } else {
      formatted = parseFloat(result.toPrecision(6)).toString();
    }

    unitToAmount.value = formatted;

    /* Show conversion formula */
    if (unitFormula) {
      var fromName = categoryData.units[from].name;
      var toName = categoryData.units[to].name;
      unitFormula.textContent = amount + ' ' + fromName + ' = ' + formatted + ' ' + toName;
    }  /* ========================================
     EVENT LISTENERS
  ======================================== */

  /* ---- CATEGORY BUTTONS ----
     When user taps a category like "Length"
     or "Weight", we populate the dropdowns
     with that category's units */
  unitCatButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var category = this.getAttribute('data-category');

      /* Update active state */
      unitCatButtons.forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      /* Update current category */
      currentCategory = category;

      /* Populate dropdowns with new units */
      populateUnitDropdowns(category);

      /* Clear input */
      if (unitFromAmount) {
        unitFromAmount.value = '1';
      }

      /* Auto-convert with default value */
      convertUnits();

      /* Show toast */
      if (window.showToast) {
        var catData = unitData[category];
        if (catData) {
          window.showToast(catData.name + ' converter');
        }
      }
    });
  });

  /* ---- AMOUNT INPUT ----
     Convert live as user types */
  if (unitFromAmount) {
    unitFromAmount.addEventListener('input', function() {
      convertUnits();
    });
  }

  /* ---- FROM UNIT CHANGED ---- */
  if (unitFromSelect) {
    unitFromSelect.addEventListener('change', function() {
      convertUnits();
    });
  }

  /* ---- TO UNIT CHANGED ---- */
  if (unitToSelect) {
    unitToSelect.addEventListener('change', function() {
      convertUnits();
    });
  }

  /* ========================================
     SWAP BUTTON
     
     Swaps the From and To units and moves
     the result value to the input field.
  ======================================== */
  var unitSwapBtn = document.getElementById('unit-swap');

  if (unitSwapBtn) {
    unitSwapBtn.addEventListener('click', function() {
      if (!unitFromSelect || !unitToSelect) return;

      /* Store current values */
      var tempFrom = unitFromSelect.value;
      var tempTo = unitToSelect.value;
      var tempResult = unitToAmount ? unitToAmount.value : '';

      /* Swap dropdown selections */
      unitFromSelect.value = tempTo;
      unitToSelect.value = tempFrom;

      /* Move result to input if valid */
      if (tempResult && tempResult !== 'Error') {
        var cleanResult = tempResult.replace(/,/g, '');
        var numResult = parseFloat(cleanResult);
        if (!isNaN(numResult)) {
          unitFromAmount.value = numResult;
        }
      }

      /* Add spin animation */
      this.style.transition = 'transform 0.4s ease';
      this.style.transform = 'rotate(360deg)';

      var self = this;
      setTimeout(function() {
        self.style.transition = 'none';
        self.style.transform = 'rotate(0deg)';
      }, 400);

      /* Recalculate */
      convertUnits();

      /* Toast */
      if (window.showToast) {
        window.showToast('Units swapped');
      }
    });
  }

  /* ========================================
     KEYBOARD SUPPORT
     
     Enter key triggers conversion.
     This is for users who type the amount
     and press Enter instead of waiting.
  ======================================== */
  if (unitFromAmount) {
    unitFromAmount.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        convertUnits();
      }
    });
  }

  /* ========================================
     PREVENT INVALID INPUT
     
     Block 'e' key (scientific notation input)
     which can cause unexpected behavior.
  ======================================== */
  if (unitFromAmount) {
    unitFromAmount.addEventListener('keydown', function(e) {
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    });
  }

  /* ========================================
     SELECT ALL ON FOCUS
     
     When user taps the input field,
     select all text so they can immediately
     type a new number.
  ======================================== */
  if (unitFromAmount) {
    unitFromAmount.addEventListener('focus', function() {
      var self = this;
      setTimeout(function() {
        self.select();
      }, 50);
    });
  }

  /* ========================================
     AUTO-POPULATE ON MODE SWITCH
     
     When user switches to Units mode,
     make sure the dropdowns are populated
     with the current category's units.
     
     Uses MutationObserver to detect when
     the mode panel becomes active.
  ======================================== */
  var unitsMode = document.getElementById('mode-units');

  if (unitsMode) {
    var unitsObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (unitsMode.classList.contains('active')) {
            /* Check if dropdowns are empty */
            if (unitFromSelect && unitFromSelect.options.length === 0) {
              populateUnitDropdowns(currentCategory);

              if (unitFromAmount) {
                unitFromAmount.value = '1';
              }

              convertUnits();
            }
          }
        }
      });
    });

    unitsObserver.observe(unitsMode, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* ========================================
     INITIALIZE
     
     Populate the length category by default
     when the page first loads. This ensures
     the dropdowns aren't empty if user
     navigates directly to units mode.
  ======================================== */
  populateUnitDropdowns('length');

  /* Set default value */
  if (unitFromAmount) {
    unitFromAmount.value = '1';
  }

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
      }
