
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
//chagne to remove 
export default function hexToRgb(hex:string): {r: number, g: number, b: number} | null {
    let  cleanHex = decodeURIComponent(hex);

  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result ? {
        r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
  }  : null;
}
