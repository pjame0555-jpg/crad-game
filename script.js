(`collect-${id}`);
  if (collectItem) {
    collectItem.classList.add('unlocked');
  }
}

// เรียกใช้ฟังก์ชันสร้างสมุดสะสมเมื่อเริ่มเกม
initCollection();

// คลิกการ์ดสุ่มได้
document.getElementById('card').addEventListener('click', drawCard);const cards = [
  { 
    id: 1,
    title: 'จอมมังกรอเวจีโบราณ', 
    rarity: 'LR', 
    desc: 'การ์ดระดับตำนานสูงสุด ผู้ปกครองมิติเวลาและความมืดมิดทั้งปวง!', 
    image: 'images/dragon.jpg' 
  },
  { 
    id: 2,
    title: 'ปีศาจจากขุมนรก', 
    rarity: 'SSR', 
    desc: 'สิ่งมีชีวิตจากความมืดมิด พร้อมสูบวิญญาณและทำลายล้างทุกสิ่ง!', 
    image: 'images/demon.jpg' 
  },
  { 
    id: 3,
    title: 'จอมเวทน้ำแข็ง', 
    rarity: 'SR', 
    desc: 'สามารถแช่แข็งศัตรูให้อยู่กับที่ได้ด้วยเวทมนตร์โบราณ', 
    image: 'images/mage.jpg' 
  },
  { 
    id: 4,
    title: 'อัศวินเกราะเหล็ก', 
    rarity: 'R', 
    desc: 'มีพลังป้องกันสูง คอยปกป้องเพื่อนร่วมทีมจากความเสี่ยง', 
    image: 'images/knight.jpg' 
  },
  { 
    id: 5,
    title: 'นกพิราบส่งสาร', 
    rarity: 'N', 
    desc: 'บินไว แต่ไม่มีพลังต่อสู้ เอาไว้ส่งจดหมายอย่างเดียว', 
    image: 'images/pigeon.jpg' 
  }
];

let playerData = {
  username: '',
  unlockedCards: [],
  drawCount: 0
};

let isFlipped = false;

window.onload = function() {
  const savedData = localStorage.getItem('cardGame_playerData');
  if (savedData) {
    playerData = JSON.parse(savedData);
    showGameContent();
  }
};

function login() {
  const usernameInput = document.getElementById('usernameInput').value.trim();
  if (usernameInput === '') {
    alert('กรุณากรอกชื่อผู้เล่นก่อนครับ');
    return;
  }

  playerData.username = usernameInput;
  saveData();
  showGameContent();
}

function logout() {
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('gameContent').style.display = 'none';
  document.getElementById('usernameInput').value = '';
}

function saveData() {
  localStorage.setItem('cardGame_playerData', JSON.stringify(playerData));
}

function showGameContent() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('gameContent').style.display = 'block';
  document.getElementById('playerDisplay').innerText = playerData.username;
  document.getElementById('drawCountDisplay').innerText = playerData.drawCount;

  initCollection();
}

function initCollection() {
  const grid = document.getElementById('collectionGrid');
  document.getElementById('totalCount').innerText = cards.length;
  grid.innerHTML = '';

  cards.forEach(card => {
    const isUnlocked = playerData.unlockedCards.includes(card.id);
    const item = document.createElement('div');
    item.className = `collection-item ${isUnlocked ? 'unlocked' : ''}`;
    item.id = `collect-${card.id}`;
    
    item.innerHTML = `
      <span class="item-badge">${card.rarity}</span>
      <img src="${card.image}" alt="${card.title}">
      <div class="item-title">${card.title}</div>
    `;
    
    grid.appendChild(item);
  });

  document.getElementById('collectedCount').innerText = playerData.unlockedCards.length;
}

function drawCard() {
  const cardInner = document.getElementById('cardInner');
  const btn = document.getElementById('drawBtn');

  btn.disabled = true;

  if (isFlipped) {
    cardInner.classList.remove('flipped');
    isFlipped = false;
    
    setTimeout(() => {
      randomizeAndFlip();
    }, 600);
  } else {
    randomizeAndFlip();
  }
}

function randomizeAndFlip() {
  const cardInner = document.getElementById('cardInner');
  const cardBack = document.getElementById('cardBack');
  const cardRarity = document.getElementById('cardRarity');
  const btn = document.getElementById('drawBtn');

  const randomIndex = Math.floor(Math.random() * cards.length);
  const selectedCard = cards[randomIndex];

  playerData.drawCount++;
  document.getElementById('drawCountDisplay').innerText = playerData.drawCount;

  cardBack.className = 'card-back';
  cardBack.classList.add(`rarity-${selectedCard.rarity}`);

  cardRarity.className = 'rarity-badge';
  if (selectedCard.rarity === 'LR') {
    cardRarity.classList.add('badge-LR');
  }

  cardRarity.innerText = selectedCard.rarity;
  document.getElementById('cardImage').src = selectedCard.image;
  document.getElementById('cardTitle').innerText = selectedCard.title;
  document.getElementById('cardDesc').innerText = selectedCard.desc;

  if (!playerData.unlockedCards.includes(selectedCard.id)) {
    playerData.unlockedCards.push(selectedCard.id);
    const collectItem = document.getElementById(`collect-${selectedCard.id}`);
    if (collectItem) collectItem.classList.add('unlocked');
    document.getElementById('collectedCount').innerText = playerData.unlockedCards.length;
  }

  saveData();

  cardInner.classList.add('flipped');
  isFlipped = true;

  setTimeout(() => {
    btn.disabled = false;
  }, 600);
}

function resetData() {
  if (confirm('คุณต้องการรีเซ็ตประวัติการสุ่มและการ์ดที่สะสมทั้งหมดใช่หรือไม่?')) {
    playerData.unlockedCards = [];
    playerData.drawCount = 0;
    saveData();
    showGameContent();
  }
}

document.getElementById('card').addEventListener('click', drawCard);