(function(global) {

  class blurAmountController extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          original: new NIN.TextureInput(),
          blurred: new NIN.TextureInput(),
          amount: new NIN.Input(),
        },
        outputs: {
          out: new NIN.TextureOutput(),
        }
      });
    }

    render() {
      this.outputs.out.setValue(this.inputs.original.getValue());
      if (BEAN >= 518 && BEAN < 518 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 534 && BEAN < 534 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 550 && BEAN < 550 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 566 && BEAN < 566 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 640 && BEAN < 644) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      } else if(BEAN >= 704 && BEAN < 708) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 512 + 518 && BEAN < 512 + 518 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 512 + 534 && BEAN < 512 + 534 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 512 + 550 && BEAN < 512 + 550 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
      if (BEAN >= 512 + 566 && BEAN < 512 + 566 + 2) {
        this.outputs.out.setValue(this.inputs.blurred.getValue());
      }
    }
  }

  global.blurAmountController = blurAmountController;
})(this);
