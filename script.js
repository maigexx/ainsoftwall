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

if(savedTheme) root.setAttribute("data-theme", savedTheme);

if(toggle){
  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
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
