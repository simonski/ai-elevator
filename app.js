const floors = [
  {
    id: "ground-floor",
    level: "Ground Floor",
    title: "Lobby",
    altitude: 0,
    layer: "Lobby Layer",
    humans: "x1",
    velocity: "x1",
    team: "Solo",
    agents: "x1",
    subtitle: "Website, prompting, conversational.",
    description:
      "You login to ChatGPT, Copilot, or Claude.ai. You talk to your AI, copy and paste, and get useful output quickly.",
    welcome: "Welcome aboard. You are at Ground Floor. Scroll up to ride the AI Elevator."
  },
  {
    id: "first-floor",
    level: "First Floor",
    title: "Editor Dialog",
    altitude: 900,
    layer: "City Layer",
    humans: "x1",
    velocity: "x1",
    team: "Pair",
    agents: "x1",
    subtitle: "You and the model are both writing code.",
    description:
      "Inside an editor, you stay in dialog with the model while it helps generate implementation as you iterate."
  },
  {
    id: "second-floor",
    level: "Second Floor",
    title: "Tooling Fluency",
    altitude: 1800,
    layer: "City Layer",
    humans: "x2",
    velocity: "x2",
    team: "Pair",
    agents: "x2",
    subtitle: "Plan mode and approvals improve speed.",
    description:
      "You start using command workflows. The editor can modify code for you while you approve actions and keep momentum."
  },
  {
    id: "third-floor",
    level: "Third Floor",
    title: "One-Shot Thinking",
    altitude: 3000,
    layer: "Builder Layer",
    humans: "x2",
    velocity: "x2",
    team: "Pair",
    agents: "x2",
    subtitle: "From back-and-forth chat to stronger one-shots.",
    description:
      "You rely more on structured instructions and preset rules. You write less code directly and focus on outcome quality."
  },
  {
    id: "fourth-floor",
    level: "Fourth Floor",
    title: "Rules as Infrastructure",
    altitude: 4500,
    layer: "Builder Layer",
    humans: "x2",
    velocity: "x2",
    team: "Pair",
    agents: "x2",
    subtitle: "Editor and terminal become one loop.",
    description:
      "You keep rules in markdown and auto-load them into sessions so behavior is consistent and reusable."
  },
  {
    id: "fifth-floor",
    level: "Fifth Floor",
    title: "Parallel Sessions",
    altitude: 6500,
    layer: "Builder Layer",
    humans: "x2",
    velocity: "x4",
    team: "Pod",
    agents: "x4",
    subtitle: "More than one agent session at a time.",
    description:
      "You run sessions in parallel, compare outputs, and share working patterns with other engineers."
  },
  {
    id: "sixth-floor",
    level: "Sixth Floor",
    title: "Structured Decomposition",
    altitude: 9000,
    layer: "Systems Layer",
    humans: "x3",
    velocity: "x8",
    team: "Crew",
    agents: "x8",
    subtitle: "One-shots evolve into epics and tasks.",
    description:
      "You experiment with beads and drive agents with decomposed work rather than only ad-hoc prompts."
  },
  {
    id: "seventh-floor",
    level: "Seventh Floor",
    title: "Automation Discipline",
    altitude: 13000,
    layer: "Systems Layer",
    humans: "x3",
    velocity: "x16",
    team: "Crew",
    agents: "x16",
    subtitle: "Conversation moves to architecture and verification.",
    description:
      "You are less conversational during coding and more conversational during requirements, decomposition, and rigor."
  },
  {
    id: "eighth-floor",
    level: "Eighth Floor",
    title: "Spec-Driven Work",
    altitude: 18500,
    layer: "Systems Layer",
    humans: "x4",
    velocity: "x64",
    team: "Network",
    agents: "x64",
    subtitle: "Specifications generate beads that generate execution.",
    description:
      "You are comfortable letting agents run over prepared structures and frameworks you maintain."
  },
  {
    id: "ninth-floor",
    level: "Ninth Floor",
    title: "Verification First",
    altitude: 26000,
    layer: "Frontier Layer",
    humans: "x4",
    velocity: "x128",
    team: "Network",
    agents: "x128",
    subtitle: "Consensus and verification are core loops.",
    description:
      "You accept hallucinations as an operating constraint and design systems around checks, councils, and confidence."
  },
  {
    id: "tenth-floor",
    level: "Tenth Floor",
    title: "Authoring the Stack",
    altitude: 36000,
    layer: "Frontier Layer",
    humans: "x0.5",
    velocity: "x16384",
    team: "Founder",
    agents: "x16384",
    subtitle: "You build your own primitives.",
    description:
      "You are writing your own beads and frameworks. You are not just using the elevator anymore, you are building it."
  }
];

const stopsEl = document.getElementById("stops");
const towerFloorsEl = document.getElementById("tower-floors");
const carEl = document.getElementById("car");
const activeFloorEl = document.getElementById("active-floor");
const altitudeEl = document.getElementById("altitude");
const layerEl = document.getElementById("layer");
const hudHumansEl = document.getElementById("hud-humans");
const hudVelocityEl = document.getElementById("hud-velocity");
const hudTeamEl = document.getElementById("hud-team");
const hudAgentsEl = document.getElementById("hud-agents");
const scrollCueEl = document.getElementById("scroll-cue");
const landingEl = document.getElementById("landing");
const packetLaneEl = document.getElementById("packet-lane");
const cpuCoreEl = document.getElementById("cpu-core");

