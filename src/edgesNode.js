(function(global) {
  class edgesNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        tNormal: new NIN.TextureInput(),
        tDepth: new NIN.TextureInput(),
        tInverter: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.GU.value = GU;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.tNormal.value = this.inputs.tNormal.getValue();
      this.uniforms.tDepth.value = this.inputs.tDepth.getValue();
      this.uniforms.tInverter.value = this.inputs.tInverter.getValue();
    }
  }

  global.edgesNode = edgesNode;
})(this);
