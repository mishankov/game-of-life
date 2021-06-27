import * as THREE from 'three';

import * as TW from './threejs-wrappers/threejs-wrappers';
import { MouseButton, ObjectWrapper, CameraWrapper } from './threejs-wrappers/threejs-wrappers';

import { Universe, Cell, CellStatus } from './Universe';

const ALIVE_CELL_COLOR = 0x00ff00;
const DEAD_CELL_COLOR = 0x550000;


window.addEventListener('DOMContentLoaded', () => {
    const app = new Application(true);
    TW.animate(app);
});


class CellObject extends ObjectWrapper {
    constructor(coordinates: THREE.Vector2, size: number, gap: number, color: number = 0x000000) {
        // const geometry = new THREE.BoxGeometry(size, size, size);
        const geometry = new THREE.SphereGeometry(size/2 + gap/2);
        const material = new THREE.MeshStandardMaterial({color: color});
        
        const object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        object.position.set(coordinates.x*(size+gap), coordinates.y*(size+gap), 0);

        super(object);
    }

    setColorForStatus(status: CellStatus) {
        switch (status) {
            case CellStatus.Alive: {
                this.actualObject.material.color.set(ALIVE_CELL_COLOR);
                break;
            }
            case CellStatus.Dead: {
                this.actualObject.material.color.set(DEAD_CELL_COLOR);
                break;
            }
        }
    }
}

class UniverseObject {
    universeData: Universe;
    cellObjects: Array<Array<CellObject>>;
    lasTimeStamp: DOMHighResTimeStamp;
    
    constructor (universeData: Universe, cellSize: number, cellGap: number) {
        this.universeData = universeData;
        this.cellObjects = [];
        
        for (let i = 0; i < this.universeData.cells.length; i++) {
            const row: Array<CellObject> = [];
            for (let j = 0; j < this.universeData.cells[i].length; j++) {
                const cell = new CellObject(new THREE.Vector2(i, j), cellSize, cellGap);
                cell.setColorForStatus(this.universeData.cells[i][j].status);
                row.push(cell);
            }
            this.cellObjects.push(row);
        }
    }
    
    animation(currentTimeStamp: DOMHighResTimeStamp) {
        if (this.lasTimeStamp === undefined) {
            this.lasTimeStamp = currentTimeStamp
            return 
        }

        if (this.lasTimeStamp + 1000 <= currentTimeStamp) {
            const universeDelta = this.universeData.nextState();

            for (let i = 0; i < universeDelta.length; i++) {
                const cellDelta = universeDelta[i];
                
                this.cellObjects[cellDelta.x][cellDelta.y].setColorForStatus(cellDelta.status);
            }

            this.lasTimeStamp = currentTimeStamp;
        }
    }
}

class Application extends TW.BaseApplication {
    previousMousePosition: THREE.Vector2;
    currentMousePosition: THREE.Vector2;

    universeData: Universe;
    univeseObject: UniverseObject;

    cellSize: number;
    cellGap: number;

    init() {
        this.cellSize = 10;
        this.cellGap = 3;

        // this.addGround();
        this.addUniverse();
    }

    initCamera() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 300);
        // camera.rotation.order = 'YXZ';
        camera.lookAt(0, 0, 0);

        this.camera = new CameraWrapper(camera);
    }

    addUniverse() {
        this.universeData = new Universe(10, 10);
        
        // R-pentamino
        // this.universeData.setState([
        //     [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        //     [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // ]);

        // migalka
        // this.universeData.setState([
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // ]);


        // glider
        this.universeData.setState([
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]);

        // this.universeData.putFigure(0, 0, [
        //     [1, 0, 0],
        //     [0, 1, 1],
        //     [1, 1, 0]
        // ]);

        this.univeseObject = new UniverseObject(this.universeData, this.cellSize, this.cellGap);

        for (let i = 0; i < this.univeseObject.cellObjects.length; i++) {
            for (let j = 0; j < this.univeseObject.cellObjects[i].length; j++) {          
                this.scene.add(this.univeseObject.cellObjects[i][j].actualObject);
            }
        }

        this.animatedObjects.push(this.univeseObject);
    }

    addGround() {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xcccccc,
              }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);       
    }

    keyboardInputHandler() {
        const acceleration = this.keyboardInput.includes('Shift') ? 2 : 1;
        
        if (this.keyboardInput.includes('w')) {
            this.camera.move(TW.MoveDirection.Forward, acceleration);
        }
        
        if (this.keyboardInput.includes('s')) {
            this.camera.move(TW.MoveDirection.Backward, acceleration);
        }

        if (this.keyboardInput.includes('a')) {
            this.camera.move(TW.MoveDirection.Left, acceleration);
        }
        
        if (this.keyboardInput.includes('d')) {
            this.camera.move(TW.MoveDirection.Right, acceleration);
        }

    }

    mouseInputHandler() {
        if (this.mouseInput.includes(MouseButton.Main)) {
            if (this.previousMousePosition === undefined) {
                this.previousMousePosition = this.mouseInput.mousePosition;
            } else {
                this.currentMousePosition = this.mouseInput.mousePosition;
                
                const delta_y = this.currentMousePosition.y - this.previousMousePosition.y;
                const delta_x = this.currentMousePosition.x - this.previousMousePosition.x;

                this.camera.rotate(delta_y / window.innerHeight * Math.PI, delta_x / window.innerWidth * Math.PI);

                this.previousMousePosition = this.currentMousePosition;
            }
        } else {
            delete this.previousMousePosition;
            delete this.currentMousePosition;
        }
    }
}