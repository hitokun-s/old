var HtCanvas = function(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.style.display = "none";
    this.getMosaic = function(imgObj, colcnt) {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imgObj, 0, 0, w, h);// adjust size
        var pixSize = w / colcnt;
        var rowcnt = h / pixSize;
        mosaic = new Array(colcnt);
        for (var i = 0; i < colcnt; i++) {
            mosaic[i] = [];
            for (var j = 0; j < rowcnt; j++) {
                var data = ctx.getImageData(i * pixSize, j * pixSize, pixSize, pixSize);
                mosaic[i][j] = this.getAvg(data);
            }
        }
        ;
        return mosaic;
    };
};
HtCanvas.prototype.getAvg = function(imageData) {
    var data = imageData.data;
    var r = 0, g = 0, b = 0;
    for (var i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    ;
    var cnt = data.length / 4;
    return {r: ~~(r / cnt), g: ~~(g / cnt), b: ~~(b / cnt)};
};