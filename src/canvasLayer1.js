(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class canvasLayer1 extends NIN.THREENode {
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
      this.ctx.translate(this.halfWidth, this.halfHeight);

      var canvas_size = 1024;
      var size = 800;
      var width_horizontal = 100;
      var top_gap = 150;

      this.ctx.fillStyle = '#6c79ae';
      this.ctx.strokeStyle = 'pink';
      this.ctx.beginPath();
      this.ctx.moveTo(canvas_size / 2 , 
                      canvas_size / 2 + size / 2);
      this.ctx.lineTo(canvas_size / 2 + size / 2,
                      canvas_size / 2 + size / 2  - size / 2);
      this.ctx.lineTo(canvas_size / 2 + size / 2 - width_horizontal,
                      canvas_size / 2 + size / 2  - size / 2);
      this.ctx.lineTo(canvas_size / 2 , 
                      canvas_size / 2 + size / 2 - width_horizontal);

      this.ctx.closePath();
      //this.ctx.stroke();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(canvas_size / 2 + top_gap, 
                      canvas_size / 2 - size / 2 + top_gap);
      this.ctx.lineTo(canvas_size / 2 + size / 2,
                      canvas_size / 2 - size / 2  + size / 2);
      this.ctx.lineTo(canvas_size / 2 + size / 2 - width_horizontal,
                      canvas_size / 2 - size / 2  + size / 2);
      this.ctx.lineTo(canvas_size / 2 + top_gap, 
                      canvas_size / 2 - size / 2 + width_horizontal + top_gap);

      this.ctx.closePath();
      //this.ctx.stroke();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(canvas_size / 2 , 
                      canvas_size / 2 + size / 2);
      this.ctx.lineTo(canvas_size / 2 - size / 2,
                      canvas_size / 2 + size / 2  - size / 2);
      this.ctx.lineTo(canvas_size / 2 - size / 2 + width_horizontal,
                      canvas_size / 2 + size / 2  - size / 2);
      this.ctx.lineTo(canvas_size / 2 , 
                      canvas_size / 2 + size / 2 - width_horizontal);

      this.ctx.closePath();
      //this.ctx.stroke();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(canvas_size / 2 - top_gap, 
                      canvas_size / 2 - size / 2 + top_gap);
      this.ctx.lineTo(canvas_size / 2 - size / 2,
                      canvas_size / 2 - size / 2  + size / 2);
      this.ctx.lineTo(canvas_size / 2 - size / 2 + width_horizontal,
                      canvas_size / 2 - size / 2  + size / 2);
      this.ctx.lineTo(canvas_size / 2 - top_gap, 
                      canvas_size / 2 - size / 2 + width_horizontal + top_gap);

      this.ctx.closePath();
      //this.ctx.stroke();
      this.ctx.fill();

      this.ctx.restore();
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.canvasLayer1 = canvasLayer1;
})(this);