const STORAGE_KEY = 'teamforge-state-v1';

const seedProjects = [
  { id:'p1', title:'AI Study Assistant', category:'Artificial Intelligence', description:'A smart study copilot that turns messy notes into focused revision plans, flashcards and exam sprints.', skills:['Python','React','LLMs','UX'], needed:2, applicants:7, owner:'Rhea Sharma', initials:'RS', accent:'violet', status:'Recruiting', time:'2h ago' },
  { id:'p2', title:'CampusConnect', category:'Web Development', description:'One place for students to discover campus events, clubs, societies and people who share their interests.', skills:['Next.js','TypeScript','Supabase'], needed:1, applicants:4, owner:'Kabir Mehta', initials:'KM', accent:'cyan', status:'Recruiting', time:'5h ago' },
  { id:'p3', title:'Smart Parking', category:'IoT', description:'Low-cost smart parking with live slot detection, occupancy analytics and a lightweight mobile interface.', skills:['Arduino','Java','IoT'], needed:3, applicants:10, owner:'Aditya Nair', initials:'AN', accent:'green', status:'Recruiting', time:'1d ago' },
  { id:'p4', title:'PhishShield', category:'Cybersecurity', description:'A student-friendly phishing detector that explains why a link looks risky instead of just returning a score.', skills:['Java','Security','ML'], needed:2, applicants:6, owner:'Mihir Rao', initials:'MR', accent:'orange', status:'Recruiting', time:'1d ago' },
  { id:'p5', title:'GreenRoute', category:'Sustainability', description:'Compare routes by time, emissions and cost to make greener commuting a practical everyday choice.', skills:['Python','Maps','Data'], needed:2, applicants:5, owner:'Nandini Das', initials:'ND', accent:'green', status:'Recruiting', time:'2d ago' },
  { id:'p6', title:'MedMemo', category:'HealthTech', description:'A privacy-first reminder and symptom journal concept designed around accessibility and calm interactions.', skills:['Flutter','Firebase','UI/UX'], needed:2, applicants:8, owner:'Aarav Joshi', initials:'AJ', accent:'pink', status:'Recruiting', time:'3d ago' },
  { id:'p7', title:'FinLens', category:'FinTech', description:'A personal finance dashboard that turns transaction history into clearer spending patterns and goals.', skills:['React','Node.js','Charts'], needed:1, applicants:3, owner:'Ishita Sen', initials:'IS', accent:'cyan', status:'Recruiting', time:'3d ago' },
  { id:'p8', title:'RoboRescue', category:'Robotics', description:'A small autonomous rover concept for indoor emergency mapping using low-cost sensors.', skills:['C++','ROS','Sensors'], needed:3, applicants:9, owner:'Yash Kapoor', initials:'YK', accent:'violet', status:'Recruiting', time:'4d ago' }
];

const seedPeople = [
  {id:'u1',name:'Rhea Sharma',role:'AI / Full-stack',initials:'RS',match:96,bio:'Builds practical AI products and loves turning rough ideas into polished demos.',skills:['Python','LLMs','React','Figma']},
  {id:'u2',name:'Kabir Mehta',role:'Frontend Engineer',initials:'KM',match:92,bio:'Frontend-focused builder who cares way too much about smooth interactions — in a good way.',skills:['Next.js','TypeScript','Motion','UI']},
  {id:'u3',name:'Mihir Rao',role:'Security Enthusiast',initials:'MR',match:89,bio:'Into ethical security, Java and explaining complicated security problems clearly.',skills:['Java','Cybersecurity','Linux','OWASP']},
  {id:'u4',name:'Nandini Das',role:'Data / Product',initials:'ND',match:86,bio:'Data storyteller who likes projects with a visible real-world impact.',skills:['Python','SQL','Analytics','Product']},
  {id:'u5',name:'Aarav Joshi',role:'Mobile Engineer',initials:'AJ',match:83,bio:'Flutter developer with an eye for clean interfaces and hackathon velocity.',skills:['Flutter','Firebase','Dart','UX']},
  {id:'u6',name:'Ishita Sen',role:'Backend / Cloud',initials:'IS',match:81,bio:'Enjoys APIs, databases and building dependable foundations behind shiny frontends.',skills:['Node.js','Postgres','AWS','APIs']}
];

