# Goals from proposal 
- [x] To create and use a custom 3d renderer using WebGL2
- [x] To have the game be multiplayer, using a server with up to 4 people being able to play at the same time on different computers
- [x] To make the game appear live service
    - [x] This will be done by creating and using a predictive algorithm(based on current velocity and acceleration) to fill in the gaps between position/velocity updates, like how Mario Kart Online does it.
- [ ] Updates would be sent upon item usage, hitting an obstacle, hitting a speed boost, and after a set interval of time.
- [x] To allow players to accelerate, decelerate, turn left, and turn right using the arrow keys.
- [ ] To repurpose a tire physics simulator Thomas previously created to create realistic tire physics in the game
- [ ] To create a basic item system along with an entity that would give an item upon hitting it:
    - [ ] Speed boost: applies a multiplier to the player's velocity for a set amount of time.
    - [ ] Thrown projectile: that travels at a velocity defined by the users with some multiplier applied and, on contact, would set the velocity and acceleration of the player who has been hit to 0.
    - [ ] Stationary projectile: practically identical to the thrown projectile on the logic side just with a velocity of 0
- [x] To have the track be procedurally generated (stretch goal)
- [ ] Obstacles they would need to avoid with contact reducing the player’s velocity.
- [ ] Speed boosts on the ground that would apply a multiplier to the player's velocity for a set amount of time.
- [ ] Have the finish line be set to a certain distance from the start
- [ ] Reach: 
- [ ] If we have extra time, we might make the track generate in such a way that it would always allow for a three lap race.
- [ ] Stretch goal: allow players to drift and have specific tracks for it.

# Stuff we still need to do to fufill proposal
- [ ] Obstacles
- [ ] Item system
    - [ ] Speed boost
    - [ ] Stationary projectile
    - [ ] Thrown projectile
- [ ] Tire physics
- [ ] Finish line
    - [ ] Laps
- [ ] drift (stretch)

# Random small things that may or may not be implemented depending on time
- [ ] Road having rainbow road texture and starry skybox
- [ ] Low-poly car mesh (rectangles only go so far :( )
- [ ] Road elevation changes (requires physics update)
