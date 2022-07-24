
varying vec2 vUv;


attribute vec3 aCoordinates;
varying vec2 vCoordinates;

uniform float time;
uniform float move;

attribute float aSpeed;
attribute float aOffset;

uniform sampler2D texture;

void main() {
  vUv = uv;

  vec3 pos = position;
  // pos.z = position.z + move*aSpeed + aOffset;

  // vec4 mvPosition = modelViewMatrix * vec4(position,1.);
  vec4 mvPosition = modelViewMatrix * vec4(pos,1.);
  // gl_PointSize = 200. * (1.0 /  ( - mvPosition.z) );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  vCoordinates = aCoordinates.xy;
}
