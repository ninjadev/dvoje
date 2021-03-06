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
      for (const filename of ['res/robot.mp4', 'res/heli.mp4', 'res/Trebuchet.mp4', 'res/bat2.mp4', 'res/car.mp4']) {
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

      this.brickImage = document.createElement('img');
      Loader.load('res/brick_frame.png', this.brickImage);
      this.brickLongImage = document.createElement('img');
      Loader.load('res/brick_frame_long.png', this.brickLongImage);

      this.inventoryBox = document.createElement('canvas');
      this.inventoryBox.width = this.canvas.width;
      this.inventoryBox.height = this.canvas.height;
      this.inventoryBoxCtx = this.inventoryBox.getContext('2d');
      this.drawInventoryBox(this.inventoryBoxCtx, 0, 0, this.inventoryBox.width, this.inventoryBox.height);

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
      ctx.fillStyle = 'rgb(202, 221, 230)';
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

      this.renderPartsInventoryBox();

      this.renderStepNumberVerticalLineAndBox(100, 250);

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

      let legoGlitch = 0;
      if (BEAN < 256) {
        let value = smoothstep(0, 1, F(frame, 64, 16));
        value = smoothstep(value, 0, F(frame, 64 + 48, 16));
        value = smoothstep(value, 1, F(frame, 128 + 32, 16));
        value = smoothstep(value, 0, F(frame, 128 + 48 + 64, 16));
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = value;
        ctx.translate(1920 / 2, 1080 / 2);
        const scaler = 1 + F(frame, 64, 256);
        ctx.scale(scaler, scaler);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.font = '80px SchmelviticoThin';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = BEAN < 128 ? 'N  I  N  J  A  D  E  V' : 'C  O  N  S  T  R  U  C  T';
        ctx.fillText(text, 0, 0);
        ctx.restore();



        const fadeInDoneBean = 40;
        if (BEAN < fadeInDoneBean){
          this.ctx.fillStyle = 'rgba(0,0,0,' + smoothstep(0, 1, (1 - F(frame, 0, fadeInDoneBean))) + ')';
          this.ctx.fillRect(0,0,1920,1080);
        }
      }

      // glitch controls
      if ( (BEAN > 98 && BEAN < 253) || (BEAN > 706 && BEAN < 768) || BEAN > 1161){

        const ctx = this.ctx;

        switch (BEAN){
          case 99:
          case 130:
          case 146:
          case 160:
          case 169:
          case 178:
          case 189:
          case 200:
          case 208:
          case 212:
          case 219:
          case 222:
          case 225:
          case 228:
          case 232:
          case 236:
          case 238:
          case 242:
          case 244:
          case 245:
          case 248:
          case 250:
          case 253:
            legoGlitch = 1;
          }

        // snare drum
        if (BEAN % 8 == 4 && BEAN > 706 && BEAN < 752){
            legoGlitch = 1;
        }

        // craaaaaaazy!
        if (BEAN > 751 && BEAN < 768){
            legoGlitch = Math.random() * 16;
        }

        //outro 
        switch (BEAN) {
          case 1162:
          case 1167:
          case 1173:
          case 1216:
          case 1220:
          case 1222:
          case 1227:
          case 1229:
          case 1231:
          case 1234:
          case 1236:
          case 1240:
          case 1241:
          case 1244:
          case 1248:
          case 1249:
          case 1251:
          case 1253:
          case 1254:
          case 1256:
          case 1258:
            legoGlitch = 1;
        }
        ctx.save();
        ctx.globalAlpha = 0.5 * legoGlitch;
        ctx.drawImage(this.brickImage, Math.random()*1920, Math.random()*1080);
        ctx.drawImage(this.brickLongImage, Math.random()*1920, Math.random()*1080);
        ctx.restore();

      }
      this.uniforms.legoGlitch.value = legoGlitch;


      const fadeOutBean = 1250;
      if (BEAN > fadeOutBean){
        this.ctx.fillStyle = 'rgba(0,0,0,' + F(frame, 1250, 10) + ')';
        this.ctx.fillRect(0,0,1920,1080);
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
      this.ctx.save()

      let inventoryPosition = "top-right";

      if (BEAN >= 256 && BEAN < 368) { //car
        if(BEAN >= 296 && BEAN < 304) {
          inventoryPosition = "bottom-left";
        }
      } else if (BEAN >= 384 && BEAN < 496) { // heli
        if(BEAN >= 384 && BEAN < 392) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 392 && BEAN < 400) {
          inventoryPosition = "top-left";
        } else if(BEAN >= 408 && BEAN < 416) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 416 && BEAN < 424) {
          inventoryPosition = "top-left";
        } else if(BEAN >= 424 && BEAN < 440) {
          inventoryPosition = "bottom-right";
        }
      } else if (BEAN >= 512 && BEAN < 624) { // robot
        if(BEAN >= 512 && BEAN < 528) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 528 && BEAN < 536) {
          inventoryPosition = "top-left";
        } else if(BEAN >= 536 && BEAN < 552) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 576 && BEAN < 592) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 592 && BEAN < 600) {
          inventoryPosition = "top-left";
        } else if(BEAN >= 600 && BEAN < 608) {
          inventoryPosition = "bottom-right";
        }
      } else if (BEAN >= 896 && BEAN < 1008) { // treb
        if(BEAN >= 896 && BEAN < 920) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 920 && BEAN < 928) {
          inventoryPosition = "bottom-right";
        } else if(BEAN >= 928 && BEAN < 952) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 960 && BEAN < 976) {
          inventoryPosition = "bottom-left";
        }
      } else if (BEAN >= 1024 && BEAN < 1136) { // bat
        if(BEAN >= 1024 && BEAN < 1032) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 1032 && BEAN < 1040) {
          inventoryPosition = "top-right";
        } else if(BEAN >= 1040 && BEAN < 1064) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 1088 && BEAN < 1112) {
          inventoryPosition = "bottom-left";
        } else if(BEAN >= 1112 && BEAN < 1120) {
          inventoryPosition = "bottom-left";
        }
      } else {
        // Never show for other scenes
        return;
      }

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
              count: 1,
              sortField: material.name + "_" + part.geometry.name,
              key: key
            }
          }
        }

        var pos = inventoryPosition.split("-");

        var parts = Object.values(mapParts);
        if (parts.length > 0) {

          parts = parts.sort(function(a, b) {
            if ( a.sortField < b.sortField ){
              return -1;
            }
            if ( a.sortField > b.sortField ){
              return 1;
            }
            return 0;
          });

          var startOffsetX = 10;

          if (pos[0] == "top" && pos[1] == "left") {
            startOffsetX = this.stepNumber > 9 ? 400 : 300;
          }
          var startOffsetY = 80;

          var offsetX = 0;
          var offsetY = 0;
          let maxHeight = 0;
          let imagesToBeDrawn = [];
          let invW = 0, invH = 300;

          for(var part of parts) {
            let file = this.inventoryImages["res/bricks/" + part.key];
            let ratio = file.width / file.height;
            let scaleY = file.height / 850;
            let scaleX = file.width * scaleY;
            let height = 200 * scaleY;
            maxHeight = Math.max(height, maxHeight);
            let width = height * ratio;

            let imgX = startOffsetX - 20 + offsetX;

            offsetX += width + 10;

            imagesToBeDrawn.push({
              img: file.img,
              x: imgX, 
              y: startOffsetY + offsetY,
              w: width,
              h: height,
              count: part.count
            })
            invW = Math.max(invW, offsetX);
            invH = offsetY + maxHeight;
          }

          let fullWidth = invW + 50;
          let fullHeight = invH + 55;

          let invX = startOffsetX-40;
          let invY = startOffsetY-20;
          if(pos[0] == "top") {
            if(pos[1] == "right") {
              invX = this.canvas.width-fullWidth-50;
            }
          } else {
            invX = 130;
            invY = this.canvas.height-fullHeight-startOffsetY-30;

            if(pos[1] == "right") {
              invX = this.canvas.width-fullWidth-30;
            }
          }
          this.ctx.drawImage(this.inventoryBox, 0, 0, fullWidth, fullHeight, invX, invY, fullWidth, fullHeight);

          this.ctx.lineWidth = 8;
          this.ctx.strokeStyle = 'rgba(47, 58, 58)';

          this.ctx.strokeRect(invX, invY, fullWidth, fullHeight);


          invX = 10;
          invY = startOffsetY;
          if(pos[0] == "top") {
            if(pos[1] == "right") {
              invX = this.canvas.width - fullWidth;
            }
          } else {
            invX = 175;
            invY = this.canvas.height-fullHeight-startOffsetY-10;

            if(pos[1] == "right") {
              invX = this.canvas.width - fullWidth + 20;
            }
          }


          for(var file of imagesToBeDrawn) {
            let heightDiff = maxHeight - file.h;
            this.ctx.drawImage(file.img, invX + file.x, invY + (heightDiff/2), file.w, file.h);

            this.ctx.fillStyle = '#000';
            this.ctx.font = '32px SchmelviticoLight';
            this.ctx.fillText(file.count + " x ", invX + file.x - 20, invY + maxHeight + 20);
          }
        }
      }
      this.ctx.restore();
    }
    
    renderStepNumberVerticalLineAndBox(x, y) {

      this.stepNumber = 0

      if (BEAN >= 256 && BEAN < 336) { //car
        this.stepNumber = ((BEAN - 256) / 8 | 0) + 1;
      } else if (BEAN >= 384 && BEAN < 486) { // heli
        this.stepNumber = ((BEAN - 384) / 8 | 0) + 1;
      } else if (BEAN >= 512 && BEAN < 616) { // robot
        this.stepNumber = ((BEAN - 512) / 8 | 0) + 1;
      } else if (BEAN >= 896 && BEAN < 984) { // treb
        this.stepNumber = ((BEAN - 896) / 8 | 0) + 1;
      } else if (BEAN >= 1024 && BEAN < 1120) { // bat
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

    warmup(renderer) {
      this.update(2236);
      this.render(renderer);
    }
  }

  global.postfxNode = postfxNode;
})(this);
