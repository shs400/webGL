import React from 'react';

import { shader, setupWebGL, makeShader } from '../../../router/gl.js'

class Webgl07 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    this.gl = null,
    this.canvas = null,
    this.texture = null,
    this.glProgram = null,
    this.fragmentShader = null,
    this.vertexShader = null,
    this.trianglesVerticeBuffer = null,
    this.vertexPositionAttribute = null,

    this.positionAttributeLocation = null,
    this.resolutionUniformLocation = null,
    this.colorUniformLocation = null,
    this.matrixUniformLocation = null,
    this.triangleVerticeBuffer = null;
  }

  componentDidMount() {
    const vertxtText = `
      attribute vec3 aVertexPosition;
    
      varying highp vec2 vTextureCoord;
    
      void main(void) {
        gl_Position = vec4(aVertexPosition, 1.0);
        vTextureCoord = aVertexPosition.xy + 0.5;
      }`;

    const fragmentText = `
      varying highp vec2 vTextureCoord;
      uniform sampler2D uSampler;
    
      void main(void) {
        gl_FragColor = texture2D( uSampler, vec2(vTextureCoord.s, vTextureCoord.t) );
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
      this.setupBuffers(this.gl);
      this.loadTexture(this.gl);
      let _this = this;
      this.textureImage.onload = function() {
        _this.setupTexture(_this.gl)
        setupWebGL(_this.gl);
        _this.drawScene(_this.gl);
      }
    } else {
      alert('브라우저가 지원안함');
    }
  }

  setupTexture = (gl) => {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    this.glProgram.samplerUniform = gl.getUniformLocation(this.glProgram, "uSampler");
    gl.uniform1i(this.glProgram.samplerUniform, 0);
  }

  loadTexture = (gl) => {
    this.textureImage = new Image();
    // this.textureImage.src = 'smiley-128px.8c4ef643.png';
    this.textureImage.src = 'stone-128px.3a5b9013.png';
  }

  initShader = (gl) => {

    // 셰이더 컴파일
    this.fragmentShader = makeShader(gl, 'shader-fs');   // 색상 계산
    this.vertexShader = makeShader(gl, 'shader-vs');  // 위치계산

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

    const triangleVertices = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0,

      0.5, 0.5, 0.0,
      -0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0
    ];

    this.trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  }

  drawScene = (gl) => {
    this.vertexPositionAttribute = gl.getAttribLocation(this.glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 2*3);
  }

  render() {
    return (
      <div>
        <h2>Webgl07 {this.props.match.params.name}</h2>
        <canvas id="my-canvas" width="400" height="300">
          your browser does not support the HTML5 canvas element.
        </canvas>
      </div>
    );
  }
}

export default Webgl07;
