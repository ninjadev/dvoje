(function (global) {
  class postfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        paperTexture: new NIN.TextureInput(),
      };
      super(id, options);
      this.paperTexture = Loader.loadTexture('res/paper.jpg');
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
    }
  }

  global.postfxNode = postfxNode;
})(this);
