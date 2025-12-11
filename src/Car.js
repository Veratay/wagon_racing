/**This is Code for "Italian Car" object and its properties */
//Might have to add more properties later on like drift, and direction later on(can def as a normal vector based on user input )
// Preset configurations for different kart types. Taken from form submission before joining game.(Can move to seperate file for cleaner code)

//Const acceperation. Percent of
const KART_PRESETS = {
  light: { handling: 0.6, acceleration: 300*3, maxSpeed: 150, mass: 22*3 },
  medium: { handling: 0.4, acceleration: 250*3, maxSpeed: 160, mass: 20*3 },
  heavy: { handling: 0.2, acceleration: 230*3, maxSpeed: 190, mass: 32*3 },
};

export default class ItalianCar {
  #color;
  #type;
  #theta; // direction angle
  #handling;
  #acceleration;
  #maxSpeed;
  #currentSpeed;
  #x;
  #y;
  #omega; // angular velocity
  #velocityX;
  #velocityY;
  #frontWheelAngle;
  #frontWheelAngularVelocity;
  #rearWheelAngularVelocity;
  #mass;
  //the initial x coordinate
  initialX;
   //the initial y coordinate
  initialY;
   //the initial angle
  initialTheta;
  //the width of the car
  width = 1;
  //the length of the car
  length = 2;
  #coins; //def the speedboost
  #spdmod = 0.9;

  /**
   * @param {string} color - Body color selected by the player.
   * @param {string} type - Preset key determining handling stats.
   * @param {number} [initialX=0] - Initial world X coordinate (m)
   * @param {number} [initialY=0] - Initial world Y coordinate (m)
   * @param {number} [initialTheta=0] - Initial heading angle (rad)
   */
  constructor(color, type, initialX = 0, initialY = 0, initialTheta = 0) {
    this.#color = color;
    if (!KART_PRESETS[type]) {
      type = "medium"; // Default to medium if invalid type
    }
    this.#type = type;
    const preset = KART_PRESETS[type];
    this.#handling = preset.handling;
    this.#acceleration = preset.acceleration;
    this.#maxSpeed = preset.maxSpeed;
    this.#currentSpeed = 0;
    this.#x = initialX; // Initial X position
    this.#y = initialY; // Initial Y position
    this.#omega = 0; // initial angular velocity
    // this.#coins = 0;
    this.#theta = initialTheta; // initial direction angle
    this.#velocityX = 0;
    this.#velocityY = 0;
    this.#frontWheelAngle = 0;
    this.#frontWheelAngularVelocity = 0;
    this.#rearWheelAngularVelocity = 0;
    this.#mass = preset.mass;
    this.initialX = initialX;
    this.initialY = initialY;
    this.initialTheta = initialTheta;
    //theta is in RADIANS!
  }
  //returns the x position
  get x() {
    return this.#x;
  }
  //returns the y position
  get y() {
    return this.#y;
  }
  //returns the color of the car
  get color() {
    return this.#color;
  }
  //returns the type of car it is
  get type() {
    return this.#type;
  }
  //returns the handeling value of the car
  get handling() {
    return this.#handling;
  }
  //returns the acceleration of the car
  get acceleration() {
    return this.#acceleration;
  }
  //returns the cars max speed
  get maxSpeed() {
    return this.#maxSpeed;
  }
  //sets the cars max speed using to an integer
  set maxSpeed(spd) {
    this.#maxSpeed = spd;
  }
  //returns the current speed of the car
  get currentSpeed() {
    return this.#currentSpeed;
  }
  //sets the cars current speed using to an integer
  set currentSpeed(speed) {
    this.#currentSpeed = Math.min(speed, this.#maxSpeed);
  }
  //returns the x and y position of a car as an object
  get position() {
    return { x: this.#x, y: this.#y };
  }
  //returns the current angle of the car
  get theta() {
    return this.#theta;
  }
  //sets the cars current angle using to an integer
  set theta(angle) {
    this.#theta = angle;
  }
  //returns the angular velocity of the car
  get omega() {
    return this.#omega;
  }
  //sets the angular valucity of the car using an integer
  set omega(angularVelocity) {
    this.#omega = angularVelocity;
  }
  // get coins() {
  //   return this.#coins;
  // }
  // set coins(num) {
  //   this.#coins = num;
  // }

  //sets the x position of the car using an integer
  set x(posX) {
    this.#x = posX;
  }
  //sets the y position of the car using an integer
  set y(posY) {
    this.#y = posY;
  }
  //sets the width of the car using an integer
  set Width(width) {
    this.width = width;
  }
  //sets the length of the car using an integer
  set Length(length) {
    this.length = length;
  }

  //sets the speed modifier of the car using an integer
  set spdmod(nspdm) {
    this.#spdmod = nspdm;
  }

  //returns the value that the velocity of other entities should be multiplied by on collision
  get spdmod() {
    return this.#spdmod;
  }
  //returns the mass of the car
  get mass() {
    return this.#mass;
  }
  //returns the x velocity of the car
  get velocityX() {
    return this.#velocityX;
  }
  //sets the x velocity of the car using an integer
  set velocityX(vx) {
    this.#velocityX = vx;
  }
  //returns the y velocity of the car
  get velocityY() {
    return this.#velocityY;
  }
  //sets the y velocity of the car using an integer
  set velocityY(vy) {
    this.#velocityY = vy;
  }
  //returns the angle of the cars front wheels
  get frontWheelAngle() {
    return this.#frontWheelAngle;
  }
  //sets the angle of the cars front wheels using an integer
  set frontWheelAngle(angle) {
    this.#frontWheelAngle = angle;
  }
  //returns the anglular velocity of the cars front wheels
  get frontWheelAngularVelocity() {
    return this.#frontWheelAngularVelocity;
  }
  //sets the anglular velocity of the cars front wheels using an integer
  set frontWheelAngularVelocity(v) {
    this.#frontWheelAngularVelocity = v;
  }
  //returns the anglular velocity of the cars rear wheels
  get rearWheelAngularVelocity() {
    return this.#rearWheelAngularVelocity;
  }
  //sets the anglular of the cars rear wheels using an integer
  set rearWheelAngularVelocity(v) {
    this.#rearWheelAngularVelocity = v;
  }

  //resets the cars values to what they should be at the start
  resetToInitialPosition() {
    this.#x = this.initialX;
    this.#y = this.initialY;
    this.#theta = this.initialTheta;
    this.#currentSpeed = 0;
    this.#omega = 0;
    this.#velocityX = 0;
    this.#velocityY = 0;
    this.#frontWheelAngle = 0;
    this.#frontWheelAngularVelocity = 0;
    this.#rearWheelAngularVelocity = 0;
  }
}
