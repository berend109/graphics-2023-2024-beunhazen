import { Scene } from "./Scene";
import { SceneManager } from "../SceneManager";
import * as Three from "three";

import { KeyboardManager } from "../KeyboardManager";

export class StuiterbalScene extends Scene {
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private camera: Three.PerspectiveCamera;

    private sphere: Three.Object3D;
    private wireframe: Three.Object3D;

    /**
     * Creates a StuiterbalScene scene.
     * @param {SceneManager} sm The scene manager of the StuiterbalScene.
     * @param {string} sceneName The name of the StuiterbalScene.
     */

    constructor(sm: SceneManager, sceneName: string) {
        super(sm, sceneName);

        const canvas = document.getElementById(".scene");
        this.scene = new Three.Scene();

        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        this.renderer = new Three.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        var ambientLight = new Three.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        this.sphere = new Three.Object3D;
        this.wireframe = new Three.Object3D;

        this.CreateSphere ();
        this.CreateRoom ();   
    }
    
    private CreateSphere () { 
        var geometry = new Three.SphereGeometry(1, 32, 32); 

        // Create a material with a yellow color
        var material = new Three.MeshBasicMaterial({ color: 0xFFFF00 }); // yellow color
        var material2 = new Three.MeshBasicMaterial({ color: 0x000000 }); // Black color

        // Create a mesh by combining the geometry and material
        var sphere = new Three.Mesh(geometry, material);
        var wireframe = new Three.WireframeGeometry(geometry)
        var sphereLines = new Three.LineSegments( wireframe, material2 );
        this.wireframe = sphereLines
        this.scene.add(this.wireframe);

        // Add the sphere to the scene
        this.sphere = sphere;
        this.scene.add(this.sphere);
        
    }
    private CreateRoom() {
        // Create a room-like environment (box)
        var roomGeometry = new Three.BoxGeometry(10, 10, 10);
        // Width, Height, Depth
        var roomMaterial = new Three.MeshPhongMaterial({
            color: 0xffff00,
            // Yellow color
            side: Three.BackSide
            // Render the back side
        });
        var room = new Three.Mesh(roomGeometry, roomMaterial);
        this.scene.add(room);
    }

    private isColorOne: boolean = true;

    public changeSphereColor(): void {
        // Create a random color or select one of the two colors
        let newColor;
        if (this.isColorOne) {
            newColor = 0xFF0000; // Red
        } else {
            newColor = 0x008000; // Green
        }
        
        // Set the sphere's material color to the selected color
        const tempMesh = this.sphere as Three.Mesh;
        tempMesh.material = new Three.MeshBasicMaterial({ color: newColor });
        this.sphere = tempMesh;
    
        // Toggle the color state for the next click
        this.isColorOne = !this.isColorOne;
    }
    
/**
     * Returns the scene name.
     * @returns {string} The scene name.
     */
    public get SceneName(): string {
        return this.sceneName;
    }
    public override Update() {                  
        this.sphere.rotation.x += 0.10;
        this.sphere.rotation.y += 0.10;  

        let y = KeyboardManager.IsKeyDown("y");

        if(y) {
            this.changeSphereColor();
            // console.log(this.sphere);
        }
        //moves sphere to the right
        let a = KeyboardManager.IsKeyDown("a");
        if(a) {
            this.sphere.position.x -= 0.5;
            this.wireframe.position.x -= 0.5;

             }
        //moves sphere down
        let s = KeyboardManager.IsKeyDown("s");
        if(s) {
            this.sphere.position.y -= 0.5;
            this.wireframe.position.y -= 0.5;

        }
        //makes sphere smaller then original
        let space = KeyboardManager.IsKeyDown(" ");
        if(space) {
            this.sphere.position.z -= 0.5;
            this.wireframe.position.z -= 0.5;
   
        }
        
    }
    /**
     * Renders the scene.
     * @returns {void}
     */
    public override Render(): void {
        this.renderer.render(this.scene, this.camera);
    }
    /**
     * Unloads the scene.
     * @returns {void}
     */
    public override Unload(): void {
        this.scene.traverse((object) => {
            object.traverse((child) => {
                if(child instanceof Three.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
        });
    }
}