import React from 'react';

import { shader, setupWebGL, makeShader } from '../../../router/gl.js'

class Webgl02 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    this.gl = null,
    this.canvas = null,
    this.glProgram = null,
    this.fragmentShader =null,
    this.vertexShader = null,
    this.vertexPosition = null,
    this.triangleVerticeBuffer = null;
  }

  componentDidMount() {
    const vertxtText = `
      attribute vec2 aVertexPosition;
      uniform vec2 u_resolution;
    
      void main(void) {
        vec2 zeroToOne = aVertexPosition / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
    
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }`;

    const fragmentText = `
      precision mediump float;
      uniform vec4 u_color;
      void main(void) {
        gl_FragColor = u_color;
      }`;

    shader('vertex', vertxtText);
    shader('fragment', fragmentText);

    this.init();
  }

  componentWillUnmount() {
    document.getElementById('shader-vs').remove();
    document.getElementById('shader-fs').remove();
  }

  init = () => {
    this.canvas = document.getElementById("my-canvas");

    try{
      this.gl = this.canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
    }catch (e){
    }

    if (this.gl) {
      setupWebGL(this.gl);
      this.initShader(this.gl);
      this.setupBuffers(this.gl);
      this.drawScene(this.gl);
    } else {
      alert('브라우저가 지원안함');
    }
  }



  initShader = (gl) => {

    // 셰이더 컴파일
    this.vertexShader = makeShader(gl, 'shader-fs');   // 색상 계산
    this.fragmentShader = makeShader(gl, 'shader-vs');  // 위치계산

    // 프로그램 생성
    // 프로그램은 vertexShader,fragmentShader 두쌍을 합쳐서 프로그램이라고 한다.
    this.glProgram = gl.createProgram();

    // 프로그램에 셰이더를 첨부하고 연결
    gl.attachShader(this.glProgram, this.vertexShader);
    gl.attachShader(this.glProgram, this.fragmentShader);
    gl.linkProgram(this.glProgram); // 프로그램 연결

    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      alert('Unable to initalize the shader program.');
    }
    // 프로그램을 사용
    gl.useProgram(this.glProgram);  // WebGL이 이 프로그램을 사용가능하게함
  }

  setupBuffers = (gl) => {

    let positions = [
      // 왼쪽 삼각형
      -0.5, 0.5, 0.0,
      0.0, 0.0, 0.0,
      -0.5, -0.5, 0.0,

      // 오른쪽 삼각형
      0.5, 0.5, 0.0,
      0.0, 0.0, 0.0,
      0.5, -0.5, 0.0
    ];

    this.triangleVerticeBuffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  drawScene = (gl) => {
    this.positionAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexPosition");
    this.resolutionUniformLocation = gl.getUniformLocation(this.glProgram, "u_resolution");
    this.colorUniformLocation = gl.getUniformLocation(this.glProgram, "u_color");
    gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVerticeBuffer);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    for (var i = 0; i < 50; i++) {
      this.setRectangle(gl, this.randomInt(300), this.randomInt(300), this.randomInt(300), this.randomInt(300));
      gl.uniform4f(
        this.colorUniformLocation,
        Math.random(),
        Math.random(),
        Math.random(),
        1
      )
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  randomInt = (range) => {
    return Math.floor(Math.random() * range);
  }

  setRectangle = (gl, x, y, width, height) => {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2]), gl.STATIC_DRAW)
  }

  render() {
    return (
      <div>
        <h2>Webgl02 {this.props.match.params.name}</h2>
        <canvas id="my-canvas" width="400" height="300">
          your browser does not support the HTML5 canvas element.
        </canvas>
      </div>
    );
  }
}

export default Webgl02;
