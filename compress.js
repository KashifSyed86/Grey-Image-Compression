const fs = require("fs");

function mostFrequent(arr) {
  var dict = {};

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] in dict) {
      dict[arr[i]]++ 
    } else {
      dict[arr[i]] = 1
    }
  }

  return Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b);;
}

function compressHandler(arr) {
  max_intensity = mostFrequent(arr);
  let bit_array = new Array();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == max_intensity) {
      bit_array.push(1);
    } else {
      bit_array.push(0);
    }
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == max_intensity) {
      arr.splice(i, 1);
      i--;
    }
  }

  return [arr, max_intensity, bit_array];
}

function compress(degree, arr) {

  fs.access("./output", (err) => {
    if (err) {
      fs.mkdir("./output", () => { });
    }
  });

  fs.access("./output/compress", (err) => {
    if (err) {
      fs.mkdir("./output/compress", () => { });
    }
  });

  for (let i = 0; i < degree; i++) {
    let result = compressHandler(arr);
    arr = result[0];

    let max_intensity = result[1];
    let bit_array = result[2];

    let byteArray = new Array();
    let zeros = 8 - (bit_array.length % 8);

    byteArray.push((max_intensity >>> 0).toString(2).padStart(8, 0));
    byteArray.push((zeros >>> 0).toString(2).padStart(8, 0));
    
    for (let i = 0; i < zeros; i++) {
      bit_array.unshift(0);
    }

    byteArray = Uint8Array.from(byteArray.join("")) + "," + Uint8Array.from(bit_array);

    fs.writeFile('./output/compress/config' + i + '.bin', byteArray, (err) => { })
  }

  fs.writeFile('./output/compress/image.bin', arr.toString(), (err) => { })

}

var degree = 5
var arr = fs.readFileSync("./image.bin", 'utf-8').split(',')

compress(degree, arr);