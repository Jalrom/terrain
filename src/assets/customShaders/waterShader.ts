export const WATER_VERTEX_SHADER =
`
    varying vec2 vUv;
    varying vec4 pos;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        pos = gl_Position;
    }
`
;

export const WATER_FRAGMENT_SHADER =
`
    uniform sampler2D tDiffuse;

    varying vec2 vUv;
    varying vec4 pos;
    varying vec3 worldPosition;

    void main() {
        vec2 screen = (pos.xy/pos.z + 1.0)*0.5;
        vec4 color = texture2D( tDiffuse, screen );
        gl_FragColor = color;
    }
`
;

