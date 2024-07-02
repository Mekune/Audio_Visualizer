let fft;
let particles = [];
let mic;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Initialisation de l'analyseur FFT
  fft = new p5.FFT();

  // Restaurer l'état du microphone depuis localStorage
  let micEnabled = JSON.parse(localStorage.getItem("micEnabled"));
  if (micEnabled) {
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);
  }

  // Nettoyage des ressources audio lorsque la page se ferme ou rafraîchit
  window.addEventListener("beforeunload", cleanupAudio);
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3);
  noFill();

  translate(width / 2, height / 2);

  // Analyse FFT
  let spectrum = fft.analyze();
  let amp = fft.getEnergy(20, 200);

  // Dessin des formes basées sur le spectre audio
  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i < 181; i += 0.5) {
      let index = floor(map(i, 0, 181, 0, spectrum.length - 1));
      let r = map(spectrum[index], 0, 255, 150, 350);
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
      particles[i].update(amp > 220);
      particles[i].show();
    }
  }
}

// function cleanupAudio() {
//   if (mic) {
//     mic.stop();
//     fft.setInput(null);
//   }
// }

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
      this.pos.add(this.vel); // Ajoutez votre comportement conditionnel ici
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
