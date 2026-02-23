let floors = [];
let introduction = {};
const LAST_SCROLL_STORAGE_KEY = "ai-elevator:last-scroll-y";
const defaultSettings = {
  animations: {
    pageFadeMs: 420,
    layoutSlideMs: 520,
    cardRevealMs: 560,
    layoutFlipMs: 560,
    carMoveMs: 380,
    landingFadeMs: 180
  },
  interactions: {
    landingFadeDistancePx: 540,
    introRevealDistancePx: 280,
    revealThreshold: 0.24,
    activeThreshold: 0.58,
    landingObserverThreshold: 0.45
  },
  pcb: {
    packetIntervalMs: 820,
    packetDurationMinMs: 2200,
    packetDurationRangeMs: 900,
    cpuFlashMs: 190,
    cpuFlashFirstRatio: 0.52,
    cpuFlashSecondRatio: 0.72
  },
  layout: {
    flipCleanupExtraMs: 60
  }
};
const runtimeSettings = {
  ...defaultSettings.animations,
  ...defaultSettings.interactions,
  ...defaultSettings.pcb,
  ...defaultSettings.layout
};

const stopsEl = document.getElementById("stops");
const layoutEl = document.getElementById("experience-layout");
const towerFloorsEl = document.getElementById("tower-floors");
const carEl = document.getElementById("car");
const activeFloorEl = document.getElementById("active-floor");
const altitudeEl = document.getElementById("altitude");
const layerEl = document.getElementById("layer");
const hudHumansEl = document.getElementById("hud-humans");
const hudVelocityEl = document.getElementById("hud-velocity");
const hudTeamEl = document.getElementById("hud-team");
const hudAgentsEl = document.getElementById("hud-agents");
const landingEl = document.getElementById("landing");
const packetLaneEl = document.getElementById("packet-lane");
const cpuCoreEl = document.getElementById("cpu-core");
const towerIntroEl = document.getElementById("tower-intro");
const landingKickerEl = document.getElementById("landing-kicker");
const landingTitleEl = document.getElementById("landing-title");
const landingBodyEl = document.getElementById("landing-body");
const landingNoteEl = document.getElementById("landing-note");
const retroScreenEl = document.getElementById("retro-screen");
const showFloorsLinkEl = document.getElementById("show-floors-link");
const floorPlaintextEl = document.getElementById("floor-plaintext");

const packetInputs = ["JAVA", "PYTHON", "GO"];
const packetOutputs = {
  JAVA: "101011101",
  PYTHON: "00101011",
  GO: "010"
};
const packetColors = [
  ["#67d7ff", "#ffe08e", "#ff90cd"],
  ["#7ce7b4", "#ffe08e", "#ff8f79"],
  ["#8ec3ff", "#ffd777", "#f89dff"]
];
const retroIdleDelayMs = 2600;
const retroTypeDelayMs = 24;
const retroInitialText = "package main";
const retroSieveSource = [
  "package main",
  "",
  "import (",
  "    \"fmt\"",
  ")",
  "",
  "func sieve(limit int) []int {",
  "    if limit < 2 {",
  "        return nil",
  "    }",
  "",
  "    isPrime := make([]bool, limit+1)",
  "    for i := 2; i <= limit; i++ {",
  "        isPrime[i] = true",
  "    }",
  "",
  "    for p := 2; p*p <= limit; p++ {",
  "        if !isPrime[p] {",
  "            continue",
  "        }",
  "",
  "        for multiple := p * p; multiple <= limit; multiple += p {",
  "            isPrime[multiple] = false",
  "        }",
  "    }",
  "",
  "    primes := make([]int, 0, limit/2)",
  "    for i := 2; i <= limit; i++ {",
  "        if isPrime[i] {",
  "            primes = append(primes, i)",
  "        }",
  "    }",
  "",
  "    return primes",
  "}",
  "",
  "func main() {",
  "    const limit = 100",
  "    primes := sieve(limit)",
  "    fmt.Printf(\"Primes up to %d:\\n%v\\n\", limit, primes)",
  "}"
].join("\n");
let currentLayoutSideClass = "side-left";
let flipTimerId = null;
let packetIntervalId = null;
let groundFloorTextTimerId = null;
let groundFloorSequencePlayed = false;
let retroIdleTimerId = null;
let retroTypingTimerId = null;
let retroTypingIndex = 0;
let retroTypingStarted = false;
let retroTypingPaused = false;
let retroTypingCompleted = false;

