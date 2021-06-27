function combinations(a: Array<any>, b: Array<any>): Array<any> {
    const result = new Array();


    return result
}

class Universe {
    cells: Array<Array<Cell>> = [];
    length: number;
    width: number;

    constructor(length: number, width: number) {
        this.length = length;
        this.width = width;

        for (let i = 0; i < length; i++) {
            const row: Array<Cell> = [];
            for (let j = 0; j < width; j++) {
                row.push(new Cell(CellStatus.Dead));
            }

            this.cells.push(row);
        }
    }

    calculateAliveNeigbours(x:number, y: number): number {
        let result = 0;
        
        const neighboursCoordinates = [
            [x+1, y+1],
            [x+1, y],
            [x+1, y-1],
            [x, y-1],
            [x-1, y-1],
            [x-1, y],
            [x-1, y+1],
            [x, y+1]
        ]

        for (let i = 0; i < neighboursCoordinates.length; i++) {
            const neighboursX = neighboursCoordinates[i][0];
            const neighboursY = neighboursCoordinates[i][1];
            let actualX = neighboursCoordinates[i][0];
            let actualY = neighboursCoordinates[i][1];

            if (actualX<0) {
                actualX = this.length + actualX;
            } else if (actualX>this.length-1) {
                actualX = actualX - this.length;
            }

            if (actualY<0) {
                actualY = this.width + actualY;
            } else if (actualY>this.width-1) {
                actualY = actualY - this.width;
            }

            

            try {
                if (this.cells[actualX][actualY].status === CellStatus.Alive) {
                    result += 1;
                }
            } catch (error) {
                console.log(x, y, neighboursCoordinates[i], actualX, actualY);
            }
            
        }
        return result;
    }

    nextState(): Array<{x: number, y: number, status: CellStatus}> {
        this.logState();
        const delta: Array<{x: number, y: number, status: CellStatus}> = [];

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const cell = this.cells[i][j];
                const neigboursAmount = this.calculateAliveNeigbours(i, j);

                switch (cell.status) {
                    case CellStatus.Dead:
                        if (neigboursAmount === 3) {
                            delta.push({x: i, y: j, status: CellStatus.Alive})
                        }
                        break;
                    
                    case CellStatus.Alive:
                        if (neigboursAmount < 2 || neigboursAmount > 3) {
                            delta.push({x: i, y: j, status: CellStatus.Dead})
                        }
                }
            }
        }

        for (let i = 0; i < delta.length; i++) {
            this.cells[delta[i].x][delta[i].y].status = delta[i].status;
        }

        console.log(delta);
        this.logState();
        return delta
    }

    setState(state: Array<Array<CellStatus>>) {
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state[i].length; j++) {
                this.cells[i][j].status = state[i][j];
            }
        }
    }

    putFigure(x: number, y: number, fugire: Array<Array<CellStatus>>) {
        for (let i = 0; i < fugire.length; i++) {
            for (let j = 0; j < fugire[i].length; j++) {
                this.cells[i+x][j+y].status = fugire[i][j];
            }
        }
    }

    logState() {
        console.log("UNIVERSE STATE:");
        for (let i = 0; i < this.cells.length; i++) {
            let row = ''
            for (let j = 0; j < this.cells[i].length; j++) {
                row += this.cells[i][j].status + ", "
            }
            console.log(row);
        }
    }
}

enum CellStatus {
    Dead,
    Alive
}

class Cell {
    status: CellStatus;

    constructor(status: CellStatus) {
        this.status = status;
    }
}

export { Universe, Cell, CellStatus };
