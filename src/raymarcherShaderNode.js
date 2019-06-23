(function(global) {
  class raymarcherShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
      }
      super(id, options);

      /*this.map_image = Loader.loadTexture('res/map/norge.png');
      this.testpattern = Loader.loadTexture('res/map/testlines.jpg');
      this.colorizer = Loader.loadTexture('res/graphics-graffiti.png');*/
    }

    /*warmup(renderer) {
      this.update(4989);
      this.render(renderer);
    }*/

    update(frame) {
      this.uniforms.frame.value = frame;
      /*this.uniforms.raw_bg.value = this.testpattern;
      this.uniforms.depthmap.value = this.inputs.lines.getValue();
      this.uniforms.rendered_input.value = this.inputs.rendered_input.getValue();
      this.uniforms.frame.value = frame;
      this.uniforms.blackfade.value = smoothstep(1, 0, (frame - 4737) / 50);

      if((frame > FRAME_FOR_BEAN(865) && frame < FRAME_FOR_BEAN(867)) ||
        (frame > FRAME_FOR_BEAN(871) && frame < FRAME_FOR_BEAN(872.5)) ||
        BEAN > 879
        )
      {
        this.uniforms.sobel_power.value = 1.0;
      } else {
        this.uniforms.sobel_power.value = 0.;
      }*/
    }
  }

  global.raymarcherShaderNode = raymarcherShaderNode;
})(this);