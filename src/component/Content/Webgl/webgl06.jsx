import React from 'react';
import { mat4 } from 'gl-matrix';
import { shader, makeShader } from '../../../router/gl.js'

class Webgl06 extends React.Component{
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
    this.vertexPointBuffer = null,
    this.vertexPointIndexBuffer = null,
    this.angle = 0.0,
    this.xAngle = 0.0,
    this.yAngle = 0.0,
    this.axis = [0,0,0],
    this.view = 45,
    this.mvMatrix = mat4.create(),
    this.camera = mat4.create(),
    this.pMatrix = mat4.create();
  }

  componentDidMount() {
    const vertxtText = `
      attribute vec3 aVertexPosition;
      attribute vec4 aVertexColor;
  
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
  
      varying vec4 v_color;
      void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
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
      this.getMatrixUniforms(this.gl);
      let _this = this;
      (function animLoop(){
        _this.setupWebGL(_this.gl);
        _this.setupDynamicBuffers(_this.gl);
        _this.setMatrixUniforms(_this.gl);
        _this.drawScene(_this.gl);
        requestAnimationFrame(animLoop, _this.canvas);
      })();
    } else {
      alert('브라우저가 지원안함');
    }
  }

  setupWebGL = (gl) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    mat4.perspective(this.pMatrix, this.view, this.canvas.width / this.canvas.height, 0.1, 2000.0);
    // mat4.perspective 는 gl-matrix 라이브러리의 헬퍼 함수 (시야, 종횡비, 전방 및 후방 경계를 인자로 받는다.)
    // glMatrix.mat4.lookAt(vec3.createFrom(100,1,1), vec3.createFrom(0,0,0), vec3.createFrom(0,-1,0));
    // mat4.identity(mvMatrix);
    mat4.lookAt(this.mvMatrix, [0,0,7], [0,0,0], [0,1,0]);
    // identity가 초기화로 카메라를 중앙에 위치하는 것이고
    // lookAt은 카메라 시점 초기셋팅을 내가 정할수 있는 것이다.
    mat4.translate(this.mvMatrix, this.mvMatrix, [-0.0, -1.0, -0.5]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, this.angle, [0, 1, 0]);
    mat4.scale(this.mvMatrix, this.mvMatrix, [1,1,1]);
    this.angle += 0.03;
    // 카메라는 기본적으로 (0,0,0) 위치에 있으므로 mvMatrix를 생성할 떄는
    // z축상에 있는 삼각형도 볼 수 있게 좀 더 뒤로 이동하도록 z좌표만 조정해준다.
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

    let vertexColor = [

      // 앞면
      0.0, 0.0, 1.0,
      1.0, 1.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      1.0, 1.0, 1.0,

      // 뒷면
      0.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      1.0, 1.0, 1.0
    ];

    this.positionsColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);

    let vertexPoint = [

      // 앞면 정점
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      2.0, 0.0, 0.0,
      0.5, 1.0, 0.0,
      1.5, 1.0, 0.0,
      1.0, 2.0, 0.0,

      // 뒷면 정점
      0.0, 0.0, -2.0,
      1.0, 0.0, -2.0,
      2.0, 0.0, -2.0,
      0.5, 1.0, -2.0,
      1.5, 1.0, -2.0,
      1.0, 2.0, -2.0
    ];

    this.vertexPointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPoint), gl.STATIC_DRAW);

    let vertexPointIndex = [

      // 정점버퍼 설정

      // 앞

      0, 1, 3,
      1, 3, 4,
      1, 2, 4,
      3, 4, 5,

      // 뒤

      6, 7, 9,
      7, 9, 10,
      7, 8, 10,
      9, 10, 11,

      // 왼

      0, 3, 6,
      3, 6, 9,
      3, 5, 9,
      5, 9, 11,

      // 오른

      2, 4, 8,
      4, 8, 10,
      4, 5, 10,
      5, 10, 11,

      // 아래

      0, 6, 8,
      8, 2, 0

    ];

    this.vertexPointIndexBuffer = gl.createBuffer();
    this.vertexPointIndexBuffer.number_vertex_point = vertexPointIndex.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexPointIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexPointIndex), gl.STATIC_DRAW);
  }

  drawScene = (gl) => {
    this.positionAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexPosition");
    this.colorAttributeLocation = gl.getAttribLocation(this.glProgram, "aVertexColor");
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPointBuffer);
    gl.vertexAttribPointer(this.positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsColorBuffer);
    gl.vertexAttribPointer(this.colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexPointIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.vertexPointIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
  }

  getMatrixUniforms(gl) {
    this.glProgram.pMatrixUniform = gl.getUniformLocation(this.glProgram, "uPMatrix");
    this.glProgram.mvMatrixUniform = gl.getUniformLocation(this.glProgram, "uMVMatrix");
  }

  setMatrixUniforms(gl) {
    gl.uniformMatrix4fv(this.glProgram.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(this.glProgram.mvMatrixUniform, false, this.mvMatrix);
  }

  render() {
    return (
      <div>
        <h2>Webgl06 {this.props.match.params.name}</h2>
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

export default Webgl06;
