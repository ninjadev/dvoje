(function(global) {
  class outtro extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const sideTexture = Loader.loadTexture('res/box_Side.png');
      const topTexture = Loader.loadTexture('res/box_Side.png');
      // TODO: DAFUQ - må roteres riktig
      topTexture.rotation = -0.7;
      const frontTexture = Loader.loadTexture('res/box_Front.png');

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(250, 150, 50),
        new THREE.MeshFaceMaterial([
          new THREE.MeshBasicMaterial({map: sideTexture}),
          new THREE.MeshBasicMaterial({map: sideTexture}),
          new THREE.MeshBasicMaterial({map: topTexture}),
          new THREE.MeshBasicMaterial({map: sideTexture}),
          new THREE.MeshBasicMaterial({map: frontTexture}),
          new THREE.MeshBasicMaterial({map: frontTexture}),
        ])
      );
      this.cube.rotation.y = 0.8;
      this.cube.rotation.x = 0.6;
      this.scene.add(this.cube);

      let light = new THREE.DirectionalLight(0xffffff, 1, 1000);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      let ambientLight = new THREE.AmbientLight(0x404040, 1.5);
      this.scene.add(ambientLight);

      this.camera.position.z = 300;
      this.camera.position.y = -20;
    }

    update(frame) {
      super.update(frame);
      this.camera.position.z += 0.1;
    }
  }

  global.outtro = outtro;
})(this);
