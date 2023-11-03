import * as CHAI from "chai";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

mocha.setup("bdd");

const loader = new GLTFLoader();

//waarom kan ik met javascript niet normaal checken of files bestaan.......
// describe("Folders present", () => {
//     describe("Model folder", function() {
//         it("Can be found", function (done) {
//             fetch("../Models").then((response) => {
//                 expect(response.ok).to.be.true;
//                 done();
//             });
//         });
//     });
//     describe("Asset folder", function() {
//         it("Can be found", function (done) {

//         });
//     });
// });

// describe("Files present", () => {
//     describe("Bismarck model", function() {
//         it("Can be found", function (done) {

//         });
//     });
//     describe("USLouisiana model", function() {
//         it("Can be found", function (done) {

//         });
//     });
// });

describe("Libs", function() {
    describe("Three.js", function() {
        it("Installed", function (done) {
            CHAI.expect(THREE).to.not.be.null;
            done();
        });
    });
    describe("Chai.js", function() {
        it("Installed", function (done) {
            CHAI.expect(CHAI).to.not.be.null;
            done();
        });
    });
});

describe("Models present", function() {
    this.timeout(20000);
    describe("Bismarck model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/Ships/Bismarck/bismarck.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
    describe("USLouisiana model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/Ships/USLouisiana/uslouisiana.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
    describe("Buoy model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/Buoy/buoy.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
    describe("Bridge model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/bridge/scene.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
    describe("Rockwall model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/rockWallScan/scene.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
    describe("Soccelball model", function() {
        it("Can be loaded by the GLTFLoader", function (done) {
            loader.load("Models/soccer_ball/scene.gltf", (gltf) => {
                CHAI.expect(gltf).to.not.be.null;
                done();
            });
        });
    });
});
mocha.run();