(function(global) {
  class outtro extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({color: '#686868', side: THREE.BackSide})
      );
      this.scene.add(this.background);

      const sideTexture = Loader.loadTexture('res/construct_box_side.png');
      const topTexture = Loader.loadTexture('res/construct_box_side.png');
      topTexture.rotation = Math.PI/2;
      topTexture.wrapS = THREE.RepeatWrapping;
      topTexture.wrapT = THREE.RepeatWrapping;
      const frontTexture = Loader.loadTexture('res/construct_box.png');

      this.box = new THREE.Mesh(new THREE.BoxGeometry(250, 150, 50),
        [
          new THREE.MeshStandardMaterial({map: sideTexture, roughness: 1, metalness: 0}),
          new THREE.MeshStandardMaterial({map: sideTexture, roughness: 1, metalness: 0}),
          new THREE.MeshStandardMaterial({color: 'gray', roughness: 1, metalness: 0}),
          new THREE.MeshStandardMaterial({map: sideTexture, roughness: 1, metalness: 0}),
          new THREE.MeshStandardMaterial({map: frontTexture, roughness: 1, metalness: 0}),
          new THREE.MeshStandardMaterial({map: frontTexture, roughness: 1, metalness: 0}),
        ]
      );
      this.scene.add(this.box);

      this.boxTopLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(250, 50),
        [
          new THREE.MeshBasicMaterial({map: topTexture}),
          new THREE.MeshBasicMaterial({color: 'gray'})
        ]
      );
      this.boxTopLeft.position.x = 0;
      this.boxTopLeft.position.y = 100;
      this.boxTopLeft.position.z = 25;
      rotateAboutPoint(
        this.boxTopLeft,
        new THREE.Vector3(250/2, 150/2, 50/2),
        new THREE.Vector3(1, 0, 0),
        Math.PI/4
      );
      this.scene.add(this.boxTopLeft);

      this.boxTopRight = new THREE.Mesh(
        new THREE.PlaneGeometry(250, 50),
        [
          new THREE.MeshBasicMaterial({color: 'gray'}),
          new THREE.MeshBasicMaterial({map: topTexture})
        ]
      );
      this.boxTopRight.position.x = 0;
      this.boxTopRight.position.y = 100;
      this.boxTopRight.position.z = -25;
      rotateAboutPoint(
        this.boxTopRight,
        new THREE.Vector3(250/2, 150/2, -50/2),
        new THREE.Vector3(1, 0, 0),
        -Math.PI/4
      );
      this.scene.add(this.boxTopRight);

      let light = new THREE.DirectionalLight(0xffffff, 1, 1000);
      light.position.set(-100, 50, 50);
      this.scene.add(light);

      let ambientLight = new THREE.AmbientLight(0x404040, 4.5);
      this.scene.add(ambientLight);

      this.canvas = document.createElement('canvas');
      this.tex = new THREE.Texture(this.canvas);
      this.tex.needsUpdate = true;
      this.ctx = this.canvas.getContext('2d');
      this.textPlane = new THREE.Mesh(new THREE.PlaneGeometry(160, 90), new THREE.MeshBasicMaterial({
        map: this.tex,
        side: THREE.DoubleSide,
        transparent: true
      }));
      this.textPlane.position.set(190, 30, 160);
      this.textPlane.lookAt(new THREE.Vector3(300, 50, 252));
      this.scene.add(this.textPlane);

      this.colorNIN = 'rgba(0,0,0,0)';
      this.colorJA = 'rgba(0,0,0,0)';
      this.colorDEV = 'rgba(0,0,0,0)';

      this.camera.position.z = 200;
    }

    update(frame) {
      super.update(frame);
      let startBEAN = 1157;
      let startFrame = FRAME_FOR_BEAN(startBEAN);

      let nin = 1188;
      let ja = 1191;
      let dev = 1204;

      const stopZoom = 1236;

      const startCloseLid = 1175;
      const stopCloseLid = 1178;

      let t = 0;

      if(BEAN < stopZoom) {
        t = frame - FRAME_FOR_BEAN(startBEAN);
        this.camera.position.x = lerp(0, 300, t/300);
        this.camera.position.y = lerp(0, 50, t/300);
        this.camera.position.z = lerp(200, 252, t/300);
        this.camera.lookAt(this.box.position);
      }

      if(frame >= FRAME_FOR_BEAN(startCloseLid) && frame < FRAME_FOR_BEAN(stopCloseLid)) {
        rotateAboutPoint(
          this.boxTopLeft,
          new THREE.Vector3(250/2, 150/2, 50/2),
          new THREE.Vector3(1, 0, 0),
          -0.1
        );
        rotateAboutPoint(
          this.boxTopRight,
          new THREE.Vector3(250/2, 150/2, -50/2),
          new THREE.Vector3(1, 0, 0),
          0.1
        );
      }

      if (BEAN < nin) {
        this.colorNIN = 'rgba(0,0,0,0)';
        this.colorJA = 'rgba(0,0,0,0)';
        this.colorDEV = 'rgba(0,0,0,0)';
      }

      if (BEAN >= nin) {
        t = frame - FRAME_FOR_BEAN(nin);
        this.sizeNIN = lerp(0.5, 1.5, t/10);
        this.colorNIN = '#ffffff';
      }

      if (BEAN >= ja) {
        t = frame - FRAME_FOR_BEAN(ja);
        this.sizeJA = lerp(0.5, 1.5, t/10);
        this.colorJA = '#ffffff';
      }

      if (BEAN >= dev) {
        t = frame - FRAME_FOR_BEAN(dev);
        this.sizeDEV = lerp(0.5, 1.5, t/10);
        this.colorDEV = '#ffffff';
      }
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render(renderer) {
      super.render(renderer);
      let font = 'SchmelviticoBold';
      let size = 1.2;
      let shake = 0.4;
      this.ctx.font = 'bold ' + (size * GU) + `pt ${font}`;
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.clearRect(0, 0, 16*GU, 9*GU);

      this.ctx.fillStyle = 'rgba(0,0,0,0)';
      this.ctx.fillRect(0, 0, 16*GU, 9*GU);
      this.ctx.save();

      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeNIN, this.sizeNIN);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.fillStyle = this.colorNIN;
      this.ctx.fillText('NIN', 3.7 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();

      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeJA, this.sizeJA);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.fillStyle = this.colorJA;
      this.ctx.fillText('JA', 6.7 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();

      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizeDEV, this.sizeDEV);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.fillStyle = this.colorDEV;
      this.ctx.fillText('DEV', 8.9 * GU, 4.5 * GU);

      this.ctx.restore();

      this.tex.needsUpdate = true;
    }

    warmup(renderer) {
      this.update(10065);
      this.render(renderer);
    }
  }

  global.outtro = outtro;
})(this);
