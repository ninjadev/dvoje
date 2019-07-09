uniform float frame;
uniform float videoAmount;
uniform float abberration;
uniform sampler2D tDiffuse;
uniform sampler2D paperTexture;
uniform sampler2D videoTexture;
uniform sampler2D overlayTexture;

varying vec2 vUv;

#define PI 3.14159265359

float rand(float n){return fract(sin(n) * 43758.5453123);}


vec3 getColor(vec2 uv) {
  if(frame >= 5591. && frame < 6150.) {
  }
  vec3 originalColor = texture2D(tDiffuse, uv).rgb;
  vec3 paperColor = texture2D(paperTexture, uv).rgb;
  vec4 overlayColor = texture2D(overlayTexture, uv).rgba;

  vec3 color = originalColor * paperColor;

  if(frame >= 5591. && frame < 6150.) {
      float steps = 3.;
      color *= steps + 1.;
      color = floor(color);
      color /= steps;
      color *= paperColor;
      float c = (color.r + color.g + color.b) / 3.;
      color = vec3(c);
      vec2 circle = -2. + mod(uv * vec2(16. / 9., 1.) * 180., 1.) * 4.;
      return mix(color * 2., color * vec3(0.95), step(1., circle.x * circle.x + circle.y * circle.y));
  }
  return mix(color, overlayColor.rgb, overlayColor.a);
  return color;
  return vec3(1. ,0., 1.);
}

void main() {

  float eps = 0.04 * abberration;
  vec2 uv = vUv;

  if(frame < 5590.5 || frame > 7827.5) {
      float boomer = mod(frame / 60. / 60. * 103. / 2., 1.);
      float transitionDuration = 0.20;
      if(boomer > (1. - transitionDuration)) {
        uv.x = mod(uv.x + smoothstep(0., 1., (boomer - (1. - transitionDuration)) / transitionDuration), 1.);
      }
  }
  //uv.x += frame / 60. / 60. * 103.;
  uv.x = mod(uv.x, 1.);

  uv.y += abberration * 0.01 * sin(uv.x * PI * 2. + frame / 5. + abberration * 10.);
  uv.x += abberration * 0.001 * cos(uv.x * PI * 2. + frame / 5. + abberration * 10.);

  if(frame >= 5591. && frame < 6150.) {
      uv.y += (rand(frame + 3.) - 0.5) * 0.004;
      uv.x += (rand(frame + 19.) - 0.5) * 0.004;
      float stripescale = 32.;
      float stripe = floor(uv.y * stripescale) / stripescale;
      uv.x += pow(0.5 * tan(mod(rand(frame * 0.1 + stripe), 1.)), 16.) * (mod(frame, 2.) - .5) * 2.;
  }

  vec3 color = getColor(uv);
  if(abberration > 0.0001) {
  color = vec3(
      getColor(uv - vec2(eps, 0.)).r,
      color.g,
      getColor(uv + vec2(eps, 0.)).b);
  }

  if(frame >= 5591. && frame < 6150.) {
      float n = rand(vUv.x + frame + 53.) * rand(vUv.y + frame + 193.);
      color += n * 0.05;
  }

  vec3 videoColor = texture2D(videoTexture, vUv).rgb;
  color = mix(color, videoColor, videoAmount);

  /* videoflashes */
  if(frame >= 3215. - 0.5 && frame < 3319. - 0.5) {
    float amount = clamp(0., 1., 1. - smoothstep(0., 2., (frame - 3215.) / 30.));
    //color = mix(color, vec3(1.), amount);
    color += amount * 0.5;
  }
  if(frame >= 4333. - 0.5 && frame < 4438. - 0.5) {
    float amount = clamp(0., 1., 1. - smoothstep(0., 2., (frame - 4333.) / 30.));
    //color = mix(color, vec3(1.), amount);
    color += amount * 0.5;
  }

  gl_FragColor = vec4(color, 1.);
}
