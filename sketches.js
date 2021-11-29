module.exports = {
    sketch1: function (){
        function setup() {
            let c = createCanvas(100, 100);
            background(255, 0, 0);
            saveCanvas('myCanvas', 'jpg');
        }
    }
}