/* ============================================================
   CONTENT: edit this file to update the site.
   ============================================================ */
const DATA = {
  name: "Talha Aker",

  // Profile photo: put your picture in the images folder with this name.
  // Until the file exists, your initials are shown instead.
  photo: "images/profile.jpg",

  // Hero terminal. cls: "ok" shows the output in green.
  terminal: [
    { cmd: "whoami", out: "talha aker" },
    { cmd: "cat role.txt", out: "3rd-year BSc cybersecurity @ kristiania, oslo" },
    { cmd: "ls focus/", out: "network-security/  monitoring/  secure-dev/" },
    { cmd: "systemctl status career", out: "● active: open to security roles", cls: "ok" }
  ],

  // Skills, shown as an Nmap scan report.
  skills: [
    { port: "22/tcp",   service: "systems-cloud",    tools: ["Linux", "Kali Linux", "Docker", "Google Cloud"] },
    { port: "80/tcp",   service: "programming",      tools: ["Python", "Java", "C#", "JavaScript", "React"] },
    { port: "161/udp",  service: "network-security", tools: ["Nmap", "Wireshark", "TCP/IP", "Sockets"] },
    { port: "443/tcp",  service: "secure-dev",       tools: ["ASP.NET Core", "JWT", "RBAC", "Rate limiting"] },
    { port: "514/udp",  service: "monitoring",       tools: ["SIEM", "Audit logging", "Anomaly detection"] },
    { port: "5432/tcp", service: "data-ml",          tools: ["SQL", "PostgreSQL", "Machine learning"] },
    { port: "8834/tcp", service: "vuln-assessment",  tools: ["Penetration testing", "Vulnerability analysis", "Scrum"] }
  ],

  /* PROJECTS: copy this template into the list below and fill it in.
    {
      name: "Project name",
      lang: "Python",
      date: "2026",
      tag: "Web Security",
      desc: "One sentence on what it is.",
      highlights: ["What it does", "How it's secured", "What you learned"],
      stack: ["Tool 1", "Tool 2"],
      link: "https://github.com/t4lh8/repo-name"
    },
  */
  projects: [
    {
      name: "ZeroTrust Sentinel",
      lang: "C#",
      date: "01.2026 – 03.2026",
      tag: "Security Monitoring",
      desc: "A real-time security monitoring platform that flags suspicious logins, behaviour and traffic using AI-based anomaly detection.",
      highlights: [
        "anomaly detection on logins, behaviour and traffic",
        "live alerts over SignalR to a Blazor dashboard",
        "JWT auth, RBAC, rate limiting and audit logging",
        "honeypot endpoints that log suspicious requests"
      ],
      stack: ["ASP.NET Core", "PostgreSQL", "Blazor WASM", "SignalR", "Docker"],
      link: "https://github.com/t4lh8"
    },
    {
      name: "Python Port Scanner",
      lang: "Python",
      date: "2024",
      tag: "Network Security",
      desc: "A TCP port scanner built from scratch to understand what tools like Nmap automate.",
      highlights: [
        "TCP connect scanning with Python sockets",
        "reports open ports for quick network analysis",
        "tested only on hosts I own"
      ],
      stack: ["Python", "socket", "GitHub"],
      link: "https://github.com/t4lh8"
    }
  ],

  // Experience, newest first. kind: "volunteer" adds a small label.
  experience: [
    { when: "2026-04 → now", role: "Coding Assistant", org: "Lær Kidsa Koding", note: "Teach kids programming with Micro:bit, robots and Python.", kind: "volunteer" },
    { when: "2025-08 → now", role: "Chair & Project Coordinator", org: "Teknogarden | Furim Institute", note: "Run tech workshops for young people on programming, AI, VR and online safety." },
    { when: "2023-03 → 2025-07", role: "Substitute Teacher", org: "Acapedia AS", note: "" },
    { when: "2022-03 → 2025-05", role: "Youth Leader", org: "Mentorung", note: "" }
  ],

  contact: [
    { k: "email",    v: "talha28aker@gmail.com",               href: "mailto:talha28aker@gmail.com" },
    { k: "github",   v: "github.com/t4lh8",                    href: "https://github.com/t4lh8" },
    { k: "linkedin", v: "in/talha-aker-111a97289",             href: "https://www.linkedin.com/in/talha-aker-111a97289/" }
  ]
};
