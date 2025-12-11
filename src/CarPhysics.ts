import ItalianCar from "./Car";
import { InputStates } from "./input";
import TireModel from "./TireModel";
import { Vec3 } from "./math";

const GRAVITY = 9.81;
const DEFAULT_TIRE_PARAMS = [500, 1.0, 1.0, 1.0];
const LATERAL_TIRE_PARAMS = [250, 1.0, 0.8, 1.0];
const MAX_STEER_ANGLE = Math.PI / 4;
const STEER_RETURN_RATE = 10;
const WHEEL_RADIUS = 0.35;
const ANGULAR_DAMPING = 4;
const LATERAL_VELOCITY_DAMP = 6;

type WheelConfig = {
  tire: TireModel;
  location: Vec3;
  isFront: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export default class CarPhysics {
  static #wheelCache: WeakMap<ItalianCar, WheelConfig[]> = new WeakMap();

  static update(car: ItalianCar, input: InputStates, dt: number) {
    this.ensureVelocity(car);
    this.applySteering(car, input, dt);
    this.applyWheelInputs(car, input, dt);

    const carVel = new Vec3(car.velocityX ?? 0, car.velocityY ?? 0, 0);
    const wheelForces = this.computeWheelForces(car, carVel);

    this.integrate(car, wheelForces, dt);

    return this.predictNextPosition(car, dt);
  }

  static updatePosition(car: ItalianCar, nextMove: { x: number; y: number }) {
    car.x = nextMove.x;
    car.y = nextMove.y;
  }

  private static ensureVelocity(car: ItalianCar) {
    if (!Number.isFinite(car.velocityX) || !Number.isFinite(car.velocityY)) {
      console.log("VELOICTY NAN!!");
      car.velocityX = 0;
      car.velocityY = 0;
    }
  }

  private static applySteering(
    car: ItalianCar,
    input: InputStates,
    dt: number,
  ) {
    // let steer = car.frontWheelAngle ?? 0;
    // const steerSpeed = car.handling;
    //
    // if (input.left && !input.right) {
    //   steer += steerSpeed * dt;
    // } else if (input.right && !input.left) {
    //   steer -= steerSpeed * dt;
    // } else {
    //   // bring wheels back toward center when no steering input
    //   const sign = Math.sign(steer);
    //   const magnitude = Math.max(0, Math.abs(steer) - STEER_RETURN_RATE * dt);
    //   steer = magnitude * sign;
    // }

    // car.frontWheelAngle = clamp(steer, -MAX_STEER_ANGLE, MAX_STEER_ANGLE);

    car.frontWheelAngle = 0;
    if (input.left) {
      car.frontWheelAngle += MAX_STEER_ANGLE;
    }
    if (input.right) {
      car.frontWheelAngle -= MAX_STEER_ANGLE;
    }
  }

  private static applyWheelInputs(
    car: ItalianCar,
    input: InputStates,
    dt: number,
  ) {
    const wheelAccel = (car.acceleration / WHEEL_RADIUS) * dt;
    const maxWheelSpeed = car.maxSpeed / WHEEL_RADIUS;

    if (input.up && !input.down) {
      car.frontWheelAngularVelocity += wheelAccel;
      car.rearWheelAngularVelocity += wheelAccel;
    } else if (input.down && !input.up) {
      car.frontWheelAngularVelocity -= wheelAccel;
      car.rearWheelAngularVelocity -= wheelAccel;
    } else {
      const decay = Math.exp(-STEER_RETURN_RATE * dt);
      car.frontWheelAngularVelocity *= decay;
      car.rearWheelAngularVelocity *= decay;
    }

    car.frontWheelAngularVelocity = clamp(
      car.frontWheelAngularVelocity ?? 0,
      0,
      maxWheelSpeed,
    );
    car.rearWheelAngularVelocity = clamp(
      car.rearWheelAngularVelocity ?? 0,
      0,
      maxWheelSpeed,
    );
  }

  private static integrate(
    car: ItalianCar,
    wheelForces: {
      totalForce: { x: number; y: number };
      totalTorque: number;
    },
    dt: number,
  ) {
    const ax = wheelForces.totalForce.x / car.mass;
    const ay = wheelForces.totalForce.y / car.mass;

    car.velocityX = (car.velocityX ?? 0) + ax * dt;
    car.velocityY = (car.velocityY ?? 0) + ay * dt;
    const forwardX = Math.cos(car.theta);
    const forwardY = Math.sin(car.theta);
    const lateralX = -Math.sin(car.theta);
    const lateralY = Math.cos(car.theta);
    const forwardSpeed = car.velocityX * forwardX + car.velocityY * forwardY;
    const lateralSpeed = car.velocityX * lateralX + car.velocityY * lateralY;
    const dampedLateral = lateralSpeed * Math.exp(-LATERAL_VELOCITY_DAMP * dt);
    car.velocityX = forwardSpeed * forwardX + dampedLateral * lateralX;
    car.velocityY = forwardSpeed * forwardY + dampedLateral * lateralY;
    car.currentSpeed = Math.hypot(car.velocityX, car.velocityY);

    const inertia =
      (car.mass * (car.length * car.length + car.width * car.width)) / 12;
    const angularAcc = wheelForces.totalTorque / inertia;
    car.omega = (car.omega ?? 0) + angularAcc * dt;
    car.omega *= Math.exp(-ANGULAR_DAMPING * dt);
    car.theta += car.omega * dt;
  }

  private static predictNextPosition(car: ItalianCar, dt: number) {
    const vx = car.velocityX ?? 0;
    const vy = car.velocityY ?? 0;
    return { x: car.x + vx * dt, y: car.y + vy * dt };
  }

  private static getWheels(car: ItalianCar): WheelConfig[] {
    const cached = this.#wheelCache.get(car);
    if (cached) return cached;

    const halfWheelBase = car.length * 0.5;
    const halfTrackWidth = car.width * 0.5;
    const loadPerWheel = (car.mass * GRAVITY) / 4;

    const locations = [
      { position: new Vec3(halfWheelBase, halfTrackWidth, 0), isFront: true },
      { position: new Vec3(halfWheelBase, -halfTrackWidth, 0), isFront: true },
      { position: new Vec3(-halfWheelBase, halfTrackWidth, 0), isFront: false },
      {
        position: new Vec3(-halfWheelBase, -halfTrackWidth, 0),
        isFront: false,
      },
    ];

    const wheels = locations.map((loc) => ({
      tire: new TireModel(
        WHEEL_RADIUS,
        loc.position,
        DEFAULT_TIRE_PARAMS,
        loadPerWheel,
        0.1,
        LATERAL_TIRE_PARAMS,
      ),
      location: loc.position,
      isFront: loc.isFront,
    }));

    this.#wheelCache.set(car, wheels);
    return wheels;
  }

  private static computeWheelForces(car: ItalianCar, carVel: Vec3) {
    const wheels = this.getWheels(car);
    const totalForce = { x: 0, y: 0 };
    let totalTorque = 0;

    const theta = car.theta;
    const omega = car.omega ?? 0;
    const frontWheelAngle = car.frontWheelAngle ?? 0;
    const frontWheelOmega = car.frontWheelAngularVelocity ?? 0;
    const rearWheelOmega = car.rearWheelAngularVelocity ?? 0;

    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    for (const wheel of wheels) {
      const steerAngle = wheel.isFront ? frontWheelAngle : 0;
      const wheelOmega = wheel.isFront ? frontWheelOmega : rearWheelOmega;
      const contactTheta = theta + steerAngle;

      const { longitudinal, lateral } = wheel.tire.computeForces(
        wheelOmega,
        carVel,
        steerAngle,
        theta,
        omega,
      );

      const dirX = Math.cos(contactTheta);
      const dirY = Math.sin(contactTheta);
      const latDirX = -Math.sin(contactTheta);
      const latDirY = Math.cos(contactTheta);

      const forceX = dirX * longitudinal + latDirX * lateral;
      const forceY = dirY * longitudinal + latDirY * lateral;

      totalForce.x += forceX;
      totalForce.y += forceY;

      const worldX = wheel.location.x * cosTheta - wheel.location.y * sinTheta;
      const worldY = wheel.location.x * sinTheta + wheel.location.y * cosTheta;
      totalTorque += worldX * forceY - worldY * forceX;
    }

    return { totalForce, totalTorque };
  }
}
