varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
 
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
     float glitchStrength = sin(uTime);
     modelPosition.x += (random2D(modelPosition.xz + (uTime)) - 0.5) * glitchStrength * 20.0;
     modelPosition.y += (random2D(modelPosition.xz + (uTime)) - 0.5) * glitchStrength;
     modelPosition.z += (random2D(modelPosition.xz + (uTime * 0.001)) - 0.5) * 2.0; 


    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

        // // Mode nornal 

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}
