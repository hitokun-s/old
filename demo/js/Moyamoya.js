//depends on modernizr.js, LinkedList.js
var Moyamoya = function(canvasId, opt) {
    if (!Modernizr.canvas) {
        return;
    }
    var opt = opt || {};
    var displayCanvas = document.getElementById(canvasId);
    var context = displayCanvas.getContext("2d");
    var displayWidth = displayCanvas.width;
    var displayHeight = displayCanvas.height;
    var gridWidth = opt.vertGridCnt || 50; //to be modified
    var gridHeight = opt.horiGridCnt || 70; //to be modified
    var cellWidth = displayWidth / gridWidth;
    var cellHeight = displayHeight / gridHeight;
    var delegate = opt.delegate;
    var timer;

    var ease = opt.ease || 0.67;
    var mag;
    var velMax = opt.velMax || 255;
    var minDist = opt.minDist || 8;
    var minDistSquare = opt.minDistSquare || minDist * minDist;
    var sepNormMag = opt.sepNormMag || 4;
    var rMin = 0, rMax = 255;
    var gMin = 0, gMax = 255;
    var bMin = 0, bMax = 255;
    var interval = 5;//ms

    var cellList = new LinkedList();

    var createCell = function(i, j) {
        var r, g, b;
        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;
        return {
            i: i,
            j: j,
            x: i * displayWidth / gridWidth,
            y: j * displayHeight / gridHeight,
            r: r,
            g: g,
            b: b,
            bufferR: r,
            bufferG: g,
            bufferB: b,
            rVel: 0,
            gVel: 0,
            bVel: 0,
            bufferRVel: 0,
            bufferGVel: 0,
            bufferBVel: 0,
            neighbors: new LinkedList()
        };
    };

    this.start = function() {
        createCells();
        timer = window.setInterval(onTimer, interval);
    };

    var createCells = function() {
        var cellArray = [];
        for (var i = 0; i < gridWidth; i++) {
            cellArray[i] = [];
            for (var j = 0; j < gridHeight; j++) {
                var newCell = createCell(i, j);

                //set 4 neighbor cells (above, below, left,right)
                //above,below
                if (i > 0) {
                    newCell.neighbors.add(cellArray[i - 1][j]);
                    cellArray[i - 1][j].neighbors.add(newCell);
                }
                //left,right
                if (j > 0) {
                    newCell.neighbors.add(cellArray[i][j - 1]);
                    cellArray[i][j - 1].neighbors.add(newCell);
                }
                cellArray[i][j] = newCell;
                cellList.add(newCell);
            }
        }
    }

    this.restart = function(evt) {
        cellList.map(function(cell) {
            cell.bufferR = cell.r = Math.random() * 255;
            cell.bufferG = cell.g = Math.random() * 255;
            cell.bufferB = cell.b = Math.random() * 255;
            cell.bufferRVel = cell.rVel = 0;
            cell.bufferGVel = cell.gVel = 0;
            cell.bufferBVel = cell.bVel = 0;
        });
    };
    this.setDelegate = function(fn) {
        delegate = fn;
    };

    var onTimer = function(evt) {
        if (delegate) {
            delegate(cellList);
//            cellList.map(function(cell) {
//                delegate(cell);
//            });
            cellList.map(function(cell) {
                context.fillStyle = "rgb(" + ~~cell.r + "," + ~~cell.g + "," + ~~cell.b + ")";
                context.fillRect(cell.x, cell.y, cellWidth, cellHeight);
            });
            return;
        }
        var rVelAve, gVelAve, bVelAve;
        var rAve, gAve, bAve;
        var rSep, gSep, bSep;
        var dr, dg, db, f;
        cellList.map(function(cell) {
            rAve = 0;
            gAve = 0;
            bAve = 0;
            rVelAve = 0;
            gVelAve = 0;
            bVelAve = 0;
            rSep = 0;
            gSep = 0;
            bSep = 0;

            cell.neighbors.map(function(neighbor) {
                rAve += neighbor.r;
                gAve += neighbor.g;
                bAve += neighbor.b;
                rVelAve += neighbor.rVel;
                gVelAve += neighbor.gVel;
                bVelAve += neighbor.bVel;
                dr = cell.r - neighbor.r;
                dg = cell.g - neighbor.g;
                db = cell.b - neighbor.b;
                //"Separation":keep color distance as bigger than constant
                if (dr * dr + dg * dg + db * db < minDistSquare) {
                    rSep += dr;
                    gSep += dg;
                    bSep += db;
                }
                ;
            });

            rAve *= (f = 1 / cell.neighbors.length);
            gAve *= f;
            bAve *= f;
            rVelAve *= f;
            gVelAve *= f;
            bVelAve *= f;

            //normalize separation vector(keep vector length to be  constant(:sepNormMag))
            //prevent from 'dividing by zero'
            if ((rSep !== 0) || (gSep !== 0) || (bSep !== 0)) {
                rSep *= (sepMagRecip = sepNormMag / Math.sqrt(rSep * rSep + gSep * gSep + bSep * bSep));
                gSep *= sepMagRecip;
                bSep *= sepMagRecip;
            }

            //Update velocity by combining separation, alignment and cohesion effects. Change velocity only by 'ease' ratio. 
            //変化速度を周辺平均にちかづける
            //色を周辺平均にちかづける
            //Think with graph!
            cell.bufferRVel += ease * (rSep + rVelAve + rAve - cell.r - cell.bufferRVel);
            cell.bufferGVel += ease * (gSep + gVelAve + gAve - cell.g - cell.bufferGVel);
            cell.bufferBVel += ease * (bSep + bVelAve + bAve - cell.b - cell.bufferBVel);


            //Code for clamping velocity commented out because in my testing, the velocity never went over the max. (But you may wish to restore this
            //code if you experiment with different parameters.)
            /*
             if ((mag = Math.sqrt(cell.bufferRVel*cell.bufferRVel + cell.bufferGVel*cell.bufferGVel + cell.bufferBVel*cell.bufferBVel))> velMax) {
             cell.bufferRVel *= (f = velMax/mag);
             cell.bufferGVel *= f;
             cell.bufferBVel *= f;
             }
             */

            //update colors according to color velocities
            cell.bufferR += cell.bufferRVel;
            cell.bufferG += cell.bufferGVel;
            cell.bufferB += cell.bufferBVel;

            //bounce colors off of color cube boundaries
            if (cell.bufferR < rMin) {
                cell.bufferR = rMin;
                cell.bufferRVel *= -1;
            } else if (cell.bufferR > rMax) {
                cell.bufferR = rMax;
                cell.bufferRVel *= -1;
            }
            if (cell.bufferG < gMin) {
                cell.bufferG = gMin;
                cell.bufferGVel *= -1;
            } else if (cell.bufferG > gMax) {
                cell.bufferG = gMax;
                cell.bufferGVel *= -1;
            }
            if (cell.bufferB < bMin) {
                cell.bufferB = bMin;
                cell.bufferBVel *= -1;
            } else if (cell.bufferB > bMax) {
                cell.bufferB = bMax;
                cell.bufferBVel *= -1;
            }
        });

        //now loop through again, copy buffer values and draw
        cellList.map(function(cell) {
            cell.r = cell.bufferR;
            cell.g = cell.bufferG;
            cell.b = cell.bufferB;
            cell.rVel = cell.bufferRVel;
            cell.gVel = cell.bufferGVel;
            cell.bVel = cell.bufferBVel;
            context.fillStyle = "rgb(" + ~~cell.r + "," + ~~cell.g + "," + ~~cell.b + ")";
            context.fillRect(cell.x, cell.y, cellWidth, cellHeight);
        });
    };
    //:val is -127 to 127
    this.setRrange = function(val){
        if(val >= 0){
            rMin = val * 2 ;
            rMax = 255;
        }else{
            rMin = 0;
            rMax = 255 + val * 2;
        }
        this.restart();
    };
    this.setGrange = function(val){
        if(val >= 0){
            gMin = val * 2 ;
            gMax = 255;
        }else{
            gMin = 0;
            gMax = 255 + val * 2;
        }
        this.restart();
    };
    this.setBrange = function(val){
        if(val >= 0){
            bMin = val * 2 ;
            bMax = 255;
        }else{
            bMin = 0;
            bMax = 255 + val * 2;
        }
        this.restart();
    };
    this.setInterval = function(msec){
        window.clearInterval(timer);
        interval = msec;
        timer = window.setInterval(onTimer, interval);
    };
};