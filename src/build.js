(function(global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class build extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          logo: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;

      this.canvas = document.createElement('canvas');
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: new THREE.CanvasTexture(this.canvas),
          side: THREE.DoubleSide,
          transparent: true,
        }));

      this.plane.scale.setScalar(10);

      this.plane.material.map.minFilter = THREE.LinearFilter;
      this.plane.material.map.magFilter = THREE.LinearFilter;


      this.scene.add(this.plane);
    }

    update(frame) {
      super.update(frame);

      let value = smoothstep(0, 1, F(frame, 64, 16));
      value = smoothstep(value, 0, F(frame, 64 + 48, 16));
      value = smoothstep(value, 1, F(frame, 128, 16));
      value = smoothstep(value, 0, F(frame, 128 + 48, 16));

      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.plane.material.map.needsUpdate = true;

      this.plane.material.color.setScalar(value);
    }
  }

  global.build = build;
})(this);
