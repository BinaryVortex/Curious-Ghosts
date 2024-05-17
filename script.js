/**
 * Constants
 */
const TWO_PI = Math.PI * 2;

/**
 * Returns a random integer between a given minimum and maximum value
 * @param min - The minimum value, can be negative
 * @param max - The maximum value, can be negative
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Application Class
 */
class Application {
    /**
     * Application constructor
     */
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        //Set an initial mouse position so the eyes have something to look at
        this.mousePosition = {
            x: this.width / 2,
            y: this.height / 2
        };

        this.ghosts = [];
        this.numberOfGhosts = Math.round((this.width + this.height) / 200);

        //Resize listener for the canvas to fill browser window dynamically
        window.addEventListener('resize', () => this.resizeCanvas(), false);
        window.addEventListener('mousemove', (e) => this.mouseMove(e), false);
        window.addEventListener('touchmove', (e) => this.touchMove(e), false);
    }

    /**
     * Simple resize function. Reinitializing everything on the canvas while changing the width/height
     */
    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.numberOfGhosts = Math.round((this.width + this.height) / 200);

        //Empty the previous container and fill it again with new Ghost objects
        this.ghosts = [];
        this.initializeGhosts();
    }

    /**
     * Create a number of Ghost objects based on the width and height of the screen
     * @return void
     */
    initializeGhosts() {
        for (let i = 0; i < this.numberOfGhosts; i++) {
            //Initialize a new instance of the Ghost class
            let ghost = new Ghost(
                getRandomInt(0, this.width),
                getRandomInt(0, this.height),
                this.context
            );

            //Initialize the Ghost object so it can create it's Eye objects
            ghost.initialize();

            //Add the Ghost object to our array of Ghost objects
            this.ghosts.push(ghost);
        }
    }

    /**
     * Updates the application and every child of the application
     * @return void
     */
    update() {
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].update(this.mousePosition);
        }
    }

    /**
     * Renders the application and every child of the application
     * @return void
     */
    render() {
        //Clear the entire canvas every render
        this.context.clearRect(0, 0, this.width, this.height);

        //Trigger the render function on every child element
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].render(this.context);
        }
    }

    /**
     * Update and render the application at least 60 times a second
     * @return void
     */
    loop() {
        this.update();
        this.render();

        window.requestAnimationFrame(() => this.loop());
    }

    /**
     * Triggered every time the user moves his mouse, updates the mousePosition variable
     * @param event - The browsers mousemove event object 
     */
    mouseMove(event) {
        this.mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
    
    /**
     * Triggered every time the user touches the screen and moves his finger, updates the mousePosition variable
     * @param event - The browsers touchmove event object 
     */
    touchMove(event) {
        event.preventDefault();
        this.mousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

/**
 * Ghost Class
 */
class Ghost {
    /**
     * Ghost constructor
     * @param x - The horizontal position of this Ghost
     * @param y - The vertical position of this Ghost
     * @param context - The context from the canvas object of the Application
     */
    constructor(x, y, context) {
        this.position = new Vector2D(x, y);
        this.handPosition = new Vector2D(x, y);
        this.context = context;

        this.radius = 50;
        this.eyeDistance = 10;
        this.eyes = [];
        this.bodyBounceAngle = getRandomInt(0, 100);
        this.bounceDistance = 0.5;
        this.bounceSpeed = 0.05;

        this.velocity = new Vector2D(0, 0);
        this.velocity.setLength(Math.random() * 2 + 1);
        this.velocity.setAngle(Math.random() * TWO_PI);
    }

    /**
     * Create two eyes for this ghost! Ghosts can't see without their eyes
     * @return void
     */
    initialize() {
        this.eyes.push(new Eye(this.position.getX() - this.eyeDistance, this.position.getY() - 10));
        this.eyes.push(new Eye(this.position.getX() + this.eyeDistance, this.position.getY() - 10));
    }

    /**
     * Update the position of this object
     * @param mousePosition - The current position of the users mouse, in x,y format
     * @return void
     */
    update(mousePosition) {
        //Randomize the velocity of this ghost
        if (Math.random() < 0.01) {
            this.velocity.setLength(Math.random() * 2 + 1);
            this.velocity.setAngle(Math.random() * TWO_PI);
        }

        //Update the position of the ghost
        //this.position.addTo(this.velocity);

        //Calculate the amount of velocity for the way the body and the hands should bounce
        let bodyBounce = new Vector2D(0, Math.sin(this.bodyBounceAngle) * this.bounceDistance);
        let handBounce = new Vector2D(0, Math.sin(this.bodyBounceAngle + 10) * this.bounceDistance / 2);
        this.position.addTo(bodyBounce);
        this.handPosition.subtractFrom(handBounce);

        //We want to position both eyes at the same angle, so we calculate the angle once and then pass it to every eye
        let dx = mousePosition.x - this.position.getX();
        let dy = mousePosition.y - this.position.getY();
        let angle = Math.atan2(dy, dx);

        //Trigger the update function on every child element
        for (let i = 0; i < this.eyes.length; i++) {
            this.eyes[i].update(bodyBounce, angle);
        }

        //Update the bounce angle by adding the speed
        this.bodyBounceAngle += this.bounceSpeed;
    }

    /**
     * Renders this Ghost object on the canvas
     * @return void
     */
    render() {
        //Draw the body of the ghost
        this.context.fillStyle = "#ffffff";
        this.context.beginPath();
        this.context.arc(this.position.getX(), this.position.getY(), this.radius, 0, TWO_PI);
        this.context.fill();

        //Draw the left hand of the ghost
        this.context.fillStyle = "#ffffff";
        this.context.beginPath();
        this.context.arc(this.handPosition.getX() - this.radius + 5, this.handPosition.getY() + 10, 10, 0, TWO_PI);
        this.context.fill();

        //Draw the right hand of the ghost
        this.context.fillStyle = "#ffffff";
        this.context.beginPath();
        this.context.arc(this.handPosition.getX() + this.radius - 5, this.handPosition.getY() + 10, 10, 0, TWO_PI);
        this.context.fill();

        //Trigger the render function on every child element
        for (let i = 0; i < this.eyes.length; i++) {
            this.eyes[i].render(this.context);
        }
    }
}

/**
 * Eye Class
 */
class Eye {
    /**
     * Eye constructor
     * @param x - The horizontal position of this Eye
     * @param y - The vertical position of this Eye
     */
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.irisPosition = new Vector2D(x, y);
        this.moveRadius = 20;
        this.sizeRadius = 5;
    }

    /**
     * Update the position of this object
     * @param velocity - The velocity of which this eye is currently moving
     * @param angle - The new angle directed at the users mouse position
     * @return void
     */
    update(velocity, angle) {
        this.position.addTo(velocity);

        this.irisPosition.setX(this.position.getX() + Math.cos(angle) * this.moveRadius);
        this.irisPosition.setY(this.position.getY() + Math.sin(angle) * this.moveRadius);
    }

    /**
     * Renders this Eye object on the canvas
     * @param context - The context from the canvas object of the Application
     * @return void
     */
    render(context) {
        //Draw the iris of the eye
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(this.irisPosition.getX(), this.irisPosition.getY(), this.sizeRadius, 0, TWO_PI);
        context.fill();
    }
}

/**
 * Vector2D class
 */
class Vector2D {
    /**
     * Vector constructor
     */
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    /**
     * @param x
     * @return void
     */
    setX(x) {
        this._x = x;
    }

    /**
     * @param y
     * @return void
     */
    setY(y) {
        this._y = y;
    }

    /**
     * @return {number}
     */
    getX() {
        return this._x;
    }

    /**
     * @return {number}
     */
    getY() {
        return this._y;
    }

    /**
     * @param angle
     * @return void
     */
    setAngle(angle) {
        let length = this.getLength();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    /**
     * @return {number}
     */
    getAngle() {
        return Math.atan2(this._y, this._x);
    }

    /**
     * @param length
     * @return void
     */
    setLength(length) {
        let angle = this.getAngle();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    /**
     * @return {number}
     */
    getLength() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    /**
     * @param {Vector} v2
     * @return {Vector2D}
     */
    add(v2) {
        return new Vector2D(this._x + v2.getX(), this._y + v2.getY());
    }

    /**
     * @param {Vector} v2
     * @return {Vector2D}
     */
    subtract(v2) {
        return new Vector2D(this._x - v2.getX(), this._y - v2.getY());
    }

    /**
     * @param value
     * @return {Vector2D}
     */
    multiply(value) {
        return new Vector2D(this._x * value, this._y * value);
    }

    /**
     * @param value
     * @return {Vector2D}
     */
    divide(value) {
        return new Vector2D(this._x / value, this._y / value);
    }

    /**
     * @param v2
     * @return void
     */
    addTo(v2) {
        this._x += v2.getX();
        this._y += v2.getY();
    }

    /**
     * @param v2
     * @return void
     */
    subtractFrom(v2) {
        this._x -= v2.getX();
        this._y -= v2.getY();
    }

    /**
     * @param value
     * @return void
     */
    multiplyBy(value) {
        this._x *= value;
        this._y *= value;
    }

    /**
     * @param value
     * @return void
     */
    divideBy(value) {
        this._x /= value;
        this._y /= value;
    }
}

/**
 * Onload function is executed whenever the page is done loading, initializes the application
 */
window.onload = function () {
    //Create a new instance of the application
    const application = new Application();

    //Initialize the Ghosts objects
    application.initializeGhosts();

    //Start the initial loop function for the first time
    application.loop();
};