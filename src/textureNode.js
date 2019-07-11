(function(global) {
  class textureNode extends NIN.Node {
    constructor(id, options) {
      options.outputs = {
        out: new NIN.Output(),
      };
      super(id, options);
      this.texture = Loader.loadTexture(options.path);
      this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
      this.texture.magFilter = this.texture.minFilter = THREE.LinearFilter;
    }

    render() {
      this.outputs.out.setValue(this.texture);
    }
  }

  global.textureNode = textureNode;
})(this);
