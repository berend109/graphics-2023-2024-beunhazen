import { ContentManager } from "./ContentLoader";
import { Ship } from "./Ship";
import * as THREE from "three";

export class USLouisianaShip extends Ship {

    private speed: number;
    private rotationSpeed: number;
    private tiltSpeed: number;
    private moveRight: boolean;
    private moveLeft: boolean;

    /**
     * Creates a USLouisiana.
     */
    constructor() {
        super();
        this.speed = 1.6;
        this.rotationSpeed = 0.01;
        this.tiltSpeed = 0.00001;
        this.moveRight = false;
        this.moveLeft = false;
        if(ContentManager.ModelContent.has("uslouisiana")) {
            this.SetModel(ContentManager.ModelContent.get("uslouisiana")!.clone());
        }
        this.SetScaleUniform(2);
        this.SetPosition(0, 20, 0);
    }
    /**
     * Sets the speed of the USLouisiana.
     * @param {number} speed The speed of the USLouisiana.
     * @returns {void}
     */
    public SetSpeed(speed: number): void {
        this.speed = speed;
    }
    /**
     * Returns the speed of the USLouisiana.
     * @returns {number} The speed of the USLouisiana.
     */
    public GetSpeed(): number {
        return this.speed;
    }
    /**
     * Sets the rotation speed of the USLouisiana.
     * @param {number} rotationSpeed The rotation speed of the USLouisiana.
     * @returns {void}
     */
    public SetRotationSpeed(rotationSpeed: number): void {
        this.rotationSpeed = rotationSpeed;
    }
    /**
     * Returns the rotation speed of the USLouisiana.
     * @returns {number} The rotation speed of the USLouisiana.
     */
    public GetRotationSpeed(): number {
        return this.rotationSpeed;
    }
    /**
     * Sets the tilt speed of the USLouisiana.
     * @param {number} tiltSpeed The tilt speed of the USLouisiana.
     * @returns {void}
     */
    public SetTiltSpeed(tiltSpeed: number): void {
        this.tiltSpeed = tiltSpeed;
    }
    /**
     * Returns the tilt speed of the USLouisiana.
     * @returns {number} The tilt speed of the USLouisiana.
     */
    public GetTiltSpeed(): number {
        return this.tiltSpeed;
    }
    /**
     * Sets whether the USLouisiana should move right.
     * @param {boolean} moveRight Whether the USLouisiana should move right.
     * @returns {void}
     */
    public SetMoveRight(moveRight: boolean): void {
        this.moveRight = moveRight;
    }
    /**
     * Returns whether the USLouisiana is moving right.
     * @returns {boolean} Whether the USLouisiana is moving right.
     */
    public GetMoveRight(): boolean {
        return this.moveRight;
    }
    /**
     * Sets whether the USLouisiana should move left.
     * @param {boolean} moveLeft Whether the USLouisiana should move left.
     * @returns {void}
     */
    public SetMoveLeft(moveLeft: boolean): void {
        this.moveLeft = moveLeft;
    }
    /**
     * Returns whether the USLouisiana is moving left.
     * @returns {boolean} Whether the USLouisiana is moving left.
     */
    public GetMoveLeft(): boolean {
        return this.moveLeft;
    }
    /**
     * Updates the USLouisiana.
     * @returns {void}
     */
    public Update(): void {
        //the ship is always moving forward and cant go backwards
        //the ship can only move left or right
        const targetRotation = this.moveRight ? -Math.PI / 4 : (this.moveLeft ? Math.PI / 4 : 0);
        this.GetRotation().y = THREE.MathUtils.lerp(this.GetRotation().y, targetRotation, this.rotationSpeed);
        this.GetRotation().x = THREE.MathUtils.lerp(this.GetRotation().x, targetRotation, this.tiltSpeed);
        const xOffset = Math.cos(this.GetRotation().y) * this.speed;
        const zOffset = -Math.sin(this.GetRotation().y) * this.speed;
        this.GetPosition().x = THREE.MathUtils.lerp(this.GetPosition().x, this.GetPosition().x + xOffset * 2, this.speed);
        this.GetPosition().z = THREE.MathUtils.lerp(this.GetPosition().z, this.GetPosition().z + zOffset * 2, this.speed);
    }
}