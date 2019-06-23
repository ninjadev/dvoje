(function(global) {
  class digitalUI extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          input_scene: new NIN.TextureInput(),
        }
      });

      this.background_frame = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
      this.background_frame.material.transparent = true;
      this.scene.add(this.background_frame);


      this.crankwork = new THREE.Mesh(new THREE.PlaneGeometry(393 / 14, 744 / 14, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
      this.crankwork.material.transparent = true;
      this.scene.add(this.crankwork);

      this.crankwork.material.uniforms.input_image.value = Loader.loadTexture('res/crankwork.png');;

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;

      this.map_object = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
    }

    update(frame) {
      super.update(frame);

      this.background_frame.material.uniforms.input_image.value = this.inputs.input_scene.getValue();
    }
  }

  global.digitalUI = digitalUI;
})(this);
