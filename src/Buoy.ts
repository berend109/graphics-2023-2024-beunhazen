import * as THREE from "three";
import { ContentManager } from "./ContentLoader";

export class Buoy {

    private buoy: THREE.Object3D;

    /**
     * Creates a buoy.
     */
    constructor(name: string) {
        this.buoy = new THREE.Object3D();
        if(ContentManager.ModelContent.has("buoy")) {
            this.buoy = ContentManager.ModelContent.get("buoy")?.clone()!;
        }
        this.buoy.name = name;
    }
    /**
     * Returns the buoy.
     * @returns {THREE.Object3D} The buoy.
     */
    public get GetBuoy(): THREE.Object3D {
        return this.buoy;
    }
    /**
     * Sets the position of the buoy.
     * @param {number} x The x position of the buoy.
     * @param {number} y The y position of the buoy.
     * @param {number} z The z position of the buoy.
     * @returns {void}
     */
    public SetPosition(x: number, y: number, z: number): void {
        this.buoy.position.set(x, y, z);
    }
    /**
     * Returns the position of the buoy.
     * @returns {THREE.Vector3} The position of the buoy.
     */
    public GetPosition(): THREE.Vector3 {
        return this.buoy.position;
    }
    /**
     * Sets the rotation of the buoy.
     * @param {number} x The x rotation of the buoy.
     * @param {number} y The y rotation of the buoy.
     * @param {number} z The z rotation of the buoy.
     * @returns {void}
     */
    public SetRotation(x: number, y: number, z: number): void {
        this.buoy.rotation.set(x, y, z);
    }
    /**
     * Gets the rotation of the buoy.
     * @returns {THREE.Euler} The rotation of the buoy.
     */
    public GetRotation(): THREE.Euler {
        return this.buoy.rotation;
    }
    /**
     * Sets the scale of the buoy.
     * @param {number} x The x scale of the buoy.
     * @param {number} y The y scale of the buoy.
     * @param {number} z The z scale of the buoy.
     * @returns {void}
     */
    public SetScale(x: number, y: number, z: number): void {
        this.buoy.scale.set(x, y, z);
    }
    /**
     * Gets the scale of the buoy.
     * @returns {THREE.Vector3} The scale of the buoy.
     */
    public GetScale(): THREE.Vector3 {
        return this.buoy.scale;
    }
    /**
     * Sets the scale of the buoy uniformly.
     * @param {number} scale The scale of the buoy.
     * @returns {void}
     */
    public SetScaleUniform(scale: number): void {
        this.buoy.scale.set(scale, scale, scale);
    }
    /**
     * Updates the buoy.
     * @returns {void}
     */
    public Update(): void {
        this.buoy.position.y = Math.sin(Date.now() * 0.001) * 5;
    }
}