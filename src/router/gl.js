export function shader(type, text) {
  const script = document.createElement("script");
  script.async = true;

  if (type === "vertex") {
    script.id = "shader-vs";
    script.type = "x-shader/x-vertex";
  }
  else {
    script.id = "shader-fs";
    script.type = "x-shader/x-fragment";
  }


  script.innerHTML = text;
  document.head.appendChild(script);
}

export function setupWebGL(gl) {
  // 클리어 색상을 녹색으로 설정
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function makeShader(gl, id) {
  let shaderScript, theSource, currentChild, shader;

  shaderScript = document.getElementById(id);

  if (!shaderScript) {
    return null;
  }

  theSource = "";
  currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    // Unknown shader type
    return null;
  }

  // 정점 셰이더 컴파일
  gl.shaderSource(shader, theSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}