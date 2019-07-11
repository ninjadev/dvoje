(function (global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class postfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        paperTexture: new NIN.TextureInput(),
      };
      super(id, options);

      this.videos = {};
      for (const filename of ['res/output-robot.mp4', 'res/heli.mp4', 'res/Trebuchet.mp4', 'res/bat2.mp4']) {
        const video = document.createElement('video');
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        Loader.load(filename, video, () => {
          video.play();
        });
        this.videos[filename] = {
          video,
          videoTexture,
        }
      }

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;

      this.inventoryBox = document.createElement('canvas');
      this.inventoryBox.width = 400;
      this.inventoryBox.height = 300;
      this.drawInventoryBox(this.inventoryBox.getContext('2d'), 0, 0, 400, 300);

      this.detailedBox = document.createElement('canvas');
      this.detailedBox.width = 500;
      this.detailedBox.height = 400;
      this.drawDetailsBox(this.detailedBox.getContext('2d'), 0, 0, 500, 400);
    }

    drawDetailsBox(ctx, x, y, w, h) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#faecbf';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 8;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      const stepSize = 16;
      ctx.lineWidth = 3;
      for (let i = 0; i < w / stepSize; i++) {
        ctx.moveTo(i * stepSize, 0);
        const remainingWidth = w - i * stepSize;
        let distance = Math.min(remainingWidth, h);
        ctx.lineTo(i * stepSize + distance, distance);
      }
      for (let i = 0; i < h / stepSize; i++) {
        ctx.moveTo(0, i * stepSize);
        const remainingHeight = h - i * stepSize;
        let distance = Math.min(remainingHeight, w);
        ctx.lineTo(distance, i * stepSize + distance);
      }
      ctx.stroke();
      ctx.restore();
    }


    drawInventoryBox(ctx, x, y, w, h) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(171, 199, 211)';
      const stepSize = 16;
      
      ctx.lineWidth = 6;
      for (let i = 0; i < w / stepSize; i = i + 10) {
        ctx.moveTo(i * stepSize, 0);
        ctx.lineTo(i * stepSize, h);
      }
      for (let i = 0; i < h / stepSize; i = i + 5) {
        ctx.moveTo(0, i * stepSize);
        ctx.lineTo(w, i * stepSize);
      }
      ctx.stroke();

      ctx.lineWidth = 3;
      for (let i = 0; i < w / stepSize; i++) {
        ctx.moveTo(i * stepSize, 0);
        ctx.lineTo(i * stepSize, h);
      }
      for (let i = 0; i < h / stepSize; i++) {
        ctx.moveTo(0, i * stepSize);
        ctx.lineTo(w, i * stepSize);
      }
      ctx.stroke();


      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(47, 58, 58)';
      ctx.strokeRect(0, 0, w, h);
      
      ctx.restore();
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
      this.uniforms.overlayTexture.value = this.canvasTexture;
      let currentVideo;

      this.ctx.fillStyle = 'white';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.renderStepNumberVerticalLineAndBox();

      this.canvasTexture.needsUpdate = true;

      if (BEAN < 384) {
        currentVideo = this.videos['res/car.mp4'];
      } else if (BEAN < 512) {
        currentVideo = this.videos['res/heli.mp4'];
      } else if (BEAN < 640) {
        currentVideo = this.videos['res/output-robot.mp4'];
      } else if (BEAN < 1024) {
        currentVideo = this.videos['res/Trebuchet.mp4'];
      } else {
        currentVideo = this.videos['res/bat2.mp4'];
      }
      if (currentVideo) {
        this.uniforms.videoTexture.value = currentVideo.videoTexture;
      }
      this.uniforms.videoAmount.value = 0;
      this.uniforms.abberration.value = 0;
      if (BEAN >= 518) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 518, 8));
      } 
      if (BEAN >= 534) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 534, 8));
      }
      if (BEAN >= 550) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 550, 8));
      }
      if (BEAN >= 566) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 566, 8));
      }
      if (BEAN >= 640) {
        this.uniforms.abberration.value =
          smoothstep(this.uniforms.abberration.value, 1, F(frame, 638, 4));
        this.uniforms.abberration.value =
          easeOut(this.uniforms.abberration.value, 0, F(frame, 644, 2));

        this.uniforms.abberration.value =
          smoothstep(this.uniforms.abberration.value, 1, F(frame, 702, 4));
        this.uniforms.abberration.value =
          easeOut(this.uniforms.abberration.value, 0, F(frame, 708, 2));
      }
      if (BEAT && BEAN === 366) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.4;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 496) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.2;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 622) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.2;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 1006) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 1134) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if(BEAN >= 368 && BEAN < 380) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 496 && BEAN < 512) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 624 && BEAN < 636) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 1008 && BEAN < 1024) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 1136 && BEAN < 1152) {
        this.uniforms.videoAmount.value = 1;
      }
    }

    renderStepNumberVerticalLineAndBox() {

      let stepNumber = 0

      if (BEAN >= 256 && BEAN < 368) { //car
        stepNumber = ((BEAN - 256) / 8 | 0) + 1;
      } else if (BEAN >= 384 && BEAN < 496) { // heli
        stepNumber = ((BEAN - 384) / 8 | 0) + 1;
      } else if (BEAN >= 512 && BEAN < 624) { // robot
        stepNumber = ((BEAN - 512) / 8 | 0) + 1;
      } else if (BEAN >= 896 && BEAN < 1008) { // treb
        stepNumber = ((BEAN - 896) / 8 | 0) + 1;
      } else if (BEAN >= 1024 && BEAN < 1136) { // bat
        stepNumber = ((BEAN - 1024) / 8 | 0) + 1;
      }

      if (stepNumber < 1) {
        return;
      }

      this.ctx.font = 'bold 200px SchmelviticoBoulder';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 8;
      const count = 35;
      for (let i = 0; i < count; i++) {
        this.ctx.fillStyle = i === count - 1 ? '#e1cf69' : 'black';
        this.ctx.fillText(stepNumber, 520 - i, 300 - i);
      }

      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(150, 400, 8, 600);

      this.ctx.drawImage(this.inventoryBox, 50, 50);

      // Will move based on interesting building
      //this.ctx.drawImage(this.detailedBox, 1920-600, 400);
    }
  }

  global.postfxNode = postfxNode;
})(this);
