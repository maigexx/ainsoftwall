let history = [];
let lastMood = 'neutral';
let lastReply = "";


function showSection(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const section = document.getElementById(id);
  if(section) section.classList.add('active');

  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  const navMap = { home:'nav-home', features:'nav-features', message:'nav-message' };
  if(navMap[id]){
    const navItem = document.getElementById(navMap[id]);
    if(navItem) navItem.classList.add('active');
  }
}


const toggle = document.getElementById("themeToggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");

if(savedTheme){
  root.setAttribute("data-theme", savedTheme);
}

if(toggle){
  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

function sendMessage(){

  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const ventToggle = document.getElementById('ventToggle');

  if(!input || !messages) return;
  if(!input.value.trim()) return;

  const vent = ventToggle ? ventToggle.checked : false;

  const user = document.createElement('div');
  user.className = 'user';
  user.textContent = input.value;
  messages.appendChild(user);

  messages.scrollTop = messages.scrollHeight;

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
  }, 900);
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

  if(vent){
    return pickRandom([
      "Nandito lang ako. You don’t have to explain everything. Just let it out.",
      "Okay lang kung magulo yung kwento mo. Hindi kita huhusgahan.",
      "I’m here. Kahit paulit-ulit, kahit tahimik, okay lang.",
      "Take your time. Hindi ka istorbo dito.",
      "You can breathe here. Walang pressure."
    ]);
  }

  if(mood === 'sad'){
    return pickRandom([
      "I’m really sorry you’re feeling this way. Minsan kahit anong lakas natin, napapagod din talaga.",
      "Mukhang mabigat yung dinadala mo ngayon. Hindi mo kailangang buhatin lahat mag-isa.",
      "It’s okay to feel this pain. Hindi ka broken—nasasaktan ka lang.",
      "Some days are heavier than others. Today might be one of those days.",
      "Kung pagod ka na, pahinga muna. Hindi ibig sabihin sumusuko ka."
    ]);
  }

  if(mood === 'angry'){
    return pickRandom([
      "Ramdam ko yung galit mo. Minsan galit is pain that wasn’t heard.",
      "Okay lang magalit. May pinanggagalingan yan, and valid yun.",
      "You don’t have to suppress it here. Safe kang maglabas.",
      "Galit can be exhausting. Salamat sa pag-share.",
      "Hindi ka masamang tao dahil nagagalit ka."
    ]);
  }

  if(mood === 'lonely'){
    return pickRandom([
      "Masakit ang pakiramdam ng mag-isa, lalo na kapag walang nakakaintindi.",
      "Even if it feels quiet right now, you’re not invisible here.",
      "Hindi ka nag-iisa dito. Kahit ngayon lang, may kasama ka.",
      "Loneliness doesn’t mean you’re unlovable.",
      "Minsan isang nakikinig lang sapat na."
    ]);
  }

  if(mood === 'confused'){
    return pickRandom([
      "Nakakapagod kapag hindi mo alam kung saan ka papunta.",
      "Hindi mo kailangang may sagot agad.",
      "Okay lang malito. Hindi ibig sabihin mahina ka.",
      "Let’s slow this down. One thought at a time.",
      "You’re allowed to pause."
    ]);
  }

  if(mood === 'happy'){
    return pickRandom([
      "I’m really glad you shared this.",
      "You deserve moments like this.",
      "Hold on to that feeling—even if it’s small.",
      "Masaya akong marinig yan.",
      "That lightness you’re feeling? It’s real."
    ]);
  }

  if(history.length >= 4){
    return pickRandom([
      "I’m still here. Hindi ka nag-iisa sa kwento mo.",
      "You’ve shared a lot already. Walang deadline dito.",
      "I’m following your story. Take your time.",
      "You don’t need to impress anyone here.",
      "It’s okay if you’re not sure what to say next."
    ]);
  }

  return pickRandom([
    "Salamat sa pagbabahagi. I’m here with you.",
    "Safe ka dito.",
    "Nandito lang ako, nakikinig.",
    "Take your time.",
    "I’m listening."
  ]);
}

document.addEventListener("DOMContentLoaded", function(){

  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("input");

  if(sendBtn){
    sendBtn.addEventListener("click", sendMessage);
  }

  if(input){
    input.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        sendMessage();
      }
    });
  }

});