function readNumber(value, fallback, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, num));
}

function applySettings(settings) {
  const animations = settings && settings.animations ? settings.animations : {};
  const interactions = settings && settings.interactions ? settings.interactions : {};
  const pcb = settings && settings.pcb ? settings.pcb : {};
  const layout = settings && settings.layout ? settings.layout : {};

  runtimeSettings.pageFadeMs = readNumber(
    animations.pageFadeMs,
    defaultSettings.animations.pageFadeMs,
    0,
    4000
  );
  runtimeSettings.layoutSlideMs = readNumber(
    animations.layoutSlideMs,
    defaultSettings.animations.layoutSlideMs,
    0,
    4000
  );
  runtimeSettings.cardRevealMs = readNumber(
    animations.cardRevealMs,
    defaultSettings.animations.cardRevealMs,
    0,
    4000
  );
  runtimeSettings.layoutFlipMs = readNumber(
    animations.layoutFlipMs,
    defaultSettings.animations.layoutFlipMs,
    0,
    4000
  );
  runtimeSettings.carMoveMs = readNumber(
    animations.carMoveMs,
    defaultSettings.animations.carMoveMs,
    0,
    4000
  );
  runtimeSettings.landingFadeMs = readNumber(
    animations.landingFadeMs,
    defaultSettings.animations.landingFadeMs,
    0,
    4000
  );

  runtimeSettings.landingFadeDistancePx = readNumber(
    interactions.landingFadeDistancePx,
    defaultSettings.interactions.landingFadeDistancePx,
    1,
    4000
  );
  runtimeSettings.introRevealDistancePx = readNumber(
    interactions.introRevealDistancePx,
    defaultSettings.interactions.introRevealDistancePx,
    1,
    4000
  );
  runtimeSettings.revealThreshold = readNumber(
    interactions.revealThreshold,
    defaultSettings.interactions.revealThreshold,
    0,
    1
  );
  runtimeSettings.activeThreshold = readNumber(
    interactions.activeThreshold,
    defaultSettings.interactions.activeThreshold,
    0,
    1
  );
  runtimeSettings.landingObserverThreshold = readNumber(
    interactions.landingObserverThreshold,
    defaultSettings.interactions.landingObserverThreshold,
    0,
    1
  );

  runtimeSettings.packetIntervalMs = readNumber(
    pcb.packetIntervalMs,
    defaultSettings.pcb.packetIntervalMs,
    1,
    10000
  );
  runtimeSettings.packetDurationMinMs = readNumber(
    pcb.packetDurationMinMs,
    defaultSettings.pcb.packetDurationMinMs,
    1,
    20000
  );
  runtimeSettings.packetDurationRangeMs = readNumber(
    pcb.packetDurationRangeMs,
    defaultSettings.pcb.packetDurationRangeMs,
    0,
    20000
  );
  runtimeSettings.cpuFlashMs = readNumber(
    pcb.cpuFlashMs,
    defaultSettings.pcb.cpuFlashMs,
    0,
    5000
  );
  runtimeSettings.cpuFlashFirstRatio = readNumber(
    pcb.cpuFlashFirstRatio,
    defaultSettings.pcb.cpuFlashFirstRatio,
    0,
    1
  );
  runtimeSettings.cpuFlashSecondRatio = readNumber(
    pcb.cpuFlashSecondRatio,
    defaultSettings.pcb.cpuFlashSecondRatio,
    0,
    1
  );

  runtimeSettings.flipCleanupExtraMs = readNumber(
    layout.flipCleanupExtraMs,
    defaultSettings.layout.flipCleanupExtraMs,
    0,
    2000
  );

  document.documentElement.style.setProperty("--duration-page-fade", `${runtimeSettings.pageFadeMs}ms`);
  document.documentElement.style.setProperty("--duration-layout-slide", `${runtimeSettings.layoutSlideMs}ms`);
  document.documentElement.style.setProperty("--duration-card-reveal", `${runtimeSettings.cardRevealMs}ms`);
  document.documentElement.style.setProperty("--duration-layout-flip", `${runtimeSettings.layoutFlipMs}ms`);
  document.documentElement.style.setProperty("--duration-car-move", `${runtimeSettings.carMoveMs}ms`);
  document.documentElement.style.setProperty("--duration-landing-fade", `${runtimeSettings.landingFadeMs}ms`);
}

