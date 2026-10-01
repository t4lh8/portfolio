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
/* ---------- live code panel: types a security script when it scrolls into view ---------- */
(() => {
  const code = $("#code-stream"), panel = $(".codepanel"), statusEl = $(".cp-status");
  if (!code || !panel) return;

  const SRC = [
    "# sentinel.py · live threat watch",
    "import asyncio",
    "from sentinel import Model, Alert",
    "",
    "model = Model.load(\"isolation-forest\")",
    "",
    "async def watch(stream):",
    "    async for ev in stream:",
    "        s = model.score(ev)       # 0..1",
    "        if ev.rule == \"T1003.001\" or s > .9:",
    "            await Alert.critical(",
    "                title=ev.describe(),",
    "                source=ev.src_ip,",
    "            )",
    "            await respond(ev)     # isolate",
    "            notify(soc, ev)       # + page",
    "",
    "asyncio.run(watch(events))",
  ];

  const KW = new Set("import from as async def await for while in if elif else or and not return None True False class with pass lambda".split(" "));
  const tokenize = line => {
    const out = [], re = /(#.*$)|("[^"]*"|'[^']*')|(\.\d+|\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_]+)/g;
    let m;
    while ((m = re.exec(line))) {
      if (m[1]) out.push(["c-com", m[1]]);
      else if (m[2]) out.push(["c-str", m[2]]);
      else if (m[3]) out.push(["c-num", m[3]]);
      else if (m[4]) out.push([KW.has(m[4]) ? "c-kw" : (line[re.lastIndex] === "(" ? "c-fn" : ""), m[4]]);
      else if (m[5]) out.push(["", m[5]]);
      else out.push(["c-pun", m[6]]);
    }
    return out;
  };
  const html = line => tokenize(line).map(([c, t]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join("") || "&nbsp;";

  if (reduced) {
    code.innerHTML = SRC.map(l => `<span class="cl">${html(l)}</span>`).join("");
    return;
  }

  let running = false, stop = false, visible = false;

  async function typeAll() {
    if (running) return;
    running = true; stop = false;
    code.innerHTML = "";
    if (statusEl) statusEl.textContent = "compiling…";
    for (const line of SRC) {
      if (stop) break;
      const cl = document.createElement("span"); cl.className = "cl"; code.appendChild(cl);
      const caret = document.createElement("span"); caret.className = "cp-caret"; cl.appendChild(caret);
      if (line === "") { caret.remove(); cl.innerHTML = "&nbsp;"; await sleep(55); continue; }
      for (const [c, t] of tokenize(line)) {
        if (stop) break;
        const span = document.createElement("span"); if (c) span.className = c;
        cl.insertBefore(span, caret);
        for (const ch of t) { span.textContent += ch; if (stop) break; await sleep(9 + Math.random() * 26); }
      }
      caret.remove();
      if (cl.textContent === "") cl.innerHTML = "&nbsp;";
      await sleep(line.trim().endsWith(":") ? 150 : 60);
    }
    const last = code.lastElementChild;
    if (last && !stop) { const caret = document.createElement("span"); caret.className = "cp-caret"; last.appendChild(caret); }
    if (statusEl) statusEl.textContent = "monitoring…";
    running = false;
    if (!stop && visible) { await sleep(5600); if (!stop && visible && !running) typeAll(); }
  }

  const obs = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) { if (!running) typeAll(); }
    else { stop = true; }
  }, { threshold: 0.25 });
  obs.observe(panel);
})();

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
