const STORAGE_KEY = "adhyanPortfolioData";

const defaultData = {
  profile: {
    name: "Adhyan Gupta",
    status: "B.Tech CSE (Artificial Intelligence) | 2nd Year Student",
    role: "Software Developer & AI Engineer in progress",
    location: "India",
    headline: "AI-focused developer portfolio built with code, clarity, and impact.",
    intro: "I am Adhyan Gupta, a Computer Science Engineering student from India focused on becoming a Software Developer and AI Engineer. I enjoy creating practical digital products that combine modern interfaces, automation, and intelligent systems.",
    about: "I am a 2nd year B.Tech CSE (Artificial Intelligence) student with a strong interest in software development, machine learning, and product-focused problem solving.",
    education: "Currently pursuing B.Tech in Computer Science Engineering with a specialization in Artificial Intelligence.",
    objective: "My goal is to become a capable Software Developer and AI Engineer who can design scalable systems, build user-friendly apps, and apply AI to real-world challenges.",
    email: "adhyangupta@example.com",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    imageData: "",
    resumeData: "",
    resumeName: "Adhyan_Gupta_Resume.pdf",
  },
  skills: ["Python", "C++", "Flutter", "HTML", "CSS", "JavaScript", "Git & GitHub", "Artificial Intelligence", "Machine Learning"],
  projects: [
    { title: "Smart Hospital Management System", summary: "Developed during an Ideathon to support digital patient management, appointment scheduling, and hospital workflow optimization.", tags: ["Ideathon", "Healthcare", "Workflow"] },
    { title: "CodeBuddy", summary: "A Flutter-based mobile application with modern UI/UX, cross-platform development, and student-focused productivity features.", tags: ["Flutter", "Mobile App", "UI/UX"] },
  ],
  certificates: [],
  experience: [
    { label: "Hackathons", title: "Problem-solving under pressure", detail: "Participated in coding and innovation events to practice teamwork, quick prototyping, and technical presentation." },
    { label: "Ideathons", title: "Smart Hospital Management System", detail: "Built and presented a healthcare workflow concept focused on patient management and appointment operations." },
    { label: "Internships", title: "Open to internship opportunities", detail: "Seeking software development and AI-focused internships to apply classroom learning to real products." },
    { label: "Certifications", title: "Continuous learning", detail: "Add AI, programming, cloud, and development certifications here as you complete them." },
  ],
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultData;
  try {
    const parsed = JSON.parse(saved);
    return { ...defaultData, ...parsed, profile: { ...defaultData.profile, ...parsed.profile } };
  } catch {
    return defaultData;
  }
}

const data = loadData();
const $ = (selector) => document.querySelector(selector);
const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value; };

function renderProfile() {
  text("#heroStatus", data.profile.status);
  text("#heroHeadline", data.profile.headline);
  text("#heroIntro", data.profile.intro);
  text("#profileName", data.profile.name);
  text("#profileRole", data.profile.role);
  text("#locationText", data.profile.location);
  text("#aboutIntro", data.profile.about);
  text("#educationText", data.profile.education);
  text("#objectiveText", data.profile.objective);
  text("#emailText", data.profile.email);
  text("#linkedinText", data.profile.linkedin);
  text("#githubText", data.profile.github);
  $("#emailLink").href = `mailto:${data.profile.email}`;
  $("#linkedinLink").href = data.profile.linkedin;
  $("#githubLink").href = data.profile.github;
  $("#projectCount").textContent = `${data.projects.length}+`;

  if (data.profile.imageData) $("#profilePhoto").src = data.profile.imageData;
  const resumeLinks = [$("#resumeDownloadTop"), $("#resumeDownloadBottom")];
  resumeLinks.forEach((link) => {
    if (data.profile.resumeData) {
      link.href = data.profile.resumeData;
      link.download = data.profile.resumeName || "Adhyan_Gupta_Resume.pdf";
    }
  });
}

function renderSkills() {
  $("#skillsGrid").innerHTML = data.skills.map((skill) => {
    const initials = skill.split(/[\s&+]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("");
    return `<article class="skill-chip"><span class="skill-icon">${initials}</span><strong>${skill}</strong></article>`;
  }).join("");
}

function renderProjects() {
  $("#projectsGrid").innerHTML = data.projects.map((project) => `
    <article class="project-card glass-card reveal">
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderCertificates() {
  const grid = $("#certificatesGrid");
  if (!data.certificates.length) {
    grid.innerHTML = `<div class="empty-state">No certificates added yet. Open Edit and upload certificates.</div>`;
    return;
  }
  grid.innerHTML = data.certificates.map((cert) => `
    <article class="cert-card glass-card reveal">
      ${cert.type.startsWith("image/") ? `<img src="${cert.data}" alt="${cert.name}" />` : `<div class="cert-file">PDF Certificate</div>`}
      <h3>${cert.name}</h3>
      <p>${cert.type}</p>
      <a class="btn secondary" href="${cert.data}" target="_blank" download="${cert.name}">Open Certificate</a>
    </article>
  `).join("");
}

function renderExperience() {
  $("#experienceList").innerHTML = data.experience.map((item) => `
    <article class="timeline-card glass-card reveal">
      <span>${item.label}</span>
      <div><h3>${item.title}</h3><p>${item.detail}</p></div>
    </article>
  `).join("");
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

$(".menu-toggle").addEventListener("click", () => $(".nav-links").classList.toggle("is-open"));
$(".nav-links").addEventListener("click", (event) => { if (event.target.matches("a")) $(".nav-links").classList.remove("is-open"); });
window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 24));

$("#profilePhoto").addEventListener("error", () => $("#profilePhoto").classList.add("is-hidden"));

$("#speakCvBtn").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  const avatar = $(".talking-avatar");
  if (avatar.classList.contains("is-speaking")) {
    window.speechSynthesis.cancel();
    avatar.classList.remove("is-speaking");
    $("#speakCvBtn").textContent = "Play CV Intro";
    return;
  }
  const intro = `Hi, I am ${data.profile.name}. I am a ${data.profile.status}. My career goal is to become a Software Developer and AI Engineer. My skills include ${data.skills.join(", ")}. My featured projects include ${data.projects.map((project) => project.title).join(" and ")}.`;
  const utterance = new SpeechSynthesisUtterance(intro);
  utterance.lang = "en-IN";
  utterance.rate = 0.94;
  avatar.classList.add("is-speaking");
  $("#speakCvBtn").textContent = "Stop Intro";
  $("#speechBubble").textContent = "Explaining my CV, skills, projects, and career goal...";
  utterance.onend = () => {
    avatar.classList.remove("is-speaking");
    $("#speakCvBtn").textContent = "Play CV Intro";
    $("#speechBubble").textContent = "That was my quick CV introduction.";
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
});

$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Portfolio message from ${form.get("name")}`);
  const body = encodeURIComponent(`${form.get("message")}\n\nFrom: ${form.get("name")}\nEmail: ${form.get("email")}`);
  window.location.href = `mailto:${data.profile.email}?subject=${subject}&body=${body}`;
  $("#formStatus").textContent = "Opening your email app...";
});

$("#year").textContent = new Date().getFullYear();
renderProfile();
renderSkills();
renderProjects();
renderCertificates();
renderExperience();
setupRevealAnimations();
