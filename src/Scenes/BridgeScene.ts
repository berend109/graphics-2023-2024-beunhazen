import { Scene } from "./Scene";
import { SceneManager } from "../SceneManager";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as Three from "three";

/**
 * Scene van Berend aka berend109
 */

export class BridgeScene extends Scene {

    private readonly scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private readonly camera: Three.PerspectiveCamera;

    protected bridge: Three.Object3D | undefined;
    protected ball: Three.Object3D | undefined;
    protected leftWallScene: Three.Object3D | undefined;
    protected rightWallScene: Three.Object3D | undefined;

    /**
     * Main constructor for the BridgeScene class
     * @param sm
     * @param sceneName
     */
    constructor(sm: SceneManager, sceneName: string) {
        super(sm, sceneName);
        const canvas = document.getElementById(".scene");
        this.scene = new Three.Scene();

        this.camera = new Three.PerspectiveCamera(
            120,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // rotate camera to look at bridge
        this.camera.rotateY(90 * Math.PI / 180);

        // @ts-ignore
        this.renderer = new Three.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // add ambient light
        const ambientLight = new Three.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // add directional light
        const directionalLight = new Three.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // add background to scene
        this.wallpaper();

        // load both walls
        this.leftWall();
        this.rightWall();

        // add bridge to scene
        this.loadBridge();

        // add ball to scene with controls to move it
        this.loadBall();
        this.ballControl = this.ballControl.bind(this);
        this.moveBallLeft = this.moveBallLeft.bind(this);
        this.moveBallRight = this.moveBallRight.bind(this);

        document.body.addEventListener('keydown', this.ballControl, false);

        window.addEventListener("resize", () => {
            this.Resize();
        });
    }

    /**
     * Add background to scene
     */
    private wallpaper() {
        this.scene.background = new Three.TextureLoader().load("assets/foggy-mountains.jpg");
    }

    /**
     * Resize the scene to fit the screen
     */
    public Resize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Create left wall
     */
    private leftWall() {
        let scaleF = 3;
        const loader = new GLTFLoader();
        loader.load("Models/rockWallScan/scene.gltf", (gltf) => {
            this.leftWallScene = gltf.scene;
            this.leftWallScene.position.set(0, 0, 0);
            this.leftWallScene.scale.set(scaleF, scaleF, scaleF);
            this.scene.add(this.leftWallScene);
        });
    }

    /**
     * Create right wall
     */
    private rightWall() {
        let scaleF = 3;
        const loader = new GLTFLoader();
        loader.load("Models/rockWallScan/scene.gltf", (gltf) => {
            this.rightWallScene = gltf.scene;
            this.rightWallScene.position.set(0, 0, 1);
            this.rightWallScene.scale.set(scaleF, scaleF, scaleF);
            this.scene.add(this.rightWallScene);
        });
    }

    /**
     * Load bridge gltf model
     */
    private loadBridge() {
        let scaleF = 3;
        const loader = new GLTFLoader();
        loader.load("Models/bridge/scene.gltf", (gltf) => {
            this.bridge = gltf.scene;
            this.bridge.position.set(-4, 3, -10);
            this.bridge.scale.set(scaleF, scaleF, scaleF);
            this.scene.add(this.bridge);
        });

        // zoom in to the bridge
        this.camera.position.x = -40;
    }

    /**
     * Load ball gltf model
     * @private
     */
    private loadBall() {
        let scaleF = 1;
        const loader = new GLTFLoader();
        loader.load("Models/soccer_ball/scene.gltf", (gltf) => {
            this.ball = gltf.scene;
            this.ball.name = "ball";
            this.ball.position.set(-45, -2, 0);
            this.ball.scale.set(scaleF, scaleF, scaleF);
            this.scene.add(this.ball);
        });
    }

    /**
     * Control the ball with the arrow keys
     * @param e
     * @private
     */
    private ballControl(e: { key: any; preventDefault: () => void; }) {
        switch (e.key) {
            case "ArrowLeft":
                // console.log("left");
                this.moveBallLeft();
                break;
            case "ArrowRight":
                // console.log("right");
                this.moveBallRight();
                break;
        }
        e.preventDefault();
    }

    /**
     * Move ball to the left
     * @private
     */
    private moveBallLeft() {
        const ball = this.scene.getObjectByName("ball");
        if (ball) {
            ball.position.z += .2;
        }
    }

    /**
     * Move ball to the right
     * @private
     */
    private moveBallRight() {
        const ball = this.scene.getObjectByName("ball");
        if (ball) {
            ball.position.z -= .2;
        }
    }

    /**
     * Get the scene name
     * @constructor
     * @return {string}
     */
    public get SceneName(): string {
        return this.sceneName;
    }

    /**
     * Update
     */
    public override Update() { }

    /**
     * Render the scene
     */
    public override Render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public override Unload(): void {
        this.dispose(this.scene);
    }

    /**
     * Dispose all objects in scene to prevent memory leaks
     * this is used to switch between scenes
     * @param scene
     */
    private dispose(scene: Three.Scene) {
        for (let i = 0; i < scene.children.length; i++) {
            const child = scene.children[i];
            if (!(child instanceof Three.Mesh)) {
                continue;
            }
            child.geometry.dispose();
            child.material.dispose();
        }
    }
}
