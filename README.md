# Square
An Entity Component System Based Game Engine

**Example**

**app.js**
```javascript
import Application from "./void2d/Application.js";
import { KeyboardSystem, MovementSystem, RenderingSystem, ShapeRenderer, UIRenderer } from "./systems.js";
import { PositionComponent, BoxShapeComponent } from "./components.js";

const app = new Application({
    initialState: {
        score: 0,
        loading: true
    },
    systems: [RenderingSystem, UIRenderer, ShapeRenderer, KeyboardSystem, MovementSystem]
});

app.on("init", app => {
    const player = app.entityPool.getEntity();
    player.tag("visible");
    player.tag("controllable");

    player.attach("position", new PositionComponent(20, 20));
    player.attach("shape", new BoxShapeComponent(32, 32));
    player.attach("speed", 10);

    app.add(player);
});

app.start();
```

**systems.js**
```javascript
export const RenderingSystem = app => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.background = "#000";

    const context = canvas.getContext("2d");

    app.on("init", () => {
      document.body.appendChild(canvas);
    });

    app.on("update", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        app.emit("render", context);
    });
}

export const MovementSystem = app => {
    app.on("update", dt => {
        const entities = app.query("controllable");
        
        entities.forEach(entity => {
            if(app.state.keyboard.ArrowRight) {
                entity.position.x += (100 + entity.speed) * dt;
            } else if(app.state.keyboard.ArrowLeft) {
                entity.position.x -= (100 + entity.speed) * dt;
            }
            if(app.state.keyboard.ArrowDown) {
                entity.position.y += (100 + entity.speed) * dt;
            } else if(app.state.keyboard.ArrowUp) {
                entity.position.y -= (100 + entity.speed) * dt;
            }
        });    
    });
}

export const KeyboardSystem = app => {
    app.state.keyboard = {};

    const handleKey = ({ key, type }) => 
        app.state.keyboard[key] = type === 'keydown' ? true : false;

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
}

export const ShapeRenderer = app => {

    const query = ['@position', '@shape', 'visible'];

    app.on("render", ctx => {
        const entities = app.query(query);

        entities.forEach(entity => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(entity.position.x, entity.position.y, entity.shape.width, entity.shape.height);
        });
    });

}

export const UIRenderer = app => {
    app.on("render", ctx => {
        ctx.fillStyle = "#fff";
        ctx.font = "24px sans-serif";
        ctx.fillText(app.state.score, ctx.measureText(app.state.score).width + 10, 34);
    });
}
```

**components.js**
```javascript
export class PositionComponent {
    constructor(x = 0, y = 0) {
        Object.assign(this, { x, y });
    }
}

export class BoxShapeComponent {
    constructor(width, height) {
        Object.assign(this, { width, height });
    }
}
```
