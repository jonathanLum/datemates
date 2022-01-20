const Jimp = require('jimp') ;

module.exports = async function() {
    this.create = async function (name, data) {
        var name2 = "";
        var fanciness = 0;
        
        // parse data to decide on text
        for (var key in data){
            if (data[key] == null){
            next;
            }

            if (key == "Name"){
                name2 = data[key];
            } else if (key == "Fanciness"){
                fanciness = int(data[key]);
            }
        }

        // Reading image
        const image = await Jimp.read('/imgs/casualTemplate.jpg');
        // Defining the text font
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        image.print(font, 10, 350, `${name} invites ${name2}\nTo:`);
        // Writing image after processing
        await image.writeAsync('/casualInvite.png');
        return "casualInvite.png";
    }
}
