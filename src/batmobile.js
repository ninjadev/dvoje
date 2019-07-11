(function(global) {
  const namecounter = {};
  class batmobile extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          out: new NIN.Output(),
          positions: new NIN.Output(),
        }
      });

      const materials = {
        black: new THREE.MeshBasicMaterial({
          color: 0,
          side: THREE.BackSide,
        }),
        'SOLID-BLACK': new THREE.MeshBasicMaterial({
          color: 0,
          side: THREE.BackSide,
        }),
        'SOLID-MEDIUM_ORANGE': new THREE.MeshBasicMaterial({
          color: 0xFDB200,
          side: THREE.BackSide,
        }),
        'METAL-SILVER': new THREE.MeshBasicMaterial({
          color: 0x8A928D,
          side: THREE.BackSide,
        }),
        'RUBBER-BLACK': new THREE.MeshBasicMaterial({
          color: 0x222222,
          side: THREE.BackSide,
        }),
        'CHROME-ANTIQUE_BRASS': new THREE.MeshBasicMaterial({
          color: 0x645a4c,
          side: THREE.BackSide,
        }),
        'SOLID-DARK_AZURE': new THREE.MeshBasicMaterial({
          color: 0x469bc3,
          side: THREE.BackSide,
        }),
        'SOLID-BRIGHT_GREEN': new THREE.MeshBasicMaterial({
          color: 0x009624,
          side: THREE.BackSide,
        }),
        'SOLID-WHITE': new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.BackSide,
        }),
       };
      for(let materialName in materials) {
        materials[materialName].name = materialName;
        materials[materialName].originalColor = materials[materialName].color.clone();
      }

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
          color: oldMaterial.color,
        });
      }

      this.positions = {};
      this.outputs.positions.value = this.positions;
      const loader = new THREE.ColladaLoader();
      Loader.loadAjax('res/robot_animation_data.json', text => {
        this.positions.robot = JSON.parse(text);
      });
      Loader.loadAjax('res/treb_animation_data.json', text => {
        this.positions.treb = JSON.parse(text);
      });
      Loader.loadAjax('res/heli_animation_data.json', text => {
        this.positions.heli = JSON.parse(text);
      });
      Loader.loadAjax('res/car_animation_data.json', text => {
        this.positions.car = JSON.parse(text);
      });
      Loader.loadAjax('res/constructmaterials.dae', text => {
        const parsed = loader.parse(text);
        console.log(parsed);
        parsed.scene.traverse(item => {
          if(item.name && item.name.startsWith('Inner-Node')) {
            console.log('resetting item.name!', item.name);
            //item.rotation.set(0, 0, 0);
          }
          if(!item.geometry) {
            //item.rotation.set(0, 0, 0);
          }
          if(item.geometry) {
            if(!item.geometry.boundingBox) {
              item.geometry.computeBoundingBox();
            }
            let base_name_part = item.geometry.name;
            let material_name_part = '';
            item.size = [
              (item.geometry.boundingBox.max.x - item.geometry.boundingBox.min.x) / 100,
              (item.geometry.boundingBox.max.y - item.geometry.boundingBox.min.y) / 100,
              (item.geometry.boundingBox.max.z - item.geometry.boundingBox.min.z) / 100,
            ];
            item.originalPosition = item.position.clone();
            item.originalRotation = item.rotation.clone();
            if(item.material) {
              if(item.material instanceof Array && item.material.length > 0) {
                material_name_part = item.material[0].name;
                for(let i = 0; i < item.material.length; i++) {
                  item.material[i] = replaceMaterial(item.material[i]);
                }
              } else {
                material_name_part = item.material.name;
                item.material = replaceMaterial(item.material);
              }
            }
            const base_name = base_name_part + '__' + material_name_part;
            if(!(base_name in namecounter)) {
              namecounter[base_name] = 0
            }
            namecounter[base_name]++;
            item.name = base_name + '__' + namecounter[base_name];
          }
        });
        this.outputs.out.value = parsed.scene;
        parsed.scene.materials = materials;
      });
    }

    render() {
    }
  }

  global.batmobile = batmobile;
})(this);