const categories = ['All','Artificial Intelligence','Web Development','IoT','Cybersecurity','Sustainability','HealthTech','FinTech','Robotics'];

const defaultState = {
  projects: seedProjects,
  requested: [],
  saved: [],
  notifications: true,
  user: {name:'Arnav Piyush',role:'Student Builder',initials:'AP',skills:['Java','Python','HTML','React'],bio:'CS student who likes building things that look as good as they work.'}
};

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved) return {...defaultState,...saved, user:{...defaultState.user,...(saved.user||{})}};
  } catch(e) {}
  return structuredClone(defaultState);
}
const state = loadState();

const app = document.getElementById('app');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const toastRoot = document.getElementById('toast-root');
const mobileNav = document.getElementById('main-nav');

function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function initials(name){ return name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase(); }
function esc(s){ const d=document.createElement('div'); d.textContent=s ?? ''; return d.innerHTML; }
function route(){ return (location.hash || '#home').slice(1).split('?')[0] || 'home'; }
function queryParams(){ return new URLSearchParams(location.hash.split('?')[1] || ''); }
function navigate(r){ location.hash = r; mobileNav.classList.remove('open'); }
function toast(title,message,type='success'){
  const el=document.createElement('div'); el.className='toast'+(type==='error'?' error':''); el.innerHTML=`<span class="toast-dot"></span><div><b>${esc(title)}</b><p>${esc(message)}</p></div>`; toastRoot.appendChild(el); setTimeout(()=>el.remove(),3400);
}
function closeModal(){ modalBackdrop.classList.remove('open'); modalBackdrop.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
function openModal(html){ modalBody.innerHTML=html; modalBackdrop.classList.add('open'); modalBackdrop.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); }
modalClose.addEventListener('click',closeModal); modalBackdrop.addEventListener('click',e=>{if(e.target===modalBackdrop) closeModal()});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){closeModal();closePalette();} if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();} });

document.getElementById('mobile-menu-btn').addEventListener('click',()=>mobileNav.classList.toggle('open'));
document.getElementById('notification-btn').addEventListener('click',()=>openNotifications());
document.getElementById('profile-btn').addEventListener('click',()=>openProfile());

function shell(content){
  app.innerHTML = content;
  document.querySelectorAll('[data-route]').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
  document.querySelectorAll('[data-open-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.openProject)));
  document.querySelectorAll('[data-toggle-save]').forEach(b=>b.addEventListener('click',()=>toggleSave(b.dataset.toggleSave)));
  document.querySelectorAll('[data-join]').forEach(b=>b.addEventListener('click',()=>requestJoin(b.dataset.join)));
  document.querySelectorAll('[data-connect]').forEach(b=>b.addEventListener('click',()=>connectPerson(b.dataset.connect)));
}
function activeNav(){ document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('active',a.dataset.route===route())); }

function projectCard(p){
  const saved = state.saved.includes(p.id);
  const requested = state.requested.includes(p.id);
  return `<article class="project-card">
    <div class="project-top"><span class="category">${esc(p.category)}</span><span class="status">${esc(p.status)}</span></div>
    <h3>${esc(p.title)}</h3>
    <p class="description">${esc(p.description)}</p>
    <div class="skill-list">${p.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join('')}</div>
    <div class="project-meta"><span>${p.needed} member${p.needed===1?'':'s'} needed</span><span>${p.time}</span></div>
    <div class="project-actions">
      <button class="btn btn-soft btn-sm" data-open-project="${p.id}">View project</button>
      <button class="btn btn-ghost btn-sm bookmark" data-toggle-save="${p.id}" title="${saved?'Remove save':'Save project'}">${saved?'★':'☆'}</button>
      <button class="btn ${requested?'btn-ghost':'btn-primary'} btn-sm" data-join="${p.id}">${requested?'Requested':'Join team'}</button>
    </div>
  </article>`;
}

