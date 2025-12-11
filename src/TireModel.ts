import { Mat4, Vec3 } from "./math";

/**
 * A class implementing Pacejka's tire model (Magic Tire Formula) */
export default class TireModel {
  #params: number[];
  #latParams: number[];
  #radius: number;
  #location: Vec3;
  #vxLow: number;
  #load: number;

  /**
   * @param radius {number} wheel radius
   * @param location {Vec3} location of the tire center in the car-relative frame where the origin is the COM
   * @param params {number[]} longitudinal pacejka parameters
   * @param lateralParams {number[]} lateral pacejka parameters (defaults to params if omitted)
   */
  constructor(
    radius: number,
    location: Vec3,
    params: number[],
    load: number,
    vxLow = 0.1,
    lateralParams?: number[],
  ) {
    this.#params = params;
    this.#latParams = lateralParams ?? params;
    this.#radius = radius;
    this.#location = location;
    this.#vxLow = vxLow;
    this.#load = load;
  }

  computeForces(
    wheelAngularVelocity: number,
    carVel: Vec3,
    wheelTheta: number,
    carTheta: number,
    carAngVel: number,
  ): { longitudinal: number; lateral: number } {
    // https://www.mathworks.com/help/sdl/ref/tireroadinteractionmagicformula.html

    // car space: +x is forward, +y is left
    // tire space: +x is forward, +y is left

    // the effective tangential velocity at the tire from the rotation of the car (in car space)
    let tireVFromCarRotation = Vec3.cross(
      new Vec3(0, 0, 1),
      this.#location,
    ).scale(carAngVel);

    // velocity of car in car-local space
    const carVelInCarSpace = new Mat4().rotateZ(-carTheta).multiplyVec(carVel);

    // total velocity of tire in car-local space
    const tireVelInCarSpace = Vec3.add(carVelInCarSpace, tireVFromCarRotation);

    // velocity of ground relative to tire (in tire space)
    let v = new Mat4().rotateZ(-wheelTheta).multiplyVec(tireVelInCarSpace);

    let vt = wheelAngularVelocity * this.#radius;

    let d = Math.abs(v.x);
    if (d < this.#vxLow) d = this.#vxLow;
    const vsx = v.x - vt;

    const slipRatio = -vsx / d;
    const slipAngle = Math.atan2(v.y, d);

    return {
      longitudinal: this.slipToLongForce(slipRatio),
      lateral: -this.slipToLatForce(slipAngle),
    };
  }

  private slipToLongForce(slip: number) {
    const b = this.#params[0];
    const c = this.#params[1];
    const d = this.#params[2];
    const e = this.#params[3];

    return (
      this.#load *
      d *
      Math.sin(c * Math.atan(b * slip - e * (b * slip - Math.atan(b * slip))))
    );
  }

  private slipToLatForce(slip: number) {
    const b = this.#latParams[0];
    const c = this.#latParams[1];
    const d = this.#latParams[2];
    const e = this.#latParams[3];

    return (
      this.#load *
      d *
      Math.sin(c * Math.atan(b * slip - e * (b * slip - Math.atan(b * slip))))
    );
  }
}
