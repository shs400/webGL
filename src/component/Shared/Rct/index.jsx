import React from 'react';

class Rct extends React.Component {

  constructor(props) {
    super(props);
    this.caller = new RTCPeerConnection();
    this.callee = new RTCPeerConnection();
    this.localVideo = document.getElementById('localVideo');
    this.remoteVideo = document.getElementById('remoteVideo');
  }

  componentDidMount() {
    this.localVideo = document.getElementById('localVideo');
    this.remoteVideo = document.getElementById('remoteVideo');
    this.caller.onicecandidate = this.handlerCallerOnicecandidate;
    this.callee.onicecandidate = this.handlerCalleeOnicecandidate;
    this.callee.onaddstream = this.handlerCalleeAddStream;
  }

  handleVideoOpen = (evt) => {
    evt.preventDefault();
    const constraints = window.constraints = {
      audio: false,
      video: { width: 100, height: 100 }
    }
    console.log('constraints : ', constraints);
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      /* 반환된 스트림 사용 */
      const localVideo = document.getElementById('localVideo');
      localVideo.srcObject = stream;
      this.caller.addStream(stream); // 스트림 입력
      localVideo.onloadedmetadata = function(e) {
        localVideo.play();
      };
      this.createOffer();
    }).catch((err) => {
      /* 에러 예외처리 */
      console.log(err.name + ": " + err.message);
    })
  }

  createOffer = () => {
    this.caller.createOffer()
      .then((sdp) => this.createOfferSuccess(sdp))
      .catch(err => console.log(err));
  }

  createOfferSuccess(sdp){
    console.warn('sdp : ', sdp)
    this.caller.setLocalDescription(sdp);
    this.sendOffer(sdp); //send sdp to callee
  }

  sendOffer = (sdp) => {
    this.callee.setRemoteDescription(sdp);
    this.createAnswer();
  }

  createAnswer = () => {
    this.callee.createAnswer()
      .then(() => this.createAnswerSuccess)
      .catch(err => console.log(err));
  }

  createAnswerSuccess = (sdp) => {
    this.callee.setLocalDescription(sdp);
    this.sendAnswer(sdp);
  }

  sendAnswer = (sdp) => {
    this.callee.setRemoteDescription(sdp);
  }

  handlerCallerOnicecandidate = (e) => {
    if(e.candidate) this.callee.addIceCandidate(e.candidate);
  }

  handlerCalleeOnicecandidate = (e) => {
    if(e.candidate) this.caller.addIceCandidate(e.candidate);
  }

  handlerCalleeAddStream = (e) => {
    console.log('asd : ', e.stream)
    const localVideo = document.getElementById('remoteVideo');
    localVideo.srcObject = e.stream;
  }

  handlerClickCall = (e) => {
    e.preventDefault();
    navigator.getUserMedia({
      video: true,
      audio: false
    });
  }

  render() {
    return (
      <div>
        <video id="localVideo"></video>
        <video id="remoteVideo"></video>
        <button onClick={(evt) => this.handleVideoOpen(evt)}>CameraOpen</button>
        <button onClick={(evt) => this.handleVideoOpen(evt)}>CallOpen</button>
      </div>
    )
  }
}

export default Rct;
