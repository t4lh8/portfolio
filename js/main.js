/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const chips = list => `<div class="chips">${list.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;

/* ---------- boot intro: kali boot log -> login -> screen collapses into the site ---------- */
(async () => {
  const root = document.documentElement, el = $("#boot");
  if (!root.classList.contains("booting")) return;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.classList.add("leave");
    setTimeout(() => root.classList.remove("booting"), 680);
  };
  addEventListener("keydown", finish, { once: true });
  el.addEventListener("pointerdown", finish);

  const bar = $("#boot-bar"), log = $("#boot-log");
  const lines = [
    "Started kernel · linux 6.8.0-kali-amd64",
    "Mounted /home/talha",
    "Started NetworkManager.service",
    `Loaded ${DATA.skills.length} services from ~/skills`,
    `Indexed ${DATA.projects.length} projects in ~/projects`,
    "Started zerotrust-sentinel.service",
    "Reached target SOC monitoring"
  ];
  const type = async (node, text, speed) => { for (const ch of text) { if (done) return; node.lastChild.textContent += ch; await sleep(speed); } };

  for (let i = 0; i < lines.length && !done; i++) {
    log.insertAdjacentHTML("beforeend", `<div><span class="ok">[  OK  ]</span> ${esc(lines[i])}</div>`);
    bar.style.width = `${(i + 1) / lines.length * 55}%`;
    if (i === 2) $(".boot-dragon").classList.add("draw");
    await sleep(110 + Math.random() * 60);
  }
  if (done) return;
  await sleep(250);
  $("#boot-l1").innerHTML = "kali login: <b></b>";
  await type($("#boot-l1"), "talha", 70);
  bar.style.width = "75%";
  await sleep(160);
  $("#boot-l2").innerHTML = "Password: <b></b>";
  await type($("#boot-l2"), "••••••••", 35);
  bar.style.width = "90%";
  await sleep(260);
  if (done) return;
  $("#boot-l3").textContent = "✓ access granted · loading portfolio";
  bar.style.width = "100%";
  await sleep(550);
  finish();
})();

/* ---------- themes ---------- */
const SKINS = [
  { id: "midnight",  label: "Midnight",  bg: "#0B0F14", ac: "#7CC4E0" },
  { id: "amber",     label: "Amber",     bg: "#0F0C08", ac: "#F0B24B" },
  { id: "blueprint", label: "Blueprint", bg: "#0A2342", ac: "#8FD8FF" },
  { id: "paper",     label: "Paper",     bg: "#F4F3EF", ac: "#1C5DA6" }
];
function setSkin(id) {
  document.documentElement.dataset.skin = id;
  document.querySelectorAll(".skin").forEach(b => b.setAttribute("aria-checked", b.dataset.id === id));
  try { localStorage.setItem("skin", id); } catch {}
}
$("#skins").innerHTML = SKINS.map(s =>
  `<button class="skin" type="button" role="radio" data-id="${s.id}" title="${s.label}" aria-label="${s.label} theme" style="--sw-bg:${s.bg};--sw-ac:${s.ac}"></button>`).join("");
$("#skins").addEventListener("click", e => { const b = e.target.closest(".skin"); if (b) setSkin(b.dataset.id); });
let savedSkin = "midnight";
try { const s = localStorage.getItem("skin"); if (SKINS.some(k => k.id === s)) savedSkin = s; } catch {}
setSkin(savedSkin);

/* ---------- profile photo ---------- */
if (DATA.photo) {
  const probe = new Image();
  probe.onload = () => { const img = $("#photo"); img.src = DATA.photo; img.hidden = false; $("#photo-fallback").hidden = true; };
  probe.src = DATA.photo;
}

/* ---------- hero: kali desktop ---------- */
const clock = $("#k-clock");
const tick = () => { clock.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
tick(); setInterval(tick, 10000);

const term = $("#term");
const outs = l => [].concat(l.out);
$("#term-sr").textContent = DATA.terminal.map(l => outs(l).join(" ")).join(". ");
// Kali's two-line zsh prompt
const ps1 = `<div class="ln"><span class="kf">┌──(</span><span class="ku">talha㉿kali</span><span class="kf">)-[</span><span class="kp">~</span><span class="kf">]</span></div>`;
const ps2 = cmd => `<div class="ln"><span class="kf">└─</span><span class="ku">$</span> <span class="cmd">${esc(cmd)}</span></div>`;
const outLine = (text, cls) => `<div class="ln ${cls || "out"}">${esc(text)}</div>`;
const add = html => { term.insertAdjacentHTML("beforeend", html); term.scrollTop = term.scrollHeight; };

async function typeCmd(cmd, wait) {
  add(ps1 + ps2(""));
  const ln = term.lastElementChild, el = $(".cmd", ln);
  ln.insertAdjacentHTML("beforeend", `<span class="cur"></span>`);
  await sleep(wait);
  for (const ch of cmd) { el.textContent += ch; await sleep(34 + Math.random() * 46); }
  await sleep(220);
  $(".cur", ln).remove();
}
async function runTerminal() {
  if (reduced) {
    term.innerHTML = DATA.terminal.map(l => ps1 + ps2(l.cmd) + outs(l).map(o => outLine(o, l.cls)).join("")).join("") + ps1 + ps2("");
    return;
  }
  for (;;) {
    term.innerHTML = "";
    for (const l of DATA.terminal) {
      await typeCmd(l.cmd, 450);
      const lines = outs(l);
      for (const o of lines) { add(outLine(o, l.cls)); if (lines.length > 1) await sleep(90 + Math.random() * 160); }
    }
    await typeCmd("clear", 7000);
    await sleep(350);
  }
}
runTerminal();

/* ---------- skills (nmap) ---------- */
$("#scan-rows").innerHTML = DATA.skills.map((s, i) => `
  <div class="scan-row" role="row" style="--i:${i}">
    <span class="port" role="cell">${esc(s.port)}</span>
    <span class="state" role="cell">open</span>
    <span class="svc" role="cell">${esc(s.service)}</span>
    <span role="cell">${chips(s.tools)}</span>
  </div>`).join("");
const scanTime = (0.3 + DATA.skills.length * 0.05).toFixed(2);
const scanDone = `Nmap done: 1 IP address (1 host up) scanned in ${scanTime} seconds`;
const scanLog = $("#scan-log"), scanFoot = $("#scan-foot");
const hitLine = s => `<div class="hit">Discovered open port <b>${esc(s.port)}</b> on talha-aker</div>`;
if (reduced) {
  scanLog.innerHTML = DATA.skills.map(hitLine).join("");
  scanFoot.textContent = scanDone;
} else {
  $("#scan").classList.add("pending");
  scanFoot.textContent = "Initiating Service scan…";
  const scanObs = new IntersectionObserver(async ([en]) => {
    if (!en.isIntersecting) return;
    scanObs.disconnect();
    const rows = document.querySelectorAll("#scan-rows .scan-row");
    for (let i = 0; i < DATA.skills.length; i++) {
      await sleep(50 + Math.random() * 50);
      scanLog.insertAdjacentHTML("beforeend", hitLine(DATA.skills[i]));
      rows[i].style.opacity = 1;
      rows[i].classList.add("found");
    }
    await sleep(220);
    $("#scan").classList.remove("pending");
    scanFoot.textContent = scanDone;
    scanFoot.classList.add("scan-foot-done");
  }, { threshold: 0.35 });
  scanObs.observe($("#scan"));
}

/* ---------- projects ---------- */
// status: { k: "threat level", v: "low", bar: 1 } shows a 5-step meter; leave bar out for a plain line
const pstat = st => `<span class="pstat">${esc(st.k)}: <b>${esc(st.v)}</b>${st.bar ? `<span class="meter" aria-hidden="true">${[1, 2, 3, 4, 5].map(n => `<i${n <= st.bar ? ' class="on"' : ""}></i>`).join("")}</span>` : ""}</span>`;
$("#project-list").innerHTML = DATA.projects.map(p => `
  <article class="proj">
    <div class="proj-top"><span class="lang">${esc(p.lang)}</span><span class="proj-meta">${p.status ? pstat(p.status) : ""}<span>${esc(p.date)}</span></span></div>
    <div class="proj-title"><h3>${esc(p.name)}</h3><span class="tag">${esc(p.tag)}</span></div>
    <p>${esc(p.desc)}</p>
    <ul class="diff" aria-label="Highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
    <div class="proj-foot">
      ${chips(p.stack)}
      ${p.link ? `<a class="proj-link" href="${esc(p.link)}" target="_blank" rel="noopener">view on github ↗</a>` : ""}
    </div>
  </article>`).join("");

/* ---------- projects: SOC widget (demo numbers) ---------- */
if (!reduced) {
  const soc = { events: 1247, alerts: 3 };
  const bump = (el, text) => { el.textContent = text; el.classList.add("bump"); setTimeout(() => el.classList.remove("bump"), 60); };
  const socTick = () => {
    soc.events += 1 + Math.floor(Math.random() * 9);
    bump($("#soc-events"), soc.events);
    if (Math.random() < .07) { soc.alerts = soc.alerts >= 9 ? 2 : soc.alerts + 1; bump($("#soc-alerts"), String(soc.alerts).padStart(2, "0")); }
    setTimeout(socTick, 1200 + Math.random() * 1600);
  };
  setTimeout(socTick, 1500);
}

/* ---------- experience ---------- */
$("#exp-list").innerHTML = DATA.experience.map(x => `
  <li class="${/now/.test(x.when) ? "now" : ""}">
    <time>${esc(x.when)}</time>
    <h3>${esc(x.role)} <span class="org">· ${esc(x.org)}</span>${x.kind ? `<span class="kind">${esc(x.kind)}</span>` : ""}</h3>
    ${x.note ? `<p>${esc(x.note)}</p>` : ""}
  </li>`).join("");

/* ---------- experience: fingerprint scan ---------- */
const fp = $(".fp-card"), fpStatus = $(".fp-status");
const fpRows = [...fp.querySelectorAll(".fp-bin text")];
const bits = n => Array.from({ length: n }, () => (Math.random() < .5 ? "0" : "1")).join("");
let fpBusy = false;
function scanPrint() {
  if (reduced || fpBusy) return;
  fpBusy = true;
  fp.classList.remove("matched");
  fp.classList.add("scanning");
  fpStatus.textContent = "place finger…";
  const start = performance.now() + 300, dur = 2200;
  const frame = now => {
    const t = Math.min(1, Math.max(0, (now - start) / dur));
    const e = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;   // matches ease-in-out on the beam
    const beamY = 25 + e * 337;
    if (now >= start) fpStatus.textContent = `scanning ${String(Math.round(t * 100)).padStart(3, " ")}%`;
    // digits near the beam get rewritten, like data being read off the print
    fpRows.forEach(r => {
      const near = Math.abs(+r.getAttribute("y") - beamY) < 22;
      r.classList.toggle("hot", near);
      if (near) r.textContent = [bits(8), bits(8), bits(8), bits(8)].join(" ");
    });
    if (t < 1) return requestAnimationFrame(frame);
    fp.classList.replace("scanning", "matched");
    fpStatus.textContent = "match · talha-aker · 99.4%";
    setTimeout(() => { fp.classList.remove("matched"); fpStatus.textContent = "identity verified"; fpBusy = false; }, 2400);
  };
  requestAnimationFrame(frame);
}
fp.addEventListener("click", scanPrint);

// minutiae markers: points picked along a few ridges, linked like a biometric template
(() => {
  const ridges = [...fp.querySelectorAll(".fp-ridges path")];
  const picks = [[3, .15], [5, .55], [6, .9], [8, .3], [9, .72], [11, .05], [11, .5], [13, .28], [13, .85], [14, .62]];
  const pts = picks.map(([r, f]) => { const el = ridges[r], p = el.getPointAtLength(el.getTotalLength() * f); return [p.x, p.y]; });
  const order = [0, 3, 5, 7, 1, 4, 8, 9, 6, 2, 0];
  const lines = order.slice(1).map((j, k) => { const [x1, y1] = pts[order[k]], [x2, y2] = pts[j]; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }).join("");
  $("#fp-nodes").innerHTML = lines + pts.map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7"/>`).join("");
  const nodes = [...fp.querySelectorAll(".fp-nodes rect")];
  const svg = $(".fp", fp);
  svg.addEventListener("pointermove", e => {
    const m = svg.getScreenCTM().inverse(), pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    nodes.forEach((n, i) => n.classList.toggle("near", Math.hypot(pts[i][0] - pt.x, pts[i][1] - pt.y) < 55));
  });
  svg.addEventListener("pointerleave", () => nodes.forEach(n => n.classList.remove("near")));
})();
const expObs = new IntersectionObserver(([en]) => {
  if (en.isIntersecting) { scanPrint(); expObs.disconnect(); }
}, { threshold: 0.4 });
expObs.observe(fp);

