(function(global) {
  const F = (frame, from, delta) => (
    frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from)
  );

  class greetsBackgroundCanvas extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.random = new Random('greetsbg');

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.width = 1024;
      this.height = 1024;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      // first point of scene: frame: 6710, bean: 768
      // last point of scene: frame: 7827, bean: 895
      // duration: 1117 frames, 127 beans
      super.update(frame);
      if(BEAN % 8 === 0){
        this.ctx.save();

        // Use random color for drawing:
        var randomColor = `#${Math.floor(this.random() * 0x1000000).toString(16).padStart(6, '0')}`;
        this.ctx.fillStyle = randomColor;

        // Main shape:
        this.ctx.beginPath();
        // Random x/y centerpoint that is within scene:
        var x = Math.floor(this.random() * 1024);
        var y = Math.floor(this.random() * 1024);
        // Random size of circle, but within reasonable bounds:
        var maxCircleRadius = this.canvas.width / 7;
        var minCircleRadius = this.canvas.width / 25;
        var radius = Math.floor(this.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius);
        // Draw circle based on config above
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Extras
        // Neck part
        var neckXscaling = 0.6;
        var neckX = x - radius * neckXscaling;
        var neckY = y + radius * 0.80;
        var neckWidth = 2 * radius * neckXscaling;
        var neckHeight = radius * 0.30;
        this.ctx.fillRect(
          neckX,
          neckY,
          neckWidth,
          neckHeight,
        );

        // Top head part
        var topHeadBumpXScale = 0.4;
        var topHeadBumpX = x - radius * topHeadBumpXScale;
        var topHeadBumpY = y - radius * 1.2;
        var topHeadBumpWidth = 2 * radius * topHeadBumpXScale;
        var topHeadBumpHeight = radius * 0.4;
        this.ctx.fillRect(
          topHeadBumpX,
          topHeadBumpY,
          topHeadBumpWidth,
          topHeadBumpHeight,
        );

        // Mouth
        // Mouth lower part
        this.ctx.fillStyle = '#000000';
        var motuhOuterRadius = radius * 0.70;
        this.ctx.beginPath();
        this.ctx.arc(x, y, motuhOuterRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Mouth upper part
        var mouthInnerRadius = motuhOuterRadius * 1.1;
        var mountInnerYOffset = radius - motuhOuterRadius;
        var mouthInnerY = y - mountInnerYOffset;
        this.ctx.fillStyle = randomColor;
        this.ctx.beginPath();
        this.ctx.arc(x, mouthInnerY, mouthInnerRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Eyes
        this.ctx.fillStyle = '#000000';
        var eyeRadius = radius * 0.2;
        var eyeXoffset = radius * 0.4;
        var eyeYoffset = radius * 0.30;

        // Draw left eye
        this.ctx.beginPath();
        var leftEyeX = x - eyeXoffset;
        var leftEyeY = y - eyeYoffset;
        this.ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw right eye
        this.ctx.beginPath();
        var rightEyeX = x + eyeXoffset;
        var rightEyeY = y - eyeYoffset;
        this.ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }

      // Draw names!
      // the 8 names: {Darklite, Desire, Dekadence, Ephidrena, Mr doob, Still, Solskogen crew, You}
      // Have 139.625 frames for each, starting at frame 6710
      this.ctx.save();

      // Always clear text background:
      this.ctx.fillStyle = '#000000';
      var textBackgroundX = 0;
      var textBackgroundY = 450;
      var textBackgroundWidth = 640;
      var textBackgroundHeight = 128;
      this.ctx.fillRect(
        textBackgroundX,
        textBackgroundY,
        textBackgroundWidth,
        textBackgroundHeight,
      );

      var firstFrameNumber = 6710;
      var nameDisplayIntervalFrames = 139;
      var currentName = '';
      if(frame < firstFrameNumber + nameDisplayIntervalFrames){
        currentName = 'Darklite';
      }
      else if (frame < firstFrameNumber + 2 * nameDisplayIntervalFrames){
        currentName = 'Desire';
      }
      else if (frame < firstFrameNumber + 3 * nameDisplayIntervalFrames){
        currentName = 'Dekadence';
      }
      else if (frame < firstFrameNumber + 4 * nameDisplayIntervalFrames){
        currentName = 'Ephidrena';
      }
      else if (frame < firstFrameNumber + 5 * nameDisplayIntervalFrames){
        currentName = 'Mr doob';
      }
      else if (frame < firstFrameNumber + 6 * nameDisplayIntervalFrames){
        currentName = 'Still';
      }
      else if (frame < firstFrameNumber + 7 * nameDisplayIntervalFrames){
        currentName = 'Solskogen crew';
      }
      else if (frame < firstFrameNumber + 8 * nameDisplayIntervalFrames){
        currentName = 'You';
      }
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold ' + (60) + 'pt oldfont';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(currentName, 1024/4, 1024/2);
      this.ctx.restore();
    }

    warmup(renderer) {
      this.update(6710);
      this.render(renderer);
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.greetsBackgroundCanvas = greetsBackgroundCanvas;
})(this);
