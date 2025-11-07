import kaplay from "kaplay";

export const k = kaplay({
  width: 480,
  height: 270,
  scale: 2,
  global: false,
  pixelDensity: window.devicePixelRatio,
  canvas: getElementById("myCanvas"),
  shaders: {
    pixelDust: {
      frag: `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;

      // Hash untuk random
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 23.45);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        // Background: gradasi hitam ke ungu
        vec3 col = mix(vec3(0.02, 0.0, 0.05), vec3(0.08, 0.0, 0.15), uv.y);

        // "Pixel grid" effect — buat debu nampak seperti piksel
        vec2 gridUV = floor(uv * 160.0) / 160.0; // 160 bisa disesuaikan untuk density
        float sparkle = 0.0;

        // Random bintik berdasarkan posisi pixel grid
        float rnd = hash(gridUV * 100.0);
        if (rnd > 0.995) { // Semakin kecil, semakin sedikit debu
          // efek kelip pelan
          float flicker = 0.5 + 0.5 * sin(u_time * 2.0 + rnd * 10.0);
          sparkle = flicker;
        }

        // Tambahkan warna putih keunguan untuk debu
        col += vec3(0.9, 0.8, 1.0) * sparkle * 0.8;

        gl_FragColor = vec4(col, 1.0);
      }
      `,
    },
  },
});

// Tambahkan ke layar background

