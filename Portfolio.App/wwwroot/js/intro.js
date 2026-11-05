var terminal = document.getElementById("oldSkool");

var context = terminal.getContext("2d");
terminal.width = 1024; // window.innerWidth;
terminal.height = 1024;
terminal.style.width = "50%";
terminal.style.height = "100%";
terminal.style.pointerEvents = "none";
terminal.style.zIndex = "-1";

var resume;
function relay() {
  window.requestAnimationFrame(relay);
  resume();
}

// ============================================================
//  CONFIG — tweak these to taste
// ============================================================

var CONFIG = {
  // What gets typed out. Each string = one line.
  text: [
    "Hello, world!",
    "",
    "This is a self-typing terminal effect.",
    "All sizes below are derived from FONT_SIZE.",
    "",
    "Try changing FONT_SIZE and everything scales.",
    "",
    "   _.-'`'-._",
    "  ;  _____  ;",
    "  | |     | |",
    "  | |     | |",
    "  ; :_____: ;",
    "   '-._____.-'",
  ],

  // Visual style
  fontFamily: "monospace", // any CSS font-family
  fontSize: 36, // px — the ONE number that drives the layout
  lineHeightMul: 1.4, // multiplier on fontSize -> line spacing
  marginLeft: 20, // px from left edge
  marginTop: 20, // px from top edge

  // Cursor (the "caret" block)
  cursorWidthMul: 0.6, // × fontSize  -> cursor width
  cursorHeightMul: 1.0, // × fontSize  -> cursor height
  cursorOffsetX: 2, // px gap between text and cursor
  cursorOffsetY: 0, // px vertical offset (fine tuning)

  // Colors (hue in degrees, 120 = green)
  textHue: 120,
  cursorHue: 120,

  // Fade / glow
  fadeAlpha: 0.4, // lower = longer ghost trails
  shadowBlur: 9,
  glowAlpha: 0.5,

  // Scroll: how many px to shift up per frame once typing reaches the bottom
  scrollStep: 0.5,
  scrollBottomGap: 200, // start scrolling when cursor is this many px from bottom
};

// ============================================================
//  Derived values — computed once from CONFIG
// ============================================================

var FONT_PX = CONFIG.fontSize;
var LINE_H = FONT_PX * CONFIG.lineHeightMul;
var CURSOR_W = FONT_PX * CONFIG.cursorWidthMul;
var CURSOR_H = FONT_PX * CONFIG.cursorHeightMul;

// ============================================================
//  Setup
// ============================================================

var _s = CONFIG.text;
var x = 0,
  y = 0;

var w = (terminal.width = window.innerWidth);
var h = (terminal.height = window.innerHeight);

// db.style.margin = 0;
// db.style.background = "transparent"; // "hsla(0,0%,0%,1)";
// db.style.overflow = "hidden";
context.textBaseline = "top";
context.font = FONT_PX + "px " + CONFIG.fontFamily;

// ============================================================
//  Draw loop
// ============================================================

resume = function () {
  // 1. Fade previous frame -> phosphor trail
  context.globalCompositeOperation = "source-over";
  context.shadowBlur = 0;
  context.fillStyle = "hsla(0,0%,0%," + CONFIG.fadeAlpha + ")";
  context.fillRect(0, 0, w, h);

  // 2. Glow + additive blend for the CRT look
  context.shadowColor =
    "hsla(" + CONFIG.textHue + ",100%,50%," + CONFIG.glowAlpha + ")";
  context.shadowBlur = CONFIG.shadowBlur;
  context.fillStyle = "hsla(" + CONFIG.textHue + ",100%,20%,1)";
  context.globalCompositeOperation = "lighter";

  // 3. Draw all completed lines + partial current line
  for (var i = 0; i <= y && i < _s.length; i++) {
    var t = _s[i];
    if (i === y) t = t.substr(0, x);
    context.fillText(t, CONFIG.marginLeft, CONFIG.marginTop + i * LINE_H);
  }

  // 4. Cursor block right after the last typed char
  if (y < _s.length) {
    context.fillStyle = "hsla(" + CONFIG.cursorHue + ",100%,50%,1)";
    var typed = _s[y].substr(0, x);
    context.fillRect(
      CONFIG.marginLeft + context.measureText(typed).width + CONFIG.cursorOffsetX,
      CONFIG.marginTop + y * LINE_H + CONFIG.cursorOffsetY,
      CURSOR_W,
      CURSOR_H,
    );
  }

  // 5. Advance the typewriter
  x++;
  if (y < _s.length && x > _s[y].length) {
    y++;
    x = 0;
  }

  // 6. Scroll up once we approach the bottom of the viewport
  if (CONFIG.marginTop + y * LINE_H > h - CONFIG.scrollBottomGap) {
    context.translate(0, -CONFIG.scrollStep);
  }
};

relay();