function renderHome(){
  const featured=state.projects.slice(0,3);
  shell(`<section class="view">
    <div class="hero">
      <div>
        <span class="kicker"><i></i> The student builder network</span>
        <h1>Find your people.<br><span class="gradient">Build something real.</span></h1>
        <p class="hero-copy">TeamForge connects ambitious students around projects, skills and momentum — so your next hackathon idea does not die in a group chat.</p>
        <div class="hero-actions"><button class="btn btn-primary" onclick="navigate('explore')">Explore projects <span>→</span></button><button class="btn btn-ghost" onclick="navigate('create')">Create a project <span>＋</span></button></div>
        <div class="metric-row" style="margin-top:42px;max-width:640px"><div class="metric"><div class="label">Active ideas</div><div class="value">${state.projects.length}</div><div class="delta">+12% this week</div></div><div class="metric"><div class="label">Builders</div><div class="value">2.4k</div><div class="delta">+180 this month</div></div><div class="metric"><div class="label">Matches</div><div class="value">8.7k</div><div class="delta dim">Across 42 campuses</div></div><div class="metric"><div class="label">Teams formed</div><div class="value">614</div><div class="delta">78% completion</div></div></div>
      </div>
      <div class="hero-visual"><div class="glow-orb"></div><div class="board"><div class="board-head"><div class="window-dots"><i></i><i></i><i></i></div><span class="fake-title">teamforge / workspace</span><span class="pill-live">● LIVE</span></div><div class="board-main"><div class="board-card"><div class="profile-row"><div class="mini-face">RS</div><div><div class="mini-name">Rhea Sharma</div><div class="mini-role">AI / Full-stack builder</div></div></div><div class="match-score"><div><b>96%</b><div><span>compatibility</span></div></div><span>great match</span></div><div class="board-skills"><span>Python</span><span>LLMs</span><span>React</span><span>Figma</span></div></div><div class="board-card"><div style="font-size:9px;color:#75809b;text-transform:uppercase;letter-spacing:.12em">Hot right now</div>${featured.map(p=>`<div class="mini-project"><div><p>${esc(p.title)}</p><small>${esc(p.category)}</small></div><span>${p.needed} spot${p.needed===1?'':'s'}</span></div>`).join('')}</div></div><div class="board-bottom"><div class="stat-chip"><small>Response rate</small><strong>83%</strong></div><div class="stat-chip"><small>Avg. team size</small><strong>4.1</strong></div><div class="stat-chip"><small>Projects shipped</small><strong>312</strong></div></div></div></div>
    </div>
    <section class="section"><div class="section-header"><div><h2>Projects worth joining</h2><p>Fresh ideas from students looking for the one or two people who make the concept click.</p></div><a class="section-link" href="#explore">See all projects →</a></div><div class="project-grid">${featured.map(projectCard).join('')}</div></section>
    <section class="section"><div class="trust-row"><div class="feature-card large"><div class="feature-icon">✦</div><h3>Match on how you build — not just what you study.</h3><p>TeamForge looks beyond degree names. Discover collaborators through skills, project interests, working style and the kind of problems you actually want to solve.</p><div class="feature-list"><span>⚡ Skills & tech stacks</span><span>◉ Project interests</span><span>↗ Builder profiles</span><span>✓ Explainable matches</span></div></div><div class="feature-card"><div class="feature-icon">⌁</div><h3>From “we should build this” to “look what we shipped.”</h3><p>Create a project, recruit your missing skills, manage the team and keep the momentum visible.</p><button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="navigate('create')">Start a project</button></div></div></section>
  </section>`);
}

