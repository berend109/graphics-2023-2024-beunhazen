import { ContentManager } from "./ContentLoader";
import { Ship } from "./Ship";
import * as THREE from "three";

export class BismarckShip extends Ship {

    private speed: number;
    private rotationSpeed: number;
    private tiltSpeed: number;
    private moveRight: boolean;
    private moveLeft: boolean;

    /**
     * Creates a Bismarck.
     */
    constructor() {
        super();
        this.speed = 0.6;
        this.rotationSpeed = 0.001;
        this.tiltSpeed = 0.00001;
        this.moveRight = false;
        this.moveLeft = false;
        if(ContentManager.ModelContent.has("bismarck")) {
            this.SetModel(ContentManager.ModelContent.get("bismarck")!.clone());
        }
        this.SetScaleUniform(3);
    }
    /**
     * Sets the speed of the Bismarck.
     * @param {number} speed The speed of the Bismarck.
     * @returns {void}
     */
    public SetSpeed(speed: number): void {
        this.speed = speed;
    }
    /**
     * Returns the speed of the Bismarck.
     * @returns {number} The speed of the Bismarck.
     */
    public GetSpeed(): number {
        return this.speed;
    }
    /**
     * Sets the rotation speed of the Bismarck.
     * @param {number} rotationSpeed The rotation speed of the Bismarck.
     * @returns {void}
     */
    public SetRotationSpeed(rotationSpeed: number): void {
        this.rotationSpeed = rotationSpeed;
    }
    /**
     * Returns the rotation speed of the Bismarck.
     * @returns {number} The rotation speed of the Bismarck.
     */
    public GetRotationSpeed(): number {
        return this.rotationSpeed;
    }
    /**
     * Sets the tilt speed of the Bismarck.
     * @param {number} tiltSpeed The tilt speed of the Bismarck.
     * @returns {void}
     */
    public SetTiltSpeed(tiltSpeed: number): void {
        this.tiltSpeed = tiltSpeed;
    }
    /**
     * Returns the tilt speed of the Bismarck.
     * @returns {number} The tilt speed of the Bismarck.
     */
    public GetTiltSpeed(): number {
        return this.tiltSpeed;
    }
    /**
     * Sets whether the Bismarck should move right.
     * @param {boolean} moveRight Whether the Bismarck should move right.
     * @returns {void}
     */
    public SetMoveRight(moveRight: boolean): void {
        this.moveRight = moveRight;
    }
    /**
     * Returns whether the Bismarckis moving right.
     * @returns {boolean} Whether the Bismarck is moving right.
     */
    public GetMoveRight(): boolean {
        return this.moveRight;
    }
    /**
     * Sets whether the Bismarck should move left.
     * @param {boolean} moveLeft Whether the Bismarck should move left.
     * @returns {void}
     */
    public SetMoveLeft(moveLeft: boolean): void {
        this.moveLeft = moveLeft;
    }
    /**
     * Returns whether the Bismarck is moving left.
     * @returns {boolean} Whether the Bismarck is moving left.
     */
    public GetMoveLeft(): boolean {
        return this.moveLeft;
    }
    /**
     * Updates the Bismarck.
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