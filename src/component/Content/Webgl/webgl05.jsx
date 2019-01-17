import React from 'react';

import { shader, setupWebGL, makeShader } from '../../../router/gl.js'

class Webgl05 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    this.gl = null,
    this.canvas = null,
    this.glProgram = null,
    this.fragmentShaderSource = null,
    this.verTextShaderSource = null,
    this.positionAttributeLocation = null,
    this.colorAttributeLocation = null,
    this.positionsColorBuffer = null,
    this.angle = 0;
  }

  componentDidMount() {
    const vertxtText = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
    
      uniform mat4 u_matrix;
    
      varying vec4 v_color;
    
      void main(void) {
        gl_Position = aVertexPosition;
        v_color = aVertexColor * 0.5 + 0.5;
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
      this.initShader(this.gl);
      setupWebGL(this.gl);
      let _this = this;
      (function animLoop(){
        _this.setupDynamicBuffers(_this.gl);
        _this.drawScene(_this.gl);
        requestAnimationFrame(animLoop, _this.canvas);
      })();
    } else {
      alert('브라우저가 지원안함');
    }
  }



  initShader = (gl) => {

    // 셰이더 컴파일
    this.verTextShaderSource = makeShader(gl, 'shader-fs');   // 색상 계산
    this.fragmentShaderSource = makeShader(gl, 'shader-vs');  // 위치계산

    // 프로그램 생성
    // 프로그램은 vertexShader,fragmentShader 두쌍을 합쳐서 프로그램이라고 한다.
    this.glProgram = gl.createProgram();

    // 프로그램에 셰이더를 첨부하고 연결
    gl.attachShader(this.glProgram, this.verTextShaderSource);
    gl.attachShader(this.glProgram, this.fragmentShaderSource);
    gl.linkProgram(this.glProgram); // 프로그램 연결

    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      alert('Unable to initalize the shader program.');
    }
    // 프로그램을 사용
    gl.useProgram(this.glProgram);  // WebGL이 이 프로그램을 사용가능하게함
  }

  setupDynamicBuffers = (gl) => {
    const x_translation = Math.sin(this.angle)/2.0;
    let positionsColor = [
      -0.5 + x_translation,  0.5 + x_translation, //첫번째 삼각형의 정점 1
      -0.5 + x_translation, -0.5 + x_translation, //첫번째 삼각형의 정점 2
      0.5 + x_translation, -0.5 + x_translation, //첫번째 삼각형의 정점 3
    ];

    this.positionsColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsColor), gl.DYNAMIC_DRAW);

    let triangleVertices = [
      -0.5 + x_translation,  0.5 + x_translation, //첫번째 삼각형의 정점 1
      -0.5 + x_translation, -0.5 + x_translation, //첫번째 삼각형의 정점 2
      0.5 + x_translation, -0.5 + x_translation, //첫번째 삼각형의 정점 3
    ];
    this.angle += 0.01;

    this.trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  }

  drawScene = (gl) => {
    this.positionAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexPosition");
    this.colorAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexColor");
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsColorBuffer);
    gl.vertexAttribPointer(this.colorAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  render() {
    return (
      <div>
        <h2>Webgl04 {this.props.match.params.name}</h2>
        <canvas
          id="my-canvas"
          width="400"
          height="300"
          style={{background: '#000'}}
        >
          your browser does not support the HTML5 canvas element.
        </canvas>
      </div>
    );
  }
}

export default Webgl05;
