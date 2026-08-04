const spotifyStatus = document.getElementById("spotify-status");

if (spotifyStatus) {
  const username = "31am6hhgi535wzokdgsp5adujxli";
  const apiUrl = `https://spotify-github-profile.vercel.app/api?username=${username}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Spotify API unavailable");
      }
      return response.json();
    })
    .then((data) => {
      const title = data?.song || data?.title || data?.track || data?.trackName;
      const artist = data?.artist || data?.artists || data?.artistName;
      const isPlaying = data?.isPlaying || data?.playing;
      const image = data?.image || data?.albumImageUrl || data?.cover;

      if (title) {
        spotifyStatus.innerHTML = `
          <div class="spotify-icon">♪</div>
          <div>
            <h3>${isPlaying ? "Now playing" : "Last played"}</h3>
            <p>${title}${artist ? ` — ${artist}` : ""}</p>
            ${image ? `<img src="${image}" alt="Album art" style="width: 56px; height: 56px; border-radius: 10px; margin-top: 8px; object-fit: cover;" />` : ""}
          </div>
        `;
      } else {
        throw new Error("No track data");
      }
    })
    .catch(() => {
      spotifyStatus.innerHTML = `
        <div class="spotify-icon">♪</div>
        <div>
          <h3>Spotify</h3>
          <p>Live listening data is temporarily unavailable, but your profile is ready to open.</p>
        </div>
      `;
    });
}

document.querySelectorAll('.copy-card').forEach((card) => {
  card.addEventListener('click', async (event) => {
    event.preventDefault();
    const value = card.getAttribute('data-copy');

    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      const label = card.querySelector('small');
      if (label) {
        label.textContent = 'Copied!';
      }
    } catch {
      const label = card.querySelector('small');
      if (label) {
        label.textContent = 'Copy failed';
      }
    }
  });
});

const starfield = document.createElement('canvas');
starfield.id = 'starfield';
document.body.appendChild(starfield);

const ctx = starfield.getContext('2d');
const stars = [];
const starCount = 220;
const pointer = { x: 0.5, y: 0.5 };
let offsetX = 0;
let offsetY = 0;
let drift = 0;

function resizeStarfield() {
  const dpr = window.devicePixelRatio || 1;
  starfield.width = window.innerWidth * dpr;
  starfield.height = window.innerHeight * dpr;
  starfield.style.width = `${window.innerWidth}px`;
  starfield.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initStars() {
  stars.length = 0;
  for (let i = 0; i < starCount; i += 1) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 2.6 + 0.8,
      alpha: Math.random() * 0.65 + 0.2,
      hue: 190 + Math.random() * 140,
      speed: 0.03 + Math.random() * 0.08,
      trail: Math.random() < 0.16,
    });
  }
}

function drawStars() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  stars.forEach((star) => {
    const px = star.x * width + offsetX * star.speed * 80 + Math.sin(drift + star.hue) * 8;
    const py = star.y * height + offsetY * star.speed * 80 + Math.cos(drift + star.hue) * 6;
    const x = ((px % width) + width) % width;
    const y = ((py % height) + height) % height;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.radius * 6);
    gradient.addColorStop(0, `hsla(${star.hue}, 90%, 92%, ${star.alpha})`);
    gradient.addColorStop(0.18, `hsla(${star.hue}, 90%, 92%, ${star.alpha * 0.55})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, star.radius * 6, 0, Math.PI * 2);
    ctx.fill();

    if (star.trail) {
      ctx.strokeStyle = `hsla(${star.hue}, 90%, 95%, ${star.alpha * 0.25})`;
      ctx.lineWidth = star.radius * 0.8;
      ctx.beginPath();
      ctx.moveTo(x - star.radius * 4, y - star.radius * 4);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });
}

function animateStars() {
  offsetX += (pointer.x - 0.5) * 0.65;
  offsetY += (pointer.y - 0.5) * 0.65;
  offsetX *= 0.88;
  offsetY *= 0.88;
  drift += 0.007;
  drawStars();
  requestAnimationFrame(animateStars);
}

window.addEventListener('mousemove', (event) => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

window.addEventListener('resize', () => {
  resizeStarfield();
  initStars();
});

resizeStarfield();
initStars();
animateStars();
