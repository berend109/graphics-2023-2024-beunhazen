import { SceneManager } from "../SceneManager";

export abstract class Scene {
    protected sm: SceneManager;
    protected sceneName: string;
    /**
     * Creates a scene.
     * @param {SceneManager} sm The scene manager of the scene.
     * @param {string} sceneName The name of the scene.
     */
    constructor(sm: SceneManager, sceneName: string) {
        this.sm = sm;
        this.sceneName = sceneName;
    }
    /**
     * Updates the scene.
     * @returns void
     */
    public abstract Update(): void;
    /**
     * Renders the scene.
     * @returns void
     */
    public abstract Render(): void;
    /**
     * Unloads the scene.
     * @returns void
     */
    public abstract Unload(): void;
}