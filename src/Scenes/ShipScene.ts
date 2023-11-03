import { Scene } from "./Scene";
import { SceneManager } from "../SceneManager";
import * as THREE from "three";
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { KeyboardManager } from "../KeyboardManager";
import { BismarckShip } from "../BismarckShip";
import { USLouisianaShip } from "../USLouisianaShip";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Buoy } from "../Buoy";

//https://github.com/mrdoob/three.js/blob/dev/examples/webgl_shaders_ocean.html

export class ShipScene extends Scene {

    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private water: Water;
    private sky: Sky | undefined;
    private sun: THREE.Vector3;
    // private orbitControls: OrbitControls;

    private battleship: USLouisianaShip;
    // private battleship: BismarckShip;
    private buoys: Array<Buoy> = new Array<Buoy>();

    /**
     * Creates a ship scene.
     * @param {SceneManager} sm The scene manager of the ship scene.
     * @param {string} sceneName The name of the ship scene.
     */
    constructor(sm: SceneManager, sceneName: string) {
        super(sm, sceneName);

        //scene
        document.title = sceneName;
        const canvas = document.getElementById(".scene")!;
        this.scene = new THREE.Scene();

        //renderer en camera
        this.renderer = new THREE.WebGLRenderer({canvas}); //Negeer de error, het werkt wel
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.5;
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(30, 30, 100);

        //water
        const waterGeometry = new THREE.PlaneGeometry(1000000, 1000000);
        this.water = new Water(
            waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load("/waternormals.jpg", function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xFF0000,
            waterColor: 0x2087A3,
            distortionScale: 4.7,
            fog: false
        }
        );
        this.water.rotation.x = - Math.PI / 2;
        this.scene.add(this.water);

        //de lucht
        this.sky = new Sky();
        this.sky.scale.setScalar(100000);
        this.scene.add(this.sky);
        const skyUniforms = this.sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;
        const parameters = { elevation: 6, azimuth: 180 };
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const sceneEnv = new THREE.Scene();
        let renderTarget;
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        //de zon
        this.sun = new THREE.Vector3();
        this.sun.setFromSphericalCoords(1, phi, theta);
        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
        this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize();
        sceneEnv.add(this.sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        this.scene.add(this.sky);
        this.scene.environment = renderTarget.texture;

        //als er wat mis is heb je dit nodig @Pieter, groetjes van Pieter uit het verleden
        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControls.maxPolarAngle = Math.PI * 0.495;
        // this.orbitControls.target.set(0, 10, 0);
        // this.orbitControls.minDistance = 40.0;
        // this.orbitControls.maxDistance = 600.0;
        // this.orbitControls.update();

        //inladen van de boot, de camera positie zetten en de boeien plaatsen
        // this.battleship = new BismarckShip();
        this.battleship = new USLouisianaShip();
        this.scene.add(this.battleship.GetShipObject);
        this.ClipCamera();
        this.SetupBouys(100);
    }
    /**
     * Returns the scene name.
     * @returns {string} The scene name.
     */
    public get SceneName(): string {
        return this.sceneName;
    }
    /**
     * Fills the buoys array with buoys.
     * @param {number} count The amount of buoys.
     * @returns {void}
     */
    public SetupBouys(count: number): void {
        let z = 0;
        let x = 0;
        for(let i = 0; i < count; i++) {
            const buoyR = new Buoy(`buoyR${i}`);
            const buoyL = new Buoy(`buoyL${i}`);
            x += (Math.random() * 2500);
            z += Math.random() * 250 * (Math.round(Math.random()) ? 1 : -1);
            z = Math.max(-500, Math.min(500, z));
            buoyR.SetPosition(x, 0, 30 + z);
            buoyL.SetPosition(x, 0, -57 + z);
            buoyR.SetScaleUniform(6);
            buoyL.SetScaleUniform(6);
            this.buoys.push(buoyR);
            this.buoys.push(buoyL);
            this.scene.add(buoyR.GetBuoy);
            this.scene.add(buoyL.GetBuoy);
        }
    }
    /**
     * Clips the camera to the ship.
     * @returns {void}
     */
    private ClipCamera(): void {
        if(this.battleship === undefined) { return; }
        this.camera.position.set(this.battleship.GetPosition().x - 250, this.battleship.GetPosition().y + 95, this.battleship.GetPosition().z);
        this.camera.lookAt(this.battleship.GetPosition());
    }
    /**
     * Updates the scene.
     * @returns {void}
     */
    public override Update(): void {
        this.battleship.SetMoveRight(KeyboardManager.IsKeyDown("d"));
        this.battleship.SetMoveLeft(KeyboardManager.IsKeyDown("a"));
        for(let i = 0; i < this.buoys.length; i++) {
            this.buoys[i].Update();
        }
        this.battleship.Update();
        this.water.material.uniforms['time'].value += 1.0 / 60.0;
        if(this.ResizeRendererToDisplaySize(this.renderer)) {
            this.renderer.setSize(window.innerWidth, window.innerHeight, false);
            this.camera.aspect = this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        this.ClipCamera();
    }
    /**
     * Renders the scene.
     * @returns {void}
     */
    public override Render(): void {
        this.renderer.render(this.scene, this.camera);
    }
    /**
     * Resizes the renderer to the display size.
     * @param {THREE.WebGLRenderer} renderer The renderer.
     * @returns {boolean} Whether the renderer has been resized.
     */
    private ResizeRendererToDisplaySize(renderer: THREE.WebGLRenderer): boolean {
        return renderer.domElement.width !== window.innerWidth || renderer.domElement.height !== window.innerHeight;
    }
    /**
     * Unloads the scene.
     * @returns {void}
     */
    public override Unload(): void {
        this.scene.traverse((object) => {
            object.traverse((child) => {
                if(child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
        });
    }
}