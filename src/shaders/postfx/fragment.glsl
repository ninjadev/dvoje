uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D paperTexture;

varying vec2 vUv;

void main() {
  vec3 originalColor = texture2D(tDiffuse, vUv).rgb;
  vec3 paperColor = texture2D(paperTexture, vUv  * vec2(16. / 9., 1.) * 6.).rgb;

  vec3 color = originalColor * mix(1., pow((paperColor.r + paperColor.g + paperColor.b) / 3., 2.), 0.3333);

  gl_FragColor = vec4(color, 1.);
}
