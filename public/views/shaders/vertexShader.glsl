varying vec2 vertexUV;
varying vec3 vertexNormal;
// varying vec3 vertexNormal;

void main() {
    vertexUV = uv;
    vertexNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // vertexUV = uv;
    // vertexNormal = normalize(normalMatrix * normal);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 2.0 );
}