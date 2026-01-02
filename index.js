let score1 = 0;
let score2 = 0;
let lastRoll1 = null;
let lastRoll2 = null;
const WIN_TARGET = 3;

const startBtn = document.getElementById("startBtn");
const nameScreen = document.getElementById("nameScreen");
const gameContainer = document.getElementById("gameContainer");

const roll1 = document.getElementById('roll1');
const roll2 = document.getElementById('roll2');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const label1 = document.getElementById('label1');
const label2 = document.getElementById('label2');
const status = document.getElementById('status');

const winnerOverlay = document.getElementById('winnerOverlay');
const winnerBox = document.getElementById('winnerBox');
const winnerText = document.getElementById('winnerText');
const closePopup = document.getElementById('closePopup');
const winSound = document.getElementById('winSound');
const diceSound = document.getElementById('diceSound');
const restart = document.getElementById('restart');

// Start game — attach handler so Start button works
startBtn.addEventListener('click', () => {
  const p1 = document.getElementById('name1').value.trim() || 'Player 1';
  const p2 = document.getElementById('name2').value.trim() || 'Player 2';


  // store names in DOM (no localStorage required)
  label1.textContent = `${p1} : 0`;
  label2.textContent = `${p2} : 0`;

 startBtn.addEventListener("click", () => {
  
  nameScreen.classList.add("hidden");    
  gameContainer.classList.remove("hidden");
});

  // initialize controls: player1 starts
  score1 = 0; score2 = 0;
  lastRoll1 = null; lastRoll2 = null;

  roll1.disabled = false;
  roll2.disabled = true;
  status.textContent = `${p1}'s turn — Roll the dice`;
});

// Roll button handlers
roll1.addEventListener('click', () => playerRoll(1));
roll2.addEventListener('click', () => playerRoll(2));

restart.addEventListener('click', () => location.reload());

// Play again from winner popup
closePopup.addEventListener('click', () => {
  winnerOverlay.classList.add('hidden');
  winnerBox.classList.add('hidden');
  location.reload();
});

function playerRoll(player) {
  // if someone already won, ignore
  if (score1 >= WIN_TARGET || score2 >= WIN_TARGET) return;

  const diceImg = (player === 1) ? img1 : img2;
  diceImg.classList.add('shake');

  // random 1..6
  const rollValue = Math.floor(Math.random() * 6) + 1;

  setTimeout(() => {
    diceImg.classList.remove('shake');
     try { diceSound.play(); } catch (e) {}

    diceImg.src = `images/dice${rollValue}.png`;

    if (player === 1) {
      lastRoll1 = rollValue;
      // disable player1, enable player2
      roll1.disabled = true;
      roll2.disabled = false;
      status.textContent = `${getName(1)} rolled ${rollValue}. ${getName(2)}'s turn.`;
    } else {
      lastRoll2 = rollValue;
      // round finishes when player2 rolls: decide winner of round
      roll2.disabled = true;
      roll1.disabled = false;
      status.textContent = `${getName(2)} rolled ${rollValue}. Comparing...`;

      // compare lastRoll1 & lastRoll2
      if (lastRoll1 == null) {
        // edge case: player2 somehow rolled first — just continue
        status.textContent = `${getName(2)} rolled ${rollValue}. Next: ${getName(1)}.`;
        return;
      }

      if (lastRoll1 > lastRoll2) {
        score1 += 1;
        label1.textContent = `${getName(1)} : ${score1}`;
        status.textContent = `${getName(1)} wins the round! (+1)`;
      } else if (lastRoll2 > lastRoll1) {
        score2 += 1;
        label2.textContent = `${getName(2)} : ${score2}`;
        status.textContent = `${getName(2)} wins the round! (+1)`;
      } else {
        status.textContent = `Round is a draw! No points.`;
      }

      // clear last rolls for next round
      lastRoll1 = null;
      lastRoll2 = null;

      // check winner
      if (score1 >= WIN_TARGET) showWinner(getName(1));
      else if (score2 >= WIN_TARGET) showWinner(getName(2));
      else status.textContent += ` Next: ${getName(1)}'s turn.`;
    }

  }, 650); // match animation duration
}

// helper: read names from label text
function getName(player) {
  if (player === 1) return document.getElementById('label1').textContent.split(' : ')[0];
  return document.getElementById('label2').textContent.split(' : ')[0];
}

function showWinner(name) {
  // show overlay + popup
  winnerOverlay.classList.remove('hidden');
  winnerBox.classList.remove('hidden');
  winnerText.textContent = `🎉 Ohh! ${name} Wins!`;

  // play sound if available (won't crash if missing)
  try { winSound.play(); } catch (e) {}

  // disable both rolls
  roll1.disabled = true;
  roll2.disabled = true;
}
