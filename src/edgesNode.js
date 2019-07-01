(function(global) {
  class edgesNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        tNormal: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.GU.value = GU;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.tNormal.value = this.inputs.tNormal.getValue();
    }
  }

  global.edgesNode = edgesNode;
})(this);
