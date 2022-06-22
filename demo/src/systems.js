import { RenderableQuery, KinematicBodyQuery } from "./queries.js";

export const RenderingSystem = app => {
    const canvas = document.createElement("canvas");
    canvas.width = app.config.canvas.width;
    canvas.height = app.config.canvas.height;
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

    app.state.keyboard = {};

    const handleKey = ({ key, type }) => {
        app.state.keyboard[key === " " ? "Spacebar" : key] = type === "keydown";
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
};

export const MovementSystem = app => {
    app.on("update", dt => {
        const [player] = app.query("controllable");
        if(!player.tags.has("jumping") && app.state.keyboard.Spacebar) {
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