function getIntroduction() {
  return introduction || {};
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatFloorsPlainText(floorList) {
  if (!Array.isArray(floorList) || !floorList.length) {
    return "No floors found in app.json.";
  }

  return floorList
    .map((floor, index) => {
      const floorLevel = floor.level || `Floor ${index + 1}`;
      const floorTitle = floor.title || "Untitled";
      const subtitle = stripHtml(floor.subtitle || "");
      const description = stripHtml(floor.description || "");
      const lines = [`${index + 1}. ${floorLevel}`, `Title: ${floorTitle}`];

      if (subtitle) {
        lines.push(`Subtitle: ${subtitle}`);
      }
      if (description) {
        lines.push(`Description: ${description}`);
      }

      return lines.join("\n");
    })
    .join("\n\n");
}

function setupFloorPlainTextLink() {
  if (!showFloorsLinkEl || !floorPlaintextEl) {
    return;
  }

  showFloorsLinkEl.addEventListener("click", async (event) => {
    event.preventDefault();
    floorPlaintextEl.hidden = false;
    floorPlaintextEl.textContent = "Loading floors from app.json...";

    try {
      const appConfig = await loadAppConfig();
      floorPlaintextEl.textContent = formatFloorsPlainText(appConfig.floors);
    } catch (error) {
      floorPlaintextEl.textContent = "Unable to read app.json right now.";
      console.error(error);
    }

    floorPlaintextEl.focus();
  });
}

function clearIntroductionContent() {
  document.body.classList.remove("introduction-visible");
  towerIntroEl.textContent = "";
  landingKickerEl.textContent = "";
  landingTitleEl.textContent = "";
  landingBodyEl.textContent = "";
  landingNoteEl.textContent = "";
}

function applyIntroductionContent() {
  const intro = getIntroduction();

  towerIntroEl.textContent = intro.towerIntro || "";
  landingKickerEl.textContent = intro.landingKicker || "";
  landingTitleEl.textContent = intro.landingTitle || "";
  landingBodyEl.textContent = intro.landingBody || "";
  landingNoteEl.textContent = intro.landingNote || "";

  window.requestAnimationFrame(() => {
    document.body.classList.add("introduction-visible");
  });
}

function render() {
  const visualOrder = floors.slice().reverse();
  const intro = getIntroduction();

  const floorsMarkup = visualOrder
    .map((floor) => {
      const index = floors.indexOf(floor);
      const welcome = floor.welcome ? `<p class="welcome">${floor.welcome}</p>` : "";

      return `
        <article class="stop" data-index="${index}" id="${floor.id}">
          <section class="card">
            <div class="badges">
              <span>${floor.level}</span>
              <span>Velocity ${floor.velocity}</span>
              <span>Parallel Humans ${floor.humans}</span>
              <span>Agents ${floor.agents}</span>
            </div>
            <h2>${floor.title}</h2>
            <p class="subtitle">${floor.subtitle}</p>
            <p>${floor.description}</p>
            ${welcome}
          </section>
        </article>
      `;
    })
    .join("");

  const entryStop = intro.entryStop || {};
  const entryMarkup = entryStop.title
    ? `
      <article class="stop entry-stop" id="tower-entry">
        <section class="card">
          <div class="badges">
            <span>${entryStop.badge || "Tower Entry"}</span>
          </div>
          <h2>${entryStop.title}</h2>
          <p class="subtitle">${entryStop.subtitle || ""}</p>
          <p>${entryStop.description || ""}</p>
        </section>
      </article>
    `
    : "";

  stopsEl.innerHTML = `${floorsMarkup}${entryMarkup}`;

  towerFloorsEl.innerHTML = visualOrder
    .map((floor) => {
      const index = floors.indexOf(floor);
      return `<li class="tower-floor" data-index="${index}" title="${floor.level}"></li>`;
    })
    .join("");
}

function setActive(index) {
  if (!floors.length) {
    return;
  }

  const towerFloors = Array.from(document.querySelectorAll(".tower-floor"));
  const target = towerFloors.find((node) => Number(node.dataset.index) === index);

  if (!target) {
    return;
  }

  towerFloors.forEach((node) => node.classList.remove("active"));
  target.classList.add("active");

  const current = floors[index];
  updateLayoutForFloor(index);
  triggerGroundFloorSequence(index);
  activeFloorEl.textContent = current.level;
  altitudeEl.textContent = `${current.altitude.toLocaleString()}`;
  layerEl.textContent = current.layer;
  hudHumansEl.textContent = current.humans;
  hudVelocityEl.textContent = current.velocity;
  hudTeamEl.textContent = current.team;
  hudAgentsEl.textContent = current.agents;
  document.body.dataset.layer = current.layer.toLowerCase().replace(/\s+/g, "-");

  const top = target.offsetTop;
  carEl.style.height = `${target.offsetHeight}px`;
  document.documentElement.style.setProperty("--car-top", `${top}px`);
}

function triggerGroundFloorSequence(index) {
  if (groundFloorSequencePlayed) {
    return;
  }

  const groundFloorIndex = floors.findIndex((floor) => floor.id === "ground-floor");
  if (groundFloorIndex < 0 || index !== groundFloorIndex) {
    return;
  }

  groundFloorSequencePlayed = true;
  document.body.classList.add("ground-floor-sequence");

  window.requestAnimationFrame(() => {
    document.body.classList.add("ground-floor-building-ready");
  });

  if (groundFloorTextTimerId) {
    window.clearTimeout(groundFloorTextTimerId);
  }

  groundFloorTextTimerId = window.setTimeout(() => {
    document.body.classList.add("ground-floor-text-ready");
    groundFloorTextTimerId = null;
  }, 2000);
}

function getDataSourceForFloor(index) {
  const floor = floors[index];
  return floor && floor.dataSource === "left" ? "left" : "right";
}

function updateLayoutForFloor(index) {
  if (!layoutEl) {
    return;
  }

  if (window.innerWidth <= 920) {
    layoutEl.classList.remove("side-left", "side-right", "is-flipping");
    currentLayoutSideClass = "side-left";
    return;
  }

  const dataSource = getDataSourceForFloor(index);
  const nextLayoutSideClass = dataSource === "left" ? "side-right" : "side-left";
  const sideChanged = nextLayoutSideClass !== currentLayoutSideClass;

  layoutEl.classList.remove("side-left", "side-right");
  layoutEl.classList.add(nextLayoutSideClass);

  if (sideChanged) {
    layoutEl.classList.add("is-flipping");
    if (flipTimerId) {
      window.clearTimeout(flipTimerId);
    }
    flipTimerId = window.setTimeout(() => {
      layoutEl.classList.remove("is-flipping");
      flipTimerId = null;
    }, runtimeSettings.layoutFlipMs + runtimeSettings.flipCleanupExtraMs);
  }

  currentLayoutSideClass = nextLayoutSideClass;
}

function initObservers() {
  const stops = document.querySelectorAll(".stop");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
        }
      });
    },
    { threshold: runtimeSettings.revealThreshold }
  );

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const index = Number(entry.target.dataset.index);
        if (Number.isNaN(index)) {
          return;
        }

        setActive(index);
      });
    },
    { threshold: runtimeSettings.activeThreshold }
  );

  stops.forEach((stop) => {
    revealObserver.observe(stop);
    activeObserver.observe(stop);
  });
}

