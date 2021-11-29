const p5 = require('p5');
module.exports = {
    make: function(fanciness) {
        function setup() {
            createCanvas(400, 400);
            background(220);
            saveCanvas('myCanvas', 'jpg');
          }
    }
 }