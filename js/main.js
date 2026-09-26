/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const chips = list => `<div class="chips">${list.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;

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

/* ---------- hero terminal ---------- */
const term = $("#term");
$("#term-sr").textContent = DATA.terminal.map(l => l.out).join(". ");
const promptLine = cmd => `<div class="ln"><span class="pr">$</span> ${esc(cmd)}</div>`;
const outLine = l => `<div class="ln ${l.cls || "out"}">${esc(l.out)}</div>`;
async function runTerminal() {
  if (reduced) {
    term.innerHTML = DATA.terminal.map(l => promptLine(l.cmd) + outLine(l)).join("") + `<div class="ln"><span class="pr">$</span> <span class="cur"></span></div>`;
    return;
  }
  for (const l of DATA.terminal) {
    const ln = document.createElement("div");
    ln.className = "ln";
    ln.innerHTML = `<span class="pr">$</span> <span class="cmd"></span><span class="cur"></span>`;
    term.appendChild(ln);
    const cmd = $(".cmd", ln);
    await sleep(380);
    for (const ch of l.cmd) { cmd.textContent += ch; await sleep(34 + Math.random() * 46); }
    await sleep(200);
    $(".cur", ln).remove();
    term.insertAdjacentHTML("beforeend", outLine(l));
  }
  term.insertAdjacentHTML("beforeend", `<div class="ln"><span class="pr">$</span> <span class="cur"></span></div>`);
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
$("#scan-foot").textContent = `${DATA.skills.length} services detected · scan done in ${scanTime}s`;
if (!reduced) {
  const scanObs = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { $("#scan").classList.add("run"); scanObs.disconnect(); }
  }, { threshold: 0.4 });
  scanObs.observe($("#scan"));
}

/* ---------- projects ---------- */
$("#project-list").innerHTML = DATA.projects.map(p => `
  <article class="proj">
    <div class="proj-top"><span class="lang">${esc(p.lang)}</span><span>${esc(p.date)}</span></div>
    <div class="proj-title"><h3>${esc(p.name)}</h3><span class="tag">${esc(p.tag)}</span></div>
    <p>${esc(p.desc)}</p>
    <ul class="diff" aria-label="Highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
    <div class="proj-foot">
      ${chips(p.stack)}
      ${p.link ? `<a class="proj-link" href="${esc(p.link)}" target="_blank" rel="noopener">view on github ↗</a>` : ""}
    </div>
  </article>`).join("");

/* ---------- experience ---------- */
$("#exp-list").innerHTML = DATA.experience.map(x => `
  <li class="${/now/.test(x.when) ? "now" : ""}">
    <time>${esc(x.when)}</time>
    <h3>${esc(x.role)} <span class="org">· ${esc(x.org)}</span>${x.kind ? `<span class="kind">${esc(x.kind)}</span>` : ""}</h3>
    ${x.note ? `<p>${esc(x.note)}</p>` : ""}
  </li>`).join("");

/* ---------- contact ---------- */
$("#contact-list").innerHTML = DATA.contact.map((c, i) => `
  <div class="crow">
    <span class="k">${esc(c.k)}</span>
    <a href="${esc(c.href)}" ${c.href.startsWith("http") ? `target="_blank" rel="noopener"` : ""} id="cv-${i}">${esc(c.v)}</a>
    <button class="copy" type="button" data-i="${i}" aria-label="Copy ${esc(c.k)}">copy</button>
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
