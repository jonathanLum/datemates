const Jimp = require('jimp') ;

module.exports = async function create(data) {
    // parse data to decide on text
    for (var key in data){
        if (data[key] == null){
          next;
        }
        message += `${key}: ${data[key]}\n`;
    }

    // Reading image
    const image = await Jimp.read('/imgs/fancy.jpg');
    // Defining the text font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print(font, 10, 350, 'All copyrights @https://www.tutorialspoint.com');
    // Writing image after processing
    await image.writeAsync('/home/jimp/textOverlay.png');
}
