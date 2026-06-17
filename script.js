// Highlight active nav link based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => observer.observe(section));

// Terminal easter egg
const COMMANDS = {
  help: () => [
    "available commands:",
    "  whoami            — who is this guy",
    "  ls experience/    — work history",
    "  cat &lt;company&gt;     — details on a role (apple, revops, umass, blub0x)",
    "  ls projects/      — things i've built",
    "  cat &lt;project&gt;     — details on a project (myr, juke, protostar)",
    "  open &lt;link&gt;       — github, linkedin, email",
    "  run &lt;effect&gt;      — glitch, warp, or matrix",
    "  run reset         — stop the current effect",
    "  clear             — clear the terminal",
    "  exit              — close",
  ],

  whoami: () => [
    "chris berns",
    "senior software engineer @ apple — r&d, ai &amp; autonomy",
    "previously: revops (first eng hire), umass lowell (researcher), blub0x",
    "interested in: hard problems, teaching, things that don't have obvious answers yet",
  ],

  "ls experience/": () => [
    "apple/",
    "revops/",
    "umass-lowell/",
    "blub0x/",
  ],

  "ls projects/": () => [
    "myr/",
    "juke/",
    "protostar/",
  ],

  "cat apple": () => [
    "<span class='t-accent'>Apple</span> — Senior Software Engineer",
    "2021 – present",
    "",
    "r&amp;d in ai and autonomy. started as a contractor, converted to full-time.",
    "working on problems that are still being figured out.",
  ],

  "cat revops": () => [
    "<span class='t-accent'>RevOps</span> — Senior Software Engineer",
    "2019 – 2021",
    "",
    "first engineering hire. built a quote-to-cash platform for saas sales teams",
    "from scratch — the kind of role where you have to figure everything out as you go.",
  ],

  "cat umass": () => [
    "<span class='t-accent'>UMass Lowell</span> — Undergraduate Researcher",
    "2018 – 2019",
    "",
    "lead developer on MYR, a browser-based 3d environment for teaching programming.",
    "mentored new lab members. co-authored a paper on cs pedagogy.",
  ],

  "cat umass-lowell": () => COMMANDS["cat umass"](),

  "cat blub0x": () => [
    "<span class='t-accent'>BluB0X Security</span> — Support Services &amp; Jr. Developer",
    "2015 – 2017",
    "",
    "where i wrote my first real code. started in support,",
    "talked my way into development, and never looked back.",
  ],

  "cat myr": () => [
    "<span class='t-accent'>MYR</span>",
    "a browser-based 3d scene editor designed to make programming accessible.",
    "built to lower the barrier to entry for cs education.",
    "led to an academic publication on cs pedagogy.",
    "",
    "→ <a href='https://github.com/engaging-computing/MYR' target='_blank' rel='noopener'>github.com/engaging-computing/MYR</a>",
  ],

  "cat juke": () => [
    "<span class='t-accent'>Juke</span>",
    "browser-based multiplayer games where the winner picks the next song,",
    "building a crowdsourced playlist in real time.",
    "",
    "→ <a href='https://github.com/CBernsCode/Juke' target='_blank' rel='noopener'>github.com/CBernsCode/Juke</a>",
  ],

  "cat protostar": () => [
    "<span class='t-accent'>Protostar</span>",
    "an application for rapidly prototyping vr interfaces in the browser.",
    "built for a human-computer interaction course.",
    "",
    "→ <a href='https://github.com/CBernsCode/hcifinal' target='_blank' rel='noopener'>github.com/CBernsCode/hcifinal</a>",
  ],

  "open github": () => { window.open("https://github.com/CBernsCode", "_blank"); return ["opening github..."]; },
  "open linkedin": () => { window.open("https://www.linkedin.com/in/chris-berns/", "_blank"); return ["opening linkedin..."]; },
  "open email": () => { window.location.href = "mailto:chris@chrisberns.com"; return ["opening email..."]; },

  "run glitch": () => { window.chris.glitch(); return ["running glitch — chris.reset() or <span class='t-accent'>run reset</span> to stop"]; },
  "run warp":   () => { window.chris.warp();   return ["running warp — chris.reset() or <span class='t-accent'>run reset</span> to stop"]; },
  "run matrix": () => { window.chris.matrix(); return ["running matrix — chris.reset() or <span class='t-accent'>run reset</span> to stop"]; },
  "run reset":  () => { window.chris.reset();  return ["effect stopped"]; },

  clear: () => "__clear__",
  exit: () => "__exit__",
  quit: () => "__exit__",
  q: () => "__exit__",
};

