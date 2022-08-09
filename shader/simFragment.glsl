//basic simulation: displays the particles in place.
uniform sampler2D refTex;
varying vec2 vUv;
void main() {

    vec3 pos = texture2D( refTex, vUv ).rgb;
    gl_FragColor = vec4( pos,1.0 );
}