var Timer = function(f, e, count, msec) {
                var period = period || 500;
                var timer;
                var event = function() {
                    f(count);
                    count--;
                    if (count >= 0) {
                        timer = setTimeout(event, period);
                    } else {
                        if(e){
                            e();//occur once when timer end
                        }
                    }
                }
                this.start = event;
                this.stop = function() {
                    clearTimeout(timer);
                }
                this.pause = function(_count) {
                    this.stop();
                    setTimeout(event, _count * period);
                }
                this.stopWithDelay = function(_count) {
                    count = _count;
                }
            }