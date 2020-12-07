const fs = require('fs');
const _ = require("lodash");
// const d3 = require("d3-color")

// this data was pulled from
// http://tomari.org/main/java/color/webdata_color.html?cc.csv
const data = fs.readFileSync('../data/pccs_tones.txt', 'utf8').split("\r\n").filter(d => d);

const toneDict = {
  "v": "vivid",
  "b": "bright",
  "s": "strong",
  "dp": "deep",
  "lt": "light",
  "lt+": "light(+)",
  "sf": "soft",
  "d": "dull",
  "dk": "dark",
  "p": "pale",
  "p+": "pale(+)",
  "ltg": "light grayish",
  "g": "grayish",
  "dkg": "dark grayish",
  "m": "mono"
}

// console.log("total color number:" + data.length);

// 最後の9色（グレートーン）を除いてから、トーンコードでグループ化

// v, b, s, dp, lt+, lt, sf, d, dk, p+, p, ltg, g, dkg, (W, Gy, B)

const grouped = _.groupBy(data.slice(0, data.length - 9), line => {
  return line.split("\t")[1].replace(/[0-9|\.]/g, "") // 面倒なので数字を消して分類キーにする
})
grouped["m"] = data.slice(data.length - 9); // mono tone

// extract color data
const tones = _.map(grouped, (lines, k) => {
  return {
    code: k,
    name: toneDict[k],
    colors: lines.map(line => {
      const _line = line.split("\t")
      return {
        name: _line[1],
        code: _line[4],
        rgb: [_line[5], _line[6],_line[7]].map(v => parseInt(v)),
        hsv: [_line[12], _line[13], _line[14]].map(v => parseInt(v))
      }
    })
  }
})

tones.forEach(tone => {
  console.log(tone.code + ":" + tone.colors.length);
})

const json = JSON.stringify(tones, null, 2)

fs.writeFileSync("../data/tones.json", json);