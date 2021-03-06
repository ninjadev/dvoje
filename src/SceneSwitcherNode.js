(function(global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          FUNK: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          OUTTRO: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });
    }

    beforeUpdate() {
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.FUNK.enabled = false;
      this.inputs.D.enabled = false;
      this.inputs.OUTTRO.enabled = false;

      let selectedScene;
      if (BEAN < 50) {
        selectedScene = this.inputs.D;
      } else if (BEAN < 253) {
        selectedScene = this.inputs.D;
      } else if (BEAN < 640) {
        selectedScene = this.inputs.A;
      } else if (BEAN < 768) {
        selectedScene = this.inputs.FUNK;
      } else if (BEAN < 896) {
        selectedScene = this.inputs.B;
      } else if (BEAN < 1152) {
        selectedScene = this.inputs.A;
      } else {
        selectedScene = this.inputs.OUTTRO;
      }

      selectedScene.enabled = true;
      this.selectedScene = selectedScene;
    }

    render() {
      this.outputs.render.setValue(this.selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
