(function(global) {
  class spinningCube extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          model: new NIN.Input(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
          normal: new NIN.TextureOutput()
        }
      });


      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 30;
      this.camera.position.y = 10;
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));

      this.background = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshBasicMaterial({
          color: 0xf5f3da,
          side: THREE.BackSide,
        }));
      this.scene.add(this.background);

      this.modelContainer = new THREE.Object3D();
      this.scene.add(this.modelContainer);

      this.normalMaterial = new THREE.MeshNormalMaterial({
        side: THREE.BackSide,
      });

      this.normalRenderTarget = new THREE.WebGLRenderTarget(1920 * 2, 1080 * 2);
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

    render(renderer) {
      this.background.visible = true;
      const renderTarget = NIN.FullscreenRenderTargetPool.getFullscreenRenderTarget();
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(this.scene, this.camera);
      renderer.setRenderTarget(null);
      this.outputs.render.setValue(renderTarget.texture);

      this.background.visible = false;
      const renderTargetNormal = this.normalRenderTarget;
      renderer.setRenderTarget(renderTargetNormal);
      renderer.clear();
      this.scene.overrideMaterial = this.normalMaterial;
      renderer.render(this.scene, this.camera);
      this.scene.overrideMaterial = null
      renderer.setRenderTarget(null);
      this.outputs.normal.setValue(renderTargetNormal.texture);
    }
  }

  global.spinningCube = spinningCube;
})(this);
