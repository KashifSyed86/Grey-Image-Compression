const fs = require("fs");

function decompress() {

  const config_count = fs.readdirSync('./output/compress').length - 1;
  var image = fs.readFileSync("./output/compress/image.bin", 'utf-8').split(',')

  for (let i = config_count - 1; i >= 0; i--) {
    var config = fs.readFileSync("./output/compress/config" + i + ".bin", 'utf-8').split(',')

    let max_intensity = parseInt(config.slice(0, 8).join(""), 2);
    let zeros = parseInt(config.slice(8, 16).join(""), 2);
    var bit_array = config.slice(16 + zeros, config.length)

    var new_image = []
    var index = 0

    bit_array.forEach(e => {
      if (e == 1) {
        new_image.push(max_intensity)
      } else {
        new_image.push(image[index])
        index++;
      }
    })

    image = new_image
  }

  fs.access("./output", (err) => {
    if (err) {
      fs.mkdir("./output", () => { });
    }
  });

  fs.access("./output/decompress", (err) => {
    if (err) {
      fs.mkdir("./output/decompress", () => { });
    }
  });

  fs.writeFile('./output/decompress/image.bin', image.join(","), (err) => { })
}

decompress()