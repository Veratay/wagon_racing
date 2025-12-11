import ItalianCar from "./Car";
import { Vec3 } from "./math";

export class CollisionBox {
  position: Vec3;
  size: Vec3;
  zRotation: number; // about Z axis

  constructor(position: Vec3, size: Vec3, zRotation: number) {
    this.position = position;
    this.size = size;
    this.zRotation = zRotation;
  }

  /**
   * Uses the seperating axis theorem to collide two boxes
   * @param other {CollisionBox} the box to collide with
   *
   * @returns {boolean} wether or not the two boxes collide
   */
  collide(other: CollisionBox): boolean {
    let collides = true;

    // Calculate the rotation matrices for both boxes
    const rot1 = this.zRotation;
    const rot2 = other.zRotation;

    // Calculate the axes to test (normals of the faces of both boxes)
    const axes = [
      new Vec3(Math.cos(rot1), Math.sin(rot1), 0), // Axis 1 from box 1
      new Vec3(-Math.sin(rot1), Math.cos(rot1), 0), // Axis 2 from box 1
      new Vec3(Math.cos(rot2), Math.sin(rot2), 0), // Axis 1 from box 2
      new Vec3(-Math.sin(rot2), Math.cos(rot2), 0), // Axis 2 from box 2
    ];

    // For each axis, project both boxes and check for overlap
    for (const axis of axes) {
      // Project both boxes onto the axis
      const projection1 = this.project(axis);
      const projection2 = other.project(axis);

      // Check if the projections overlap
      if (!this.overlap(projection1, projection2)) {
        collides = false;
        break;
      }
    }

    return collides;
  }

  private project(axis: Vec3): { min: number; max: number } {
    const halfSize = this.size.scale(0.5);
    const vertices = [
      new Vec3(-halfSize.x, -halfSize.y, 0),
      new Vec3(halfSize.x, -halfSize.y, 0),
      new Vec3(halfSize.x, halfSize.y, 0),
      new Vec3(-halfSize.x, halfSize.y, 0),
    ];

    const rotatedVertices = vertices.map((v) => {
      const rotatedX =
        v.x * Math.cos(this.zRotation) - v.y * Math.sin(this.zRotation);
      const rotatedY =
        v.x * Math.sin(this.zRotation) + v.y * Math.cos(this.zRotation);
      return new Vec3(rotatedX, rotatedY, 0);
    });

    const translatedVertices = rotatedVertices.map((v) =>
      Vec3.add(v, this.position),
    );

    // Project the vertices onto the axis
    const projections = translatedVertices.map((v) => Vec3.dot(v, axis));

    return { min: Math.min(...projections), max: Math.max(...projections) };
  }

  private overlap(
    proj1: { min: number; max: number },
    proj2: { min: number; max: number },
  ): boolean {
    return !(proj1.max < proj2.min || proj2.max < proj1.min);
  }
}

// this function will be used to detect collision between two items and also tell whether movement is valid
//class is in place of namespace
//WE have Cars as same dimensions
export class CollisionSystem {
  //simplest
  static isCollidingCarCar(car1: ItalianCar, car2: ItalianCar): boolean {
    const car1Box = CollisionSystem.createCarCollisionBox(car1);
    const car2Box = CollisionSystem.createCarCollisionBox(car2);
    return car1Box.collide(car2Box);
  }

  /* 
    FIXME: need better object structure to work properly
    */
  //any for now. later will be changed.
  static isCollidingCarObject(car: ItalianCar, object: any): boolean {
    let dx = car.x - object.x / 2;
    let dy = car.y - object.y / 2;
    return Math.abs(dx) < car.width && Math.abs(dy) < car.length;
  }

  //creates a projectile object
  static newshell(thrower: ItalianCar) {
    let shell = thrower;
    shell.maxSpeed = 2 * thrower.maxSpeed;
    shell.currentSpeed = thrower.currentSpeed + thrower.maxSpeed;
    shell.Width = 10;
    shell.Length = 30;
    shell.omega = 0;
    shell.spdmod = 0;
    return shell;
  }
  //creates a mine object
  static newmine(user: ItalianCar) {
    let mine = user;
    mine.maxSpeed = 0;
    mine.currentSpeed = 0;
    mine.Width = 10;
    mine.Length = 30;
    mine.omega = 0;
    mine.spdmod = 0;
    return mine;
  }

  //applys the collision by swapping angles and speeds
  static applycollision(obj1: ItalianCar, obj2: ItalianCar) {
    let tempspd = obj1.currentSpeed;
    let temptheta = obj1.theta;
    obj1.currentSpeed = obj2.currentSpeed * obj2.spdmod;
    obj1.theta = obj2.theta;
    obj2.currentSpeed = tempspd * obj1.spdmod;
    obj2.theta = obj2.theta;
  }
  //Dependign on boundaries of track, we can have function here to check car track collision

  private static createCarCollisionBox(car: ItalianCar): CollisionBox {
    const position = new Vec3(car.x, car.y, 0);
    const size = new Vec3(car.length, car.width, 1);
    return new CollisionBox(position, size, car.theta);
  }
}
