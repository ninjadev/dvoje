(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class greetsBackgroundNames extends NIN.THREENode {
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
      this.ctx.save();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt oldfont';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      this.ctx.fillText('NIN', 3.8 * GU, 4.5 * GU);

      this.ctx.restore();
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.greetsBackgroundNames = greetsBackgroundNames;
})(this);
