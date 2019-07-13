(function (global) {
  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));
  class postfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        paperTexture: new NIN.TextureInput(),
        partsOnCurrentPage: new NIN.Input(),
      };
      super(id, options);

      this.stepNumber = 0;
      this.videos = {};
      for (const filename of ['res/output-robot.mp4', 'res/heli.mp4', 'res/Trebuchet.mp4', 'res/bat2.mp4', 'res/car.mp4']) {
        const video = document.createElement('video');
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        Loader.load(filename, video, () => {
          video.play();
        });
        this.videos[filename] = {
          video,
          videoTexture,
        }
      }

      this.equalizerThrob = 0;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;

      this.inventoryBox = document.createElement('canvas');
      this.inventoryBox.width = this.canvas.width / 2;
      this.inventoryBox.height = 300;
      this.inventoryBoxCtx = this.inventoryBox.getContext('2d');
      this.drawInventoryBox(this.inventoryBoxCtx, 0, 0, this.inventoryBox.width, this.inventoryBox.height);

      /*
      this.inventoryBoxCrop = document.createElement('canvas');
      this.inventoryBoxCrop.width = 600;
      this.inventoryBoxCrop.height = 600;
      */

      this.detailedBox = document.createElement('canvas');
      this.detailedBox.width = 500;
      this.detailedBox.height = 400;
      this.drawDetailsBox(this.detailedBox.getContext('2d'), 0, 0, 500, 400);

      this.loadInventoryImages()
    }

    drawDetailsBox(ctx, x, y, w, h) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#faecbf';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 8;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      const stepSize = 16;
      ctx.lineWidth = 3;
      for (let i = 0; i < w / stepSize; i++) {
        ctx.moveTo(i * stepSize, 0);
        const remainingWidth = w - i * stepSize;
        let distance = Math.min(remainingWidth, h);
        ctx.lineTo(i * stepSize + distance, distance);
      }
      for (let i = 0; i < h / stepSize; i++) {
        ctx.moveTo(0, i * stepSize);
        const remainingHeight = h - i * stepSize;
        let distance = Math.min(remainingHeight, w);
        ctx.lineTo(distance, i * stepSize + distance);
      }
      ctx.stroke();
      ctx.restore();
    }


    drawInventoryBox(ctx, x, y, w, h) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(171, 199, 211)';
      const stepSize = 16;

      ctx.lineWidth = 6;
      for (let i = 0; i < w / stepSize; i = i + 10) {
        ctx.moveTo(i * stepSize, 0);
        ctx.lineTo(i * stepSize, h);
      }
      for (let i = 0; i < h / stepSize; i = i + 5) {
        ctx.moveTo(0, i * stepSize);
        ctx.lineTo(w, i * stepSize);
      }
      ctx.stroke();

      ctx.lineWidth = 3;
      for (let i = 0; i < w / stepSize; i++) {
        ctx.moveTo(i * stepSize, 0);
        ctx.lineTo(i * stepSize, h);
      }
      for (let i = 0; i < h / stepSize; i++) {
        ctx.moveTo(0, i * stepSize);
        ctx.lineTo(w, i * stepSize);
      }
      ctx.stroke();

      ctx.restore();
    }

    update(frame) {
      this.equalizerThrob *= 0.95;
      if (BEAT && BEAN % 4 == 0) {
        this.equalizerThrob = 1;
      }
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.inputs.paperTexture.getValue();
      this.uniforms.overlayTexture.value = this.canvasTexture;
      let currentVideo;

      let currentText = '';
      if (BEAN < 384) {
        currentVideo = this.videos['res/car.mp4'];
        currentText = 'CAR';
      } else if (BEAN < 512) {
        currentVideo = this.videos['res/heli.mp4'];
        currentText = 'HELICOPTER';
      } else if (BEAN < 640) {
        currentVideo = this.videos['res/robot.mp4'];
        currentText = 'ROBOT';
      } else if (BEAN < 896) {
        /* do nothing */
      } else if (BEAN < 1024) {
        currentVideo = this.videos['res/Trebuchet.mp4'];
        currentText = 'TREBUCHET';
      } else if (BEAN < 1152) {
        currentVideo = this.videos['res/bat2.mp4'];
        currentText = 'BATMOBILE';
      }
      this.ctx.fillStyle = 'white';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = 'bold 200px SchmelviticoBold';

      var {invX, invY} = this.renderPartsInventoryBox();

      this.renderStepNumberVerticalLineAndBox(invX, invY);

      if (currentText) {
        this.ctx.save();
        this.ctx.fillStyle = '#444';
        const bottomHeight = easeIn(1080, 100, F(frame, 254, 2));
        this.ctx.fillRect(0, 1080 - bottomHeight, 1920, bottomHeight);
        this.ctx.globalAlpha = easeIn(0, 1, F(frame, 255, 1));
        this.ctx.font = 'bold 200px SchmelviticoBold';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 8;
        this.ctx.textAlign = 'right';
        const count = 35;
        const pageNumber = ((BEAN_FOR_FRAME(frame + 7) - 256) / 8 | 0) + 1;
        this.ctx.save();
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '24px SchmelviticoLight';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Ninjadev Multi Construction Kit 1 Instruction Manual --  P. ${pageNumber}`, 1860, 1040);

        this.ctx.textAlign = 'left';
        this.ctx.font = '24px SchmelviticoLight';
        this.ctx.fillText('MODEL', 50, 1040);

        this.ctx.font = '24px SchmelviticoBold';
        this.ctx.fillText(currentText, 140, 1040);

        this.ctx.font = 'bold 24px SchmelviticoBold';
        this.ctx.fillText('BUILD-O-METER', 450, 1040);
        this.ctx.restore();

        this.ctx.fillStyle = '#aaa';
        for (let i = 0; i < this.equalizerThrob * 8; i++) {
          this.ctx.fillRect(680 + i * 24, 1019, 16, 24);
        }
        this.ctx.restore();
      }

      if (BEAN < 256) {
        let value = smoothstep(0, 1, F(frame, 64, 16));
        value = smoothstep(value, 0, F(frame, 64 + 48, 16));
        value = smoothstep(value, 1, F(frame, 128, 16));
        value = smoothstep(value, 0, F(frame, 128 + 48, 16));
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = value;
        ctx.translate(1920 / 2, 1080 / 2);
        const scaler = 1 + F(frame, (BEAN / 64 | 0) * 64, 64) * 0.25;
        ctx.scale(scaler, scaler);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.font = '80px SchmelviticoThin';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = BEAN < 128 ? 'N  I  N  J  A  D  E  V' : 'C  O  N  S  T  R  U  C  T';
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }

      this.canvasTexture.needsUpdate = true;

      if (currentVideo) {
        this.uniforms.videoTexture.value = currentVideo.videoTexture;
      }
      this.uniforms.videoAmount.value = 0;
      this.uniforms.abberration.value = 0;
      if (BEAN >= 518) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 518, 8));
      }
      if (BEAN >= 534) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 534, 8));
      }
      if (BEAN >= 550) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 550, 8));
      }
      if (BEAN >= 566) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 566, 8));
      }
      if (BEAN >= 640) {
        this.uniforms.abberration.value =
          smoothstep(this.uniforms.abberration.value, 1, F(frame, 638, 4));
        this.uniforms.abberration.value =
          easeOut(this.uniforms.abberration.value, 0, F(frame, 644, 2));

        this.uniforms.abberration.value =
          smoothstep(this.uniforms.abberration.value, 1, F(frame, 702, 4));
        this.uniforms.abberration.value =
          easeOut(this.uniforms.abberration.value, 0, F(frame, 708, 2));
      }
      if (BEAN >= 512 + 518) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 512 + 518, 8));
      }
      if (BEAN >= 512 + 534) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 512 + 534, 8));
      }
      if (BEAN >= 512+ 550) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 512 + 550, 8));
      }
      if (BEAN >= 512 + 566) {
        this.uniforms.abberration.value =
          easeOut(0.5, 0, F(frame, 512 + 566, 8));
      }
      this.uniforms.abberration.value += 0.03;
      if (BEAT && BEAN === 366) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.2;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 496) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.2;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 622) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0.2;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 1006) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if (BEAT && BEAN === 1134) {
        if (currentVideo) {
          currentVideo.video.currentTime = 0;
          currentVideo.video.playbackRate = 1;
          currentVideo.video.play();
        }
      }
      if(BEAN >= 368 && BEAN < 380) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 496 && BEAN < 512) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 624 && BEAN < 636) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 1008 && BEAN < 1024) {
        this.uniforms.videoAmount.value = 1;
      }
      if (BEAN >= 1136 && BEAN < 1152) {
        this.uniforms.videoAmount.value = 1;
      }
    }

    renderPartsInventoryBox() {
      var partsOnCurrentPage = this.inputs.partsOnCurrentPage.getValue();
      if(partsOnCurrentPage) {
        var mapParts = {};

        for(var partKey of Object.keys(partsOnCurrentPage)) {
          var part = partsOnCurrentPage[partKey];
          var material = part.material;
          if (Array.isArray(material)) {
            material = part.material[0];
          }
          var key = part.geometry.name + "_" + material.name + "-removebg-preview.png";
          if (mapParts[key]) {
            mapParts[key].count += 1;
          } else {
            mapParts[key] = {
              count: 1
            }
          }
        }

        if (Object.keys(mapParts).length > 0) {
          var startOffsetX = this.stepNumber > 9 ? 400 : 300;
          var startOffsetY = 80;

          var offsetX = 0;
          var offsetY = 0;
          let maxHeight = 0;
          let imagesToBeDrawn = [];
          let invW = 600, invH = 300;

          for(var key of Object.keys(mapParts)) {
            let file = this.inventoryImages["res/bricks/" + key];
            let ratio = file.width / file.height;
            let scaleY = file.height / 850;
            let scaleX = file.width * scaleY;
            let height = 200 * scaleY;
            maxHeight = Math.max(height, maxHeight);
            let width = height * ratio;

            let imgX = startOffsetX - 20 + offsetX;

            /*
            if (imgX + width > (1920/2)) {
              offsetY += maxHeight + 10;
              invW = offsetX;
              offsetX = 0;
            } else 
            */{
              offsetX += width + 10;
            }

            imagesToBeDrawn.push({
              img: file.img,
              x: imgX, 
              y: startOffsetY + offsetY,
              w: width,
              h: height
            })
            invW = Math.max(invW, offsetX)
            invH = offsetY + maxHeight;
          }

          let fullWidth = invW + 20;
          let fullHeight = invH+30;

          this.ctx.drawImage(this.inventoryBox, 0, 0, fullWidth, fullHeight, startOffsetX-40, startOffsetY-20, fullWidth, fullHeight);

          this.ctx.lineWidth = 8;
          this.ctx.strokeStyle = 'rgba(47, 58, 58)';
          this.ctx.strokeRect(startOffsetX-40, startOffsetY-20, fullWidth, fullHeight);

          for(var file of imagesToBeDrawn) {
            this.ctx.drawImage(file.img, file.x, file.y, file.w, file.h);
          }
        }
      }
      return {invX: 100, invY: 250};
    }
    
    renderStepNumberVerticalLineAndBox(x, y) {

      this.stepNumber = 0

      if (BEAN >= 256 && BEAN < 368) { //car
        this.stepNumber = ((BEAN - 256) / 8 | 0) + 1;
      } else if (BEAN >= 384 && BEAN < 496) { // heli
        this.stepNumber = ((BEAN - 384) / 8 | 0) + 1;
      } else if (BEAN >= 512 && BEAN < 624) { // robot
        this.stepNumber = ((BEAN - 512) / 8 | 0) + 1;
      } else if (BEAN >= 896 && BEAN < 1008) { // treb
        this.stepNumber = ((BEAN - 896) / 8 | 0) + 1;
      } else if (BEAN >= 1024 && BEAN < 1136) { // bat
        this.stepNumber = ((BEAN - 1024) / 8 | 0) + 1;
      }

      if (this.stepNumber < 1) {
        return;
      }

      this.ctx.font = 'bold 200px SchmelviticoBold';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 8;
      const count = 35;
      for (let i = 0; i < count; i++) {
        this.ctx.fillStyle = i === count - 1 ? '#e1cf69' : 'black';
        this.ctx.fillText(this.stepNumber, x - i, y - i);
      }

      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(100, 320 , 8, 1080 - 480);

      // Will move based on interesting building
      //this.ctx.drawImage(this.detailedBox, 1920-600, 400);
    }

    loadInventoryImages() {
      this.inventoryImages = {};
      var imgs = [{file:"Part-18946_dot_dat_METAL-SILVER-removebg-preview.png",width:364,height:379},{file:"Part-2714a_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:696,height:359},{file:"Part-2717_dot_dat_SOLID-DARK_AZURE-removebg-preview.png",width:463,height:540},{file:"Part-32000_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:440,height:439},{file:"Part-32000_dot_dat_SOLID-MEDIUM_ORANGE-removebg-preview.png",width:396,height:388},{file:"Part-32000_dot_dat_SOLID-WHITE-removebg-preview.png",width:395,height:387},{file:"Part-32001_dot_dat_SOLID-MEDIUM_ORANGE-removebg-preview.png",width:654,height:382},{file:"Part-32555_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:715,height:349},{file:"Part-32555_dot_dat_SOLID-MEDIUM_ORANGE-removebg-preview.png",width:717,height:348},{file:"Part-3647_dot_dat_METAL-SILVER-removebg-preview.png",width:233,height:235},{file:"Part-3648a_dot_dat_METAL-SILVER-removebg-preview.png",width:483,height:518},{file:"Part-3650c_dot_dat_METAL-SILVER-removebg-preview.png",width:482,height:518},{file:"Part-3673_dot_dat_METAL-SILVER-removebg-preview.png",width:348,height:246},{file:"Part-3700_dot_dat_SOLID-BRIGHT_GREEN-removebg-preview.png",width:401,height:389},{file:"Part-3701_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:566,height:442},{file:"Part-3702_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:627,height:399},{file:"Part-3702_dot_dat_SOLID-BRIGHT_GREEN-removebg-preview.png",width:628,height:398},{file:"Part-3708_dot_dat_SOLID-BLACK-removebg-preview.png",width:698,height:358},{file:"Part-3709b_dot_dat_SOLID-BRIGHT_GREEN-removebg-preview.png",width:628,height:398},{file:"Part-3713_dot_dat_METAL-SILVER-removebg-preview.png",width:248,height:221},{file:"Part-3737_dot_dat_SOLID-BLACK-removebg-preview.png",width:698,height:358},{file:"Part-3894_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:606,height:413},{file:"Part-3894_dot_dat_SOLID-BRIGHT_GREEN-removebg-preview.png",width:611,height:409},{file:"Part-3894_dot_dat_SOLID-MEDIUM_ORANGE-removebg-preview.png",width:606,height:413},{file:"Part-4019_dot_dat_METAL-SILVER-removebg-preview.png",width:360,height:382},{file:"Part-4143_dot_dat_METAL-SILVER-removebg-preview.png",width:265,height:291},{file:"Part-4266c02_dot_dat_METAL-SILVER-removebg-preview.png",width:492,height:508},{file:"Part-50451_dot_dat_SOLID-BLACK-removebg-preview.png",width:695,height:360},{file:"Part-64393_dot_dat_SOLID-DARK_AZURE-removebg-preview.png",width:621,height:402},{file:"Part-64681_dot_dat_SOLID-DARK_AZURE-removebg-preview.png",width:711,height:352},{file:"Part-6558_dot_dat_METAL-SILVER-removebg-preview.png",width:489,height:306},{file:"Part-6630_dot_dat_CHROME-ANTIQUE_BRASS-removebg-preview.png",width:675,height:370}];
      for (const file of imgs) {
        const img = document.createElement('img');
        let filename = "res/bricks/" + file.file;
        Loader.load(filename, img);
        this.inventoryImages[filename] = {
          img: img,
          height: file.height,
          width: file.width
        }
      }
    }
  }

  global.postfxNode = postfxNode;
})(this);