const packetLabels = [
  "0101",
  "MSG",
  "MOV",
  "ACK",
  "_inline",
  "COBOL",
  "FORTRAN",
  "JMP"
];
const packetColors = [
  ["#67d7ff", "#ffe08e", "#ff90cd"],
  ["#7ce7b4", "#ffe08e", "#ff8f79"],
  ["#8ec3ff", "#ffd777", "#f89dff"]
];

function render() {
  const visualOrder = floors.slice().reverse();

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

  const entryMarkup = `
    <article class="stop entry-stop" id="tower-entry">
      <section class="card">
        <div class="badges">
          <span>Tower Entry</span>
        </div>
        <h2>The Building Appears</h2>
        <p class="subtitle">Your ride starts now.</p>
        <p>
          As you scroll up from the welcome page, the tower slides into view on the left.
          Keep scrolling up to reach Ground Floor on the right.
        </p>
      </section>
    </article>
  `;

  stopsEl.innerHTML = `${floorsMarkup}${entryMarkup}`;

  towerFloorsEl.innerHTML = visualOrder
    .map((floor) => {
      const index = floors.indexOf(floor);
      return `<li class="tower-floor" data-index="${index}" title="${floor.level}"></li>`;
    })
    .join("");
}

function setActive(index) {
  const towerFloors = Array.from(document.querySelectorAll(".tower-floor"));
  const target = towerFloors.find((node) => Number(node.dataset.index) === index);

  if (!target) {
    return;
  }

  towerFloors.forEach((node) => node.classList.remove("active"));
  target.classList.add("active");

  const current = floors[index];
  activeFloorEl.textContent = current.level;
  altitudeEl.textContent = `${current.altitude.toLocaleString()} m`;
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
    { threshold: 0.24 }
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
    { threshold: 0.58 }
  );

  stops.forEach((stop) => {
    revealObserver.observe(stop);
    activeObserver.observe(stop);
  });
}

function scrollToGroundFloor() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
}

function updateScrollCue() {
  const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 60;
  scrollCueEl.textContent = document.body.classList.contains("in-landing")
    ? "Scroll Up To Enter"
    : "Scroll Up!";
  scrollCueEl.classList.toggle("hidden", !nearBottom);
}

function updateLandingProgress() {
  const distanceFromBottom = Math.max(
    0,
    document.body.scrollHeight - (window.scrollY + window.innerHeight)
  );
  const fadeDistance = 540;
  const progress = Math.max(0, Math.min(1, 1 - distanceFromBottom / fadeDistance));
  document.documentElement.style.setProperty("--landing-progress", progress.toFixed(3));
}

function setupLandingObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("in-landing", entry.isIntersecting);
        if (!entry.isIntersecting) {
          document.documentElement.style.setProperty("--landing-progress", "0");
        }
        updateScrollCue();
      });
    },
    { threshold: 0.45 }
  );

  observer.observe(landingEl);
}

function flashCpu(color) {
  if (!cpuCoreEl) {
    return;
  }

  cpuCoreEl.style.setProperty("--cpu-glow", color);
  cpuCoreEl.classList.add("hot");
  window.setTimeout(() => cpuCoreEl.classList.remove("hot"), 190);
}

function spawnPacket() {
  if (!packetLaneEl) {
    return;
  }

  const packet = document.createElement("span");
  const label = packetLabels[Math.floor(Math.random() * packetLabels.length)];
  const colors = packetColors[Math.floor(Math.random() * packetColors.length)];
  const duration = 2200 + Math.floor(Math.random() * 900);
  const laneOffset = 48 + Math.random() * 8;

  packet.className = "packet";
  packet.textContent = label;
  packet.style.top = `${laneOffset}%`;
  packet.style.animationDuration = `${duration}ms`;
  packet.style.setProperty("--c-in", colors[0]);
  packet.style.setProperty("--c-mid", colors[1]);
  packet.style.setProperty("--c-out", colors[2]);
  packetLaneEl.append(packet);

  window.setTimeout(() => flashCpu(colors[1]), Math.floor(duration * 0.52));
  window.setTimeout(() => flashCpu(colors[2]), Math.floor(duration * 0.72));
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
  window.setInterval(spawnPacket, 820);
}

render();
initObservers();
setupLandingObserver();
initPcbAnimation();
setActive(0);

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      scrollToGroundFloor();
      setActive(0);
      updateLandingProgress();
      updateScrollCue();
    },
    { once: true }
  );
} else {
  scrollToGroundFloor();
  setActive(0);
  updateLandingProgress();
  updateScrollCue();
}

window.addEventListener("scroll", () => {
  updateLandingProgress();
  updateScrollCue();
});
window.addEventListener("resize", () => {
  const currentLabel = activeFloorEl.textContent;
  const index = floors.findIndex((floor) => floor.level === currentLabel);
  setActive(index >= 0 ? index : 0);
  updateLandingProgress();
});
