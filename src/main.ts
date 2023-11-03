import { SceneManager } from "./SceneManager";

function Main() {
    try {
        console.log("Starting.");
        new SceneManager();
    }
    catch(e) { console.log(e); }
}
Main();