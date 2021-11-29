const p5 = require('p5');
module.exports = {
    make: function(fanciness) {
        function setup() {
            p5.createCanvas(400, 400);
            p5.background(220);
            p5.saveCanvas('myCanvas', 'jpg');
          }
    }
 }