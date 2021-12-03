class PieceObject {
  constructor(spec) {
    this.name = spec.name == undefined ? '' : spec.name;
    this.shape = spec.shape == undefined ? 'var(--shape1)' : spec.shape;
    this.color = spec.color == undefined ? 'var(--color1)' : spec.color;
    this.backgroundImage = spec.backgroundImage == undefined ? 'var(--bgImage1)' : spec.backgroundImage;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  }
}

var Shapes = ['var(--shape1)', 'var(--shape2)', 'var(--shape3)', 'var(--shape4)'];
var Colors = ['var(--color1)', 'var(--color2)', 'var(--color3)'];
var BackgroundImages = ['var(--bgImage1)', 'var(--bgImage2)', 'var(--bgImage3)', 'var(--bgImage4)'];