function clampScrollTop(value) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(value, maxScroll));
}

function getSavedScrollTop() {
  try {
    const raw = window.localStorage.getItem(LAST_SCROLL_STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    const value = Number(raw);
    return Number.isFinite(value) ? clampScrollTop(value) : null;
  } catch {
    return null;
  }
}

function saveScrollTop() {
  try {
    window.localStorage.setItem(LAST_SCROLL_STORAGE_KEY, String(Math.round(window.scrollY)));
  } catch {}
}

function getBottomAlignedIntroductionScrollTop() {
  if (!landingEl) {
    return 0;
  }

  const rect = landingEl.getBoundingClientRect();
  const sectionTop = window.scrollY + rect.top;
  const bottomAligned = sectionTop + rect.height - window.innerHeight;
  return clampScrollTop(bottomAligned);
}

function restoreInitialScrollPosition() {
  const target = getBottomAlignedIntroductionScrollTop();
  window.scrollTo({ top: target, behavior: "auto" });
}

function setActiveFromViewport() {
  const stops = Array.from(document.querySelectorAll(".stop[data-index]"));
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  stops.forEach((stop) => {
    const index = Number(stop.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }

    const rect = stop.getBoundingClientRect();
    const center = (rect.top + rect.bottom) / 2;
    const distance = Math.abs(center - window.innerHeight / 2);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  setActive(bestIndex);
}

function updateLayoutForViewport() {
  if (!floors.length) {
    return;
  }

  const currentLabel = activeFloorEl.textContent;
  const index = floors.findIndex((floor) => floor.level === currentLabel);
  updateLayoutForFloor(index >= 0 ? index : 0);
}

function updateLandingProgress() {
  const distanceFromBottom = Math.max(
    0,
    document.body.scrollHeight - (window.scrollY + window.innerHeight)
  );
  const fadeDistance = runtimeSettings.landingFadeDistancePx;
  const introDistance = runtimeSettings.introRevealDistancePx;
  const progress = Math.max(0, Math.min(1, 1 - distanceFromBottom / fadeDistance));
  const introReveal = Math.max(0, Math.min(1, distanceFromBottom / introDistance));
  document.documentElement.style.setProperty("--landing-progress", progress.toFixed(3));
  document.documentElement.style.setProperty("--intro-reveal", introReveal.toFixed(3));
}

function setupLandingObserver() {
  if (!landingEl) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("in-landing", entry.isIntersecting);
        if (entry.isIntersecting) {
          resumeRetroTyping();
        } else {
          pauseRetroTyping();
        }
        if (!entry.isIntersecting) {
          document.documentElement.style.setProperty("--landing-progress", "0");
        }
      });
    },
    { threshold: runtimeSettings.landingObserverThreshold }
  );

  observer.observe(landingEl);
}

