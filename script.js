const arena = document.getElementById('arena');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const msg = document.getElementById('msg');
const small = document.getElementById('small');

// Place "No" initially within the arena nicely
function placeNoInitial() {
    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();
    // Slightly right of center, aligned in the row height
    const left = Math.min(a.width - b.width, Math.max(0, a.width * 1 - b.width/2));
    const top = 0;
    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
    noBtn.dataset.locked = "0";
}

// Random safe position inside arena
function moveNoRandom() {
    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();
    const pad = 6;

    const maxX = Math.max(pad, a.width - b.width - pad);
    const maxY = Math.max(pad, a.height - b.height - pad);

    const x = pad + Math.random() * (maxX - pad);
    const y = pad + Math.random() * (maxY - pad);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// Make it dodge the cursor (desktop)
function onMouseMove(e) {
    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    // pointer location relative to arena 
    const px = e.clientX - a.left;
    const py = e.clientY - a.top;

    // button center relative to arena 
    const bx = (b.left - a.left) + b.width/2;
    const by = (b.top - a.top) + b.height/2;

    const dx = px - bx;
    const dy = py - by;
    const dist = Math.hypot(dx, dy);

    // If cursor gets close, teleport
    if (dist < 100) {
        moveNoRandom();
        tease();
    }
}

// Mobile/touch: If she tries to tap "No", it slips away 
function onNoTouch(e) {
    e.preventDefault();
    moveNoRandom();
    tease(true);
}

// If she somehow clicks "No" (should be nearly impossible), we still convert it
function onNoClick(e) {
    e.preventDefault();
    // Turn it into a Yes.
    msg.textContent = "Nice try 😏";
    small.textContent = "But the universe has decided: it's YES.";
    setTimeout(() => yesBtn.click(), 350);
}

const teases = [
    "Nope :>",
    "How dare you even try 😒",
    "Sorry, no free will 😁",
    "Ooooohhh so close!",
    "Try again 😘",
    "You have to try better than that",
    "Missed me? Damn miss you too 😍",
    "Why are you like this.",
    "Yeahhh no 😂"
];

function tease(isTouch=false) {
    const t = teases[Math.floor(Math.random()*teases.length)];
    small.textContent = isTouch ? `${t} (tap harder!)` : t;
}

// YES action
yesBtn.addEventListener('click', () => {
    msg.textContent = "YAYYYYYYYYY!!";
    small.textContent = "I love you so much, you made my day!";
    fireConfetti();
    // disable buttons after yes
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.style.filter = "grayscale(.2)";
    noBtn.style.opacity = ".5";
});

// Dodge events 
arena.addEventListener('mousemove', onMouseMove);
noBtn.addEventListener('touchstart', onNoTouch, {passive:false});
noBtn.addEventListener('click', onNoClick);

window.addEventListener('resize', placeNoInitial);
placeNoInitial();

// --- simple confetti (tiny, no libraries) ---
function fireConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({length: 160}, () => ({
        x: Math.random()*canvas.width,
        y: -20 - Math.random()*canvas.height*0.2,
        r: 4 + Math.random()*6,
        vx: -2 + Math.random()*4,
        vy: 2 + Math.random()*4,
        rot: Math.random()*Math.PI,
        vr: -0.2 + Math.random()*0.4
    }));

    let frames = 0;
    (function tick() {
        frames++;
        ctx.clearRect(0,0,canvas.width, canvas.height);

        for (const p of pieces) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.vy += 0.02; // gravity

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = 0.9;
            ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
            ctx.restore();
        }

        // Stop after ~4 seconds
        if (frames < 240) {
            requestAnimationFrame(tick);
        } else {
            canvas.style.display = 'none';
        }
    })();
}