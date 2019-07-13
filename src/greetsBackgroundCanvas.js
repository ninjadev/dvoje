(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class greetsBackgroundCanvas extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.random = new Random('greetsbg');

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.width = 1024;
      this.height = 1024;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      super.update(frame);
      if(BEAN % 8 === 0){
        this.ctx.save();

        // Use random color for drawing>
        var randomColor = `#${Math.floor(this.random() * 0x1000000).toString(16).padStart(6, '0')}`;
        this.ctx.fillStyle = randomColor;

        // Draw main shape:
        this.ctx.beginPath();
        // Random x/y centerpoint that is within scene:
        var x = Math.floor(this.random() * 900);
        var y = Math.floor(this.random() * 900);
        // Random size of circle, but within reasonable bounds:
        var maxCircleRadius = this.canvas.width / 5;
        var minCircleRadius = this.canvas.width / 15;
        var radius = Math.floor(this.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius);
        // Draw circle based on config above
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw extras
        // Neck part
        var neckXscaling = 0.6;
        var neckX = x - radius * neckXscaling;
        var neckY = y + radius * 0.80;
        var neckWidth = 2 * radius * neckXscaling;
        var neckHeight = radius * 0.30;
        this.ctx.fillRect(
          neckX,
          neckY,
          neckWidth,
          neckHeight,
        );

        //


        this.ctx.restore();
      }
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.greetsBackgroundCanvas = greetsBackgroundCanvas;
})(this);
