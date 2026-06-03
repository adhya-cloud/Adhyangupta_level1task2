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

const form = document.querySelector("#adminForm");
const statusText = document.querySelector("#adminStatus");
let currentData = loadData();

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultData);
  try {
    const parsed = JSON.parse(saved);
    return { ...structuredClone(defaultData), ...parsed, profile: { ...defaultData.profile, ...parsed.profile } };
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fillForm(data) {
  Object.entries(data.profile).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  form.elements.skills.value = data.skills.join("\n");
  form.elements.projects.value = JSON.stringify(data.projects, null, 2);
  form.elements.experience.value = JSON.stringify(data.experience, null, 2);
  renderUploads();
}

function renderUploads() {
  document.querySelector("#profilePreview").innerHTML = currentData.profile.imageData
    ? `<img src="${currentData.profile.imageData}" alt="Profile preview" />`
    : `<p class="hint">No profile image uploaded.</p>`;

  document.querySelector("#resumeFileName").textContent = currentData.profile.resumeData
    ? `Uploaded CV: ${currentData.profile.resumeName}`
    : "No resume uploaded yet.";

  const certList = document.querySelector("#certAdminList");
  certList.innerHTML = currentData.certificates.length
    ? currentData.certificates.map((cert) => `
      <div class="cert-admin-item">
        ${cert.type.startsWith("image/") ? `<img src="${cert.data}" alt="${cert.name}" />` : `<div class="cert-file">PDF</div>`}
        <p>${cert.name}</p>
      </div>
    `).join("")
    : `<p class="hint">No certificates uploaded yet.</p>`;
}

function readForm() {
  return {
    ...currentData,
    profile: {
      ...currentData.profile,
      name: form.elements.name.value.trim(),
      status: form.elements.status.value.trim(),
      role: form.elements.role.value.trim(),
      location: form.elements.location.value.trim(),
      headline: form.elements.headline.value.trim(),
      intro: form.elements.intro.value.trim(),
      about: form.elements.about.value.trim(),
      education: form.elements.education.value.trim(),
      objective: form.elements.objective.value.trim(),
      email: form.elements.email.value.trim(),
      linkedin: form.elements.linkedin.value.trim(),
      github: form.elements.github.value.trim(),
    },
    skills: form.elements.skills.value.split("\n").map((item) => item.trim()).filter(Boolean),
    projects: JSON.parse(form.elements.projects.value),
    experience: JSON.parse(form.elements.experience.value),
  };
}

document.querySelector("#profileUpload").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  currentData.profile.imageData = await readFileAsDataURL(file);
  renderUploads();
  statusText.textContent = "Profile image added. Click Save Changes.";
});

document.querySelector("#resumeUpload").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  currentData.profile.resumeData = await readFileAsDataURL(file);
  currentData.profile.resumeName = file.name;
  renderUploads();
  statusText.textContent = "CV uploaded. Click Save Changes.";
});

document.querySelector("#certificateUpload").addEventListener("change", async (event) => {
  const files = Array.from(event.target.files);
  for (const file of files) {
    currentData.certificates.push({
      name: file.name,
      type: file.type || "file",
      data: await readFileAsDataURL(file),
    });
  }
  renderUploads();
  statusText.textContent = "Certificates added. Click Save Changes.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    currentData = readForm();
    saveData();
    statusText.textContent = "Saved. Open or refresh index.html to see changes.";
  } catch {
    statusText.textContent = "JSON error: check projects or experience format.";
  }
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  currentData = structuredClone(defaultData);
  fillForm(currentData);
  statusText.textContent = "Reset done.";
});

document.querySelector("#clearCertsBtn").addEventListener("click", () => {
  currentData.certificates = [];
  renderUploads();
  statusText.textContent = "Certificates cleared. Click Save Changes.";
});

fillForm(currentData);
