# Wagon Racing

### Gameplay
Images shows track with obstacles and multiple players connected. Note: Red denotes user, yellow denotes obstacles, and blue denotes other players
<figure>
<img width="2661" height="1404" alt="image" src="https://github.com/user-attachments/assets/67d46be6-c8c7-4321-a952-b0d6348e90fe" />
</figure>

<figure>
<img width="633" height="377" alt="image" src="https://github.com/user-attachments/assets/4753a958-70de-45bf-a843-5e0ebee2dc09" />
<figcaption></figcaption>
</figure>

## User Guide
https://docs.google.com/document/d/1DYFMfiO62beaZ5C4Z15Sypa_gIaYngtBufhupBiJeaM/edit?usp=sharing

## User Page
<img width="1506" height="1331" alt="image" src="https://github.com/user-attachments/assets/e21089fd-30bc-479e-a2d6-9b1c2086ac0d" />

## Api Routes
* Get /wagon_race - opens the intro page of the website
* Get /wagon_race/events - set up a SSE stream for push updates. Each update is a JSON-encoded string of gameid and action 
* Get /wagon_race/game - returns info about the current game using url encoded data
    * input:
        * gameid-id of game to get info about
    * output:
        * obstacles - will be added later
        * players - the list of playerids
        * positions - the list of player positions as a dictionary of (player id)=(x,y)
* Get /wagon_race/start - Creates/joins a game using the following url encoded params
    * gameid - gameid of game to create/join
    * playerid - player id of the player joining
    * kart - type of kart of the player wanting to join (light, medium, or heavy)
    * color - color of the kart of player wanting to join
* Get /wagon_race/player - returns info about the current player using url encoded data.
    * input:
        * playerid - id of player to get info about
    * output:
        * position - the players position (x,y)
        * velocity - the players velocity (xVel,yVel)
        * acceleration - the players acceleration (xAcc, yAcc)
* Post /wagon_race/val - update acceleration, velocity, and position with json encoded data
    * gameid - the game id of the relvant game(might remove later but makes my life easier for now)
    * playerid - the id of he relevant player
    * xAcc - the x acceleration of the relevant player
    * yAcc - the y acceleration of the relevent player
    * xVel - the x velocity of the relevant player
    * yVel - the y velocity of the relevant player
    * xPos - the x position of the relevant player
    * yPos - the y position of the relevant player
