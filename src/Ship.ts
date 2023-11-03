import * as THREE from "three";

/**
 * Represents a ship.
 */
export class Ship {
    protected shipObject: THREE.Object3D;
    /**
     * Creates a ship.
     */
    constructor() {
        this.shipObject = new THREE.Object3D();
    }
    /**
     * Sets the ship object.
     * @param {THREE.Object3D} model The ship object.
     * @returns {void}
     */
    public SetModel(model: THREE.Object3D): void {
        this.shipObject = model;
    }
    /**
     * Returns the ship object.
     * @returns {THREE.Object3D} The ship object.
     */
    public get GetShipObject(): THREE.Object3D {
        return this.shipObject;
    }
    /**
     * Sets the position of the ship.
     * @param {number} x The x coordinate of the ship.
     * @param {number} y The y coordinate of the ship.
     * @param {number} z The z coordinate of the ship.
     */
    public SetPosition(x: number, y: number, z: number): void {
        this.shipObject.position.x = x;
        this.shipObject.position.y = y;
        this.shipObject.position.z = z;
    }
    /**
     * Returns the position of the ship.
     * @returns {THREE.Vector3} The position of the ship.
     */
    public GetPosition(): THREE.Vector3 {
        return this.shipObject.position;
    }
    /**
     * Sets the rotation of the ship.
     * @param {number} x The rotation on the x-axis.
     * @param {number} y The rotation on the y-axis.
     * @param {number} z The rotation on the z-axis.
     */
    public SetRotation(x: number, y: number, z: number): void {
        this.shipObject.rotation.x = x;
        this.shipObject.rotation.y = y;
        this.shipObject.rotation.z = z;
    }
    /**
     * Gets the rotation of the ship.
     * @returns {THREE.Euler} The rotation of the ship.
     */
    public GetRotation(): THREE.Euler {
        return this.shipObject.rotation;
    }
    /**
     * Sets the scale of the ship.
     * @param {number} x The scale on the x-axis.
     * @param {number} y The scale on the y-axis.
     * @param {number} z The scale on the z-axis.
     */
    public SetScale(x: number, y: number, z: number): void {
        this.shipObject.scale.x = x;
        this.shipObject.scale.y = y;
        this.shipObject.scale.z = z;
    }
    /**
     * Sets the scale of the ship uniformly.
     * @param {number} scale The scale of the ship.
     */
    public SetScaleUniform(scale: number): void {
        this.shipObject.scale.set(scale, scale, scale);
    }
    /**
     * Gets the scale of the ship.
     * @returns {THREE.Vector3} The scale of the ship.
     */
    public GetScale(): THREE.Vector3 {
        return this.shipObject.scale;
    }
}