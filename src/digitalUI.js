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
      //this.map_object.material.uniforms.layer0.value = this.inputs.input_scene.getValue();


      this.cubematerial = new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone();
      this.cube = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1),
                                 this.cubematerial);
      this.cube.material.transparent = true;
      this.scene.add(this.cube);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;

      this.map_object = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1),
                                 new THREE.ShaderMaterial(SHADERS.digitalUIShader).clone());
    }

    update(frame) {
      super.update(frame);

      this.cube.material.uniforms.layer0.value = this.inputs.input_scene.getValue();

      this.cube.rotation.x = Math.sin(frame / 50);
      this.cube.rotation.y = Math.cos(frame / 50);
    }
  }

  global.digitalUI = digitalUI;
})(this);
