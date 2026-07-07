const lineSpacing = 5;
const sampleStep = 10;
const noiseScale1 = 0.007;
const noiseScale2 = 0.02;
const backgroundColor = [250, 248, 245];
const strokeColor = [15, 25, 55, 60];

let startMillis = 0;
const stopAfterMs = 5000;
let lineOffsets = [];
let globalTimeOffset = 0;

function initializeLineOffsets() {
  const lineCount = Math.ceil(windowHeight / lineSpacing);
  lineOffsets = [];

  for (let i = 0; i < lineCount; i++) {
    lineOffsets.push(random(0, 1000));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12);

  startMillis = millis();
  initializeLineOffsets();
  globalTimeOffset = random(0, 10000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeLineOffsets();
  globalTimeOffset = random(0, 10000);
}

function draw() {
  const elapsed = millis() - startMillis;
  const progress = constrain(elapsed / stopAfterMs, 0, 1);
  const speed = max(0, 1 - progress * progress);

  background(...backgroundColor);
  noFill();
  stroke(...strokeColor);
  strokeWeight(1);

  const elapsedSec = elapsed / 1000;
  const minFreqFactor = 0.08;
  const freqFactor = minFreqFactor + (1 - minFreqFactor) * speed;
  const time = elapsedSec * freqFactor;
  const minAmpFactor = 0.25;
  const ampFactor = minAmpFactor + (1 - minAmpFactor) * speed;
  const lineCount = Math.ceil(windowHeight / lineSpacing);

  for (let i = 0; i < lineCount; i++) {
    beginShape();
    const offset = lineOffsets[i] || 0;

    for (let x = 0; x < windowWidth; x += sampleStep) {
      const noiseValue1 = noise((i * noiseScale1) + time + offset + globalTimeOffset, x * noiseScale1);
      const noiseValue2 = noise((i * noiseScale2) + (time * 1.8) + offset * 1.3 + globalTimeOffset * 0.01, x * noiseScale2);
      const combinedNoise = noiseValue1 * 0.7 + noiseValue2 * 0.3;
      const y = (i * lineSpacing) + combinedNoise * windowHeight * 0.7 * ampFactor;
      vertex(x, y);
    }

    endShape();
  }

  if (progress >= 1) {
    noLoop();
  }
}