/* ---------- contact ---------- */
$("#contact-list").innerHTML = DATA.contact.map((c, i) => `
  <div class="crow">
    <span class="k">${esc(c.k)}</span>
    <a href="${esc(c.href)}" ${c.href.startsWith("http") ? `target="_blank" rel="noopener"` : ""} id="cv-${i}">${esc(c.v)}</a>
    ${c.copy === false ? "" : `<button class="copy" type="button" data-i="${i}" aria-label="Copy ${esc(c.k)}">copy</button>`}
  </div>`).join("");
$("#contact-list").addEventListener("click", async e => {
  const b = e.target.closest(".copy"); if (!b) return;
  const c = DATA.contact[b.dataset.i];
  const text = c.href.startsWith("mailto:") ? c.v : c.href;
  try { await navigator.clipboard.writeText(text); b.textContent = "copied"; b.classList.add("done"); }
  catch {
    const r = document.createRange(); r.selectNodeContents($("#cv-" + b.dataset.i));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "selected";
  }
  setTimeout(() => { b.textContent = "copy"; b.classList.remove("done"); }, 1600);
});

/* ---------- nav: highlight current section ---------- */
const navLinks = [...document.querySelectorAll(".links a")];
const navObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.setAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("section.sec").forEach(s => navObs.observe(s));

