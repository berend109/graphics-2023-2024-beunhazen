import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Object3D } from "three";

export class ContentManager {

    private static loader: GLTFLoader  = new GLTFLoader();
    private static progressPercentage: number = 0;
    private static totalModelsToLoad: number = 6; // Aantal modellen om te laden, moet handmatig worden bijgehouden.
    private static loadedModelsCount: number = 0;
    private static isDone: boolean = false;

    //The maps of the content, can be accessed by the key.
    public static AudioContent: Map<string, HTMLAudioElement> = new Map<string, HTMLAudioElement>();
    public static ImageContent: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();
    public static ModelContent: Map<string, Object3D> = new Map<string, Object3D>();

    /**
     * Get the progress percentage of the content manager.
     * @returns number
     */
    public static get ProgressPercentage(): number {
        return this.progressPercentage;
    }
    /**
     * Get if the content manager is done loading.
     * @returns boolean
     */
    public static get IsDone(): boolean {
        return this.isDone;
    }
    /**
     * Initialize the content manager.
     * @returns void
     */
    public static Initialize(): void {
        console.log("ContentManager initialization.");
        this.LoadContent();
    }
    /**
     * Loads all the content.
     * @returns Promise<void>
     */
    public static async LoadContent(): Promise<void> {
        try {
            await this.LoadModelAndSetProgress("/Models/Ships/Bismarck/bismarck.gltf", "bismarck");
            await this.LoadModelAndSetProgress("/Models/Ships/USLouisiana/uslouisiana.gltf", "uslouisiana");
            await this.LoadModelAndSetProgress("/Models/Buoy/buoy.gltf", "buoy");
            await this.LoadModelAndSetProgress("/Models/bridge/scene.gltf", "bridge");
            await this.LoadModelAndSetProgress("/Models/rockWallScan/scene.gltf", "sea");
            await this.LoadModelAndSetProgress("/Models/soccer_ball/scene.gltf", "rockWall");
        } 
        catch(error) {
            console.log(`ContentManager model error: ${error}`);
        } 
        finally {
            this.isDone = true;
        }
    }
    /**
     * Loads a model and sets the progress percentage.
     * @param {string} path the path to the model
     * @param {string} key the key to store the model in the map
     * @returns Promise<void>
     */
    public static async LoadModelAndSetProgress(path: string, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (gltf) => {
                    console.log(`ContentManager model loaded: ${path}`);
                    this.ModelContent.set(key, gltf.scene);
                    this.loadedModelsCount++;
                    // Bereken de voortgang als een percentage
                    this.progressPercentage = (this.loadedModelsCount / this.totalModelsToLoad) * 100;
                    this.progressPercentage = Math.round(this.progressPercentage * 10) / 10;
                    console.log(`ContentManager progress: ${this.progressPercentage}%`);
                    resolve();
                },
                (progress) => {},
                (error) => {
                    console.log(`Error while loading model ${path}: ${error}`);
                    reject(error);
                }
            );
        });
    }
}