let font;
let state = 3;

let attractors = [];
let clifford, aizawa, lorenz, gumowskiMira;

let cliffordImg, aizawaImg, lorenzImg, gumowskiMiraImg;

function preload() {
    font = loadFont('STIX_Two_Text/STIXTwoText-VariableFont_wght.ttf');
    cliffordImg = loadImage('data/clifford.svg');
    aizawaImg = loadImage('data/aizawa.svg');
    lorenzImg = loadImage('data/lorenz.svg');
    gumowskiMiraImg = loadImage('data/gumowski-mira.svg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    textFont(font);
    
    clifford = new Clifford(-1.6, 1.7, 1.0, 0.8, cliffordImg);
    aizawa = new Aizawa(0.95, 0.7, 0.6, 3.5, 0.25, 0.1, aizawaImg);
    lorenz = new Lorenz(10, 28, 8.0 / 3.0, lorenzImg);
    gumowskiMira = new GumowskiMira(-0.192, 0.982, gumowskiMiraImg);

    attractors = [clifford, aizawa, lorenz, gumowskiMira];
}

function draw() {
    background(0);

    attractors[state].draw();
}

function keyPressed() {
    if (key === ' ') {
        state = (state + 1) % attractors.length;
    }
}

function mousePressed() {
    attractors[state].mousePressed();
    attractors[state].startDrag();
}

function mouseReleased() {
    attractors[state].endDrag();
}

function mouseDragged() {
    attractors[state].mouseDragged();
}

function mouseWheel(event) {
    attractors[state].mouseWheel(event.delta);
}