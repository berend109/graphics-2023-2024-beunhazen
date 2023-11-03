import { Scene } from "./Scenes/Scene";
import { LoadingScene } from "./Scenes/LoadingScene.ts";
import { ShipScene } from "./Scenes/ShipScene.ts";
import { BridgeScene } from "./Scenes/BridgeScene.ts";
import { StuiterbalScene } from "./Scenes/StuiterbalScene.ts";
import { CubeScene } from "./Scenes/CubeScene";
// @ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module';
import { KeyboardManager } from "./KeyboardManager.ts";
import { ContentManager } from "./ContentLoader.ts";

/**
 * Represents a scene manager.
 */
export class SceneManager {
    private stat = new Stats();
    private readonly scenes: Scene[];
    private currentScene: number;
    private animationFrameId: number | null = null;
    public readonly LoadingScene: number = 0; //TODO: implement menu
    public readonly ShipScene: number = 1;
    public readonly BridgeScene: number = 2;
    public readonly CubeScene: number = 3;
    public readonly StuiterbalScene: number = 4;
    /**
     * Creates a scene manager.
     */
    constructor() {
        document.body.appendChild(this.stat.dom);
        this.scenes = [];
        KeyboardManager.Initialize();
        ContentManager.Initialize();
        this.currentScene = this.LoadingScene;
        this.MenuButtonSetup();
        this.LoadScene(this.currentScene);
        this.Animate();
    }
    /**
     * Sets up the menu buttons.
     */
    private MenuButtonSetup() {
        this.GetButton("shipScene").addEventListener("click", () => {this.SetScene(this.ShipScene);});
        this.GetButton("bridgeScene").addEventListener("click", () => {this.SetScene(this.BridgeScene);});
        this.GetButton("cubeScene").addEventListener("click", () => {this.SetScene(this.CubeScene);});
        this.GetButton("bounceBallScene").addEventListener("click", () => {this.SetScene(this.StuiterbalScene);});
    }
    /**
     * Returns the button with the given id.
     * @param {string} id The id of the button.
     * @returns {HTMLElement} The button with the given id.
     */
    public GetButton(id: string): HTMLElement {
        // @ts-ignore
        return document.getElementById(id);
    }
    /**
     * Loads the scene with the given number.
     * @param {number} scene The number of the scene.
     * @returns void
     */
    private LoadScene(scene: number): void {
        switch(scene) {
            case this.LoadingScene: {
                this.scenes[scene] = new LoadingScene(this, "LoadingScene");
                break;
            }
            case this.ShipScene: {
                this.scenes[scene] = new ShipScene(this, "ShipScene");
                break;
            }
            case this.BridgeScene: {
                this.scenes[scene] = new BridgeScene(this, "BridgeScene");
                break;
            }
            case this.StuiterbalScene: {
                this.scenes[scene] = new StuiterbalScene(this, "StuiterbalScene");
                break;
            }
            case this.CubeScene: {
                this.scenes[scene] = new CubeScene(this, "CubeScene");
                break;
            }
            default: {
                console.log("Scene not found: " + scene);
                break;
            }
        }
        console.log("Loaded scene: " + scene);
    }
    /**
     * Sets the current scene to the scene with the given number.
     * @param {number} scene The number of the scene.
     * @returns void
     */
    public SetScene(scene: number): void {
        this.UnloadScene(this.currentScene);
        this.currentScene = scene;
        this.LoadScene(this.currentScene);
    }
    /**
     * Unloads the scene with the given number.
     * @param {number} scene The number of the scene.
     * @returns void
     */
    private UnloadScene(scene: number): void {
        this.scenes[scene]?.Unload();
    }
    /**
     * Updates the current scene.
     * @returns void
     */
    public Update(): void {
        this.scenes[this.currentScene]?.Update();
    }
    /**
     * Renders the current scene.
     * @returns void
     */
    public Render(): void {
        this.scenes[this.currentScene]?.Render();
    }
    /**
     * Animates the current scene.
     * @returns void
     */
    private Animate(): void {
        this.stat.update();
        KeyboardManager.Update();
        this.Update();
        this.Render();
        this.animationFrameId = requestAnimationFrame(() => this.Animate());
    }
    /**
     * Stops the animation.
     * @returns void
     */
    public StopAnimation(): void {
        if(this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
