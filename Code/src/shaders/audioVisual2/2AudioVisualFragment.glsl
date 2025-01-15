varying vec2 vUv;
uniform float uTime;
uniform float uFrequency;
uniform sampler2D uTexture;
#include ../includes/Simplex3DNoise.glsl
#include ../includes/FBM1.glsl

void main() {
    // using the uv coordinates, amount of time passed and a fractal brownian motion algorithm
    // to animate the shader
    vec2 uv = -1.0 + 2.0 * vUv;
    float noise = 0.25 + fbm(vec3(uv * 12.0 + (10.0 - vUv.xy) * 0.05, uTime * 0.18 + 0.5));
    noise *= 0.25 + snoise(vec3(uv * 4.0 + 1.5 + uFrequency, uTime * 0.15));
    // using the uv coordinates and a sin wave to create a wave effect
    for(float i = 1.0; i < 8.0; i++) {
        uv.y += i * 0.1 / i *
            sin(uv.x * i * i + uTime * 0.5) * sin(uv.y * i * i + uTime * 0.5);
    }
    // using the uv coordinates and the noise to create a color
    vec3 col;
    col.r = uv.y + noise + 0.4 + uFrequency / 150.;
    col.g = uv.y + noise + 0.3;
    col.b = uv.y + noise + 0.95;
    // clamping the noise to a value between 0 and 1
    noise = clamp(noise, 0.0, 1.0);

    vec2 newuv = vUv;
    // loading a texture jpeg into the shader and animating it with the fractal brownian motion algorithm with time
    vec4 textureColor = texture2D(uTexture, newuv + fbm(vec3(vUv, uTime)) * 0.05);
    // mixing the color and the texture together
    float mixFactor2 = 0.6;
    vec4 mix1 = vec4(col, noise + 2.);
    vec4 mixed = mix(textureColor, mix1, mixFactor2);

    gl_FragColor = mixed;
}