const firebaseConfig = {
  apiKey: "AIzaSyBgE5thxZSb634SOXLDmt9278JYLtRkRSo",
  authDomain: "ainsoftwall.firebaseapp.com",
  projectId: "ainsoftwall",
  storageBucket: "ainsoftwall.firebasestorage.app",
  messagingSenderId: "509412138781",
  appId: "1:509412138781:web:d7c6b8e745e8a3f4014bf4",
  measurementId: "G-ZNX87WTW35"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const freedomWall = document.getElementById('freedomWall');

function getReadableTextColor(bgColor){
  if(!bgColor || !bgColor.startsWith('#')) return '#000000';

  let color = bgColor.replace('#','');

  if(color.length === 3){
    color = color.split('').map(c => c+c).join('');
  }

  const r = parseInt(color.substr(0,2),16);
  const g = parseInt(color.substr(2,2),16);
  const b = parseInt(color.substr(4,2),16);

  const brightness = (r*0.299 + g*0.587 + b*0.114);

  return brightness > 170 ? '#000000' : '#ffffff';
}

function renderPosts(){

  db.collection("posts")
    .orderBy("timestamp","desc")
    .onSnapshot(snapshot => {

      freedomWall.innerHTML = '';

      snapshot.forEach(doc => {

        const postData = doc.data();
        const postId = doc.id;

        const post = document.createElement('div');
        post.className = 'wall-post';

        const bgColor = postData.color || '#ffffff';
        post.style.backgroundColor = bgColor;
        post.style.color = getReadableTextColor(bgColor);

        if(postData.text){
          const p = document.createElement('p');
          p.textContent = postData.text;
          post.appendChild(p);
        }

        if(postData.img){
          const img = document.createElement('img');
          img.src = postData.img;
          img.style.width = "100%";
          img.style.borderRadius = "10px";
          img.style.marginTop = "10px";
          post.appendChild(img);
        }

        const actions = document.createElement('div');
        actions.className = 'post-actions';

        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        const isLiked = likedPosts[postId] || false;

        const likeBtn = document.createElement('button');
        const likeCount = document.createElement('span');

        likeBtn.textContent = isLiked ? '❤️' : '🤍';
        likeCount.textContent = postData.likesCount || 0;

        likeBtn.onclick = async () => {

          const newLiked = !likedPosts[postId];
          likedPosts[postId] = newLiked;
          localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

          const newCount = newLiked
            ? (postData.likesCount || 0) + 1
            : Math.max((postData.likesCount || 1) - 1, 0);

          await db.collection("posts").doc(postId).update({
            likesCount: newCount
          });
        };

        actions.appendChild(likeBtn);
        actions.appendChild(likeCount);

        const localPosterId = localStorage.getItem('posterId');

        if(localPosterId && postData.posterId === localPosterId){
          const delBtn = document.createElement('button');
          delBtn.textContent = '🗑️';

          delBtn.onclick = async () => {
            await db.collection("posts").doc(postId).delete();
          };

          actions.appendChild(delBtn);
        }

        post.appendChild(actions);
        freedomWall.appendChild(post);
      });

    });
}

async function addPost(){

  const text = document.getElementById('postText').value.trim();
  const imageInput = document.getElementById('postImage');
  const colorInput = document.getElementById('postColor');

  if(!text && !imageInput.files[0]){
    alert("Please add text or image.");
    return;
  }

  let posterId = localStorage.getItem('posterId');

  if(!posterId){
    posterId = 'poster-' + Date.now() + Math.floor(Math.random()*1000);
    localStorage.setItem('posterId', posterId);
  }

  const newPost = {
    text: text || '',
    img: '',
    color: colorInput ? colorInput.value : '#ffffff',
    likesCount: 0,
    posterId: posterId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  if(imageInput.files[0]){
    const reader = new FileReader();
    reader.onload = async e => {
      newPost.img = e.target.result;
      await db.collection("posts").add(newPost);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    await db.collection("posts").add(newPost);
  }

  document.getElementById('postText').value = '';
  imageInput.value = '';
}

renderPosts();




  
