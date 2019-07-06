(function(global) {
  class buildLogo extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          out: new NIN.Output()
        }
      });
      const loader = new THREE.ColladaLoader();
      Loader.loadAjax('res/build_logo.dae', text => {
        const parsed = loader.parse(text);
        console.log(parsed)

        this.outputs.out.value = parsed.scene;
      });
    }

    render() {
      // this.outputs.out.setValue(1);
    }
  }

  global.buildLogo = buildLogo;
})(this);
