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
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
      this.uniforms.overlayTexture.value = this.canvasTexture;
      let currentVideo;

      this.ctx.fillStyle = 'white';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = 'bold 200px SchmelviticoBoulder';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 8;
      const count = 35;
      const stepNumber = ((BEAN_FOR_FRAME(frame + 7) - 256) / 8 | 0) + 1;
      for (let i = 0; i < count; i++) {
        this.ctx.fillStyle = i === count - 1 ? '#e1cf69' : 'black';
        this.ctx.fillText(stepNumber, 400 - i, 350 - i);
      }
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(150, 400, 8, 600);
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
  }

  global.postfxNode = postfxNode;
})(this);
