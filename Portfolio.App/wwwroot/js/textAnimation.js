(function(){
  // ============================================================
  // CONFIG
  // ============================================================
  var CONFIG = {
    // typing speed
    charDelay: 40,          // ms between characters

    // trail / fade effect
    trailLength: 25,        // how many characters keep full brightness behind the cursor
    trailFade:   0.85,      // each step back multiplies brightness by this (0..1)
    fgColor:     "hsl(120,100%,50%)",  // terminal green
    bgColor:     "transparent",       // page/div background (for the fade)

    // cursor
    cursorChar:  "\u2588",  // █ full block
    cursorBlink: 500,       // ms per blink half-cycle

    // scroll: keep the cursor roughly this many px from the bottom of the window
    scrollBottomGap: 200,
  };

  // ============================================================
  // SETUP
  // ============================================================

  var root = document.getElementById("animatedElement");
  if (!root) return;
  alert();

  // Style the container so it looks like a terminal
  var rs = root.style;
  rs.background   = CONFIG.bgColor;
  rs.color        = CONFIG.fgColor;
  rs.fontFamily   = "monospace";
  rs.fontSize     = "18px";
  rs.lineHeight   = "1.4";
  rs.padding      = "2em";
  rs.margin       = "0";
  rs.minHeight    = "100vh";
  rs.boxSizing    = "border-box";
  rs.overflow     = "hidden";
  rs.whiteSpace   = "pre-wrap";
  rs.textShadow   = "0 0 6px " + CONFIG.fgColor;
  document.body.style.margin     = 0;
  document.body.style.background = CONFIG.bgColor;

  // 1. Grab the text content from the original DOM, per <p>
  var paragraphs = Array.prototype.map.call(
    root.querySelectorAll("p"),
    function(p){ return p.textContent; }
  );

  // 2. Wipe the DOM and rebuild empty <p> skeletons
  root.innerHTML = "";
  var pEls = paragraphs.map(function(){
    var p = document.createElement("p");
    p.style.margin = "0";
    root.appendChild(p);
    return p;
  });

  // 3. Flatten everything into a single list of characters, each with
  //    a pointer to the <p> it belongs to (and whether it's a newline)
  var chars = [];               // [{ch, p}, ...]
  paragraphs.forEach(function(text, pi){
    for (var i = 0; i < text.length; i++) {
      chars.push({ ch: text[i], p: pEls[pi] });
    }
  });

  // 4. Pre-create a <span> for every character, inserted into its <p>,
  //    but leave them invisible (opacity 0) until the typewriter reaches them.
  var spans = chars.map(function(c){
    var s = document.createElement("span");
    s.textContent = c.ch;
    s.style.opacity = "0";
    s.style.color   = CONFIG.fgColor;
    c.p.appendChild(s);
    return s;
  });

  // Cursor is its own span, appended to whichever <p> is currently active.
  var cursor = document.createElement("span");
  cursor.textContent = CONFIG.cursorChar;
  cursor.style.color = CONFIG.fgColor;

  // ============================================================
  //  STATE
  // ============================================================

  var head     = 0;             // index of the char currently being typed
  var start    = Date.now();
  var lastBlink = 0;
  var blinking = true;

  // ============================================================
  //  DRAW LOOP
  // ============================================================

  function tick(now){
    // ---- 1. Reveal new characters based on elapsed time ----
    var target = Math.floor((now - start) / CONFIG.charDelay);
    if (target > head) {
      // Cursor moves to the <p> of the next character to be typed
      if (head < chars.length) {
        chars[head].p.appendChild(cursor);
      }

      // Reveal each newly-arrived char
      while (head < target && head < chars.length) {
        spans[head].style.opacity = "1";
        head++;
      }

      // Cursor belongs after the most recently revealed char
      if (head > 0 && head <= chars.length) {
        chars[head - 1].p.appendChild(cursor);
      }

      // Once typing is complete, stop blinking the cursor after a while
      if (head >= chars.length) {
        cursor.remove();
      }
    }

    // ---- 2. Fade older characters (the phosphor trail) ----
    // Every char before the cursor, farther than `trailLength` back,
    // gets its opacity multiplied by `trailFade` each frame.
    for (var i = 0; i < head - CONFIG.trailLength; i++) {
      var o = parseFloat(spans[i].style.opacity) || 0;
      if (o > 0.02) {
        spans[i].style.opacity = (o * CONFIG.trailFade).toFixed(3);
      } else {
        spans[i].style.opacity = "0";
      }
    }

    // ---- 3. Blink the cursor (only while typing) ----
    if (head < chars.length) {
      if (now - lastBlink > CONFIG.cursorBlink) {
        lastBlink = now;
        blinking = !blinking;
        cursor.style.opacity = blinking ? "1" : "0";
      }

      // ---- 4. Scroll if the cursor nears the bottom ----
      var rect = cursor.getBoundingClientRect();
      if (rect.top > window.innerHeight - CONFIG.scrollBottomGap) {
        window.scrollBy(0, rect.top - (window.innerHeight - CONFIG.scrollBottomGap));
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();