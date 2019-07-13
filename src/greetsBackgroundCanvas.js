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
      this.ctx.save();

      // var randomColor = `#${(Math.random() * 0x1000000 | 0).toString(16).padStart(6, '0')}`;

      // debugger;
      // this.ctx.translate(this.halfWidth, this.halfHeight);

      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0,
                        0,
                        1024,
                        1024);


      // var canvas_size = 1024;
      // var size = 800;
      // var width_small = 15;
      // var width_large = 50;

      // this.ctx.fillStyle = '#6c79ae';
      // this.ctx.fillRect

      // Use random color for drawing>
      // this.ctx.fillStyle = `#${(Math.random() * 0x1000000 | 0).toString(16).padStart(6, '0')}`;
      // this.ctx.beginPath();
      // var x = Math.random() * size | 0;
      // var y = Math.random() * size | 0;
      // // var radius = (Math.random() * (canvas_size - (canvas_size / 5)) + (canvas_size / 5) | 0);
      // // this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      // // this.ctx.fill();

      // this.ctx.fillRect(
      //   x, // x
      //   y, // y
      //   Math.random() * size, // width
      //   Math.random() * size // height
      // );

      // section of nope:
      // this.ctx.beginPath();
      // this.ctx.moveTo(400, 50);
      // this.ctx.lineTo(1024, 0);
      // this.ctx.lineTo(5, 800);
      // this.ctx.moveTo(0, 0);
      // this.ctx.lineTo(15, 15);
      // this.ctx.stroke();

      // this.ctx.fillStyle = '#6c79ae';
      // this.ctx.fillRect((canvas_size - size) / 2,
      //                   (canvas_size - size) / 2,
      //                   size,
      //                   size);
      // this.ctx.clearRect((canvas_size - size) / 2 + width_small,
      //                     (canvas_size - size) / 2 + width_small,
      //                     size - 2 * width_small,
      //                     size - 2 * width_small);

      // this.ctx.fillRect((canvas_size - size) / 2 + 2 * width_small,
      //                   (canvas_size - size) / 2 + 2 * width_small,
      //                   size - 4 * width_small,
      //                   size - 4 * width_small);
      // this.ctx.clearRect((canvas_size - size) / 2 + width_small + width_large,
      //                     (canvas_size - size) / 2 + width_small + width_large,
      //                     size - 2 * width_small - 2 * width_large,
      //                     size - 2 * width_small - 2 * width_large);

      // this.ctx.fillRect((canvas_size - size) / 2 + 2 * width_small + width_large,
      //                   (canvas_size - size) / 2 + 2 * width_small + width_large,
      //                   size - 4 * width_small - 2 * width_large,
      //                   size - 4 * width_small - 2 * width_large);
      // this.ctx.clearRect((canvas_size - size) / 2 + 3 * width_small + width_large,
      //                     (canvas_size - size) / 2 + 3 * width_small + width_large,
      //                     size - 6 * width_small - 2 * width_large,
      //                     size - 6 * width_small - 2 * width_large);

      this.ctx.restore();
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.greetsBackgroundCanvas = greetsBackgroundCanvas;
})(this);
