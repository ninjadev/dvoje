(function(global) {
  class BlurPassNode extends NIN.ShaderNode {
    constructor(id, options) {
      const kernelSize = 25;
      const sigma = 2.0;

      const convolutionShader = THREE.ConvolutionShader;
      options.shader = {
        uniforms: convolutionShader.uniforms,
        vertexShader:  convolutionShader.vertexShader,
        fragmentShader: convolutionShader.fragmentShader,
        defines: {
          KERNEL_SIZE_FLOAT: kernelSize.toFixed(1),
          KERNEL_SIZE_INT: kernelSize.toFixed(0)
        }
      };
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };
      super(id, options);
      if(options.direction == 'x') {
        this.uniforms.uImageIncrement.value = new THREE.Vector2(0.001953125, 0.0);
      } else {
        this.uniforms.uImageIncrement.value = new THREE.Vector2(0.0, 0.001953125);
      }
      this.uniforms.cKernel.value = THREE.ConvolutionShader.buildKernel(sigma);

      this.renderTarget = new THREE.WebGLRenderTarget();
      this.resize();
    }

    resize() {
      const scale = 4;
      if(this.renderTarget)
      this.renderTarget.setSize(16 * GU / scale, 9 * GU / scale);
    }

      render(renderer) {
        const renderTarget = this.renderTarget;
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(this.scene, this.camera);
      renderer.setRenderTarget(null);
      this.outputs.render.setValue(renderTarget.texture);
    }

    update() {
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.BlurPassNode = BlurPassNode;
})(this);