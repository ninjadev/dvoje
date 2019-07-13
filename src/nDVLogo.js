(function(global) {

  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class nDVLogo extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.logo = document.createElement('img');
      Loader.load('res/ndv_logo.png', this.logo, ()=>0)
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      // Nice Lego color: #e3000b
      this.ctx.fillStyle = "#e3000b";
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);



      this.ctx.scale(16/1920, 9/1080)
      if (BEAN > 20) {
        this.ctx.globalAlpha = F(this.frame, 20, 5)
        this.ctx.drawImage(this.logo, 0, 0);

      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    warmup(renderer) {
      this.update(6710);
      this.render(renderer);
    }
  }

  global.nDVLogo = nDVLogo;
})(this);