function renderExplore(){
  const params=queryParams();
  const initial=params.get('q') || '';
  shell(`<section class="view"><div class="page-head"><span class="kicker"><i></i> Explore</span><h1>Find a project<br><span class="gradient">you'd actually build.</span></h1><p>Search by idea, skill or category. Save interesting teams and request to join with one click.</p></div><div class="filter-bar"><div class="search-wrap"><span class="icon icon-search"></span><input class="search-input" id="project-search" value="${esc(initial)}" placeholder="Search projects, skills, technologies…" /></div><select class="select" id="category-filter">${categories.map(c=>`<option>${esc(c)}</option>`).join('')}</select><select class="select" id="sort-filter"><option value="fresh">Newest</option><option value="spots">Most open spots</option><option value="applied">Most applicants</option></select></div><div id="explore-grid" class="project-grid"></div></section>`);
  const search=document.getElementById('project-search'), cat=document.getElementById('category-filter'), sort=document.getElementById('sort-filter');
  function draw(){
    const q=search.value.toLowerCase().trim(), c=cat.value;
    let list=state.projects.filter(p=>(c==='All'||p.category===c) && (!q || [p.title,p.description,p.category,...p.skills,p.owner].join(' ').toLowerCase().includes(q)));
    if(sort.value==='spots') list.sort((a,b)=>b.needed-a.needed); if(sort.value==='applied') list.sort((a,b)=>b.applicants-a.applicants);
    document.getElementById('explore-grid').innerHTML=list.length?list.map(projectCard).join(''):`<div class="empty-state" style="grid-column:1/-1"><div style="font-size:30px">⌕</div><h3>No close matches yet</h3><p>Try a broader search or explore all categories. The next great team might be hiding under an unexpectedly specific keyword.</p><button class="btn btn-soft" onclick="document.getElementById('project-search').value='';document.getElementById('category-filter').value='All';document.getElementById('project-search').dispatchEvent(new Event('input'))">Clear filters</button></div>`;
    document.querySelectorAll('[data-open-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.openProject)));
    document.querySelectorAll('[data-toggle-save]').forEach(b=>b.addEventListener('click',()=>{toggleSave(b.dataset.toggleSave);draw();}));
    document.querySelectorAll('[data-join]').forEach(b=>b.addEventListener('click',()=>{requestJoin(b.dataset.join);draw();}));
  }
  search.addEventListener('input',draw); cat.addEventListener('change',draw); sort.addEventListener('change',draw); draw();
}

function renderTeams(){
  shell(`<section class="view"><div class="page-head"><span class="kicker"><i></i> People</span><h1>Meet the builders<br><span class="gradient">your project needs.</span></h1><p>Good teams are rarely four people who know exactly the same thing. Find complementary skills and compatible energy.</p></div><div class="filter-bar"><div class="search-wrap"><span class="icon icon-search"></span><input class="search-input" id="people-search" placeholder="Search a skill, role or person…" /></div><select class="select" id="match-filter"><option value="all">All matches</option><option value="90">90%+ match</option><option value="80">80%+ match</option></select></div><div id="people-grid" class="team-grid"></div></section>`);
  const search=document.getElementById('people-search'), filter=document.getElementById('match-filter');
  function draw(){ const q=search.value.toLowerCase().trim(), min=filter.value==='all'?0:Number(filter.value); const list=seedPeople.filter(p=>p.match>=min && (!q||[p.name,p.role,p.bio,...p.skills].join(' ').toLowerCase().includes(q))); document.getElementById('people-grid').innerHTML=list.map(p=>`<article class="person-card"><div class="person-head"><div class="person-avatar">${p.initials}</div><div><h3>${esc(p.name)}</h3><div class="role">${esc(p.role)}</div></div></div><div class="match-meter"><b>${p.match}%</b><span>match for you</span></div><div class="progress"><i style="width:${p.match}%"></i></div><p class="person-bio">${esc(p.bio)}</p><div class="skill-list">${p.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join('')}</div><div class="person-actions"><button class="btn btn-ghost btn-sm" data-connect="${p.id}">View profile</button><button class="btn btn-primary btn-sm" data-connect="${p.id}">Connect</button></div></article>`).join('') || `<div class="empty-state" style="grid-column:1/-1"><h3>No builders found</h3><p>Try a broader role or skill.</p></div>`; document.querySelectorAll('[data-connect]').forEach(b=>b.addEventListener('click',()=>connectPerson(b.dataset.connect))); }
  search.addEventListener('input',draw); filter.addEventListener('change',draw); draw();
}

function renderDashboard(){
  const myProjects=state.projects.filter(p=>p.owner===state.user.name);
  const requested=state.requested.map(id=>state.projects.find(p=>p.id===id)).filter(Boolean);
  shell(`<section class="view"><div class="page-head"><span class="kicker"><i></i> Your workspace</span><h1>Welcome back, <span class="gradient">${esc(state.user.name.split(' ')[0])}.</span></h1><p>Everything you have started, saved and asked to join — in one place.</p></div><div class="metric-row" style="margin-bottom:15px"><div class="metric"><div class="label">My projects</div><div class="value">${myProjects.length}</div><div class="delta dim">Build something new</div></div><div class="metric"><div class="label">Saved</div><div class="value">${state.saved.length}</div><div class="delta">Ideas to revisit</div></div><div class="metric"><div class="label">Requests</div><div class="value">${state.requested.length}</div><div class="delta">Teams waiting</div></div><div class="metric"><div class="label">Profile strength</div><div class="value">82%</div><div class="delta">Add your goals →</div></div></div><div class="dashboard-grid"><div class="panel"><div class="panel-head"><div><h3>Your activity</h3><span>Recent movement across TeamForge</span></div><button class="btn btn-soft btn-sm" onclick="navigate('create')">＋ New project</button></div><div class="list">${requested.length ? requested.map(p=>`<div class="list-row"><div class="mini-face">${p.initials}</div><div class="row-main"><b>${esc(p.title)}</b><small>Join request pending · ${esc(p.owner)}</small><div class="progress"><i style="width:48%"></i></div></div><div class="row-end">Pending</div></div>`).join('') : `<div class="empty-state"><div style="font-size:26px">✦</div><h3>Your activity feed is quiet</h3><p>Browse a project and request to join a team. Your applications will show up here.</p><button class="btn btn-primary btn-sm" onclick="navigate('explore')">Explore projects</button></div>`}</div></div><div class="panel"><div class="profile-panel"><div class="avatar-lg">${esc(state.user.initials)}</div><div><b>${esc(state.user.name)}</b><small>${esc(state.user.role)}</small></div></div><div class="panel-head"><div><h3>Your skill stack</h3></div><span>${state.user.skills.length} skills</span></div><div class="tag-cloud">${state.user.skills.map(s=>`<span>${esc(s)}</span>`).join('')}</div><button class="btn btn-ghost btn-sm btn-wide" style="margin-top:13px" onclick="openProfile()">Edit profile</button><div class="panel-head" style="margin-top:22px"><div><h3>Suggested next move</h3></div></div><div class="list-row"><div style="font-size:16px">↗</div><div class="row-main"><b>Complete your profile</b><small>Add goals + availability to unlock stronger matches.</small></div></div></div></div></section>`);
}

function renderCreate(){
  shell(`<section class="view"><div class="page-head"><span class="kicker"><i></i> New project</span><h1>Give your idea<br><span class="gradient">a team to grow with.</span></h1><p>Describe the problem, the missing skills and the kind of collaborator you want. You can edit the project later from your workspace.</p></div><div class="form-layout"><div class="form-card"><form id="create-form"><div class="form-grid"><div class="field full"><label>PROJECT NAME</label><input name="title" required maxlength="70" placeholder="e.g. AI Study Assistant" /></div><div class="field"><label>CATEGORY</label><select name="category">${categories.slice(1).map(c=>`<option>${esc(c)}</option>`).join('')}</select></div><div class="field"><label>MEMBERS NEEDED</label><input name="needed" type="number" min="1" max="10" value="2" required /></div><div class="field full"><label>PROJECT DESCRIPTION</label><textarea name="description" required maxlength="420" placeholder="What are you building, and why does it matter?"></textarea><div class="field-hint">Keep it specific. Strong project descriptions usually mention the problem, the outcome and the current stage.</div></div><div class="field full"><label>SKILLS YOU NEED</label><input name="skills" required placeholder="Python, React, UI/UX, Firebase" /><div class="field-hint">Separate skills with commas.</div></div><div class="field"><label>TEAM STYLE</label><select name="style"><option>Fast & experimental</option><option>Structured & consistent</option><option>Design-led</option><option>Research-heavy</option></select></div><div class="field"><label>PROJECT STAGE</label><select name="stage"><option>Idea</option><option>Prototype</option><option>MVP</option><option>Already shipping</option></select></div></div><div class="form-actions"><button type="button" class="btn btn-ghost" onclick="navigate('home')">Cancel</button><button class="btn btn-primary" type="submit">Publish project ↗</button></div></form></div><aside class="form-card preview-card"><div class="preview-label">LIVE PREVIEW</div><h3 id="preview-title">Your project title</h3><p class="preview-desc" id="preview-desc">Your description will appear here as you type, helping you see what other students will see.</p><div class="skill-list" id="preview-skills"><span class="skill">Your skills</span></div><div class="check-grid"><div class="check-item"><span>Clear project brief</span><b>✓</b></div><div class="check-item"><span>Skill requirements</span><b>✓</b></div><div class="check-item"><span>Recruiting status</span><b>✓</b></div></div><div class="preview-placeholder">Projects are stored in this browser automatically for this demo. Connect a real database later without redesigning the UI.</div></aside></div></section>`);
  const form=document.getElementById('create-form'); const sync=()=>{document.getElementById('preview-title').textContent=form.title.value||'Your project title';document.getElementById('preview-desc').textContent=form.description.value||'Your description will appear here as you type, helping you see what other students will see.';document.getElementById('preview-skills').innerHTML=(form.skills.value?form.skills.value.split(',').map(x=>`<span class="skill">${esc(x.trim())}</span>`).join(''):'<span class="skill">Your skills</span>')}; form.addEventListener('input',sync); sync();
  form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const p={id:'p'+Date.now(),title:fd.get('title').trim(),category:fd.get('category'),description:fd.get('description').trim(),skills:fd.get('skills').split(',').map(x=>x.trim()).filter(Boolean),needed:Number(fd.get('needed')),applicants:0,owner:state.user.name,initials:state.user.initials,accent:'violet',status:'Recruiting',time:'just now'};state.projects.unshift(p);persist();toast('Project published',`“${p.title}” is now live and recruiting.`);navigate('dashboard');});
}

