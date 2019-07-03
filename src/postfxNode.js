(function (global) {
  class postfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        paperTexture: new NIN.TextureInput(),
      };
      super(id, options);
      this.paperTexture = Loader.loadTexture('res/paper.jpg');

      const video = document.createElement('video');
      Loader.load('res/output4.mp4', video, () => {
        this.videoTexture = new THREE.VideoTexture(video);
        video.play();
      });
      this.video = video;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
      this.uniforms.videoTexture.value = this.videoTexture;
      this.uniforms.videoAmount.value = 0;
      if(BEAT && BEAN === 366) {
        this.video.currentTime = 1.2;
        this.video.play();
      }
      if(BEAN >= 368 && BEAN < 380) {
        this.uniforms.videoAmount.value = 1;
      }
    }
  }

  global.postfxNode = postfxNode;
})(this);
