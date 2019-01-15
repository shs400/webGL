import React from 'react';

import { shader, setupWebGL, makeShader } from '../../../router/gl.js'

class Webgl03 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    this.gl = null,
    this.canvas = null,
    this.glProgram = null,
    this.fragmentShader =null,
    this.vertexShader = null,
    this.positionAttributeLocation = null,
    this.resolutionUniformLocation = null,
    this.colorUniformLocation = null,
    this.matrixUniformLocation = null,
    this.triangleVerticeBuffer = null;
  }

  componentDidMount() {
    const vertxtText = `
      attribute vec4 aVertexPosition;

      uniform mat4 u_matrix;
    
      varying vec4 v_color;
    
      void main(void) {
        gl_Position = u_matrix * aVertexPosition;
        v_color = gl_Position * 0.5 + 0.5;
      }`;

    const fragmentText = `
      precision mediump float;
      varying vec4 v_color;
      void main(void) {
        gl_FragColor = v_color;
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
      0,    0.7,
      -0.7, -0.7,
      0.7, -0.7
    ];

    this.triangleVerticeBuffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  }

  drawScene = (gl) => {
    this.positionAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexPosition");
    this.matrixUniformLocation = gl.getUniformLocation(this.glProgram, "u_matrix");
    gl.uniformMatrix4fv(this.matrixUniformLocation, false, [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVerticeBuffer);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  render() {
    return (
      <div>
        <h2>Webgl03 {this.props.match.params.name}</h2>
        <canvas id="my-canvas" width="400" height="300">
          your browser does not support the HTML5 canvas element.
        </canvas>
      </div>
    );
  }
}

export default Webgl03;