function openProject(id){
  const p=state.projects.find(x=>x.id===id); if(!p)return;
  const requested=state.requested.includes(id), saved=state.saved.includes(id);
  openModal(`<div class="modal-hero"><span class="category">${esc(p.category)}</span><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></div><div class="modal-section"><h4>What this team needs</h4><div class="skill-list">${p.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join('')}</div></div><div class="modal-section"><h4>Project pulse</h4><div class="metric-row" style="grid-template-columns:repeat(3,1fr)"><div class="metric"><div class="label">Owner</div><div class="value" style="font-size:14px">${esc(p.owner)}</div><div class="delta dim">project lead</div></div><div class="metric"><div class="label">Open spots</div><div class="value" style="font-size:18px">${p.needed}</div><div class="delta dim">still recruiting</div></div><div class="metric"><div class="label">Applicants</div><div class="value" style="font-size:18px">${p.applicants}</div><div class="delta dim">interested builders</div></div></div></div><div class="modal-actions"><button class="btn btn-ghost" id="modal-save">${saved?'★ Saved':'☆ Save'}</button><button class="btn ${requested?'btn-ghost':'btn-primary'}" id="modal-join">${requested?'Request sent':'Request to join →'}</button></div>`);
  document.getElementById('modal-save').onclick=()=>{toggleSave(id);openProject(id)};
  document.getElementById('modal-join').onclick=()=>{requestJoin(id);openProject(id)};
}
function toggleSave(id){ const i=state.saved.indexOf(id); if(i>=0){state.saved.splice(i,1);toast('Removed from saved','You can always find it again in Explore.');} else {state.saved.push(id);toast('Saved project','Added to your personal shortlist.');} persist(); }
function requestJoin(id){ const p=state.projects.find(x=>x.id===id); if(!p)return; if(state.requested.includes(id)){toast('Already requested','Your join request is already on its way.');return;} state.requested.push(id); p.applicants=(p.applicants||0)+1; persist(); toast('Request sent',`The ${p.title} team will see your interest.`); }
function connectPerson(id){ const p=seedPeople.find(x=>x.id===id); if(!p)return; openModal(`<div class="modal-hero"><span class="category">${esc(p.role)}</span><h2>${esc(p.name)}</h2><p>${esc(p.bio)}</p></div><div class="modal-section"><h4>Compatibility</h4><div class="match-meter"><b>${p.match}%</b><span>strong potential</span></div><div class="progress"><i style="width:${p.match}%"></i></div></div><div class="modal-section"><h4>Skills</h4><div class="skill-list">${p.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join('')}</div></div><div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">Close</button><button class="btn btn-primary" onclick="toast('Connection request sent','${esc(p.name)} will see your request.') ; closeModal()">Connect ✦</button></div>`); }
function openNotifications(){openModal(`<div class="modal-hero"><span class="category">Notifications</span><h2>You're caught up.</h2><p>Here are the latest things waiting for you in TeamForge.</p></div><div class="list" style="margin-top:18px"><div class="list-row"><div class="mini-face">✦</div><div class="row-main"><b>New project match</b><small>AI Study Assistant looks 96% compatible with your skill stack.</small></div><div class="row-end">New</div></div><div class="list-row"><div class="mini-face">↗</div><div class="row-main"><b>Profile strength</b><small>Add availability and goals to improve your recommendations.</small></div><div class="row-end">Tip</div></div><div class="list-row"><div class="mini-face">★</div><div class="row-main"><b>${state.saved.length} saved project${state.saved.length===1?'':'s'}</b><small>They're waiting in your Explore shortlist.</small></div><div class="row-end">Saved</div></div></div>`); }
function openProfile(){openModal(`<div class="modal-hero"><span class="category">Your profile</span><h2>${esc(state.user.name)}</h2><p>${esc(state.user.bio)}</p></div><div class="form-card" style="padding:16px;margin-top:17px;background:rgba(255,255,255,.02)"><div class="field"><label>DISPLAY NAME</label><input id="profile-name" value="${esc(state.user.name)}" /></div><div class="field" style="margin-top:11px"><label>ROLE</label><input id="profile-role" value="${esc(state.user.role)}" /></div><div class="field" style="margin-top:11px"><label>SKILLS</label><input id="profile-skills" value="${esc(state.user.skills.join(', '))}" /></div><div class="modal-actions"><button class="btn btn-ghost" id="logout-demo">Reset demo</button><button class="btn btn-primary" id="save-profile">Save changes</button></div></div>`); document.getElementById('save-profile').onclick=()=>{state.user.name=document.getElementById('profile-name').value.trim()||'Arnav Piyush';state.user.role=document.getElementById('profile-role').value.trim()||'Student Builder';state.user.skills=document.getElementById('profile-skills').value.split(',').map(x=>x.trim()).filter(Boolean);state.user.initials=initials(state.user.name);persist();closeModal();render();toast('Profile updated','Your builder profile is looking sharper.');}; document.getElementById('logout-demo').onclick=()=>{localStorage.removeItem(STORAGE_KEY);location.reload()};}

