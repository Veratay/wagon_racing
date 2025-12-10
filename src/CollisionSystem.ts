import ItalianCar from "./Car"


// this function will be used to detect collision between two items and also tell whether movement is valid
//class is in place of namespace
//WE have Cars as same dimensions
export class CollisionSystem {
    //simplest
    static isCollidingCarCar(car1: ItalianCar, car2: ItalianCar): boolean {
        let dx = car1.x - (car2.x / 2);
        let dy = car1.y - (car2.y / 2);
        return (Math.abs(dx) < (car1.width)) && (Math.abs(dy) < (car1.length));
    }
    
    /* 
    FIXME: need better object structure to work properly
    */
    //any for now. later will be changed.
    static isCollidingCarObject(car: ItalianCar,object: any ): boolean {
        let dx = car.x - (object.x / 2);
        let dy = car.y - (object.y / 2);
        return (Math.abs(dx) < (car.width)) && (Math.abs(dy) < (car.length));
    }

    //creates a projectile object 
    static newshell(thrower:ItalianCar){
        let shell = thrower
        shell.maxSpeed = 2*thrower.maxSpeed
        shell.currentSpeed = thrower.currentSpeed + thrower.maxSpeed
        shell.Width = 10
        shell.Length = 30
        shell.omega=0
        shell.spdmod=0
        return shell

    }
    //creates a mine object
    static newmine(user:ItalianCar){
        let mine = user
        mine.maxSpeed = 0
        mine.currentSpeed = 0
        mine.Width = 10
        mine.Length = 30
        mine.omega=0
        mine.spdmod=0
        return mine
    }
//Dependign on boundaries of track, we can have function here to check car track collision

}   