![Square Banner](https://github.com/rare-earth/Square/raw/main/banner.png)
# Square
An Entity Component System(ECS) Based Game Framework

## Installation
```bash
npm i square-ecs
```

## Example
**app.js**
```javascript
import { Application } from "square-ecs";
import { InputSystem, RenderingSystem, ShapeRenderer, GravitySystem, MovementSystem } from "./src/systems.js";
import { BoxShapeComponent, VectorComponent } from "./src/components.js";

const app = new Application({
    data: {
        config: {
            canvas: {
                width: 400,
                height: 400,
            }
        },
        state: {
            score: 0,
            loading: true
        }
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
```

**systems.js**
```javascript
import { RenderableQuery, KinematicBodyQuery } from "./queries.js";

export const RenderingSystem = app => {
    const canvas = document.createElement("canvas");
    canvas.width = app.data.config.canvas.width;
    canvas.height = app.data.config.canvas.height;
    canvas.style.background = "#000";

    const context = canvas.getContext("2d");

    app.on("init", () => {
      document.body.appendChild(canvas);
    });

    app.on("update", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        app.emit("render", context, canvas);
    });
}

export const InputSystem = app => {

    app.data.state.keyboard = {};

    const handleKey = ({ key, type }) => {
        app.data.state.keyboard[key === " " ? "Spacebar" : key] = type === "keydown";
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
};

export const MovementSystem = app => {
    app.on("update", dt => {
        const [player] = app.query("controllable");
        if(!player.tags.has("jumping") && app.data.state.keyboard.Spacebar) {
            player.velocity.y -= player.jumpforce * dt;
        }
    });
};

export const ShapeRenderer = app => {
    app.on("render", ctx => {
        const entities = app.query(RenderableQuery);

        entities.forEach(entity => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(entity.position.x, entity.position.y, entity.shape.width, entity.shape.height);
        });
    });
}

export const GravitySystem = app => {
    const GRAVITY_CONSTANT = 6.5;
    
    app.on("update", dt => {
        const entities = app.query(KinematicBodyQuery);
        entities.forEach(entity => {
            entity.position.y += entity.velocity.y;
            
            if(entity.position.y < 200) {
                entity.tag("jumping");
                entity.velocity.y += 5 * GRAVITY_CONSTANT * dt;
            } else {
                entity.untag("jumping");
                entity.velocity.y = 0;
            }
        });
    });
}
```

**queries.js**
```javascript
export const RenderableQuery = ['@position', '@shape', 'visible'];

export const KinematicBodyQuery = ['@position', '@shape', '@velocity'];
```

**components.js**
```javascript
export class BoxShapeComponent {
    constructor(width, height) {
        this.type = "box";
        this.width = width;
        this.height = height;
    }
}

export class VectorComponent {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
```