// Build terminal DOM
const terminal = document.createElement("div");
terminal.id = "terminal";
terminal.innerHTML = `
  <div id="terminal-bar">
    <span id="terminal-title">chris@berns ~ %</span>
    <button id="terminal-close" aria-label="close terminal">✕</button>
  </div>
  <div id="terminal-output"></div>
  <div id="terminal-input-row">
    <span class="t-prompt">~/chris-berns %</span>
    <input id="terminal-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
  </div>
`;
document.body.appendChild(terminal);

const terminalEl = document.getElementById("terminal");
const outputEl = document.getElementById("terminal-output");
const inputEl = document.getElementById("terminal-input");
const closeBtn = document.getElementById("terminal-close");

let history = [];
let historyIndex = -1;
let isOpen = false;

function openTerminal() {
  if (isOpen) return;
  isOpen = true;
  terminalEl.classList.add("open");
  inputEl.focus();
  if (outputEl.children.length === 0) {
    appendLines([
      "chris-berns terminal v1.0.0",
      "type <span class='t-accent'>help</span> to see available commands.",
      "",
    ]);
  }
}

function closeTerminal() {
  isOpen = false;
  terminalEl.classList.remove("open");
}

function appendLines(lines) {
  lines.forEach((line) => {
    const div = document.createElement("div");
    div.className = "t-line";
    div.innerHTML = line === "" ? "&nbsp;" : line;
    outputEl.appendChild(div);
  });
  outputEl.scrollTop = outputEl.scrollHeight;
}

function appendCommand(cmd) {
  const div = document.createElement("div");
  div.className = "t-line t-cmd";
  div.innerHTML = `<span class='t-prompt'>~/chris-berns %</span> ${cmd}`;
  outputEl.appendChild(div);
}

function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  history.unshift(raw);
  historyIndex = -1;
  appendCommand(raw);

  const handler = COMMANDS[cmd];
  if (!handler) {
    appendLines([`command not found: ${cmd}`, "type <span class='t-accent'>help</span> for available commands.", ""]);
    return;
  }

  const result = handler();
  if (result === "__clear__") {
    outputEl.innerHTML = "";
  } else if (result === "__exit__") {
    closeTerminal();
  } else {
    appendLines([...result, ""]);
  }
}

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = inputEl.value;
    inputEl.value = "";
    runCommand(val);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      inputEl.value = history[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputEl.value = history[historyIndex];
    } else {
      historyIndex = -1;
      inputEl.value = "";
    }
  } else if (e.key === "Escape") {
    closeTerminal();
  }
});

closeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dev-mode")) {
    exitDevMode();
  } else {
    closeTerminal();
  }
});

let devMode = false;

function enterDevMode() {
  devMode = true;
  document.body.classList.add("dev-mode");
  document.getElementById("dev-mode-toggle").textContent = "✕ exit";
  openTerminal();
}

function exitDevMode() {
  devMode = false;
  document.body.classList.remove("dev-mode");
  document.getElementById("dev-mode-toggle").textContent = ">_";
  closeTerminal();
}

document.getElementById("dev-mode-toggle").addEventListener("click", () => {
  devMode ? exitDevMode() : enterDevMode();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "`" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    isOpen ? closeTerminal() : openTerminal();
  } else if (e.key === "Escape" && isOpen) {
    devMode ? exitDevMode() : closeTerminal();
  }
});