/* ---------- nav: mini terminal feedback ---------- */
const navCmd = $("#nav-cmd"), navIn = $(".nav-in");
let navHide;
function showCmd(a, html, ok) {
  clearTimeout(navHide);
  const r = a.getBoundingClientRect(), base = navIn.getBoundingClientRect();
  navCmd.innerHTML = html;
  navCmd.classList.toggle("ok", !!ok);
  navCmd.style.left = `${Math.max(0, r.left - base.left)}px`;
  navCmd.style.top = `${r.bottom - base.top + 6}px`;
  navCmd.classList.add("on");
}
const hideCmd = (ms = 0) => { clearTimeout(navHide); navHide = setTimeout(() => navCmd.classList.remove("on"), ms); };
navLinks.forEach(a => {
  const dir = a.getAttribute("href").slice(1);
  const cd = () => showCmd(a, `<span class="pr">$</span> cd ~/${esc(dir)}`);
  a.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") cd(); });
  a.addEventListener("focus", cd);
  a.addEventListener("pointerleave", () => { if (!navCmd.classList.contains("ok")) hideCmd(); });
  a.addEventListener("blur", () => hideCmd());
  a.addEventListener("click", () => { showCmd(a, "→ directory changed", true); hideCmd(450); });
});

/* ---------- footer ---------- */
$("#year").textContent = new Date().getFullYear();
(async () => {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(DATA)));
    const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
    $("#page-hash").textContent = hex.slice(0, 12) + "…" + hex.slice(-6);
    $("#page-hash").title = "SHA-256 of this site's content: " + hex;
  } catch { $("#page-hash").textContent = "unavailable"; }
})();
