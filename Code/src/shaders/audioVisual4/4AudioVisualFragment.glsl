varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uFrequency;
#include ../includes/Worley.glsl

void main() {
    vec3 noise = (vec3(vUv, uTime));
    vec2 newuv = vUv;
    // loading a texture jpeg into the shader and animating it with worley noise with time
    vec4 textureColor = texture2D(uTexture, newuv + 0.05 * fworley(newuv * 100. / 1500.0 * uTime) * noise.xy);
    vec2 uv = vUv;

    //Calculate an intensity of the worley noise
    float t = fworley(uv * 100. / 1500.0);
    //Add some gradient and affecting it with the average music frequency
    t *= exp(-length2(abs(0.7 * uv - 1.0))) + uFrequency / 500.;
    //Mix the texture with the worley noise
    float mixFactor2 = 0.3;
    vec4 mix1 = vec4(t * 5. * vec3(0.1, 1.1 * t, pow(t, 0.5 - t)), 100.0 + uFrequency / 100.);
    vec4 mixed = mix(textureColor, mix1, mixFactor2);

    gl_FragColor = mixed;
}