function openPalette(){document.getElementById('command-palette').classList.add('open');document.getElementById('command-palette').setAttribute('aria-hidden','false');const i=document.getElementById('palette-input');i.value='';i.focus();updatePalette('')}
function closePalette(){document.getElementById('command-palette').classList.remove('open');document.getElementById('command-palette').setAttribute('aria-hidden','true')}
document.getElementById('palette-input').addEventListener('input',e=>updatePalette(e.target.value));
document.getElementById('command-palette').addEventListener('click',e=>{if(e.target.id==='command-palette')closePalette()});
function updatePalette(q){ const query=q.toLowerCase().trim(); const results=[]; state.projects.filter(p=>!query || [p.title,p.category,...p.skills].join(' ').toLowerCase().includes(query)).slice(0,5).forEach(p=>results.push({title:p.title,sub:p.category,action:()=>{closePalette();openProject(p.id)}})); [{title:'Explore projects',sub:'Browse every active idea',action:()=>{closePalette();navigate('explore')}},{title:'Create a project',sub:'Start recruiting your team',action:()=>{closePalette();navigate('create')}},{title:'Your dashboard',sub:'See your activity and requests',action:()=>{closePalette();navigate('dashboard')}}].forEach(x=>{if(!query||x.title.toLowerCase().includes(query))results.push(x)}); document.getElementById('palette-results').innerHTML=results.slice(0,7).map((r,i)=>`<div class="palette-result" data-index="${i}"><div class="mini-face">${r.title.charAt(0)}</div><div><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></div></div>`).join('') || '<div style="padding:20px;color:#77839b;font-size:11px">No results.</div>';document.querySelectorAll('.palette-result').forEach((el,i)=>el.onclick=results[i].action);}

document.getElementById('palette-input').addEventListener('keydown',e=>{if(e.key==='Enter'){document.querySelector('.palette-result')?.click()}});
function render(){const r=route(); activeNav(); if(r==='home')renderHome(); else if(r==='explore')renderExplore(); else if(r==='teams')renderTeams(); else if(r==='dashboard')renderDashboard(); else if(r==='create')renderCreate(); else renderHome(); activeNav(); window.scrollTo({top:0,behavior:'smooth'});}
window.addEventListener('hashchange',render); window.navigate=navigate; window.closeModal=closeModal; window.openProfile=openProfile; window.toast=toast;
render();
