(function(global) {

  const COLOR1 = 0xff66ff;
  const COLOR2 = 0xffff66;

  const materials = {
    black: new THREE.MeshStandardMaterial({
      color: 0,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.2,

    }),
    'SOLID-BLACK': new THREE.MeshStandardMaterial({
      color: 0,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.2,

    }),
    'SOLID-MEDIUM_ORANGE': new THREE.MeshStandardMaterial({
      color: 0xFFA300,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.2,

    }),
    'METAL-SILVER': new THREE.MeshStandardMaterial({
      color: 0x8A928D,
      side: THREE.BackSide,
      metalness: 1,
      roughness: 0.1,

    }),
    'RUBBER-BLACK': new THREE.MeshStandardMaterial({
      color: 0x222222,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.1,

    }),
    'CHROME-ANTIQUE_BRASS': new THREE.MeshStandardMaterial({
      color: 0x645a4c,
      side: THREE.BackSide,
      metalness: 1,
      roughness: 0.1,

    }),
    'SOLID-DARK_AZURE': new THREE.MeshStandardMaterial({
      color: 0x469bc3,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.1,

    }),
    'SOLID-BRIGHT_GREEN': new THREE.MeshStandardMaterial({
      color: 0x009624,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.1,
    }),
    'SOLID-WHITE': new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      metalness: 0,
      roughness: 0.1,
    }),
  };

  function replaceMaterial(oldMaterial) {
    if(!oldMaterial) {
      return;
    }
    if(oldMaterial.name in materials) {
      const m =  materials[oldMaterial.name].clone();
      m.originalColor = m.color.clone();
      m.targetColor = m.color.clone();
      return m;
    }
    console.log('MATERIAL NOT FOUND', oldMaterial);
    return new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: 0xffff00,
    });
  }

  class funksolo extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cameraAngleSpeed = 0;
      this.cameraAngle = 0;
      this.cameraRadius = 60;

      this.leftWheelAcceleration = 0;
      this.rightWheelAcceleration = 0;
      this.leftWheelSpeed = 0;
      this.rightWheelSpeed = 0;

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(1000, 41, 41),
        new THREE.MeshStandardMaterial({color: 0, metalness:0, roughness: 1, side: THREE.BackSide}));

      this.scene.add(this.cube);

      const canvas = document.createElement('canvas');
      this.canvas = canvas;
      this.canvas.width = 16;
      this.canvas.height = 16;
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.ctx = canvas.getContext('2d');
      this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(60 * 50, 0.1, 30 * 50),
        new THREE.MeshStandardMaterial({
          metalness: 0,
          color: 0x111111,
          roughnessMap: Loader.loadTexture('res/Tiles38_rgh.jpg'),
          map: Loader.loadTexture('res/Tiles38_col.jpg'),
          aoMap: Loader.loadTexture('res/Tiles38_AO.jpg'),
          normalMap: Loader.loadTexture('res/Tiles38_nrm.jpg'),
          emissiveMap: new THREE.CanvasTexture(canvas),
          emissiveIntensity: 0,
          emissive: 0xffffff,
          side: THREE.DoubleSide,
        }));
      this.floor.material.map.wrapS = this.floor.material.map.wrapT = THREE.RepeatWrapping;
      this.floor.material.aoMap.wrapS = this.floor.material.map.wrapT = THREE.RepeatWrapping;
      this.floor.material.normalMap.wrapS = this.floor.material.normalMap.wrapT = THREE.RepeatWrapping;
      this.floor.material.roughnessMap.wrapS = this.floor.material.roughnessMap.wrapT = THREE.RepeatWrapping;
      this.floor.material.emissiveMap.wrapS = this.floor.material.emissiveMap.wrapT = THREE.RepeatWrapping;
      const scaler = 32;
      const mapX = 8 *scaler; const mapY = 8 * scaler;
      this.floor.material.map.repeat.set(mapX, mapY);
      this.floor.material.aoMap.repeat.set(mapX, mapY);
      this.floor.material.normalMap.repeat.set(mapX, mapY);
      this.floor.material.roughnessMap.repeat.set(mapX, mapY);
      this.floor.material.emissiveMap.repeat.set(mapX, mapY);
      this.floor.position.z = -5;
      this.floor.rotation.y = Math.PI / 4;
      this.scene.add(this.floor);

      const stage = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 16),
        new THREE.MeshStandardMaterial({color: 0, metalness: 0, roughness: 0.02}));
      stage.rotation.y = Math.PI / 4;
      this.scene.add(stage);

      this.cube.material = this.floor.material.clone();
      this.cube.material.side = THREE.BackSide;

      var light = new THREE.PointLight(0xffffff, 0.25)
      light.position.set(-60, 35, 100);

      this.camera.position.z = 100;

      THREE.RectAreaLightUniformsLib.init();

      const discolight1 = new THREE.RectAreaLight(COLOR1, 1, 6, 6);
      discolight1.position.set(-15, 7, -20);
      const discolight2 = new THREE.RectAreaLight(COLOR2, 1, 14, 14);
      discolight2.position.set(0, 0, -20);
      const discolight3 = new THREE.RectAreaLight(COLOR1, 1, 6, 6);
      discolight3.position.set(15, 7, -20);
      this.discolight1 = discolight1;
      this.discolight2 = discolight2;
      this.discolight3 = discolight3;
      this.discolight1.lookAt(new THREE.Vector3(-15, 7, 0));
      this.discolight2.lookAt(new THREE.Vector3(0, 7, 0));
      this.discolight3.lookAt(new THREE.Vector3(15, 7, 0));
      this.discolight1.rotation.z = Math.PI / 4;
      this.discolight2.rotation.z = Math.PI / 4;
      this.discolight3.rotation.z = Math.PI / 4;

      this.lightThrob1 = 0;
      this.lightThrob2 = 0;
      this.lightThrob3 = 0;

      this.discobulb1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(6, 6 ,0.1), new THREE.MeshBasicMaterial({
        color: COLOR1,
      }));
      this.discobulb2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(14, 14 ,0.1), new THREE.MeshBasicMaterial({
        color: COLOR2,
      }));
      this.discobulb3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(6, 6 ,0.1), new THREE.MeshBasicMaterial({
        color: COLOR1,
      }));

      this.discobulb1.rotation.z = Math.PI / 4;
      this.discobulb2.rotation.z = Math.PI / 4;
      this.discobulb3.rotation.z = Math.PI / 4;

      this.discobulb1.position.copy(discolight1.position);
      this.discobulb2.position.copy(discolight2.position);
      this.discobulb3.position.copy(discolight3.position);

      this.scene.add(new THREE.AmbientLight(0.2));


      this.scene.add(discolight1);
      this.scene.add(discolight2);
      this.scene.add(discolight3);
      this.scene.add(this.discobulb1);
      this.scene.add(this.discobulb2);
      this.scene.add(this.discobulb3);


      const loader = new THREE.ColladaLoader();
      Loader.loadAjax('res/piano.dae', text => {
        const model = loader.parse(text).scene;
        const scale = 0.02;
        model.scale.set(scale, scale, scale);
        model.position.z = 6;
        model.position.x = -4;
        model.traverse(item => {
          if(item.material) {
            if(item.material instanceof Array && item.material.length > 0) {
              for(let i = 0; i < item.material.length; i++) {
                item.material[i] = replaceMaterial(item.material[i]);
              }
            } else {
              item.material = replaceMaterial(item.material);
            }
          }
        });
        this.scene.add(model);
      });
      Loader.loadAjax('res/robot.dae', text => {
        const model = loader.parse(text).scene;
        console.log(model);
        const scale = 0.02;
        model.scale.set(scale, scale, scale);
        model.position.z = 0;
        model.position.x = -2.5;
        model.traverse(item => {
          if(item.material) {
            if(item.material instanceof Array && item.material.length > 0) {
              for(let i = 0; i < item.material.length; i++) {
                item.material[i] = replaceMaterial(item.material[i]);
              }
            } else {
              item.material = replaceMaterial(item.material);
            }
          }
        });
        this.scene.add(model);
      });

      this.camera.position.z = 60;
      this.camera.position.y = 35;
      this.camera.lookAt(new THREE.Vector3(0, 8, 0));
      this.camera.fov = 18;
      this.camera.near = 1;
      this.camera.far = 400;
      this.camera.updateProjectionMatrix();
    }

    update(frame) {
      super.update(frame);


      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle= 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalAlpha = 0.;
      if(BEAT & BEAN % 4 == 0) {
      this.ctx.fillStyle= '#66ff66';
      this.ctx.fillRect(
        4 * (Math.random() * 4 | 0), 4 * (Math.random() * 4 | 0),
        4, 4);
      this.ctx.fillStyle= '#ffff66';
      this.ctx.fillRect(
        4 * (Math.random() * 4 | 0), 4 * (Math.random() * 4 | 0),
        4, 4);
      }
      this.canvasTexture.needsUpdate = true;
      this.floor.material.needsUpdate = true;

      this.lightThrob1 *= 0.95;
      this.lightThrob2 *= 0.95;
      this.lightThrob3 *= 0.95;

      if(BEAT && BEAN % 4 == 0) {
        this.lightThrob1 = Math.random() < 1 / 2;
        this.lightThrob3 = Math.random() < 1 / 2;
      }
      if(BEAT && BEAN % 8 == 4) {
        this.lightThrob2 = 1;

        //this.cameraAngle = (Math.random() - 0.5) * Math.PI  / 2 + Math.PI / 4;
        //this.cameraAngle = Math.random () * Math.PI * 2;
        //this.cameraRadius = 40 + Math.random() * 50;
        //this.cameraAngleSpeed = (0.01 + (Math.random() - 0.5) * 0.1) * 0.1;
      }

      this.camera.position.x = this.cameraRadius * Math.sin(this.cameraAngle);
      this.camera.position.z = this.cameraRadius * Math.cos(this.cameraAngle);
      this.cameraAngle += this.cameraAngleSpeed;
      this.camera.lookAt(new THREE.Vector3(0, 8, 0));

      this.discolight1.intensity = this.lightThrob1 * 50;
      this.discolight2.intensity = this.lightThrob2 * 50;
      this.discolight3.intensity = this.lightThrob3 * 50;

      const intensity = 5;
      const baseColor = 0.1;
      const color1R = (COLOR1 >> 16) & 0xff;
      const color1G = (COLOR1 >> 8) & 0xff;
      const color1B = (COLOR1) & 0xFF;
      const color2R = (COLOR2 >> 16) & 0xff;
      const color2G = (COLOR2 >> 8) & 0xff;
      const color2B = (COLOR2) & 0xFF;
      this.discobulb1.material.color.setRGB(
        color1R/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob1),
        color1G/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob1),
        color1B/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob1));
      this.discobulb2.material.color.setRGB(
        color2R/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob2),
        color2G/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob2),
        color2B/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob2));
      this.discobulb3.material.color.setRGB(
        color1R/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob3),
        color1G/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob3),
        color1B/0xff * (baseColor + (1-baseColor) * intensity * this.lightThrob3));
    }
  }

  global.funksolo = funksolo;
})(this);
