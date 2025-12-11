/**This is Code for "Italian Car" object and its properties */
//Might have to add more properties later on like drift, and direction later on(can def as a normal vector based on user input )
// Preset configurations for different kart types. Taken from form submission before joining game.(Can move to seperate file for cleaner code)

//Const acceperation. Percent of
const KART_PRESETS = {
  light: { handling: 0.3, acceleration: 30, maxSpeed: 150, mass: 22 },
  medium: { handling: 0.2, acceleration: 25, maxSpeed: 160, mass: 20 },
  heavy: { handling: 0.1, acceleration: 23, maxSpeed: 190, mass: 32 },
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
  initialX;
  initialY;
  initialTheta;
  width = 1;
  length = 2;
  #coins; //def the speedboost
  #spdmod = 0.9;
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
    this.#coins = 0;
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
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get color() {
    return this.#color;
  }
  get type() {
    return this.#type;
  }
  get handling() {
    return this.#handling;
  }
  get acceleration() {
    return this.#acceleration;
  }
  get maxSpeed() {
    return this.#maxSpeed;
  }
  set maxSpeed(spd) {
    this.#maxSpeed = spd;
  }
  get currentSpeed() {
    return this.#currentSpeed;
  }
  set currentSpeed(speed) {
    this.#currentSpeed = Math.min(speed, this.#maxSpeed);
  }
  get position() {
    return { x: this.#x, y: this.#y };
  }
  get theta() {
    return this.#theta;
  }
  set theta(angle) {
    this.#theta = angle;
  }
  get omega() {
    return this.#omega;
  }
  set omega(angularVelocity) {
    this.#omega = angularVelocity;
  }
  get coins() {
    return this.#coins;
  }
  set coins(num) {
    this.#coins = num;
  }
  set x(posX) {
    this.#x = posX;
  }
  set y(posY) {
    this.#y = posY;
  }
  set Width(width) {
    this.width = width;
  }
  set Length(length) {
    this.length = length;
  }
  set spdmod(nspdm) {
    this.#spdmod = nspdm;
  }
  get spdmod() {
    return this.#spdmod;
  }
  get mass() {
    return this.#mass;
  }
  get velocityX() {
    return this.#velocityX;
  }
  set velocityX(vx) {
    this.#velocityX = vx;
  }
  get velocityY() {
    return this.#velocityY;
  }
  set velocityY(vy) {
    this.#velocityY = vy;
  }
  get frontWheelAngle() {
    return this.#frontWheelAngle;
  }
  set frontWheelAngle(angle) {
    this.#frontWheelAngle = angle;
  }
  get frontWheelAngularVelocity() {
    return this.#frontWheelAngularVelocity;
  }
  set frontWheelAngularVelocity(v) {
    this.#frontWheelAngularVelocity = v;
  }
  get rearWheelAngularVelocity() {
    return this.#rearWheelAngularVelocity;
  }
  set rearWheelAngularVelocity(v) {
    this.#rearWheelAngularVelocity = v;
  }

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
