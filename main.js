const { Engine, Composite, Render, World, Bodies, Body, Detector, Constraint } = Matter;
let ground;
const defaultCategory = 1;
const uniqCategory = 2;
let theBestNet;
let tick = 0;
const historyCtx = document.getElementById("history").getContext("2d");
const history = new Chart(historyCtx, {
    type: 'line',
    data: {
        labels: [1],
        datasets: [{
            data: [0],
            label: "Median Score",
            fill: false,
            borderColor: "#3e95cd"
        }, {
            data: [0],
            label: "High Score",
            fill: false,
            borderColor: "c45850"
        }]

    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
})

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
    document.getElementById("genDisplay").innerHTML = `Generation: ${Manager.generation} <br> Batch: ${Manager.batch - 1}<br>High Score: ${Manager.highMeters.toFixed(2)}m <br> Current High Score: ${Manager.currentMeters.toFixed(2)}m`;
    translate(-max(Manager.toTranslate - 400, 0), 0);
    background(0, 200, 200);
    fill(255);
    textSize(20);
    //text(`Time Left: ${Manager.batchTimer}s`, 10 - Manager.currentTopScore + 100, 25);
    fill(120, 80, 0);
    drawVertices(ground.vertices);
    for (let i = 0; i < 1000; i++) {
        /*fill(150);
        rect(i * 200 + 100, height - 100, 100, 100);
        fill(0);
        text(`${i}m`, i * 200 + 135, height - 50)*/
        fill(140, 80, 0);
        rect(i * 200 + 100, height - 150, 10, 50)
        rect(i * 200 + 75, height - 175, 60, 40)
        fill(0);
        textAlign(CENTER);
        text(`${i}m`, i * 200 + 105, height - 150)
    }
    fill(0, 255, 0);
    rect(0, 500, 200000, 10);
    fill(255, 255, 0);
    noStroke();
    circle(max(Manager.toTranslate - 400, 0) + 700, 87.5, 100);
    for (let i = 0; i < 30; i++) {
        noFill();
        stroke(255, 255, map(i, 0, 30, 0, 255), map(i, 0, 30, 255, 0));
        circle(max(Manager.toTranslate - 400, 0) + 700, 87.5, 100 + i);
    }
    fill(255);
    stroke(0);
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

document.getElementById("openCharts").onclick = () => {
    document.getElementById('charts').style.display = 'block';
}