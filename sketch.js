let mic;
let img;
let fft;
let particles = [];

function preload() {
  img = loadImage("BG.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);

  // Charger et appliquer un flou à l'image
  img.filter(BLUR, 12);

  // Initialiser l'analyseur FFT
  fft = new p5.FFT();

  // Appeler la fonction pour demander l'accès au microphone
  setupMicrophone();
}

function setupMicrophone() {
  // Vérifier si l'accès au microphone est déjà activé (par exemple, enregistré dans localStorage)
  let micEnabled = JSON.parse(localStorage.getItem("micEnabled"));

  // Si l'accès n'est pas déjà activé ou enregistré, demander l'autorisation
  if (!micEnabled && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        // Microphone accessible, faire quelque chose avec `stream`
        mic = new p5.AudioIn();
        mic.start();
        fft.setInput(mic);

        // Marquer que l'accès au microphone est activé dans localStorage
        localStorage.setItem("micEnabled", true);
      })
      .catch(function (err) {
        // L'utilisateur a refusé l'accès au microphone ou une erreur est survenue
        console.error("Erreur lors de l'accès au microphone : " + err.message);
      });
  } else if (micEnabled) {
    // Si l'accès est déjà activé, créer simplement l'objet p5.AudioIn et le connecter à FFT
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);
  } else {
    console.log(
      "getUserMedia n'est pas supporté par ce navigateur ou l'accès est déjà refusé."
    );
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noFill();

  translate(width / 2, height / 2);

  // Analyse FFT
  fft.analyze();
  let amp = fft.getEnergy(20, 200);

  // Rotation aléatoire de l'image si l'amplitude est élevée
  if (amp > 220) {
    rotate(random(-0.5, 0.5));
  }

  // Affichage de l'image en arrière-plan
  image(img, 0, 0, width, height);

  // Dessin des formes basées sur le spectre audio
  let wave = fft.waveform();
  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i < 181; i += 0.5) {
      let index = floor(map(i, 0, 181, 0, wave.length - 1));
      let r = map(wave[index], -1, 1, 150, 350);
      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  // Gestion des particules
  let p = new Particle();
  particles.push(p);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].edges()) {
      particles.splice(i, 1); // Supprime la particule si elle sort de l'écran
    } else {
      particles[i].update(amp > 220); // Condition pour le mouvement des particules
      particles[i].show();
    }
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3, 5);
    this.color = [random(200, 255), random(200, 255), random(200, 255)];
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      // Déplace la particule plus loin si la condition est vraie
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    return (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    );
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