function flashCpu(color) {
  if (!cpuCoreEl) {
    return;
  }

  cpuCoreEl.style.setProperty("--cpu-glow", color);
  cpuCoreEl.classList.add("hot");
  window.setTimeout(() => cpuCoreEl.classList.remove("hot"), runtimeSettings.cpuFlashMs);
}

function spawnPacket() {
  if (!packetLaneEl) {
    return;
  }

  const packet = document.createElement("span");
  const input = packetInputs[Math.floor(Math.random() * packetInputs.length)];
  const output = packetOutputs[input] || input;
  const colors = packetColors[Math.floor(Math.random() * packetColors.length)];
  const duration =
    runtimeSettings.packetDurationMinMs +
    Math.floor(Math.random() * runtimeSettings.packetDurationRangeMs);
  const laneOffset = 48 + Math.random() * 8;

  packet.className = "packet";
  packet.textContent = input;
  packet.style.top = `${laneOffset}%`;
  packet.style.animationDuration = `${duration}ms`;
  packet.style.setProperty("--c-in", colors[0]);
  packet.style.setProperty("--c-mid", colors[1]);
  packet.style.setProperty("--c-out", colors[2]);
  packetLaneEl.append(packet);

  window.setTimeout(
    () => {
      flashCpu(colors[1]);
      packet.textContent = output;
    },
    Math.floor(duration * runtimeSettings.cpuFlashFirstRatio)
  );
  window.setTimeout(
    () => flashCpu(colors[2]),
    Math.floor(duration * runtimeSettings.cpuFlashSecondRatio)
  );
  packet.addEventListener("animationend", () => packet.remove(), { once: true });
}

