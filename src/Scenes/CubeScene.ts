import { Scene } from "./Scene";
import { SceneManager } from "../SceneManager";
import * as Three from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { KeyboardManager } from "../KeyboardManager";

export class CubeScene extends Scene {
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private camera: Three.PerspectiveCamera;
    private orbitConControls: OrbitControls;

    private CubeGroup: Three.Group;
    private cubeIsRotating: boolean;

    /**
     * Creates a cube scene.
     * @param {SceneManager} sm The scene manager of the cube scene.
     * @param {string} sceneName The name of the cube scene.
     */
    constructor(sm: SceneManager, sceneName: string) {
        super(sm, sceneName);

        //the scene
        const canvas = document.getElementById(".scene")!;
        this.scene = new Three.Scene();

        //renderer and camera
        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(1, 1, 8);

        this.renderer = new Three.WebGLRenderer({ canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.orbitConControls = new OrbitControls(this.camera, this.renderer.domElement)
        this.orbitConControls.update();

        //lighting
        const ambientLight = new Three.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new Three.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        //cube
        this.CubeGroup = new Three.Group();
        this.cubeIsRotating = false;
        this.scene.add(this.CubeGroup);
        this.Cube();
    }

    /**
     * sets cube meshes and lines on the scene
     * @returns {void}
     */
    private Cube() {
        const matarial = new Three.MeshBasicMaterial({ vertexColors: true })
        const geometry = this.CubeGeometry();

        let xPosition = 0;
        let yPosition = 0;
        let zPosition = 0;

        for (let i = 0; i < 9; i++) {

            for (let j = 0; j < 3; j++) {
                let cube = new Three.Mesh(geometry, matarial);
                let edgeGeometry = new Three.EdgesGeometry( geometry );
                const line = new Three.LineSegments(edgeGeometry, new Three.LineBasicMaterial( { color: 0x000000 } ) );

                cube.position.set(xPosition - 1, yPosition - 1, zPosition - 1);
                line.position.set(xPosition - 1, yPosition - 1, zPosition - 1);

                this.CubeGroup.add(cube);
                this.scene.add(line);
                xPosition++;
                if (xPosition == 3) {
                    xPosition = 0;
                    yPosition++;
                    if (yPosition == 3) {
                        yPosition = 0;
                        zPosition++;
                    }
                }

            }
        }
    }

    /**
     * creates geometry and gives each side its own color
     * @returns {Three.Object3D}
     */
    private CubeGeometry() {
        const geometry = new Three.BoxGeometry(1, 1, 1).toNonIndexed();

        const cubeCollors = [];

        const positionAttribute = geometry.getAttribute('position');

        const color = new Three.Color();

        for (let i = 0; i < positionAttribute.count; i += 6) {
            if (i == 0) color.setHex(0x00ff00);
            else if (i == 6) color.setHex(0x0000ff);
            else if (i == 12) color.setHex(0xffffff);
            else if (i == 18) color.setHex(0xffff00);
            else if (i == 24) color.setHex(0xffa500);
            else color.setHex(0xff0000);

            for(let j = 0; j < 6; j++) {
                cubeCollors.push(color.r, color.g, color.b);
            }
        }

        geometry.setAttribute('color', new Three.Float32BufferAttribute(cubeCollors, 3))

        return geometry;
    }

    /**
     * Returns the scene name.
     * @returns {string} The scene name.
     */
    public get SceneName(): string {
        return this.sceneName;
    }

    /**
     * Updates the scene.
     * @returns {void}
     */
    public override Update() {
        let rotationKey = false;

        let up = KeyboardManager.IsKeyDown("w"); //white side
        let left = KeyboardManager.IsKeyDown("a"); //blue side
        let right = KeyboardManager.IsKeyDown("d"); //green side
        let down = KeyboardManager.IsKeyDown("x");  //yellow side
        let front = KeyboardManager.IsKeyDown("s"); //orange side
        let back = KeyboardManager.IsKeyDown("f"); //red side

        if(up || left || right || down || front || back)
        rotationKey = true;

        if(rotationKey == true && this.cubeIsRotating == false) {
            this.cubeIsRotating = true;
            let rotationGroup = new Three.Group();

            if(up) rotationGroup = this.SetRotationLayer("up", rotationGroup);
            else if(left) rotationGroup = this.SetRotationLayer("left", rotationGroup);
            else if(right) rotationGroup = this.SetRotationLayer("right", rotationGroup);
            else if(down) rotationGroup = this.SetRotationLayer("down", rotationGroup);
            else if(front) rotationGroup = this.SetRotationLayer("front", rotationGroup);
            else rotationGroup = this.SetRotationLayer("back", rotationGroup);
            
            this.RemoveRotationLayer(rotationGroup);
        }

        if(rotationKey == false) this.cubeIsRotating = false;
    }

    /**
     * adds all cubes that need to be moved to rotationgroup 
     * @param layerToRotate the side of the cube you want to rotate
     * @param rotationGroup empty group where the cubes that need to get rotated get placed in
     * @returns {Three.Group} group with all objects that need to be moved
     */
    public SetRotationLayer(layerToRotate: string, rotationGroup: Three.Group) {
        if(layerToRotate == "up") {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.y > 0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateY(Math.PI / 2);
        }
        else if (layerToRotate == "left") {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.x < -0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateX(Math.PI / 2);
        }
        else if (layerToRotate == "right") {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.x > 0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateX(Math.PI / 2);
        }
        else if (layerToRotate == "down") {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.y < -0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateY(Math.PI / 2);
        }
        else if (layerToRotate == "front") {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.z > 0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateZ(Math.PI / 2);
        }
        else {
            for (let i = 0; i < this.CubeGroup.children.length; i++) {
                if (this.CubeGroup.children[i].position.z < -0.5) {
                    rotationGroup.add(this.CubeGroup.children[i]); 
                    i--;
                }
            }
            rotationGroup.rotateZ(Math.PI / 2);
        }
        return rotationGroup;
    }

    /**
     * adds cubes back to the cubeGroup with new position and rotation
     * @param rotationGroup group with all the moved elements
     */
    public RemoveRotationLayer(rotationGroup: Three.Group) {
        let tempQ = new Three.Quaternion();
        let tempV = new Three.Vector3();

        for(let i = 0; i < rotationGroup.children.length; i++) {
            let cubeId = rotationGroup.children[i].id;

            rotationGroup.children[i].getWorldQuaternion(tempQ);
            rotationGroup.children[i].getWorldPosition(tempV);

            this.CubeGroup.add(rotationGroup.children[i]);
            for(let j = 0; j < this.CubeGroup.children.length; j++) {
                if(this.CubeGroup.children[j].id == cubeId) {
                    this.CubeGroup.children[j].quaternion.copy(tempQ);
                    this.CubeGroup.children[j].position.copy(tempV);
                }
            }
            i--;
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