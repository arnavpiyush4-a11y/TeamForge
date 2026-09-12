const defaultProjects = [
    {
        id: 1,
        name: "AI Study Assistant",
        category: "Artificial Intelligence",
        description: "A simple study assistant that helps students organise notes and prepare for exams.",
        skills: ["Python", "React", "AI"],
        members: 2
    },
    {
        id: 2,
        name: "CampusConnect",
        category: "Web Development",
        description: "A platform where students can discover campus events, clubs and activities.",
        skills: ["JavaScript", "HTML", "CSS"],
        members: 1
    },
    {
        id: 3,
        name: "Smart Parking",
        category: "IoT",
        description: "An IoT based parking system that shows available parking spaces on campus.",
        skills: ["Java", "IoT", "Arduino"],
        members: 3
    },
    {
        id: 4,
        name: "Hostel Expense Tracker",
        category: "Web Development",
        description: "A small web app for roommates to record shared expenses and see who owes what.",
        skills: ["JavaScript", "Firebase", "CSS"],
        members: 1
    },
    {
        id: 5,
        name: "PhishGuard",
        category: "Cybersecurity",
        description: "A beginner friendly tool that checks suspicious links and explains common phishing signs.",
        skills: ["Java", "Cybersecurity", "Networking"],
        members: 2
    }
];

const projectKey = "teamforge_projects";
const usersKey = "teamforge_users";
const sessionKey = "teamforge_user";
let selectedProjectId = null;
let authMode = "login";

function getProjects() {
    const saved = localStorage.getItem(projectKey);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            localStorage.removeItem(projectKey);
        }
    }
    localStorage.setItem(projectKey, JSON.stringify(defaultProjects));
    return [...defaultProjects];
}

function saveProjects(projects) {
    localStorage.setItem(projectKey, JSON.stringify(projects));
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector('.modal[aria-hidden="false"]')) {
        document.body.classList.remove("modal-open");
    }
}

