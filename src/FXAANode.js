(function(global) {
  class FXAANode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      options.shader = THREE.FXAAShader;
      super(id, options);
    }

    warmup(renderer) {
      this.update(100);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.A.getValue();
      this.uniforms.resolution.value.set(1 / (16 * GU), 1 / (9 * GU));
    }
  }

  global.FXAANode = FXAANode;
})(this);
