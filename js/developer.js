/* ============================================
   ELITE CALCULATOR — DEVELOPER TOOLS
   
   Handles 3 developer utilities:
   1. Number Base Converter (Dec/Bin/Oct/Hex)
   2. Color Code Converter (HEX/RGB/HSL)
   3. ASCII Converter (Text ↔ ASCII codes)
   
   Built for developers, students, and anyone
   who works with code, colors, or data.
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

  /* ========================================
     1. NUMBER BASE CONVERTER
     
     Converts numbers between 4 bases:
     - Decimal (base 10) — normal numbers
     - Binary (base 2) — 0s and 1s
     - Octal (base 8) — 0-7
     - Hexadecimal (base 16) — 0-9 and A-F
     
     HOW IT WORKS:
     1. User enters a number
     2. Selects which base it's in
     3. We convert to decimal first
     4. Then convert from decimal to all 4 bases
     
     WHY:
     Developers constantly need to convert
     between hex, binary, and decimal.
     Color codes are hex. Permissions are
     octal. Bit flags are binary. This
     handles all of them instantly.
  ======================================== */
  var baseCalcBtn = document.getElementById('base-calc-btn');

  if (baseCalcBtn) {
    baseCalcBtn.addEventListener('click', function() {
      var input = document.getElementById('base-input');
      var baseSelect = document.getElementById('base-from');

      if (!input || !baseSelect) return;

      var value = input.value.trim();
      var fromBase = parseInt(baseSelect.value);

      /* Validate input exists */
      if (!value) {
        if (window.showToast) {
          window.showToast('Please enter a number');
        }
        return;
      }

      /* Remove common prefixes that users might type
         0x for hex, 0b for binary, 0o for octal */
      var cleanValue = value
        .replace(/^0x/i, '')
        .replace(/^0b/i, '')
        .replace(/^0o/i, '')
        .toUpperCase();

      /* Validate the input is valid for the selected base */
      var validChars;
      switch(fromBase) {
        case 2:
          validChars = /^[01]+$/;
          break;
        case 8:
          validChars = /^[0-7]+$/;
          break;
        case 10:
          validChars = /^-?[0-9]+$/;
          break;
        case 16:
          validChars = /^[0-9A-F]+$/;
          break;
        default:
          validChars = /^[0-9]+$/;
      }

      if (!validChars.test(cleanValue)) {
        if (window.showToast) {
          window.showToast('Invalid characters for base ' + fromBase);
        }
        return;
      }

      /* Convert to decimal first */
      var decimalValue = parseInt(cleanValue, fromBase);

      /* Check if conversion succeeded */
      if (isNaN(decimalValue)) {
        if (window.showToast) {
          window.showToast('Could not convert this number');
        }
        return;
      }

      /* Check for reasonable size */
      if (Math.abs(decimalValue) > Number.MAX_SAFE_INTEGER) {
        if (window.showToast) {
          window.showToast('Number too large to convert accurately');
        }
        return;
      }

      /* Convert from decimal to all 4 bases */
      var decimal = decimalValue.toString(10);
      var binary = (decimalValue >>> 0).toString(2);
      var octal = (decimalValue >>> 0).toString(8);
      var hex = (decimalValue >>> 0).toString(16).toUpperCase();

      /* For negative numbers, show the decimal as-is
         and binary/octal/hex as unsigned 32-bit */
      if (decimalValue < 0) {
        decimal = decimalValue.toString(10);
      }

      /* Add spacing to binary for readability
         Groups of 4 bits: 1010 0110 1100 */
      var binarySpaced = binary.replace(
        /(\d{4})(?=\d)/g, '$1 '
      );

      /* Display results */
      setText('base-dec', decimal);
      setText('base-bin', binarySpaced);
      setText('base-oct', octal);
      setText('base-hex', hex);

      showCard('base-result');

      if (window.showToast) {
        window.showToast('Converted to all bases');
      }
    });
  }

  /* ========================================
     2. COLOR CODE CONVERTER
     
     Converts between 3 color formats:
     - HEX (#FF5733)
     - RGB (rgb(255, 87, 51))
     - HSL (hsl(14, 100%, 60%))
     
     HOW IT WORKS:
     1. User enters a HEX color code
     2. We extract R, G, B values from hex
     3. Convert RGB to HSL using formulas
     4. Display all 3 formats + color preview
     
     WHY:
     Web developers switch between color
     formats constantly. CSS uses all three.
     Design tools use HEX. JavaScript uses
     RGB. This converts between all of them
     and shows a live preview.
  ======================================== */
  var colorCalcBtn = document.getElementById('color-calc-btn');

  if (colorCalcBtn) {
    colorCalcBtn.addEventListener('click', function() {
      var hexInput = document.getElementById('color-hex');
      if (!hexInput) return;

      var hex = hexInput.value.trim();

      /* Remove # if present */
      hex = hex.replace(/^#/, '');

      /* Support 3-character shorthand (#F00 → #FF0000) */
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      /* Validate hex format */
      if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        if (window.showToast) {
          window.showToast('Enter a valid HEX code like #00FF88');
        }
        return;
      }

      /* ---- HEX TO RGB ----
         Each pair of hex digits represents
         one color channel (0-255) */
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      /* ---- RGB TO HSL ----
         H = Hue (0-360 degrees on color wheel)
         S = Saturation (0-100%)
         L = Lightness (0-100%)
         
         This formula is the standard
         mathematical conversion used by
         every graphics program */
      var rNorm = r / 255;
      var gNorm = g / 255;
      var bNorm = b / 255;

      var max = Math.max(rNorm, gNorm, bNorm);
      var min = Math.min(rNorm, gNorm, bNorm);
      var delta = max - min;

      /* Lightness */
      var l = (max + min) / 2;

      /* Saturation */
      var s = 0;
      if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
      }

      /* Hue */
      var h = 0;
      if (delta !== 0) {
        if (max === rNorm) {
          h = 60 * (((gNorm - bNorm) / delta) % 6);
        } else if (max === gNorm) {
          h = 60 * (((bNorm - rNorm) / delta) + 2);
        } else {
          h = 60 * (((rNorm - gNorm) / delta) + 4);
        }
      }

      /* Ensure hue is positive */
      if (h < 0) h += 360;

      /* Round values */
      h = Math.round(h);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      /* ---- DISPLAY RESULTS ---- */
      var hexFormatted = '#' + hex.toUpperCase();
      var rgbFormatted = 'rgb(' + r + ', ' + g + ', ' + b + ')';
      var hslFormatted = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

      setText('color-hex-out', hexFormatted);
      setText('color-rgb-out', rgbFormatted);
      setText('color-hsl-out', hslFormatted);

      /* Update color preview */
      var preview = document.getElementById('color-preview');
      if (preview) {
        preview.style.backgroundColor = hexFormatted;
      }

      showCard('color-result');

      if (window.showToast) {
        window.showToast('Color converted 🎨');
      }
    });
  }

  /* ========================================
     3. ASCII CONVERTER
     
     Converts between text and ASCII codes.
     
     HOW IT WORKS:
     - If user enters text like "Hello"
       we convert each character to its
       ASCII code: 72 101 108 108 111
     
     - If user enters a number like "72"
       we convert it to the character: H
     
     WHY:
     ASCII codes are fundamental to computing.
     Every character you see has a numeric
     code. Developers use these for encoding,
     data processing, and debugging.
     
     HOW we detect mode:
     If the input is all digits (with spaces),
     we treat it as ASCII codes to convert
     to text. Otherwise, we treat it as text
     to convert to ASCII codes.
  ======================================== */
  var asciiCalcBtn = document.getElementById('ascii-calc-btn');

  if (asciiCalcBtn) {
    asciiCalcBtn.addEventListener('click', function() {
      var asciiInput = document.getElementById('ascii-input');
      if (!asciiInput) return;

      var input = asciiInput.value.trim();

      if (!input) {
        if (window.showToast) {
          window.showToast('Please enter text or ASCII codes');
        }
        return;
      }

      /* Detect if input is ASCII codes (numbers)
         or text (characters) */
      var isAsciiCodes = /^[\d\s,]+$/.test(input);

      if (isAsciiCodes) {
        /* ---- ASCII CODES TO TEXT ----
           Split by spaces or commas,
           convert each number to character */
        var codes = input
          .split(/[\s,]+/)
          .filter(function(c) { return c !== ''; });

        var text = '';
        var validCodes = [];

        codes.forEach(function(code) {
          var num = parseInt(code);
          if (!isNaN(num) && num >= 0 && num <= 127) {
            /* Printable ASCII range check */
            if (num >= 32 && num <= 126) {
              text += String.fromCharCode(num);
            } else if (num === 10) {
              text += '↵';
            } else if (num === 13) {
              text += '⏎';
            } else if (num === 9) {
              text += '⇥';
            } else if (num === 32) {
              text += '␣';
            } else {
              text += '·';
            }
            validCodes.push(num);
          }
        });

        if (validCodes.length === 0) {
          if (window.showToast) {
            window.showToast('No valid ASCII codes found (0-127)');
          }
          return;
        }

        setText('ascii-text', text);
        setText('ascii-codes', validCodes.join(' '));

      } else {
        /* ---- TEXT TO ASCII CODES ----
           Convert each character to its code */
        var asciiCodes = [];
        var displayText = input;

        for (var i = 0; i < input.length; i++) {
          var charCode = input.charCodeAt(i);
          asciiCodes.push(charCode);
        }

        /* Limit display length */
        if (displayText.length > 50) {
          displayText = displayText.substring(0, 50) + '...';
        }

        setText('ascii-text', displayText);
        setText('ascii-codes', asciiCodes.join(' '));
      }

      showCard('ascii-result');

      if (window.showToast) {
        window.showToast('ASCII converted');
      }
    });
  }

  /* ========================================
     ENTER KEY SUPPORT
  ======================================== */
  var devInputPairs = [
    { input: 'base-input', btn: 'base-calc-btn' },
    { input: 'color-hex', btn: 'color-calc-btn' },
    { input: 'ascii-input', btn: 'ascii-calc-btn' }
  ];

  devInputPairs.forEach(function(pair) {
    var input = document.getElementById(pair.input);
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

  /* ========================================
     LIVE HEX COLOR PREVIEW
     
     WHY: As user types a hex code, we show
     a live preview of the color in the
     input border. This gives immediate
     visual feedback before pressing convert.
  ======================================== */
  var hexInput = document.getElementById('color-hex');

  if (hexInput) {
    hexInput.addEventListener('input', function() {
      var hex = this.value.trim().replace(/^#/, '');

      /* Support shorthand */
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        this.style.borderColor = '#' + hex;
        this.style.boxShadow = '0 0 0 3px ' + '#' + hex + '30';
      } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      }
    });

    /* Reset on blur */
    hexInput.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  }

  /* ========================================
     AUTO-UPPERCASE HEX INPUT
     
     WHY: Hex codes look better in uppercase
     (FF vs ff). We convert as user types.
  ======================================== */
  var baseInput = document.getElementById('base-input');

  if (baseInput) {
    var baseFromSelect = document.getElementById('base-from');

    baseInput.addEventListener('input', function() {
      if (baseFromSelect && baseFromSelect.value === '16') {
        var pos = this.selectionStart;
        this.value = this.value.toUpperCase();
        this.setSelectionRange(pos, pos);
      }
    });
  }

  /* ========================================
     SELECT ALL ON FOCUS
  ======================================== */
  var devInputs = document.querySelectorAll(
    '#mode-developer .form-input'
  );

  devInputs.forEach(function(input) {
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
