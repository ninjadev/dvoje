(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class canvasLayer0 extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

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
      // begin canvas content
      super.update(frame);

      this.ctx.save();
      this.ctx.translate(this.halfWidth, this.halfHeight);

      var canvas_size = 1024;
      var size = 800;
      var width_small = 15;
      var width_large = 50;


      this.ctx.fillStyle = '#6c79ae';
      this.ctx.fillRect((canvas_size - size) / 2,
                        (canvas_size - size) / 2, 
                        size,
                        size);
      this.ctx.clearRect((canvas_size - size) / 2 + width_small,
                          (canvas_size - size) / 2 + width_small,
                          size - 2 * width_small,
                          size - 2 * width_small);

      this.ctx.fillRect((canvas_size - size) / 2 + 2 * width_small,
                        (canvas_size - size) / 2 + 2 * width_small,
                        size - 4 * width_small,
                        size - 4 * width_small);
      this.ctx.clearRect((canvas_size - size) / 2 + width_small + width_large,
                          (canvas_size - size) / 2 + width_small + width_large,
                          size - 2 * width_small - 2 * width_large,
                          size - 2 * width_small - 2 * width_large);

      this.ctx.fillRect((canvas_size - size) / 2 + 2 * width_small + width_large,
                        (canvas_size - size) / 2 + 2 * width_small + width_large,
                        size - 4 * width_small - 2 * width_large,
                        size - 4 * width_small - 2 * width_large);
      this.ctx.clearRect((canvas_size - size) / 2 + 3 * width_small + width_large,
                          (canvas_size - size) / 2 + 3 * width_small + width_large,
                          size - 6 * width_small - 2 * width_large,
                          size - 6 * width_small - 2 * width_large);

      this.ctx.restore();

      //end canvas content
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.canvasLayer0 = canvasLayer0;
})(this);
