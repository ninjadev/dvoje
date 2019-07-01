(function(global) {
  class spinningCube extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          model: new NIN.Input(),
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });


      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 30;
      this.camera.position.y = 10;
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));

      this.modelContainer = new THREE.Object3D();
      this.scene.add(this.modelContainer);
    }

    update(frame) {
      super.update(frame);

      const model = this.inputs.model.getValue();
      if(model !== this.model) {
        if(this.model !== undefined) {
          this.modelContainer.remove(this.model);
        }
        this.modelContainer.add(model);
        this.model = model;
      }

      this.modelContainer.rotation.y = frame / 200;
    }
  }

  global.spinningCube = spinningCube;
})(this);
