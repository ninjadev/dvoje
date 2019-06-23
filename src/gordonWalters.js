(function(global) {
  class gordonWalters extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.fullWidth = 16;
      this.fullHeight = 9;
      this.resize();
      this.lineHeight = GU / 2
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    resize() {
      this.canvas.width = this.fullWidth * GU;
      this.canvas.height = this.fullHeight * GU;
    }

    render() {
      this.ctx.save();

      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.ctx.fillStyle = 'rgb(255, 0, 255)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      var colors = ['#cccbc4', '#232321']

      for(var line = 0; line <= this.canvas.height / this.lineHeight; line++) {
        var posY = line * this.lineHeight;
        this.drawLine(colors[line % 2], posY, this.lineHeight);
      }

      this.drawCircles(colors[0], colors[1], (this.frame/1356) * this.canvas.width, 4*this.lineHeight, this.lineHeight);
      
      this.drawCircles(colors[1], colors[0], (1 - this.frame/1356) * this.canvas.width, 5*this.lineHeight, this.lineHeight);
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    drawLine(color, posY, lineHeight) {
      this.ctx.fillStyle = color;

      this.ctx.fillRect(0, posY, this.canvas.width, lineHeight)
    }

    drawCircles(color, inverseColor, posX, posY, lineHeight) {

      var scale = 0.7 + 0.1 * (this.frame / FRAME_FOR_BEAN(4))
      var radius = lineHeight * scale;
 
      this.ctx.fillStyle = inverseColor;
      this.ctx.fillRect(posX + lineHeight, posY, 2*lineHeight, lineHeight)

      this.ctx.beginPath();
      this.ctx.arc(posX + lineHeight, posY + (1-scale)*lineHeight, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(posX + 3*lineHeight, posY+ (1-scale)*lineHeight, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  }

  global.gordonWalters = gordonWalters;
})(this);
