var terminal = document.getElementById("oldSkool");
if (!terminal) {
  throw new Error("Canvas #oldSkool was not found for intro.js.");
}

var context = terminal.getContext("2d");
var resume;
var introLines = [];
try {
  var introLinesRaw = terminal.dataset.introLines;
  if (introLinesRaw) {
    var parsedIntroLines = JSON.parse(introLinesRaw);
    if (Array.isArray(parsedIntroLines) && parsedIntroLines.every(function (line) {
      return typeof line === "string";
    })) {
      introLines = parsedIntroLines;
    } else {
      console.error("Invalid intro lines in data-intro-lines. Expected string array.");
    }
  }
} catch (error) {
  console.error("Failed to parse data-intro-lines for intro.js.", error);
}

context.textBaseline = "top";
context.font = "36px monospace";

function wrapTextLine(line, maxWidth) {
  if (!line) return [""];

  var tokens = line.split(/(\s+)/);
  var wrapped = [];
  var current = "";

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (!token) continue;

    var candidate = current + token;
    if (context.measureText(candidate).width <= maxWidth || current.length === 0) {
      current = candidate;
    } else {
      wrapped.push(current);
      current = token;
    }
  }

  if (current) {
    wrapped.push(current);
  }

  return wrapped.length > 0 ? wrapped : [""];
}

function buildRenderLines(lines) {
  var viewportLimit = Math.max(220, window.innerWidth * 0.9);
  var wrapped = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line === "") {
      wrapped.push("");
      continue;
    }

    var pieces = wrapTextLine(line, viewportLimit);
    for (var j = 0; j < pieces.length; j++) {
      wrapped.push(pieces[j]);
    }
  }

  return wrapped;
}

var renderLines = buildRenderLines(introLines.length > 0 ? introLines : []);

var longestLine = "";
for (var i = 0; i < renderLines.length; i++) {
  if (context.measureText(renderLines[i]).width > context.measureText(longestLine).width) {
    longestLine = renderLines[i];
  }
}

var fontSize = 36;
var lineHeight = fontSize * 1.4;
var marginLeft = 20;
var marginTop = 20;
var canvasWidth = Math.max(240, Math.ceil(context.measureText(longestLine).width + marginLeft * 2 + 20));
var canvasHeight = Math.ceil(renderLines.length * lineHeight + marginTop * 2 + 20);

terminal.width = canvasWidth;
terminal.height = canvasHeight;
terminal.style.width = canvasWidth + "px";
terminal.style.height = canvasHeight + "px";
terminal.style.pointerEvents = "none";
terminal.style.zIndex = "-1";
terminal.style.display = "block";
terminal.style.margin = "0 auto";

var textBoxWidth = canvasWidth;
var textBoxLeft = 0;

function relay() {
  window.requestAnimationFrame(relay);
  resume();
}

// ============================================================
//  CONFIG — tweak these to taste
// ============================================================

var CONFIG = {
  // What gets typed out. Each string = one line.
  text: renderLines,

  // Visual style
  // The canvas is sized to the widest rendered line, so it stays no wider than the text.
  blockWidth: textBoxWidth,
  blockLeft: textBoxLeft,
  fontFamily: "monospace", // any CSS font-family
  fontSize: fontSize, // px — the ONE number that drives the layout
  lineHeightMul: 1.4, // multiplier on fontSize -> line spacing
  marginLeft: marginLeft, // px from left edge
  marginTop: marginTop, // px from top edge

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

var w = terminal.width;
var h = terminal.height;

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
  var textX = CONFIG.blockLeft + CONFIG.marginLeft;
  for (var i = 0; i <= y && i < _s.length; i++) {
    var t = _s[i];
    if (i === y) t = t.substr(0, x);
    context.fillText(t, textX, CONFIG.marginTop + i * LINE_H);
  }

  // 4. Cursor block right after the last typed char
  if (y < _s.length) {
    context.fillStyle = "hsla(" + CONFIG.cursorHue + ",100%,50%,1)";
    var typed = _s[y].substr(0, x);
    context.fillRect(
      textX + context.measureText(typed).width + CONFIG.cursorOffsetX,
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
