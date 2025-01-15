varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
varying vec3 vNormal;

void main() {

    //Normal 

    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= -1.0;

    // Stripes

    float stripes = mod((vPosition.x - uTime * 0.2) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    //Fresnel1

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    //falloff

    float falloff = smoothstep(0.8, 0.0, fresnel);

    //Holographic

    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    //Final Color
    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}