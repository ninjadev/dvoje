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
      for (const filename of ['res/output-robot.mp4', 'res/heli.mp4']) {
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
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
      let currentVideo;

      if (BEAN < 384) {
        currentVideo = this.videos['res/output-robot.mp4'];
      } else if (BEAN < 512) {
        currentVideo = this.videos['res/heli.mp4'];
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
          currentVideo.video.currentTime = 0.8;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if(BEAN >= 368 && BEAN < 380) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 496 && BEAN < 508) {
        this.uniforms.videoAmount.value = 1;
      }
    }
  }

  global.postfxNode = postfxNode;
})(this);
