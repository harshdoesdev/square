# Square
An Entity Component System Based Game Engine

**Example**
```javascript
import Application from './src/Application.js';
import Entity from './src/Entity.js';
import System from './src/System.js';

class RenderingSystem extends System {
  
  query = ['@shape', '@position', 'visible']
  
  init(app) {
    this.cnv = document.createElement("canvas");
    this.cnv.width = 400;
    this.cnv.height = 400;
    this.cnv.style.background = '#000';
    this.ctx = this.cnv.getContext("2d");
  }
  
  tick(dt, entities) {
    this.ctx.fillStyle = '#fff';
    entities.forEach(entity => {
      if(entity.shape.type === 'box') {
        this.ctx.fillRect(entity.position.x, entity.position.y, entity.shape.width, entity.shape.height);
      }
    });
  }

}

class MovementSystem extends System {
  query = ['controllable']
  // implement movement logic
}

class PositionComponent {
    constructor(x = 0, y = 0) {
        Object.assign(this, { x, y });
    }
}

class ShapeComponent {
    constructor(shape, options) {
        Object.assign(this, { type: shape, ...options });
    }
}

const player = new Entity();

player.attach("position", new PositionComponent(20, 20));
player.attach("shape", new ShapeComponent("box", { width: 20, height: 20 }));

player.tag("visible");

const app = new Application({
  state: {
    score: 0
  },
  systems: [new RenderingSystem, new MovementSystem],
  entities: [player]
});

app.start();
```
