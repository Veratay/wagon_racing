import GameLogic from "./game_logic";
import { Vec3 } from "./math";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
// Getting the different things from URL
const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Player";
const carColor = params.get("color") || new Vec3(0, 1, 0);
const carType = params.get("carType") || "medium";
const gameid = (params.get("gameid") as string) || "default";

const game = new GameLogic(canvas, gameid, carColor.toString(), carType);
game.start();

// Later on, we can expand this to include menus, multiplayer setup, etc.
