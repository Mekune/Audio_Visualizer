let s1, s2, s3, s4, s5, s6;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);

  // Création des éléments HTML et des sliders
  createP("Nombre d'éléments").position(20, 710);
  s1 = createSlider(1, 10, 5, 1).position(200, 710);

  createP("Nombre de parties").position(20, 750);
  s2 = createSlider(2, 8, 4, 1).position(200, 750);

  createP("Augmenter la fragmentation").position(20, 790);
  s3 = createSlider(3, 30, 15, 1).position(200, 790);

  createP("Minimum radius").position(20, 830);
  s4 = createSlider(50, 300, 100, 10).position(200, 830);

  createP("Maximum radius").position(20, 870);
  s5 = createSlider(50, 300, 200, 10).position(200, 870);

  createP("Vitesse de rotation").position(20, 910);
  s6 = createSlider(0.1, 1, 0.5, 0.1).position(200, 910);
}

function draw() {
  background(150, 50, 20, 80);
  translate(width / 2, height / 2);
  noFill();
  strokeWeight(4);

  for (var n = 0; n < s1.value(); n++) {
    stroke(150 + n * 20, 100 + n * 5, 50);

    beginShape();
    for (var i = 0; i < 360; i += s3.value()) {
      var rad = map(
        sin(i * s2.value() + frameCount),
        -1,
        1,
        s4.value(),
        s5.value()
      );
      var x = rad * cos(i);
      var y = rad * sin(i);
      vertex(x, y);
    }
    endShape(CLOSE);
    rotate(frameCount * s6.value());
  }
}
