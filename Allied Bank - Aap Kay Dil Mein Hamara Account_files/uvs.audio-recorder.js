(function(window){var WORKER_PATH=uvsWorkerPath;var Recorder=function(source,cfg){var config=cfg||{};var bufferLen=config.bufferLen||4096;this.context=source.context;var uvsAnalyserNode=source.context.createAnalyser();source.connect(uvsAnalyserNode);uvsAnalyserNode.fftSize=2048;let lastLowFilterValue=null;let lowFilterValue=null;let minFilterValue=null;let maxFilterValue=null;let reachedHigh=false;let highFreqCount=0;let lowFreqCount=0;if(!this.context.createScriptProcessor){this.node=this.context.createJavaScriptNode(bufferLen,2,2);}else{this.node=this.context.createScriptProcessor(bufferLen,2,2);}
var worker=new Worker(config.workerPath||WORKER_PATH);worker.postMessage({command:'init',config:{sampleRate:this.context.sampleRate}});var recording=false,currCallback;function uvsAdd(accumulator,a){return accumulator+a;}
function uvsLowPassFilter(lastFilterValue,rawFreqValue){if(lastFilterValue==null){return rawFreqValue;}
let x=(lastFilterValue*4+rawFreqValue)/5;return x;}
function uvsMicButtonClickHandler(){try{if(typeof(uvsMicButtonElInCtx)!='undefined'&&uvsMicButtonElInCtx!==null){var uvsMicClassList=uvsMicButtonElInCtx.className||'';if(uvsMicClassList.indexOf('listening')!=-1)uvsMicButtonElInCtx.click();}}catch(err){console.log('uvs Error: Unable to reset Mic button.')}}
this.node.onaudioprocess=function(e){if(!recording){return;}
var uvsAudioData=new Uint8Array(uvsAnalyserNode.frequencyBinCount);uvsAnalyserNode.getByteFrequencyData(uvsAudioData);var currentVol=0;for(let i=0;i<uvsAudioData.length;i++){currentVol=currentVol+uvsAudioData[i];}
lowFilterValue=uvsLowPassFilter(lowFilterValue,currentVol);lowFilterValue=parseInt(lowFilterValue);if(minFilterValue==null){minFilterValue=lowFilterValue;}else if(lowFilterValue<minFilterValue){minFilterValue=lowFilterValue;}
if(maxFilterValue==null){maxFilterValue=lowFilterValue;}else if(lowFilterValue>maxFilterValue){maxFilterValue=lowFilterValue;if(maxFilterValue>2*minFilterValue){reachedHigh=true;}}
if((lastLowFilterValue+10)<lowFilterValue){lowFreqCount=0;highFreqCount=highFreqCount+1;}
if((lastLowFilterValue-10)>lowFilterValue){highFreqCount=0;lowFreqCount=lowFreqCount+1;}
lastLowFilterValue=lowFilterValue;if(lowFreqCount>17&&reachedHigh){uvsMicButtonClickHandler();}
worker.postMessage({command:'record',buffer:[e.inputBuffer.getChannelData(0),e.inputBuffer.getChannelData(1)]});}
this.configure=function(cfg){for(var prop in cfg){if(cfg.hasOwnProperty(prop)){config[prop]=cfg[prop];}}}
this.record=function(micButtonEl=null){recording=true;uvsMicButtonElInCtx=micButtonEl;}
this.stop=function(){recording=false;lastLowFilterValue=null;highFreqCount=0;lowFreqCount=0;lowFilterValue=null;minFilterValue=null;maxFilterValue=null;reachedHigh=false;}
this.clear=function(){uvsMicButtonInCtx=null;worker.postMessage({command:'clear'});}
this.getBuffers=function(cb){currCallback=cb||config.callback;worker.postMessage({command:'getBuffers'})}
this.exportWAV=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/wav';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'exportWAV',type:type});}
this.exportMonoWAV=function(cb,type){currCallback=cb||config.callback;type=type||config.type||'audio/wav';if(!currCallback)throw new Error('Callback not set');worker.postMessage({command:'exportMonoWAV',type:type});}
this.convertBlobToBase64=function(blobObj){return new Promise(function(resolve,reject){if(!(typeof blobObj!='undefined'&&!!blobObj&&blobObj instanceof Blob)){reject(null);return;}
let reader=new FileReader();reader.readAsDataURL(blobObj);reader.onload=function(){let base64data=reader.result;if(typeof base64data!='undefined'&&!!base64data&&base64data.indexOf(',')!==-1){resolve(base64data.split(',')[1]);}else{reject(null);}}
reader.onerror=function(event){reader.abort();};reader.onabort=function(){reject(null);}});}
worker.onmessage=function(e){var blob=e.data;currCallback(blob);}
uvsAnalyserNode.connect(this.node);this.node.connect(this.context.destination);};window.Recorder=Recorder;})(window);