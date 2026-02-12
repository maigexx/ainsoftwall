let history = [];
let lastMood = 'neutral';
let lastReply = "";

function showSection(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  const navMap = { home:'nav-home', features:'nav-features', message:'nav-message' };
  if(navMap[id]) document.getElementById(navMap[id]).classList.add('active');
}

const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

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

  const repliesByMood = {
    sad: [
      "I’m really sorry you’re feeling this way. Alam mo, minsan kahit anong lakas natin, napapagod din talaga. And that doesn’t make you weak.",
      "Mukhang mabigat yung dinadala mo ngayon. Hindi mo kailangang buhatin lahat mag-isa.",
      "It’s okay to feel this pain. Hindi ka broken—nasasaktan ka lang.",
      "Some days are just heavier than others. Today might be one of those days, and that’s okay.",
      "Kung pagod ka na, pahinga muna. Hindi ibig sabihin sumusuko ka."
    ],
    angry: [
      "Ramdam ko yung galit mo. Minsan galit is pain that wasn’t heard.",
      "Okay lang magalit. May pinanggagalingan yan, and valid yun.",
      "You don’t have to suppress it here. Safe kang maglabas.",
      "Galit can be exhausting. Salamat sa pag-share instead of keeping it inside.",
      "Hindi ka masamang tao dahil nagagalit ka."
    ],
    lonely: [
      "Masakit talaga ang pakiramdam ng mag-isa, lalo na kapag pakiramdam mo walang nakakaintindi.",
      "Even if it feels quiet right now, you’re not invisible here.",
      "Minsan hindi natin kailangan ng maraming tao—kailangan lang natin ng kahit isang nakikinig.",
      "Hindi ka nag-iisa dito. Kahit ngayon lang, may kasama ka.",
      "Loneliness doesn’t mean you’re unlovable."
    ],
    confused: [
      "Nakakapagod talaga kapag hindi mo alam kung saan ka papunta.",
      "Hindi mo kailangang may sagot agad. Clarity comes slowly sometimes.",
      "Okay lang malito. Hindi ibig sabihin mahina ka.",
      "Let’s slow this down. One thought, one breath at a time.",
      "You’re allowed to pause and not know yet."
    ],
    happy: [
      "I’m really glad you shared this. Mahalaga ring kilalanin ang mga sandaling gumagaan ang pakiramdam.",
      "It’s nice to hear something good. You deserve moments like this.",
      "Hold on to that feeling—even if it’s small.",
      "Masaya akong marinig yan. Sometimes, these moments matter the most.",
      "That lightness you’re feeling? It’s real."
    ]
  };

  if(repliesByMood[mood]) return pickRandom(repliesByMood[mood]);


  const neutralReplies = [
    "Salamat sa pagbabahagi. I’m here with you.",
    "You don’t need perfect words. Safe ka dito.",
    "Nandito lang ako, nakikinig.",
    "Take your time. Walang maling sasabihin dito.",
    "I’m listening. Go on when you’re ready."
  ];
  return pickRandom(neutralReplies);
}


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
window.db = firebase.firestore();

const freedomWall = document.getElementById('freedomWall');


async function renderPosts() {
  freedomWall.innerHTML = '';

  const querySnapshot = await window.db.collection("posts").orderBy("timestamp", "desc").get();

  querySnapshot.forEach((docSnap) => {
    const postData = docSnap.data();
    const postId = docSnap.id;

    const post = document.createElement('div');
    post.classList.add('wall-post');
    post.style.backgroundColor = postData.color || 'var(--card)';
    post.setAttribute('draggable', true);


    if(postData.text){
      const p = document.createElement('p');
      p.textContent = postData.text;
      post.appendChild(p);
    }


    if(postData.img){
      const img = document.createElement('img');
      img.src = postData.img;
      img.classList.add('img-card');
      post.appendChild(img);
    }


    const actions = document.createElement('div');
    actions.classList.add('post-actions');

 
    const likeBtn = document.createElement('button');
    likeBtn.textContent = postData.liked ? '❤️' : '🤍';
    const likeCount = document.createElement('span');
    likeCount.textContent = postData.likesCount || 0;
    likeCount.style.marginLeft = '6px';

    likeBtn.onclick = async () => {
      const docRef = window.db.collection("posts").doc(postId);
      const newLiked = !postData.liked;
      const newCount = newLiked ? (postData.likesCount || 0)+1 : Math.max((postData.likesCount||1)-1,0);

      await docRef.update({
        liked: newLiked,
        likesCount: newCount
      });

      likeBtn.textContent = newLiked ? '❤️' : '🤍';
      likeCount.textContent = newCount;
      postData.liked = newLiked;
      postData.likesCount = newCount;
    };

    actions.appendChild(likeBtn);
    actions.appendChild(likeCount);


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = async () => {
      if(confirm('Are you sure you want to delete this post?')){
        await window.db.collection("posts").doc(postId).delete();
        renderPosts();
      }
    };
    actions.appendChild(deleteBtn);

    post.appendChild(actions);
    freedomWall.appendChild(post);

 
    post.addEventListener('dragstart', e => draggedIndex = postId);
    post.addEventListener('dragover', e => e.preventDefault());
    post.addEventListener('drop', async e => {
      e.preventDefault();
      const targetId = postId;
    });
  });
}

async function addPost() {
  const text = document.getElementById('postText').value.trim();
  const imageInput = document.getElementById('postImage');
  const color = document.getElementById('postColor')?.value || 'var(--card)';

  if(!text && !imageInput.files[0]){
    alert('Please add text or select an image.');
    return;
  }

  let newPost = { text, liked:false, likesCount:0, color, timestamp: firebase.firestore.FieldValue.serverTimestamp() };

  if(imageInput.files[0]){
    const reader = new FileReader();
    reader.onload = async function(e){
      newPost.img = e.target.result;
      await window.db.collection("posts").add(newPost);
      renderPosts();
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    await window.db.collection("posts").add(newPost);
    renderPosts();
  }

  document.getElementById('postText').value = '';
  if(imageInput) imageInput.value = '';
}

window.addEventListener('DOMContentLoaded', renderPosts);
