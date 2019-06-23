uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D layer0;

varying vec2 vUv;

void main() {
    if (vUv.y > 0.5)
    {
        gl_FragColor = vec4(vUv, 0.5 + 0.5 * sin(frame / 60.0), 1.0);
    } else {
        gl_FragColor = texture2D(layer0, vUv);
    }

}
