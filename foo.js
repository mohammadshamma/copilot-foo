class AnalogClock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100vw;
          height: 100vh;
          background-color: #000;
        }
      </style>
      <canvas></canvas>
    `;
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.canvas.width = this.clientWidth;
    this.canvas.height = this.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(Math.PI / 2);
    this.ctx.arc(0, 0, this.canvas.width / 2, 0, Math.PI * 2);
    requestAnimationFrame(() => this.draw());
    // when clicking on the clock change the background color
    this.canvas.addEventListener('click', () => {
      this.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    });
    // when pressing the enter key open a new tab with the clock
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        window.open(document.location);
      }
    }
    );
    // when pressing the space key open a dialog with the time in ukraine
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        // open a dialog with the time in ukraine
        // set the timezone to ukraine
        var time = new Date();
        // Format the time in eastern european time.
        var timeString = time.toLocaleTimeString('en-GB', { timeZone: 'Europe/Kiev' });
        var dialog = document.createElement('dialog');
        dialog.innerHTML = `
          <style>
          </style>
          <h1>Час в Україні</h1>
          <p>${timeString}</p>
        `;
        // attach the dialog to the document
        document.body.appendChild(dialog);
        dialog.showModal();
      }
    }
    );

    // generate web audio beep sound wave then play it when the button 'W' is pressed.
    // when pressing the 'W' key play the sound
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 87) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0;
        oscillator.start();
        gainNode.gain.value = 0.5;
      }
    }
    );

    // When pressing the 'O' key open a dialog with a webGL context and the default triangle.
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 79) {
        var dialog = document.createElement('dialog');
        dialog.innerHTML = `

        <style>

        </style>
        <h1>WebGL</h1>
        <p>
          <canvas id="canvas"></canvas>
        </p>
        `;
        document.body.appendChild(dialog);
        dialog.showModal();
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('webgl');
        var vertices = new Float32Array([
          0.0, 0.5,
          -0.5, -0.5,
          0.5, -0.5
        ]);
        var vertexBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        ctx.shaderSource(vertexShader, `
          attribute vec2 position;
          void main() {
            gl_Position = vec4(position, 0, 1);
          }
        `);
        ctx.compileShader(vertexShader);
        var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        ctx.shaderSource(fragmentShader, 'void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }');
        ctx.compileShader(fragmentShader);
        var program = ctx.createProgram();
        ctx.attachShader(program, vertexShader);
        ctx.attachShader(program, fragmentShader);
        ctx.linkProgram(program);
        ctx.useProgram(program);
        var positionAttrib = ctx.getAttribLocation(program, 'position');
        ctx.enableVertexAttribArray(positionAttrib);
        ctx.vertexAttribPointer(positionAttrib, 2, ctx.FLOAT, false, 0, 0);
        ctx.drawArrays(ctx.TRIANGLES, 0, 3);
      }
    }
    );

    // When pressing the '3' key open a dialog with a webGL and draw a rotating cube.
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 51) {
        var dialog = document.createElement('dialog');
        dialog.innerHTML = `
        <style>
        </style>
        <h1>Rotating Cube</h1>
        <p>
          <canvas id="canvas"></canvas>
        </p>
        `;
        document.body.appendChild(dialog);
        dialog.showModal();
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('webgl');
        var vertices = new Float32Array([
          -1.0, -1.0, 1.0,
          1.0, -1.0, 1.0,
          1.0, 1.0, 1.0,
          -1.0, 1.0, 1.0,
          -1.0, -1.0, -1.0,
          1.0, -1.0, -1.0,
          1.0, 1.0, -1.0,
          -1.0, 1.0, -1.0
        ]);
        var vertexBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        ctx.shaderSource(vertexShader, `
          attribute vec3 position; 
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
          }
        `);
        ctx.compileShader(vertexShader);
        var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        // Generate a random color for each vertex.
        ctx.shaderSource(fragmentShader, `
          precision mediump float;
          uniform vec3 color;
          void main() {
            gl_FragColor = vec4(color, 1);
          }
        `);
        ctx.compileShader(fragmentShader);
        var program = ctx.createProgram();
        ctx.attachShader(program, vertexShader);
        ctx.attachShader(program, fragmentShader);
        ctx.linkProgram(program);
        ctx.useProgram(program);
        var positionAttrib = ctx.getAttribLocation(program, 'position');
        ctx.enableVertexAttribArray(positionAttrib);
        ctx.vertexAttribPointer(positionAttrib, 3, ctx.FLOAT, false, 0, 0);
        var modelViewMatrix = ctx.getUniformLocation(program, 'modelViewMatrix');
        var projectionMatrix = ctx.getUniformLocation(program, 'projectionMatrix');
        var modelViewMatrixData = new Float32Array([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
        var projectionMatrixData = new Float32Array([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
        var modelViewMatrixBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, modelViewMatrixBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, modelViewMatrixData, ctx.STATIC_DRAW);
        var projectionMatrixBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, projectionMatrixBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, projectionMatrixData, ctx.STATIC_DRAW);
        var angle = 0;
        var animate = function () {
          angle += 0.1;
          modelViewMatrixData[0] = Math.cos(angle);
          modelViewMatrixData[1] = Math.sin(angle);
          modelViewMatrixData[4] = -Math.sin(angle);
          modelViewMatrixData[5] = Math.cos(angle);
          ctx.bindBuffer(ctx.ARRAY_BUFFER, modelViewMatrixBuffer);
          ctx.bufferData(ctx.ARRAY_BUFFER, modelViewMatrixData, ctx.STATIC_DRAW);
          ctx.uniformMatrix4fv(modelViewMatrix, false, modelViewMatrixData);
          ctx.uniformMatrix4fv(projectionMatrix, false, projectionMatrixData);
          var color = ctx.getUniformLocation(program, 'color');
          var colorData = new Float32Array([
            Math.random(), Math.random(), Math.random()
          ]);
          // assign the color uniform.
          ctx.uniform3fv(color, colorData);
          ctx.drawArrays(ctx.TRIANGLES, 0, 8);
          requestAnimationFrame(animate);
        };
        animate();
      }
    });
  }

  draw() {
    var time = new Date();
    var hours = time.getHours();
    this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    // draw the hour hand
    this.ctx.save();
    this.ctx.rotate(Math.PI / 6 * hours + Math.PI / 360 * time.getMinutes() - Math.PI / 2);
    // style the path
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.canvas.width / 2);
    this.ctx.lineTo(0, -this.canvas.width / 2 + this.canvas.width / 10);
    this.ctx.stroke();
    this.ctx.restore();
    // draw the minute hand
    this.ctx.save();
    this.ctx.rotate(Math.PI / 30 * time.getMinutes() + Math.PI / 1800 * time.getSeconds() - Math.PI / 2);
    // style the path
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.canvas.width / 2);
    this.ctx.lineTo(0, -this.canvas.width / 2 + this.canvas.width / 10);
    this.ctx.stroke();
    this.ctx.restore();
    requestAnimationFrame(() => this.draw());
  }
}

customElements.define('analog-clock', AnalogClock);
