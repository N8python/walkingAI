const { Engine, Composite, Render, World, Bodies, Body, Detector, Constraint } = Matter;
let ground;
const defaultCategory = 1;
const uniqCategory = 2;
let theBestNet;
let tick = 0;

function setup() {
    createCanvas(800, 600);
    engine = Engine.create();
    ground = Bodies.rectangle(width / 2, height - 50, 20000, 100, {
        isStatic: true,
        collisionFilter: {
            category: defaultCategory
        },
        friction: 1
    });
    Manager.initGeneration();
    Manager.runBatch();
    World.add(engine.world, [ground]);
    Engine.run(engine);
    tick++;
}

function draw() {
    document.getElementById("genDisplay").innerHTML = `Generation: ${Manager.generation}, Batch: ${Manager.batch - 1}, High Score: ${Manager.highScore}, Current High Score: ${Math.round(Manager.currentTopScore)}`;
    document.getElementById("timeLeft").innerHTML = `Time Left: ${Manager.batchTimer}s`;
    translate(-max(Manager.toTranslate - 400, 0), 0);
    background(0);
    fill(255);
    textSize(20);
    //text(`Time Left: ${Manager.batchTimer}s`, 10 - Manager.currentTopScore + 100, 25);
    fill(200);
    drawVertices(ground.vertices);
    for (let i = 0; i < 1000; i++) {
        fill(150);
        rect(i * 200 + 100, height - 100, 100, 100);
        fill(0);
        text(`${i}m`, i * 200 + 135, height - 50)
    }
    Manager.drawAll();
    Manager.checkHighScore();
    tick++;
}
setInterval(() => {
    Manager.decTimer();
}, 1000)

function drawCircle(body) {
    circle(body.position.x, body.position.y, body.circleRadius * 2);
}

function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function drawConstraint(c) {
    line(c.bodyA.position.x + c.pointA.x, c.bodyA.position.y + c.pointA.y, c.bodyB.position.x + c.pointB.x, c.bodyB.position.y + c.pointB.y);
}