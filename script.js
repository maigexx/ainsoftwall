// AINSOFT AI CHAT SCRIPT (FREE, OFFLINE, HUMAN-LIKE)

let history = [];
let lastMood = 'neutral';
let lastReply = "";

function showSection(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // active nav highlight
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  const navMap = { home:'nav-home', features:'nav-features', message:'nav-message' };
  if(navMap[id]) document.getElementById(navMap[id]).classList.add('active');
}

const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

// load saved theme
const savedTheme = localStorage.getItem("theme");
if(savedTheme){
  root.setAttribute("data-theme", savedTheme);
}

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

function sendMessage(){
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const vent = document.getElementById('ventToggle').checked;
  if(!input.value.trim()) return;

  const user = document.createElement('div');
  user.className = 'user';
  user.textContent = input.value;
  messages.appendChild(user);

  const rawText = input.value;
  const text = rawText.toLowerCase();
  history.push(text);
  if(history.length > 6) history.shift();
  input.value = '';

  const bot = document.createElement('div');
  bot.className = 'bot';

  setTimeout(() => {
    bot.textContent = generateReply(text, vent);
    messages.appendChild(bot);
    messages.scrollTop = messages.scrollHeight;
  }, 800);
}

function detectMood(msg){
  if(msg.match(/sad|tired|pagod|iyak|hurt|pain/)) return 'sad';
  if(msg.match(/angry|galit|inis|frustrated/)) return 'angry';
  if(msg.match(/alone|lonely|mag-isa/)) return 'lonely';
  if(msg.match(/confused|lost|di ko alam|nalilito/)) return 'confused';
  if(msg.match(/happy|okay na|relieved|masaya/)) return 'happy';
  return 'neutral';
}

function generateReply(msg, vent){
  const mood = detectMood(msg);
  lastMood = mood;

  function pickRandom(arr){
    let reply;
    do{
      reply = arr[Math.floor(Math.random()*arr.length)];
    } while(reply === lastReply && arr.length > 1);
    lastReply = reply;
    return reply;
  }

  // =====================
  // VENT MODE
  // =====================
  if(vent){
    const ventReplies = [
      "Nandito lang ako. You don’t have to explain everything. Just let it out.",
      "Okay lang kung magulo yung kwento mo. Hindi kita huhusgahan.",
      "I’m here. Kahit paulit-ulit, kahit tahimik, okay lang.",
      "Take your time. Hindi ka istorbo dito.",
      "You can breathe here. Walang pressure."
    ];
    return pickRandom(ventReplies);
  }

  // =====================
  // SAD
  // =====================
  if(mood === 'sad'){
    const sadReplies = [
      "I’m really sorry you’re feeling this way. Alam mo, minsan kahit anong lakas natin, napapagod din talaga. And that doesn’t make you weak.",
      "Mukhang mabigat yung dinadala mo ngayon. Hindi mo kailangang buhatin lahat mag-isa.",
      "It’s okay to feel this pain. Hindi ka broken—nasasaktan ka lang.",
      "Some days are just heavier than others. Today might be one of those days, and that’s okay.",
      "Kung pagod ka na, pahinga muna. Hindi ibig sabihin sumusuko ka."
    ];
    return pickRandom(sadReplies);
  }

  // =====================
  // ANGRY
  // =====================
  if(mood === 'angry'){
    const angryReplies = [
      "Ramdam ko yung galit mo. Minsan galit is pain that wasn’t heard.",
      "Okay lang magalit. May pinanggagalingan yan, and valid yun.",
      "You don’t have to suppress it here. Safe kang maglabas.",
      "Galit can be exhausting. Salamat sa pag-share instead of keeping it inside.",
      "Hindi ka masamang tao dahil nagagalit ka."
    ];
    return pickRandom(angryReplies);
  }

  // =====================
  // LONELY
  // =====================
  if(mood === 'lonely'){
    const lonelyReplies = [
      "Masakit talaga ang pakiramdam ng mag-isa, lalo na kapag pakiramdam mo walang nakakaintindi.",
      "Even if it feels quiet right now, you’re not invisible here.",
      "Minsan hindi natin kailangan ng maraming tao—kailangan lang natin ng kahit isang nakikinig.",
      "Hindi ka nag-iisa dito. Kahit ngayon lang, may kasama ka.",
      "Loneliness doesn’t mean you’re unlovable."
    ];
    return pickRandom(lonelyReplies);
  }

  // =====================
  // CONFUSED
  // =====================
  if(mood === 'confused'){
    const confusedReplies = [
      "Nakakapagod talaga kapag hindi mo alam kung saan ka papunta.",
      "Hindi mo kailangang may sagot agad. Clarity comes slowly sometimes.",
      "Okay lang malito. Hindi ibig sabihin mahina ka.",
      "Let’s slow this down. One thought, one breath at a time.",
      "You’re allowed to pause and not know yet."
    ];
    return pickRandom(confusedReplies);
  }

  // =====================
  // HAPPY
  // =====================
  if(mood === 'happy'){
    const happyReplies = [
      "I’m really glad you shared this. Mahalaga ring kilalanin ang mga sandaling gumagaan ang pakiramdam.",
      "It’s nice to hear something good. You deserve moments like this.",
      "Hold on to that feeling—even if it’s small.",
      "Masaya akong marinig yan. Sometimes, these moments matter the most.",
      "That lightness you’re feeling? It’s real."
    ];
    return pickRandom(happyReplies);
  }

  // =====================
  // CONTEXT-AWARE NEUTRAL
  // =====================
  if(history.length >= 4){
    const contextReplies = [
      "I’m still here, reading everything you share. Hindi ka nag-iisa sa kwento mo.",
      "You’ve shared a lot already. Take your time—walang deadline dito.",
      "I’m following your story. Kahit anong pace mo, okay lang.",
      "You don’t need to impress anyone here. Just be honest.",
      "It’s okay if you’re not sure what to say next."
    ];
    return pickRandom(contextReplies);
  }

  // =====================
  // DEFAULT NEUTRAL
  // =====================
  const neutralReplies = [
    "Salamat sa pagbabahagi. I’m here with you.",
    "You don’t need perfect words. Safe ka dito.",
    "Nandito lang ako, nakikinig.",
    "Take your time. Walang maling sasabihin dito.",
    "I’m listening. Go on when you’re ready."
  ];

  return pickRandom(neutralReplies);
}