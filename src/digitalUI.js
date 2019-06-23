(function(global) {
  class digitalUI extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          input_scene0: new NIN.TextureInput(),
          input_scene1: new NIN.TextureInput(),
        }
      });

      this.background_frame = new THREE.Mesh(new THREE.PlaneGeometry(80, 80, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
      this.background_frame.material.transparent = true;
      this.scene.add(this.background_frame);
      this.background_frame.position.z = 0;

      this.foreground_frame = new THREE.Mesh(new THREE.PlaneGeometry(70, 70, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
      this.foreground_frame.material.transparent = true;
      this.scene.add(this.foreground_frame);
      this.foreground_frame.position.z = 20;


      this.crankwork = new THREE.Mesh(new THREE.PlaneGeometry(393 / 16, 744 / 16, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
      this.crankwork.material.transparent = true;
      this.scene.add(this.crankwork);
      this.crankwork.position.x = 4;
      this.crankwork.position.y = -4;
      this.crankwork.position.z = 10;

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

      this.background_frame.material.uniforms.input_image.value = this.inputs.input_scene0.getValue();
      this.foreground_frame.material.uniforms.input_image.value = this.inputs.input_scene1.getValue();
    }
  }

  global.digitalUI = digitalUI;
})(this);