function initPcbAnimation() {
  if (!packetLaneEl) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spawnPacket();
    return;
  }

  spawnPacket();
  if (packetIntervalId) {
    window.clearInterval(packetIntervalId);
  }
  packetIntervalId = window.setInterval(spawnPacket, runtimeSettings.packetIntervalMs);
}

function startRetroTyping() {
  if (!retroScreenEl || retroTypingCompleted || retroTypingTimerId) {
    return;
  }

  if (!retroTypingStarted) {
    retroTypingStarted = true;
    retroScreenEl.textContent = retroInitialText;
    retroTypingIndex = retroInitialText.length;
  }
  retroTypingPaused = false;

  retroTypingTimerId = window.setInterval(() => {
    if (!retroScreenEl) {
      return;
    }

    retroTypingIndex += 1;
    retroScreenEl.textContent = retroSieveSource.slice(0, retroTypingIndex);
    retroScreenEl.scrollTop = retroScreenEl.scrollHeight;

    if (retroTypingIndex >= retroSieveSource.length) {
      window.clearInterval(retroTypingTimerId);
      retroTypingTimerId = null;
      retroTypingCompleted = true;
    }
  }, retroTypeDelayMs);
}

function scheduleRetroTypingOnIdle() {
  if (!retroScreenEl || retroTypingStarted || retroTypingCompleted || retroTypingPaused) {
    return;
  }

  if (retroIdleTimerId) {
    window.clearTimeout(retroIdleTimerId);
  }

  retroIdleTimerId = window.setTimeout(() => {
    retroIdleTimerId = null;
    startRetroTyping();
  }, retroIdleDelayMs);
}

function initRetroTyping() {
  if (!retroScreenEl) {
    return;
  }

  retroScreenEl.textContent = retroInitialText;
  scheduleRetroTypingOnIdle();

  const idleResetEvents = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"];
  idleResetEvents.forEach((eventName) => {
    window.addEventListener(eventName, scheduleRetroTypingOnIdle, { passive: true });
  });
}

function pauseRetroTyping() {
  retroTypingPaused = true;
  if (retroIdleTimerId) {
    window.clearTimeout(retroIdleTimerId);
    retroIdleTimerId = null;
  }

  if (retroTypingTimerId) {
    window.clearInterval(retroTypingTimerId);
    retroTypingTimerId = null;
  }
}

function resumeRetroTyping() {
  retroTypingPaused = false;

  if (retroTypingCompleted) {
    return;
  }

  if (retroTypingStarted) {
    startRetroTyping();
    return;
  }

  scheduleRetroTypingOnIdle();
}

async function loadAppConfig() {
  const response = await fetch("app.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load app.json (${response.status})`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.floors)) {
    throw new Error("Invalid app.json format: expected { floors: [...] }");
  }

  return {
    floors: data.floors,
    introduction: data.introduction || {},
    settings: data.settings || {}
  };
}

async function init() {
  try {
    const appConfig = await loadAppConfig();
    floors = appConfig.floors;
    introduction = appConfig.introduction;
    applySettings(appConfig.settings);
  } catch (error) {
    console.error(error);
    document.body.classList.add("app-ready");
    return;
  }

  clearIntroductionContent();
  applyIntroductionContent();
  render();
  updateLayoutForFloor(0);
  restoreInitialScrollPosition();
  initObservers();
  setupLandingObserver();
  initPcbAnimation();
  initRetroTyping();
  setActiveFromViewport();
  updateLandingProgress();

  window.requestAnimationFrame(() => {
    document.body.classList.add("app-ready");
    restoreInitialScrollPosition();
    updateLandingProgress();
  });
}

setupFloorPlainTextLink();
init();

window.addEventListener("scroll", () => {
  saveScrollTop();
  updateLandingProgress();
});
window.addEventListener("resize", () => {
  if (!floors.length) {
    return;
  }

  const currentLabel = activeFloorEl.textContent;
  const index = floors.findIndex((floor) => floor.level === currentLabel);
  setActive(index >= 0 ? index : 0);
  updateLayoutForViewport();
  updateLandingProgress();
});
window.addEventListener("beforeunload", saveScrollTop);