function renderProjects() {
    const container = document.getElementById("project-container");
    if (!container) return;

    const search = (document.getElementById("project-search")?.value || "").trim().toLowerCase();
    const category = document.getElementById("category-filter")?.value || "all";
    const projects = getProjects().filter(project => {
        const text = `${project.name} ${project.description} ${project.skills.join(" ")}`.toLowerCase();
        return text.includes(search) && (category === "all" || project.category === category);
    });

    container.innerHTML = "";
    document.getElementById("empty-state").classList.toggle("show", projects.length === 0);

    projects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
            <span class="project-category">${escapeHtml(project.category)}</span>
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="skills">
                ${project.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join("")}
            </div>
            <div class="project-footer">
                <span>👥 Need ${project.members} ${project.members === 1 ? "member" : "members"}</span>
                <button class="view-project-btn" data-id="${project.id}">View Project</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showProject(project) {
    selectedProjectId = project.id;
    document.getElementById("modal-title").textContent = project.name;
    document.getElementById("modal-category").textContent = project.category;
    document.getElementById("modal-description").textContent = project.description;
    document.getElementById("modal-members").textContent = `👥 Need ${project.members} ${project.members === 1 ? "member" : "members"}`;
    document.getElementById("modal-skills").innerHTML = project.skills
        .map(skill => `<span>${escapeHtml(skill)}</span>`)
        .join("");
    openModal("project-modal");
}

function updateAuthModal() {
    const signup = authMode === "signup";
    document.getElementById("auth-title").textContent = signup ? "Create an account" : "Log in";
    document.getElementById("auth-submit").textContent = signup ? "Create account" : "Log in";
    document.getElementById("auth-name-label").style.display = signup ? "block" : "none";
    document.getElementById("auth-name").style.display = signup ? "block" : "none";
    document.getElementById("auth-name").required = signup;
    document.getElementById("auth-switch").innerHTML = signup
        ? 'Already have an account? <button type="button" id="switch-auth">Log in</button>'
        : 'New here? <button type="button" id="switch-auth">Create an account</button>';

    document.getElementById("switch-auth").addEventListener("click", () => {
        authMode = signup ? "login" : "signup";
        updateAuthModal();
    });
}

function setupAuthButtons() {
    const login = document.getElementById("login-btn");
    const signup = document.getElementById("signup-btn");
    if (!login || !signup) return;

    login.addEventListener("click", () => {
        authMode = "login";
        updateAuthModal();
        openModal("auth-modal");
    });

    signup.addEventListener("click", () => {
        authMode = "signup";
        updateAuthModal();
        openModal("auth-modal");
    });
}

function setupIndexPage() {
    if (!document.getElementById("project-container")) return;

    renderProjects();
    document.getElementById("project-search").addEventListener("input", renderProjects);
    document.getElementById("category-filter").addEventListener("change", renderProjects);

    document.getElementById("project-container").addEventListener("click", event => {
        const button = event.target.closest(".view-project-btn");
        if (!button) return;
        const project = getProjects().find(item => item.id === Number(button.dataset.id));
        if (project) showProject(project);
    });

    document.getElementById("close-modal").addEventListener("click", () => closeModal("project-modal"));

    document.getElementById("join-btn").addEventListener("click", () => {
        const user = localStorage.getItem(sessionKey);
        if (!user) {
            authMode = "login";
            updateAuthModal();
            closeModal("project-modal");
            openModal("auth-modal");
            showToast("Log in first to send a join request.");
            return;
        }
        showToast("Join request sent to the project owner.");
        closeModal("project-modal");
    });
}

function setupCreatePage() {
    const form = document.getElementById("project-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const skills = document.getElementById("project-skills").value
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);

        if (skills.length === 0) {
            showToast("Add at least one skill.");
            return;
        }

        const project = {
            id: Date.now(),
            name: document.getElementById("project-name").value.trim(),
            description: document.getElementById("project-description").value.trim(),
            category: document.getElementById("project-category").value,
            skills,
            members: Number(document.getElementById("project-members").value)
        };

        const projects = getProjects();
        projects.unshift(project);
        saveProjects(projects);
        form.reset();
        document.getElementById("project-members").value = 1;
        showToast("Project created. Opening the project list...");

        setTimeout(() => {
            window.location.href = "index.html#projects";
        }, 500);
    });
}

function setupAuthForm() {
    const form = document.getElementById("auth-form");
    if (!form) return;

    document.getElementById("close-auth").addEventListener("click", () => closeModal("auth-modal"));

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("auth-email").value.trim().toLowerCase();
        const password = document.getElementById("auth-password").value;
        const name = document.getElementById("auth-name").value.trim();
        const users = JSON.parse(localStorage.getItem(usersKey) || "[]");

        if (authMode === "signup") {
            if (!name) return;
            if (users.some(user => user.email === email)) {
                showToast("An account with this email already exists.");
                return;
            }
            users.push({ name, email, password });
            localStorage.setItem(usersKey, JSON.stringify(users));
            localStorage.setItem(sessionKey, JSON.stringify({ name, email }));
            showToast("Account created. You are logged in.");
        } else {
            const user = users.find(item => item.email === email && item.password === password);
            if (!user) {
                showToast("Email or password is incorrect.");
                return;
            }
            localStorage.setItem(sessionKey, JSON.stringify({ name: user.name, email: user.email }));
            showToast(`Welcome back, ${user.name}.`);
        }

        form.reset();
        closeModal("auth-modal");
    });
}

function closeModalWhenClickingOutside() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal.id);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getProjects();
    setupAuthButtons();
    setupIndexPage();
    setupCreatePage();
    setupAuthForm();
    closeModalWhenClickingOutside();

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            document.querySelectorAll('.modal[aria-hidden="false"]').forEach(modal => closeModal(modal.id));
        }
    });
});
