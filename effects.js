window.chris = (() => {
  let canvas = null;
  let animFrame = null;

  function reset() {
    if (animFrame) cancelAnimationFrame(animFrame);
    if (canvas) canvas.remove();
    animFrame = null;
    canvas = null;
  }

  function makeCanvas(blendMode) {
    reset();
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9999",
      mixBlendMode: blendMode,
    });
    document.body.appendChild(canvas);
    return canvas;
  }

  function makeGLContext() {
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) { console.warn("WebGL not supported"); return null; }

    const vertSrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    gl._makeProgram = (fragSrc) => {
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      return prog;
    };

    return gl;
  }

  function glitch() {
    makeCanvas("color");
    const gl = makeGLContext();
    if (!gl) return;

    const prog = gl._makeProgram(`
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t = u_time * 0.4;

        float v = 0.0;
        v += sin(uv.x * 12.0 + t);
        v += sin(uv.y * 12.0 + t * 0.9);
        v += sin((uv.x + uv.y) * 8.0 + t * 1.3);
        v += sin(length(uv - 0.5) * 20.0 - t * 2.5);

        float r = sin(v * 3.14159) * 0.5 + 0.5;
        float g = sin(v * 3.14159 + 2.094) * 0.5 + 0.5;
        float b = sin(v * 3.14159 + 4.189) * 0.5 + 0.5;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    gl.uniform2f(uRes, canvas.width, canvas.height);

    const start = performance.now();
    (function loop() {
      animFrame = requestAnimationFrame(loop);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    })();

    console.log("%cglitch() active — chris.reset() to stop", "color:#7c9ef8");
  }

  function warp() {
    makeCanvas("difference");
    const gl = makeGLContext();
    if (!gl) return;

    const prog = gl._makeProgram(`
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t = u_time * 0.6;

        vec2 p = uv - 0.5;
        float angle = atan(p.y, p.x);
        float radius = length(p);

        float ripple = sin(radius * 30.0 - t * 4.0) * 0.5 + 0.5;
        float spin   = sin(angle * 6.0 + t * 2.0) * 0.5 + 0.5;
        float ring   = sin(radius * 50.0 - t * 3.0) * 0.5 + 0.5;

        float r = ripple;
        float g = spin;
        float b = ring;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_res");
    gl.uniform2f(uRes, canvas.width, canvas.height);

    const start = performance.now();
    (function loop() {
      animFrame = requestAnimationFrame(loop);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    })();

    console.log("%cwarp() active — chris.reset() to stop", "color:#7c9ef8");
  }

  function matrix() {
    makeCanvas("screen");
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const fontSize = 14;
    const cols = Math.floor(W / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -H);

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエオ";

    (function loop() {
      animFrame = requestAnimationFrame(loop);

      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${fontSize}px "SF Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char is bright white
        ctx.fillStyle = "#ffffff";
        ctx.fillText(char, x, y);

        // Trail in accent color
        ctx.fillStyle = "#7c9ef8";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);

        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    })();

    console.log("%cmatrix() active — chris.reset() to stop", "color:#7c9ef8");
  }

  console.log(
    "%cwindow.chris is available\n%cchris.glitch()  — plasma color warp\nchris.warp()    — radial difference distortion\nchris.matrix()  — you know what this does\nchris.reset()   — stop",
    "color:#7c9ef8; font-weight:bold",
    "color:#888"
  );

  return { glitch, warp, matrix, reset };
})();
