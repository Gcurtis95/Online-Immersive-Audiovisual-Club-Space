varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform float uFrequency;
uniform sampler2D uTexture;
#include ../includes/ColorMap.glsl
#include ../includes/fMB2.glsl
// pattern fucntion from https://iquilezles.org/articles/warp/
float pattern(in vec2 p) {
    return fract(fbm(p + fbm(p + fbm(p + fbm(p + noise(p))))));
}

void main() {
    vec2 uv = -1.0 + 2.0 * vUv;

    vec2 newuv = vUv;
     // loading a texture jpeg into the shader and animating it with the pattern with time
    vec4 textureColor = texture2D(uTexture, newuv * 0.3 * pattern(newuv * 100. / 1500.0 * uTime));
    // mixing the texture with the pattern and color map
    float mixFactor2 = 0.6;
    vec4 mix1 = vec4(colormap(pattern(uv)).rgb, pattern(uv) + 1.0);
    vec4 mixed = mix(textureColor, mix1, mixFactor2);

    gl_FragColor = mixed;

}