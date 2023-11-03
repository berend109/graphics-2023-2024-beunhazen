import { SceneManager } from "../SceneManager";
import { Scene } from "./Scene";
import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';
import { ContentManager } from "../ContentLoader";

export class LoadingScene extends Scene {

    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private light: THREE.AmbientLight;
    private textGeometry: TextGeometry | undefined;
    private textFont: Font | undefined;

    /**
     * Creates a loading scene.
     * @param {SceneManager} sm The scene manager of the loading scene.
     * @param {string} sceneName The name of the loading scene.
     */
    constructor(sm: SceneManager, sceneName: string) {
        super(sm, sceneName);
        document.title = sceneName;
        const canvas = document.getElementById(".scene")!;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({canvas}); //Negeer de error, het werkt wel
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(0, 0, 0);
        this.scene.add(this.camera);

        this.light = new THREE.AmbientLight(0xffffff, 1);
        this.light.position.set(0, 0, 0);
        this.scene.add(this.light);

        new FontLoader().load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.textFont = font;
                this.textGeometry = new TextGeometry("Loading...", {
                    font: font,
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
            }
        );
    }
    /**
     * Creates a text mesh.
     * @param {string} text The text of the text mesh.
     * @returns void
     */
    private MakeText(text: string) {
        this.scene.remove(this.scene.getObjectByName("LoadingText")!);
        this.textGeometry = new TextGeometry(text, {
            font: this.textFont!,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const textMesh = new THREE.Mesh(this.textGeometry, [
            new THREE.MeshPhongMaterial({ color: 0xff0000 }), // front
            new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
        ]);
        textMesh.position.set(-100, 0, -1000);
        textMesh.castShadow = true;
        textMesh.name = "LoadingText";
        this.scene.add(textMesh);
    }
    /**
     * Updates the loading scene.
     * @returns void
     */
    public Update(): void {
        //dit lijntje code is echt heel vies, maar het werkt wel
        this.MakeText("Loading... \n" + ContentManager.ProgressPercentage + "%");
        if(ContentManager.IsDone) {
            this.sm.SetScene(this.sm.ShipScene);
        }
    }
    /**
     * Renders the loading scene.
     * @returns void
     */
    public Render(): void {
        this.renderer.render(this.scene, this.camera);
    }
    /**
     * Unloads the loading scene.
     * @returns void
     */
    public Unload(): void {
        this.scene.clear();
        this.renderer.dispose();
    }
}