const seed = {
  food: [
    {id:1,category:"Food bank",title:"Riverside Community Pantry",description:"Weekly grocery bags with fresh produce, tinned food and household basics.",location:"Riverside Community Centre",time:"Today, 10:00–16:00",status:"Available"},
    {id:2,category:"Community meal",title:"Neighbourhood Lunch Club",description:"A free hot lunch and a friendly place to meet. Everyone is welcome.",location:"Town Hall Kitchen",time:"Wednesday, 12:30",status:"Open"},
    {id:3,category:"Food share",title:"Fresh produce share",description:"Surplus vegetables and bread shared by local shops. Bring a reusable bag.",location:"Market Square",time:"Today, 15:00–17:00",status:"Limited"},
    {id:4,category:"Food bank",title:"Parkside Family Food Support",description:"Confidential food parcel collection for individuals and families.",location:"Parkside Support Centre",time:"Thursday, 09:00–13:00",status:"Available"}
  ],
  water: [
    {id:1,title:"Riverside public refill tap",location:"Riverside Park entrance",detail:"Outdoor drinking water refill point",status:"Working"},
    {id:2,title:"Town Centre water fountain",location:"Market Square, beside the library",detail:"Public drinking fountain",status:"Working"},
    {id:3,title:"Parkside sports grounds tap",location:"Parkside Community Pitch",detail:"Outdoor refill tap near the main gate",status:"Working"}
  ],
  jobs: [
    {id:1,category:"Employment",title:"Part-time shop assistant",description:"Local grocery shop looking for weekend and evening support. No previous experience required.",location:"Town Centre",time:"Part-time · Flexible",status:"Open"},
    {id:2,category:"Training",title:"Free digital skills workshop",description:"Learn email, online forms and basic computer skills in a small group.",location:"Community Learning Room",time:"Friday · 10:00",status:"Registering"},
    {id:3,category:"Support",title:"CV and interview help",description:"Book a free one-to-one session with a volunteer employment mentor.",location:"Riverside Library",time:"By appointment",status:"Available"}
  ],
  requests: [
    {id:1,category:"Food and essentials",title:"Looking for a food parcel",description:"A local resident is looking for a food parcel for a small household this week.",location:"Riverside area",time:"Posted today"},
    {id:2,category:"Employment or training",title:"Help finding entry-level work",description:"Looking for advice on local part-time work and help preparing a first CV.",location:"Town Centre",time:"Posted yesterday"}
  ],
  offers: [
    {id:1,category:"Food and essentials",title:"Extra pantry items available",description:"Offering unopened tins, pasta and cereal. Collection can be arranged locally.",location:"Parkside area",time:"Posted today"},
    {id:2,category:"Volunteering",title:"Available to help with deliveries",description:"Can volunteer for a couple of hours at weekends to deliver essential supplies.",location:"Riverside area",time:"Posted yesterday"}
  ]
};
function loadData(){
  try {
    const stored = localStorage.getItem("cg-demo-data");
    return stored ? {...seed, ...JSON.parse(stored)} : seed;
  } catch (error) {
    // Storage can be unavailable when this prototype is opened as a local file.
    return seed;
  }
}
let data = loadData();
let currentTab = "requests";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){
  try {
    localStorage.setItem("cg-demo-data",JSON.stringify(data));
  } catch (error) {
    toast("Saved for this session only; browser storage is unavailable.");
  }
}
function showView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
  document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.view===name));
  const label={dashboard:"Overview",food:"Food support",water:"Water access",opportunities:"Opportunities",community:"Community requests"};
  $("#crumb").textContent=label[name]||"Overview";
  window.scrollTo({top:0,behavior:"smooth"});
  if(name==="food")renderFood(); if(name==="water")renderWater(); if(name==="opportunities")renderJobs(); if(name==="community")renderCommunity();
}
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showView(el.dataset.view)}));
function updateStats(){
  $("#foodStat").textContent=data.food.length;$("#waterStat").textContent=data.water.length;$("#jobStat").textContent=data.jobs.length;$("#requestStat").textContent=data.requests.length;
  const count=document.querySelector(".nav-count");if(count)count.textContent=data.food.length;
}
function renderFood(){
  const q=($("#foodSearch")?.value||"").toLowerCase(),f=$("#foodFilter")?.value||"all";
  const items=data.food.filter(x=>(f==="all"||x.category===f)&&`${x.title} ${x.description} ${x.location}`.toLowerCase().includes(q));
  $("#foodListings").innerHTML=items.length?items.map(x=>`<article class="listing-card"><div class="listing-top"><span class="category-tag">${esc(x.category)}</span><span class="availability">● ${esc(x.status)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="listing-meta"><span>⌖ ${esc(x.location)}</span><span>◷ ${esc(x.time)}</span></div><button class="btn btn-primary" data-contact="${esc(x.title)}">View details / contact</button></article>`).join(""):`<div class="empty-state">No matching food listings. Try another search.</div>`;
  bindContact();
}
function renderWater(){
  $("#waterCount").textContent=`${data.water.length} locations`;
  $("#waterListings").innerHTML=data.water.map(x=>`<article class="water-item"><div class="water-symbol">◉</div><div><strong>${esc(x.title)}</strong><small>⌖ ${esc(x.location)}<br>${esc(x.detail)}</small></div><span class="open-label">● ${esc(x.status)}</span></article>`).join("");
}
function renderJobs(){
  const q=($("#jobSearch")?.value||"").toLowerCase(),f=$("#jobFilter")?.value||"all";
  const items=data.jobs.filter(x=>(f==="all"||x.category===f)&&`${x.title} ${x.description} ${x.location}`.toLowerCase().includes(q));
  $("#jobListings").innerHTML=items.length?items.map(x=>`<article class="listing-card"><div class="listing-top"><span class="category-tag">${esc(x.category)}</span><span class="availability">● ${esc(x.status)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="listing-meta"><span>⌖ ${esc(x.location)}</span><span>◷ ${esc(x.time)}</span></div><button class="btn btn-primary" data-contact="${esc(x.title)}">View details / contact</button></article>`).join(""):`<div class="empty-state">No matching opportunities found.</div>`;
  bindContact();
}
function renderCommunity(){
  const items=data[currentTab]||[];
  $("#communityBoard").innerHTML=items.length?items.map(x=>`<article class="board-card"><div class="board-card-top"><span class="category-tag">${esc(x.category)}</span><span class="availability">● ${currentTab==="requests"?"Needs support":"Offering help"}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="board-card-foot"><span>⌖ ${esc(x.location)} · ${esc(x.time)}</span><button data-contact="${esc(x.title)}">Respond ↗</button></div></article>`).join(""):`<div class="empty-state">Nothing here yet. Be the first to post.</div>`;
  bindContact();
}
function renderRecent(){
 const rows=[...data.food.slice(-2).map(x=>({icon:"♧",title:x.title,sub:"Food support listing",time:"Recently added"})),...data.requests.slice(-1).map(x=>({icon:"♡",title:x.title,sub:"Community support request",time:"Recently posted"})),...data.water.slice(-1).map(x=>({icon:"◉",title:x.title,sub:"Water access location",time:"Community directory"}))];
 $("#recentActivity").innerHTML=rows.map(x=>`<div class="activity-row"><div class="activity-symbol">${x.icon}</div><div><strong>${esc(x.title)}</strong><small>${esc(x.sub)}</small></div><span class="activity-time">${esc(x.time)}</span></div>`).join("");
}
function bindContact(){document.querySelectorAll("[data-contact]").forEach(b=>b.addEventListener("click",()=>openContact(b.dataset.contact)));}
function openContact(title){
 const item=[...data.food,...data.jobs,...data.requests,...data.offers].find(x=>x.title===title);
 if(!item)return;
 activeForm="contact";
 $("#modalEyebrow").textContent="COMMUNITY LISTING";
 $("#modalTitle").textContent=item.title;
 $("#modalIntro").textContent="Listing details";
 $("#modalFields").innerHTML=`<p>${esc(item.description)}</p><p><strong>Location:</strong> ${esc(item.location)}</p><p><strong>Available:</strong> ${esc(item.time||item.status||"Contact to arrange")}</p><label class="contact-check"><input name="interest" type="checkbox" required> I’m interested and would like to be contacted.</label>`;
 $("#submitModal").textContent="Send interest";
 $("#modalBackdrop").classList.add("open");
}
const forms={
 request:{eyebrow:"COMMUNITY SUPPORT",title:"Request support",intro:"Share a little information so the right community support can be found.",fields:[["name","Your name","text",""],["category","What do you need?","select",["Food and essentials","Clean drinking water","Employment or training","Other community support"]],["location","Your town or area","text",""],["details","Tell us a little more","textarea",""]]},
 donation:{eyebrow:"SDG 02 · ZERO HUNGER",title:"Share a food listing",intro:"Add surplus food or a community food service to the directory.",fields:[["name","Listing title","text",""],["category","Food category","select",["Food bank","Community meal","Food share"]],["location","Collection location","text",""],["time","When is it available?","text",""],["details","What food is available?","textarea",""]]},
 report:{eyebrow:"SDG 06 · CLEAN WATER",title:"Report a water issue",intro:"Record a local water problem so it can be followed up.",fields:[["name","Type of issue","select",["Leaking tap or pipe","Broken drinking fountain","Water quality concern","Water supply interruption"]],["location","Where is the issue?","text",""],["details","Describe the problem","textarea",""]]},
 offer:{eyebrow:"COMMUNITY CONTRIBUTION",title:"Offer help or share an opportunity",intro:"Let people nearby know what support you can provide.",fields:[["name","What are you offering?","text",""],["category","Type of offer","select",["Employment","Training","Support","Food and essentials","Volunteering","Other"]],["location","Area or location","text",""],["details","Add some details","textarea",""]]}
};
let activeForm="";
function openModal(type){
 activeForm=type;$("#submitModal").textContent=type==="report"?"Submit report":"Submit";const f=forms[type];$("#modalEyebrow").textContent=f.eyebrow;$("#modalTitle").textContent=f.title;$("#modalIntro").textContent=f.intro;
 $("#modalFields").innerHTML=f.fields.map(([id,label,type,opts])=>`<div class="field"><label for="f-${id}">${label}</label>${type==="select"?`<select id="f-${id}" name="${id}" required><option value="">Choose one</option>${opts.map(o=>`<option>${esc(o)}</option>`).join("")}</select>`:type==="textarea"?`<textarea id="f-${id}" name="${id}" required placeholder="Enter details..."></textarea>`:`<input id="f-${id}" name="${id}" type="text" required placeholder="Enter ${label.toLowerCase()}">`}</div>`).join("");
 $("#modalBackdrop").classList.add("open");$("#f-"+f.fields[0][0]).focus();
}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open)));
$(".icon-button").addEventListener("click",()=>toast("You’re all caught up on community updates."));
$(".user-chip").addEventListener("click",()=>toast("Signed in as Community member · Local access."));
function closeModal(){$("#modalBackdrop").classList.remove("open")}
$("#modalClose").addEventListener("click",closeModal);$("#cancelModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#demoForm").addEventListener("submit",e=>{
 e.preventDefault();const fd=new FormData(e.target),v=Object.fromEntries(fd.entries());
 if(activeForm==="contact"){$("#submitModal").textContent="Submit";closeModal();e.target.reset();toast("Your interest has been recorded for this demo.");return;}
 if(activeForm==="request"){data.requests.unshift({id:Date.now(),category:v.category,title:v.name,description:v.details,location:v.location,time:"Just now"});showView("community");currentTab="requests";renderCommunity();}
 if(activeForm==="donation"){data.food.unshift({id:Date.now(),category:v.category,title:v.name,description:v.details,location:v.location,time:v.time,status:"New listing"});showView("food");}
 if(activeForm==="report"){data.water.push({id:Date.now(),title:v.name,location:v.location,detail:v.details,status:"Reported"});showView("water");}
 if(activeForm==="offer"){data.offers.unshift({id:Date.now(),category:v.category,title:v.name,description:v.details,location:v.location,time:"Just now"});if(v.category==="Employment"||v.category==="Training"||v.category==="Support"){data.jobs.unshift({id:Date.now(),category:v.category,title:v.name,description:v.details,location:v.location,time:"New listing",status:"New"});showView("opportunities");}else{currentTab="offers";showView("community");renderCommunity();}}
 save();updateStats();renderRecent();closeModal();e.target.reset();$("#submitModal").textContent="Submit";toast(activeForm==="donation"?"Food listing added to the directory.":activeForm==="request"?"Your request has been posted.":activeForm==="report"?"Report submitted. It now appears in nearby water points as reported.":"Your offer has been posted.");
});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{currentTab=b.dataset.tab;document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));renderCommunity()}));
$("#foodSearch").addEventListener("input",renderFood);$("#foodFilter").addEventListener("change",renderFood);$("#jobSearch").addEventListener("input",renderJobs);$("#jobFilter").addEventListener("change",renderJobs);
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000)}
updateStats();renderRecent();renderFood();renderWater();renderJobs();
