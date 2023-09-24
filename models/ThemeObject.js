class ThemeObject {
  constructor(spec) {
    this.name = spec.name == undefined ? '' : spec.name;
    this.color1 = spec.color1;
    this.color2 = spec.color2;
    this.color3 = spec.color3;
    this.color3contrast = spec.color3contrast == undefined ? 'white' : spec.color3contrast;
    this.darkPatternHSL = spec.darkPatternHSL == undefined ? '0, 0%, 0%' : spec.darkPatternHSL;
    this.darkBlendMode = spec.darkBlendMode == undefined ? 'soft-light' : spec.darkBlendMode;
    this.darkPatternOpacity = spec.darkPatternOpacity == undefined ? 1 : spec.darkPatternOpacity;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  }
}

var Themes = [
  new ThemeObject({
    name: 'Awake',
    color1: 'hsl(313, 44%, 25%)',
    color2: 'hsl(187, 42%, 46%)',
    color3: 'hsl(64, 60%, 49%)',
    color3contrast: 'black',
    isSelected: true,
  }),
  new ThemeObject({
    name: 'Aware',
    color1: 'rgb(138 33 115)',
    color2: 'rgb(37 174 193)',
    color3: 'rgb(209 224 0)',
    color3contrast: 'black',
  }),
  new ThemeObject({
    name: 'Calm',
    color1: 'rgb(117 93 122)',
    color2: 'rgb(68 130 155)',
    color3: 'rgb(167, 177, 119)',
  }),
  new ThemeObject({
    name: 'Intent',
    color1: 'hsl(0, 0%, 15%)',
    color2: 'hsl(0, 0%, 46%)',
    color3: 'hsl(0, 0%, 70%)',
    color3contrast: 'black',
    darkPatternOpacity: 0.5,
    darkPatternHSL: '0, 0%, 0%',
    darkBlendMode: 'overlay',
  }),
  new ThemeObject({
    name: 'Keen',
    color1: 'rgb(0 184 255)',
    color2: 'rgb(0 222 0) ',
    color3: 'rgb(255, 112, 227)',
  }),
  new ThemeObject({
    name: 'Content',
    color1: 'rgb(0 202 234)',
    color2: 'rgb(84, 184, 0)',
    color3: 'rgb(184 222 0)',
    color3contrast: 'rgb(56, 122, 0)',
  }),
  new ThemeObject({
    name: 'Alive',
    color1: 'rgb(0 136 8)',
    color2: 'rgb(0 176 243)',
    color3: 'rgb(239 216 0)',
    color3contrast: 'rgb(0 136 8)',
  }),
  new ThemeObject({
    name: 'Wise',
    color1: 'rgb(145 97 21)',
    color2: 'rgb(104 195 156)',
    color3: 'rgb(234 145 4)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Moody',
    color1: 'rgb(96, 0, 117)',
    color2: 'rgb(204, 17, 110)',
    color3: 'rgb(255, 127, 78)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Mellow',
    color1: 'rgb(58, 93, 66)',
    color2: 'rgb(79, 159, 198)',
    color3: 'rgb(134, 219, 162)',
    color3contrast: 'rgb(58, 93, 66)',
  }),
  new ThemeObject({
    name: 'Antsy',
    color1: 'rgb(129, 32, 0)',
    color2: 'rgb(255, 0, 0)',
    color3: 'rgb(255, 159, 0)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Sullen',
    color1: 'rgb(66, 39, 110)',
    color2: 'rgb(74, 116, 150)',
    color3: 'rgb(134, 198, 165)',
    darkPatternOpacity: 0.5,
  }),
];
