(function(global) {
  class batmobile extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          out: new NIN.Output()
        }
      });

      function replaceMaterial(oldMaterial) {
        return new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          color: oldMaterial.color,
        });
      }

      const loader = new THREE.ColladaLoader();
      Loader.loadAjax('res/lego_transformer/batmobile.dae', text => {
        const parsed = loader.parse(text);
        parsed.scene.traverse(item => {
          if(item.material) {
            if(item.material instanceof Array) {
              for(let i = 0; i < item.material.length; i++) {
                item.material[i] = replaceMaterial(item.material[i]);
              }
            } else {
              item.material = replaceMaterial(item.material);
            }
          }
        });
        this.outputs.out.value = parsed.scene;
      });
    }

    render() {
    }
  }

  global.batmobile = batmobile;
})(this);
