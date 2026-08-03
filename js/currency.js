/* ============================================
   ELITE CALCULATOR — CURRENCY CONVERTER
   
   Uses the free ExchangeRate-API to fetch
   live currency exchange rates.
   
   Free tier: 1500 requests per month
   No credit card required
   Updates once per day
   
   HOW IT WORKS:
   1. When user opens currency mode, we fetch
      the latest rates from the API
   2. Rates are cached in memory so we don't
      make unnecessary API calls
   3. When user types an amount or changes
      currency, we calculate instantly using
      the cached rates
============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     API CONFIGURATION
     
     We use the free open API from
     exchangerate-api.com. It requires no
     API key for basic usage.
     
     The URL format is:
     https://open.er-api.com/v6/latest/USD
     
     This returns all exchange rates relative
     to 1 USD.
  ======================================== */
  var API_BASE = 'https://open.er-api.com/v6/latest/';

  /* ========================================
     CURRENCY DATA STORE
     
     We cache the fetched rates here so we
     don't call the API every time the user
     types a number. We only fetch once per
     base currency change.
  ======================================== */
  var cachedRates = {};
  var currentBase = '';
  var isFetching = false;

  /* ========================================
     DOM ELEMENTS
  ======================================== */
  var fromSelect = document.getElementById('currency-from');
  var toSelect = document.getElementById('currency-to');
  var fromAmount = document.getElementById('currency-amount-from');
  var toAmount = document.getElementById('currency-amount-to');
  var rateDisplay = document.getElementById('currency-rate');
  var statusDisplay = document.getElementById('currency-status');

  /* ========================================
     FULL CURRENCY LIST
     
     The API supports 150+ currencies but
     we pre-loaded 24 popular ones in the
     HTML. This object maps currency codes
     to their full names for display.
  ======================================== */
  var currencyNames = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'NGN': 'Nigerian Naira',
    'JPY': 'Japanese Yen',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee',
    'BRL': 'Brazilian Real',
    'ZAR': 'South African Rand',
    'KRW': 'South Korean Won',
    'MXN': 'Mexican Peso',
    'SGD': 'Singapore Dollar',
    'HKD': 'Hong Kong Dollar',
    'SEK': 'Swedish Krona',
    'NOK': 'Norwegian Krone',
    'GHS': 'Ghanaian Cedi',
    'KES': 'Kenyan Shilling',
    'EGP': 'Egyptian Pound',
    'AED': 'UAE Dirham',
    'SAR': 'Saudi Riyal',
    'TRY': 'Turkish Lira'
  };

  /* ========================================
     UPDATE STATUS INDICATOR
     
     Shows whether rates are loading, live,
     or if there was an error.
  ======================================== */
  function updateStatus(state, message) {
    if (!statusDisplay) return;

    var dot = statusDisplay.querySelector('.status-dot');
    var text = statusDisplay.querySelector('span');

    if (dot) {
      dot.classList.remove('live', 'error');
      if (state === 'live') dot.classList.add('live');
      if (state === 'error') dot.classList.add('error');
    }

    if (text) {
      text.textContent = message;
    }
  }

  /* ========================================
     FETCH EXCHANGE RATES
     
     Calls the API to get all exchange rates
     relative to the selected base currency.
     
     WHY we fetch by base currency:
     If user wants to convert USD to NGN,
     we fetch rates based on USD. The API
     returns how much 1 USD equals in every
     other currency. Then converting any
     amount is just multiplication.
  ======================================== */
  function fetchRates(baseCurrency) {
    /* Don't fetch if already fetching */
    if (isFetching) return;

    /* Don't fetch if we already have these rates */
    if (baseCurrency === currentBase && Object.keys(cachedRates).length > 0) {
      convertCurrency();
      return;
    }

    isFetching = true;
    updateStatus('loading', 'Fetching rates...');

    /* Make the API call */
    fetch(API_BASE + baseCurrency)
      .then(function(response) {
        /* Check if request was successful */
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then(function(data) {
        /* Check if API returned valid data */
        if (data.result === 'success' && data.rates) {
          cachedRates = data.rates;
          currentBase = baseCurrency;
          isFetching = false;

          updateStatus('live', 'Rates live');

          /* Now calculate the conversion */
          convertCurrency();
        } else {
          throw new Error('Invalid API response');
        }
      })
      .catch(function(error) {
        isFetching = false;
        updateStatus('error', 'Offline — check connection');

        if (rateDisplay) {
          rateDisplay.textContent = 'Could not fetch rates. Check your internet connection.';
        }

        console.error('Currency API error:', error);
      });
  }

  /* ========================================
     CONVERT CURRENCY
     
     Uses the cached rates to calculate
     the conversion instantly.
     
     HOW: If base is USD and rates show
     NGN = 1600, then to convert 5 USD
     to NGN: 5 × 1600 = 8000
  ======================================== */
  function convertCurrency() {
    if (!fromSelect || !toSelect || !fromAmount || !toAmount) return;

    var from = fromSelect.value;
    var to = toSelect.value;
    var amount = parseFloat(fromAmount.value);

    /* Validate input */
    if (isNaN(amount) || amount === 0) {
      toAmount.value = '';
      if (rateDisplay) {
        rateDisplay.textContent = 'Enter an amount to convert';
      }
      return;
    }

    /* Check if we have the needed rates */
    if (from !== currentBase) {
      fetchRates(from);
      return;
    }

    if (!cachedRates[to]) {
      if (rateDisplay) {
        rateDisplay.textContent = 'Rate not available for ' + to;
      }
      return;
    }

    /* Calculate conversion */
    var rate = cachedRates[to];
    var result = amount * rate;

    /* Format the result nicely */
    var formattedResult;
    if (result >= 1000000) {
      formattedResult = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else if (result >= 1) {
      formattedResult = result.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });
    } else {
      formattedResult = result.toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
      });
    }

    /* Show result */
    toAmount.value = formattedResult;

    /* Show rate info */
    if (rateDisplay) {
      var fromName = currencyNames[from] || from;
      var toName = currencyNames[to] || to;

      var rateFormatted = rate.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });

      rateDisplay.textContent = '1 ' + from + ' = ' + rateFormatted + ' ' + to + '  •  ' + fromName + ' → ' + toName;
    }
  }  /* ========================================
     EVENT LISTENERS
     
     We need to trigger conversion when:
     1. User types an amount
     2. User changes "from" currency
     3. User changes "to" currency
     4. User clicks the swap button
  ======================================== */

  /* ---- AMOUNT INPUT ----
     Triggers on every keystroke so user
     sees live conversion as they type */
  if (fromAmount) {
    fromAmount.addEventListener('input', function() {
      var from = fromSelect ? fromSelect.value : 'USD';

      /* If we already have rates for this base
         just convert immediately */
      if (from === currentBase && Object.keys(cachedRates).length > 0) {
        convertCurrency();
      } else {
        fetchRates(from);
      }
    });
  }

  /* ---- FROM CURRENCY CHANGED ----
     When user picks a different source currency
     we need to fetch new rates because rates
     are relative to the base currency */
  if (fromSelect) {
    fromSelect.addEventListener('change', function() {
      fetchRates(this.value);
    });
  }

  /* ---- TO CURRENCY CHANGED ----
     We already have the rates so just
     recalculate without a new API call */
  if (toSelect) {
    toSelect.addEventListener('change', function() {
      convertCurrency();
    });
  }

  /* ========================================
     SWAP BUTTON
     
     WHY: User clicks the arrow button between
     the two currency cards to swap them.
     Instead of manually changing both dropdowns,
     one tap flips everything.
     
     HOW: We swap the selected values of both
     dropdowns, move the amount to the other
     input, then fetch new rates for the
     new base currency.
  ======================================== */
  var swapBtn = document.getElementById('currency-swap');

  if (swapBtn) {
    swapBtn.addEventListener('click', function() {
      if (!fromSelect || !toSelect) return;

      /* Store current values */
      var tempFrom = fromSelect.value;
      var tempTo = toSelect.value;
      var tempAmount = toAmount ? toAmount.value : '';

      /* Swap the dropdown selections */
      fromSelect.value = tempTo;
      toSelect.value = tempFrom;

      /* Move the result to the input field
         Remove commas first so it's a valid number */
      if (fromAmount && tempAmount) {
        var cleanAmount = tempAmount.replace(/,/g, '');
        var numAmount = parseFloat(cleanAmount);
        if (!isNaN(numAmount)) {
          fromAmount.value = numAmount;
        }
      }

      /* Add spin animation to swap button */
      this.style.transition = 'transform 0.4s ease';
      this.style.transform = 'rotate(360deg)';

      var self = this;
      setTimeout(function() {
        self.style.transition = 'none';
        self.style.transform = 'rotate(0deg)';
      }, 400);

      /* Fetch rates for new base currency */
      fetchRates(fromSelect.value);

      /* Show toast */
      if (window.showToast) {
        window.showToast('Currencies swapped');
      }
    });
  }

  /* ========================================
     AUTO-FETCH ON MODE SWITCH
     
     WHY: When user switches to currency mode
     we want rates ready immediately without
     them having to do anything.
     
     HOW: We watch for the currency panel
     becoming visible using MutationObserver.
     When it gets the 'active' class, we
     fetch rates automatically.
  ======================================== */
  var currencyMode = document.getElementById('mode-currency');

  if (currencyMode) {
    /* Use MutationObserver to watch for class changes */
    var currencyObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (currencyMode.classList.contains('active')) {
            /* Mode just became active — fetch rates */
            var base = fromSelect ? fromSelect.value : 'USD';
            if (Object.keys(cachedRates).length === 0 || base !== currentBase) {
              fetchRates(base);
            }
          }
        }
      });
    });

    currencyObserver.observe(currencyMode, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /* ========================================
     FORMAT INPUT ON BLUR
     
     WHY: When user finishes typing and taps
     away from the input, we clean up the
     number to look nicer.
  ======================================== */
  if (fromAmount) {
    fromAmount.addEventListener('blur', function() {
      var val = parseFloat(this.value);
      if (!isNaN(val) && val > 0) {
        /* Keep the raw number for calculations
           but remove unnecessary decimals */
        this.value = val;
      }
    });
  }

  /* ========================================
     KEYBOARD SHORTCUT — ENTER TO CONVERT
     
     WHY: When user presses Enter while
     typing an amount, trigger conversion
     immediately.
  ======================================== */
  if (fromAmount) {
    fromAmount.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var from = fromSelect ? fromSelect.value : 'USD';
        fetchRates(from);
      }
    });
  }

  /* ========================================
     PREVENT NEGATIVE AND INVALID INPUT
     
     WHY: You can't convert negative currency
     amounts. We block the minus key and 'e'
     key (scientific notation) in the input.
  ======================================== */
  if (fromAmount) {
    fromAmount.addEventListener('keydown', function(e) {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    });
  }

  /* ========================================
     CLICK TO SELECT ALL
     
     WHY: When user taps the amount input,
     select all text so they can immediately
     type a new number without deleting first.
  ======================================== */
  if (fromAmount) {
    fromAmount.addEventListener('focus', function() {
      var self = this;
      setTimeout(function() {
        self.select();
      }, 50);
    });
  }

  if (toAmount) {
    toAmount.addEventListener('focus', function() {
      var self = this;
      setTimeout(function() {
        self.select();
      }, 50);
    });
  }

/* ========================================
   CLOSE DOMContentLoaded
======================================== */
});
