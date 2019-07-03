(function(global) {
  class batmobile extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          out: new NIN.Output()
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
          color: 0xF58624,
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
          color: 0xffff00,
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
          return materials[oldMaterial.name];
        }
        console.log('MATERIAL NOT FOUND', oldMaterial.name);
        return new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          color: oldMaterial.color,
        });
      }

      const loader = new THREE.ColladaLoader();
      Loader.loadAjax('res/constructmaterials.dae', text => {
        const parsed = loader.parse(text);
        parsed.scene.traverse(item => {
          if(item.geometry) {
            if(!item.geometry.boundingBox) {
              item.geometry.computeBoundingBox();
            }
            item.size = [
              (item.geometry.boundingBox.max.x - item.geometry.boundingBox.min.x) / 100,
              (item.geometry.boundingBox.max.y - item.geometry.boundingBox.min.y) / 100,
              (item.geometry.boundingBox.max.z - item.geometry.boundingBox.min.z) / 100,
            ];
            item.originalPosition = item.position.clone();
            item.originalRotation = item.rotation.clone();
            if(item.material) {
              if(item.material instanceof Array) {
                for(let i = 0; i < item.material.length; i++) {
                  item.material[i] = replaceMaterial(item.material[i]);
                }
              } else {
                item.material = replaceMaterial(item.material);
              }
            }
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
