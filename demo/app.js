import Application from "../src/Application.js";
import { InputSystem, RenderingSystem, ShapeRenderer, GravitySystem, MovementSystem } from "./systems.js";
import { BoxShapeComponent, VectorComponent } from "./components.js";

const app = new Application({
    config: {
        canvas: {
            width: 400,
            height: 400,
        }
    },
    initialState: {
        score: 0,
        loading: true
    },
    systems: [
        RenderingSystem, 
        ShapeRenderer, 
        InputSystem, 
        GravitySystem,
        MovementSystem
    ]
});

app.on("init", app => {
    const player = app.entityPool.getEntity();
    player.tag("visible");
    player.tag("controllable");
    player.tag("player");

    player.attach("position", new VectorComponent(20, 20));
    player.attach("shape", new BoxShapeComponent(32, 32));
    player.attach("speed", 100);
    player.attach("jumpforce", 500);
    player.attach("velocity", new VectorComponent);

    app.add(player);

    const c = app.entityPool.getEntity();
    c.tag("visible");
    c.attach("position", new VectorComponent(100, 20));
    c.attach("shape", new BoxShapeComponent(32, 32));
    c.attach("velocity", new VectorComponent);

    app.add(c);
});

app.start();