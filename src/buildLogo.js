(function(global) {
  class buildLogo extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          out: new NIN.Output()
        }
      });
      const loader = new THREE.ColladaLoader();
    }

    render() {
      // this.outputs.out.setValue(1);
    }
  }

  global.buildLogo = buildLogo;
})(this);
