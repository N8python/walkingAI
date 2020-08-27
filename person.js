function Person({
    x,
    y,
    b
}) {
    const brain = b;
    const myGroup = Body.nextGroup(false);
    const torso = Bodies.rectangle(x, y, 10, 40, {
        collisionFilter: {
            mask: defaultCategory,
            group: myGroup,
            category: uniqCategory
        },
        restitution: 0.5,
        friction: 1,
        frictionAir: 0
    });
    const head = Bodies.circle(x, y - 25, 15, {
        collisionFilter: {
            mask: defaultCategory,
            group: myGroup,
            category: uniqCategory
        },
        friction: 1,
        frictionAir: 0,
        restitution: 0.5,
        density: 0.00000000001
    });
    const arm1 = Bodies.rectangle(x, y - 10, 10, 40, {
        collisionFilter: {
            mask: defaultCategory,
            group: Body.nextGroup(false),
            category: uniqCategory
        },
        chamfer: { radius: 5 }
    });
    const shoulder1 = Constraint.create({
        bodyA: torso,
        bodyB: arm1,
        pointA: {
            x: 0,
            y: 0
        },
        pointB: {
            x: 0,
            y: 10
        },
        length: 0
    })
    const arm2 = Bodies.rectangle(x, y - 10, 10, 40, {
        collisionFilter: {
            mask: defaultCategory,
            group: Body.nextGroup(false),
            category: uniqCategory
        },
        chamfer: { radius: 5 }
    });
    const shoulder2 = Constraint.create({
        bodyA: torso,
        bodyB: arm2,
        pointA: {
            x: 0,
            y: 0
        },
        pointB: {
            x: 0,
            y: 10
        },
        length: 0
    })
    const l1 = Body.nextGroup(false);
    const l2 = Body.nextGroup(false);
    const distanceFromCenter = 0;
    const legWidth = 10;
    const upperLeg1 = Bodies.rectangle(x + distanceFromCenter, y + 45, legWidth, 30, {
        collisionFilter: {
            mask: defaultCategory,
            group: l1,
            category: uniqCategory
        },
        friction: 1,
        frictionAir: 0,
        restitution: 0.5,
        density: 0.005
            /*frictionAir: 0.1,*/
    });
    const upperLeg2 = Bodies.rectangle(x - distanceFromCenter, y + 45, legWidth, 30, {
        collisionFilter: {
            mask: defaultCategory,
            group: l2,
            category: uniqCategory
        },
        friction: 1,
        frictionAir: 0,
        restitution: 0.5,
        density: 0.005
            /*frictionAir: 0.1,*/
    });
    let death = false;
    const s = 1;
    const u = 2.5;
    const l = 2.5;
    const hipJoint1 = Constraint.create({
        bodyA: torso,
        bodyB: upperLeg1,
        length: 0,
        pointA: {
            x: distanceFromCenter,
            y: 20
        },
        pointB: {
            x: 0,
            y: -15
        },
        /*angleAStiffness: s,
        angleAMin: -Math.PI / u,
        angleAMax: Math.PI / u,*/
        angleBMin: -Math.PI / u,
        angleBMax: Math.PI / u,
        angleBStiffness: s,
        damping: 0.1
    })
    const hipJoint2 = Constraint.create({
        bodyA: torso,
        bodyB: upperLeg2,
        length: 0,
        pointA: {
            x: -distanceFromCenter,
            y: 20
        },
        pointB: {
            x: 0,
            y: -15
        },
        /*angleAStiffness: s,
        angleAMin: -Math.PI / u,
        angleAMax: Math.PI / u,*/
        angleBMin: -Math.PI / u,
        angleBMax: Math.PI / u,
        angleBStiffness: s,
        damping: 0.1
    })
    const lowerLeg1 = Bodies.rectangle(x + distanceFromCenter, y + 75, legWidth, 30, {
        collisionFilter: {
            mask: defaultCategory,
            group: l1,
            category: uniqCategory
        },
        restitution: 0.5,
        density: 0.005,
        damping: 0.1,
        friction: 1,
        frictionAir: 0
            /*angleAStiffness: s,
            angleAMin: -Math.PI / l,
            angleAMax: Math.PI / l,*/
    });
    const lowerLeg2 = Bodies.rectangle(x - distanceFromCenter, y + 75, legWidth, 30, {
        collisionFilter: {
            mask: defaultCategory,
            group: l2,
            category: uniqCategory
        },
        restitution: 0.5,
        density: 0.005,
        frictionAir: 0,
        damping: 0.1,
        friction: 1
            /*angleAStiffness: s,
            angleAMin: -Math.PI / l,
            angleAMax: Math.PI / l,*/
    });
    const foot1 = Bodies.rectangle(x - 10, y + 85, 12, 10, {
        collisionFilter: {
            mask: defaultCategory,
            group: myGroup,
            category: uniqCategory
        }
    })
    const foot2 = Bodies.rectangle(x + 10, y + 85, 12, 10, {
        collisionFilter: {
            mask: defaultCategory,
            group: myGroup,
            category: uniqCategory
        }
    })
    const ankle1 = Constraint.create({
        bodyA: lowerLeg1,
        bodyB: foot1,
        pointA: {
            x: 0,
            y: 15
        },
        pointB: {
            x: 0,
            y: -5
        },
        length: 0
    })
    const ankle2 = Constraint.create({
        bodyA: lowerLeg2,
        bodyB: foot2,
        pointA: {
            x: 0,
            y: 15
        },
        pointB: {
            x: 0,
            y: -5
        },
        length: 0
    })
    const knee1 = Constraint.create({
        bodyA: upperLeg1,
        bodyB: lowerLeg1,
        length: 0,
        pointA: {
            x: 0,
            y: 15
        },
        pointB: {
            x: 0,
            y: -15
        },
        angleBMin: -Math.PI / l,
        angleBMax: Math.PI / l,
        angleBStiffness: s,
    })
    const knee2 = Constraint.create({
        bodyA: upperLeg2,
        bodyB: lowerLeg2,
        length: 0,
        pointA: {
            x: 0,
            y: 15
        },
        pointB: {
            x: 0,
            y: -15
        },
        angleBMin: -Math.PI / l,
        angleBMax: Math.PI / l,
        angleBStiffness: s,
    })

    const neck = Constraint.create({
        bodyA: torso,
        bodyB: head,
        pointA: {
            x: 0,
            y: -20
        },
        pointB: {
            x: 0,
            y: 15
        },
        length: 0,
        angleBMax: 0,
        angleBMin: 0,
        angleBStiffness: 1
    });
    const r = 25;
    const hipConstraint1 = Constraint.create({
        bodyA: torso,
        pointA: { x: -r, y: 0 },
        bodyB: upperLeg1,
        pointB: { x: -r, y: 0 },
        stiffness: 0,
        length: r
    });
    const hipConstraint2 = Constraint.create({
        bodyA: torso,
        pointA: { x: r, y: 0 },
        bodyB: upperLeg2,
        pointB: { x: r, y: 0 },
        stiffness: 0,
        length: r
    });
    const ankleConstraint1 = Constraint.create({
        bodyA: upperLeg1,
        pointA: { x: -r, y: 0 },
        bodyB: lowerLeg1,
        pointB: { x: -r, y: 0 },
        stiffness: 0,
        length: r
    });
    const ankleConstraint2 = Constraint.create({
        bodyA: upperLeg2,
        pointA: { x: r, y: 0 },
        bodyB: lowerLeg2,
        pointB: { x: r, y: 0 },
        stiffness: 0,
        length: r
    });
    let inGame = false;
    let timeSurvived = 0;
    let torsoHeight = 0;
    let anklePenalty = 0;
    let movingLegs = 0;
    return {
        get inGame() {
            return inGame;
        },
        get score() {
            return max((torso.position.x) ** 5, 0); //max(head.position.x ** 3 + timeSurvived ** 1.5 + movingLegs ** 1.5 + max(torsoHeight, 0) ** 1.2 - anklePenalty ** 1.3, 0);
        },
        get lengthAhead() {
            return torso.position.x;
        },
        get brain() {
            return brain;
        },
        get movingLegs() {
            return movingLegs;
        },
        get timeSurvived() {
            return timeSurvived;
        },
        get torsoHeight() {
            return torsoHeight;
        },
        add() {
            inGame = true;
            World.add(engine.world, [head, neck, shoulder1, shoulder2, torso, /*arm1, arm2,*/ upperLeg1, upperLeg2, lowerLeg1, lowerLeg2, hipJoint1, hipJoint2, knee1, knee2, /*foot1, foot2, ankle1, ankle2 hipConstraint1, hipConstraint2, ankleConstraint1, ankleConstraint2*/ ]);
        },
        remove() {
            if (!theBestNet) {
                theBestNet = [brain, this.score];
            } else {
                if (this.score > theBestNet[1]) {
                    theBestNet = [brain, this.score];
                }
            }
            inGame = false;
            World.remove(engine.world, [head, neck, shoulder1, shoulder2, torso, /* arm1, arm2,*/ upperLeg1, upperLeg2, lowerLeg1, lowerLeg2, hipJoint1, hipJoint2, knee1, knee2, /*foot1, foot2, ankle1, ankle2*/ /*hipConstraint1, hipConstraint2, ankleConstraint1, ankleConstraint2*/ ]);
        },
        draw() {
            if (inGame) {
                if (!death) {
                    timeSurvived += 1;
                }
                torsoHeight += (ground.position.y - torso.position.y) * 25;
                const legImportance = 1;
                movingLegs += sigmoid(upperLeg1.angularSpeed) * legImportance;
                movingLegs += sigmoid(upperLeg2.angularSpeed) * legImportance;
                movingLegs += sigmoid(lowerLeg1.angularSpeed) * legImportance;
                movingLegs += sigmoid(lowerLeg2.angularSpeed) * legImportance;
                //fill(225);
                drawVertices(torso.vertices);
                /*drawVertices(arm1.vertices);
                drawVertices(arm2.vertices);*/
                drawVertices(upperLeg1.vertices);
                drawVertices(upperLeg2.vertices);
                drawVertices(lowerLeg1.vertices);
                drawVertices(lowerLeg2.vertices);
                /*drawVertices(foot1.vertices);
                drawVertices(foot2.vertices);*/
                drawCircle(head);
                /*stroke(255, 0, 0);
                drawConstraint(neck);
                drawConstraint(hipJoint1);
                drawConstraint(hipJoint2);
                drawConstraint(knee1);
                drawConstraint(knee2);
                stroke(0);*/
                /*stroke(255);
                drawConstraint(hipConstraint1);
                stroke(0);*/
            }
        },
        constraintDist(c) {
            let uX = c.pointA.x;
            let uY = c.pointA.y;
            let uA = c.bodyA.angle;
            let upperX = c.bodyA.position.x + uX * Math.cos(uA) - uY * Math.sin(uA);
            let upperY = c.bodyA.position.y + uX * Math.sin(uA) + uY * Math.cos(uA);

            let lX = c.pointB.x;
            let lY = c.pointB.y;
            let lA = c.bodyB.angle;
            let lowerX = c.bodyB.position.x + lX * Math.cos(lA) - lY * Math.sin(lA);
            let lowerY = c.bodyB.position.y + lX * Math.sin(lA) + lY * Math.cos(lA);

            var xDelta = upperX - lowerX;
            var yDelta = upperY - lowerY;
            return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
        },
        checkConstraint(c, t) {
            if (this.constraintDist(c) > t) {
                c.length = t;
                c.stiffness = 0;
            } else {
                c.stiffness = 0;
            }
        },
        constrainAngles() {
            /*const upperBound = 3;
            const lowerBound = 3;
            const torsoBound = 4;
            Body.setAngle(upperLeg1, Math.abs(upperLeg1.angle) > Math.PI / upperBound ? Math.PI / upperBound * Math.sign(upperLeg1.angle) : upperLeg1.angle);
            Body.setAngle(upperLeg2, Math.abs(upperLeg2.angle) > Math.PI / upperBound ? Math.PI / upperBound * Math.sign(upperLeg2.angle) : upperLeg2.angle);
            Body.setAngle(lowerLeg1, Math.abs(lowerLeg1.angle) > Math.PI / lowerBound ? Math.PI / lowerBound * Math.sign(lowerLeg1.angle) : lowerLeg1.angle);
            Body.setAngle(lowerLeg2, Math.abs(lowerLeg2.angle) > Math.PI / lowerBound ? Math.PI / lowerBound * Math.sign(lowerLeg2.angle) : lowerLeg2.angle);
            Body.setAngle(torso, Math.abs(torso.angle) > Math.PI / torsoBound ? Math.PI / torsoBound * Math.sign(torso.angle) : torso.angle);*/
            this.checkConstraint(hipConstraint1, r);
            this.checkConstraint(hipConstraint2, r);
            this.checkConstraint(ankleConstraint1, r);
            this.checkConstraint(ankleConstraint2, r);
        },
        cc() {
            const dead = Detector.collisions([
                [head, ground],
                [torso, ground],
                [arm1, ground],
                [arm2, ground],
                /*[upperLeg1, ground],
                [upperLeg2, ground]*/
            ], engine);
            const legTouch = Detector.collisions([
                [upperLeg1, ground],
                [upperLeg2, ground],
                /*[lowerLeg1, ground],
                [lowerLeg2, ground]*/
            ], engine);
            if (head.position.x < Manager.deathX) {
                World.remove(engine.world, [neck, shoulder1, shoulder2, hipJoint1, hipJoint2, knee1, knee2])
                const deadHead = Detector.collisions([
                    [head, ground]
                ], engine);
                death = true;
                setTimeout(() => {
                    this.remove();
                }, 2500)
            } else {
                if (dead.length > 0 || head.position.y > 425) {
                    this.remove();
                }
            }
            if (legTouch.length > 0) {
                anklePenalty += 100;
            }
        },
        prepareInputs() {
            const lowerLegTouchingGround = +(Detector.collisions([
                [lowerLeg1, ground],
                [lowerLeg2, ground]
            ], engine).length === 0)
            return [upperLeg1.angle / (2 * Math.PI), upperLeg2.angle / (2 * Math.PI), lowerLeg1.angle / (2 * Math.PI), lowerLeg2.angle / (2 * Math.PI), torso.angle / (2 * Math.PI), lowerLegTouchingGround, (ground.position.y - torso.position.y) / 300, Math.tanh(upperLeg1.angularVelocity), Math.tanh(upperLeg2.angularVelocity), Math.tanh(lowerLeg1.angularVelocity), Math.tanh(lowerLeg2.angularVelocity), Math.tanh(torso.angularVelocity), Math.tanh(torso.velocity.y), 1];
        },
        boundedDecay(x, c) {
            if (c > 0) {
                if (x > c) {
                    return 1 - Math.min(Math.abs(x / c - 1), 1);
                }
                return 1;
            }
            if (x < c) {
                return 1 - Math.min(Math.abs(x / c - 1), 1);
            }
            return 1;
        },
        adjustAngles(outputs) {
            const mag = 1;
            if (!death && inGame) {
                Body.setAngularVelocity(upperLeg1, map(outputs[0], -1, 1, -mag, mag));
                Body.setAngularVelocity(upperLeg2, map(outputs[1], -1, 1, -mag, mag));
                Body.setAngularVelocity(lowerLeg1, map(outputs[2], -1, 1, -mag, mag));
                Body.setAngularVelocity(lowerLeg2, map(outputs[3], -1, 1, -mag, mag));
                Body.setAngularVelocity(torso, map(outputs[4], -1, 1, -mag, mag));
            }
        },
        think() {
            this.adjustAngles(brain.feedForward(this.prepareInputs()));
        }
    }
}