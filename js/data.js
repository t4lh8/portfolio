/* ============================================================
   CONTENT: edit this file to update the site.
   ============================================================ */
const DATA = {
  name: "Talha Aker",

  // Profile photo: put your picture in the images folder with this name.
  // Until the file exists, your initials are shown instead.
  photo: "images/profile.jpg",

  // Hero terminal on the Kali desktop. Plays on a loop.
  // out: one line, or a list of lines. cls: "ok" shows the output in green.
  terminal: [
    { cmd: "whoami", out: "talha aker" },
    { cmd: "cat role.txt", out: "3rd-year BSc cybersecurity @ kristiania, oslo" },
    { cmd: "ls focus/", out: "network-security/  monitoring/  secure-dev/" },
    { cmd: "nmap -sV 10.10.14.7", out: [
      "Starting Nmap 7.95 ( https://nmap.org )",
      "Nmap scan report for lab-target (10.10.14.7)",
      "Host is up (0.0021s latency).",
      "PORT    STATE SERVICE  VERSION",
      "22/tcp  open  ssh      OpenSSH 9.6p1",
      "80/tcp  open  http     nginx 1.24.0",
      "443/tcp open  ssl/http nginx 1.24.0",
      "Nmap done: 1 IP address (1 host up) scanned in 7.84 seconds"
    ] },
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
      status: { k: "threat level", v: "low", bar: 1 },   // optional small status line
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
      status: { k: "threat level", v: "low", bar: 1 },
      desc: "A real-time security monitoring platform that flags suspicious logins, behaviour and traffic using AI-based anomaly detection.",
      highlights: [
        "anomaly detection on logins, behaviour and traffic",
        "live alerts over SignalR to a Blazor dashboard",
        "JWT auth, RBAC, rate limiting and audit logging",
        "honeypot endpoints that log suspicious requests"
      ],
      stack: ["ASP.NET Core", "PostgreSQL", "Blazor WASM", "SignalR", "Docker"],
      link: "https://github.com/t4lh8/ZeroTrust-Sentinel-AI-Based-Security-Platform"
    },
    {
      name: "SOC Automation Home Lab",
      lang: "Terraform",
      date: "2026",
      tag: "SOC / Blue Team",
      status: { k: "att&ck", v: "T1003.001" },
      desc: "A hands-on SOC that detects a real attack (Mimikatz credential dumping) on a Windows endpoint and automatically triages, enriches, documents and remediates it.",
      highlights: [
        "custom Wazuh detection rules mapped to MITRE ATT&CK",
        "SOAR workflow: VirusTotal enrichment, TheHive case, email, auto-response",
        "human-in-the-loop approval before any destructive action",
        "one-command deploy with Terraform + Docker (infrastructure as code)"
      ],
      stack: ["Wazuh", "Shuffle", "TheHive", "Sysmon", "Terraform", "Docker"],
      link: "https://github.com/t4lh8/SOC-Automation-Home-Lab"
    }
  ],

  // Experience, newest first. kind: "volunteer" adds a small label.
  experience: [
    { when: "2026-04 → now", role: "Coding Assistant", org: "Lær Kidsa Koding", note: "Teach kids programming with Micro:bit, robots and Python, breaking problems into small steps they can debug on their own.", kind: "volunteer" },
    { when: "2025-08 → now", role: "Chair & Project Coordinator", org: "Teknogarden | Furim Institute", note: "Run tech workshops for young people on programming, AI, VR and online safety. Plan the programme, coordinate volunteers and teach sessions on passwords, phishing and staying safe online." },
    { when: "2023-03 → 2025-07", role: "Substitute Teacher", org: "Acapedia AS", note: "Covered classes across subjects and age groups at short notice, keeping lessons on track and adapting to each group." },
    { when: "2022-03 → 2025-05", role: "Youth Leader", org: "Mentorung", note: "Mentored young people through school and everyday challenges, and helped organise activities and group events." }
  ],

  // copy: false hides the copy button for that row.
  contact: [
    { k: "email",    v: "talha28aker@gmail.com",               href: "mailto:talha28aker@gmail.com" },
    { k: "github",   v: "github.com/t4lh8",                    href: "https://github.com/t4lh8" },
    { k: "linkedin", v: "Talha Aker - LinkedIn",               href: "https://www.linkedin.com/in/talha-aker-111a97289/", copy: false }
  ]
};
