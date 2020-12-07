//ctx:Cancas Context
var PixImage = function() {
    var w, h
    var data //Uint8ClampedArray
    if (arguments.length == 1 && arguments[0] instanceof ImageData) {
        w = arguments[0].width;
        h = arguments[0].height;
        data = arguments[0].data;
    } else if (arguments.length == 2 && typeof (arguments[0]) == "number" && typeof (arguments[1]) == "number") {
        w = arguments[0];
        h = arguments[1];
        data = new Uint8ClampedArray(w * h * 4);
    } else {
        throw new TypeError("Illegal argumant!:" + arguments);
    }
    this.width = function(){
        return w;
    }
    this.height = function(){
        return h;
    }
    this.getRGB = function(x, y) {
        //below is necessary for createing continuous image
        if (x >= w) {
            x = x - w;
        }else if(x < 0){
            x = w + x;
        }
        if (y >= h) {
            y = y - h;
        }else if(y < 0){
            y = h + y;
        }
        var idx = (w * y + x) * 4; //index of the pixel(x,y)
        return {r: data[idx], g: data[idx + 1], b: data[idx + 2], alpha: data[idx + 3]};
    };
    //same as java setRGB method
    this.setRGB = function(x, y, c) {
        if (x >= w) x = x - w;
        if (y >= h) y = y - h;
        var idx = w * y + x;
        data[idx * 4    ] = c.r;
        data[idx * 4 + 1] = c.g;
        data[idx * 4 + 2] = c.b;
        data[idx * 4 + 3] = c.alpha;
    };
    this.getImageData = function() {
        var canvas = document.createElement('canvas');
        //canvas.width = w; //maybe not necessary
        //canvas.height = h;
        var ctx = canvas.getContext('2d');
        var imageData = ctx.createImageData(w, h);
        imageData.data.set(data);
        return imageData;
    }
    this.getPartImage = function(startX, startY, width, height){
        var res = new PixImage(width, height);
        for(var i = 0;i < width;i++){
            for(var j = 0;j < height;j++){
                res.setRGB(i, j, this.getRGB(startX + i, startY + j))
            }
        }
        return res;
    }    
}