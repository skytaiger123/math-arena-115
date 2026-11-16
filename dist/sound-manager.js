(() => {
  'use strict';
  const applauseFiles=['assets/audio/applause/applause-01.mp3','assets/audio/applause/applause-02.mp3','assets/audio/applause/applause-03.mp3'];
  const praises=['答對了，太棒了！','好厲害，完全正確！','完美作答！','答得真好，繼續加油！'];
  const encouragements=['加油！','你可以的！','再試一次！','沒關係，繼續努力！','已經很接近了！'];
  let enabled=true,volume=.45,ctx=null,currentAudio=null,activeNodes=new Set(),timers=new Set(),unlocked=false;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  function notify(message){window.dispatchEvent(new CustomEvent('soundfxerror',{detail:message}))}
  function unlock(){if(!enabled)return false;try{ctx=ctx||(AudioCtx?new AudioCtx():null);if(ctx?.state==='suspended')ctx.resume();unlocked=true;return true}catch{return false}}
  function clearTimers(){timers.forEach(clearTimeout);timers.clear()}
  function stopNodes(){activeNodes.forEach(node=>{try{node.stop()}catch{}});activeNodes.clear()}
  function stopAll(){clearTimers();if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null}stopNodes();if('speechSynthesis'in window)window.speechSynthesis.cancel()}
  function setEnabled(value){enabled=Boolean(value);if(!enabled)stopAll()}
  function setVolume(value){volume=Math.max(0,Math.min(.7,Number(value)||0));if(currentAudio)currentAudio.volume=volume}
  function speak(text,options={}){if(!enabled||!('speechSynthesis'in window))return;try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-TW';u.rate=options.rate||1.02;u.pitch=options.pitch||1.1;u.volume=Math.min(1,volume/.7);window.speechSynthesis.speak(u)}catch{}}
  function synth(notes,duration=.18,replace=true){if(!enabled||!unlock()||!ctx)return;if(replace)stopNodes();const now=ctx.currentTime;notes.forEach((freq,index)=>{const o=ctx.createOscillator(),g=ctx.createGain(),start=now+index*duration*.62;o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.015,volume*.16),start+.025);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(ctx.destination);activeNodes.add(o);o.onended=()=>activeNodes.delete(o);o.start(start);o.stop(start+duration+.02)})}
  async function playFile(intense=false,fixedIndex=null){if(!enabled)return false;unlock();if(currentAudio){currentAudio.pause();currentAudio.currentTime=0}const index=fixedIndex===null?Math.floor(Math.random()*applauseFiles.length):fixedIndex,a=new Audio(applauseFiles[index]);currentAudio=a;a.volume=Math.min(.7,volume*(intense?1.08:.9));a.playbackRate=intense?[1.04,1.1,.97][index]:[1,.98,1.02][index];a.onended=()=>{if(currentAudio===a)currentAudio=null};a.onerror=()=>notify(`音效檔案無法載入：${applauseFiles[index]}`);try{await a.play();return true}catch{notify('瀏覽器尚未允許播放音效，請教師先點一次音效面板中的按鈕。');return false}}
  function later(fn,delay){const id=setTimeout(()=>{timers.delete(id);fn()},delay);timers.add(id)}
  function playApplause(){stopAll();playFile(false)}
  function playCheer(){stopAll();playFile(true);synth([523,659,784,1047],.34,false)}
  function playCorrect(){stopAll();synth([660,880,1100],.14,false);later(()=>playFile(false),220);speak(praises[Math.floor(Math.random()*praises.length)],{pitch:1.18,rate:1.08})}
  function playDuelCorrect(){stopAll();playFile(false,0)}
  function playWrong(){stopAll();synth([392,330],.2,false);speak(encouragements[Math.floor(Math.random()*encouragements.length)],{pitch:1.02,rate:.98})}
  function playEncouragement(){stopAll();synth([392,494,587],.17,false);speak(encouragements[Math.floor(Math.random()*encouragements.length)],{pitch:1.08})}
  function playVictory(){stopAll();playFile(true);synth([523,659,784,1047,1319],.36,false);speak('挑戰成功！恭喜大家！',{pitch:1.2,rate:1.02})}
  function playCountdown(){stopAll();synth([880,880,1047],.12,false);speak('剩下十秒',{rate:1.08})}
  function playEntrance(){stopAll();synth([392,523,659],.16,false)}
  function playRandom(){[playApplause,playCheer,playEncouragement,playVictory][Math.floor(Math.random()*4)]()}
  window.SoundFX={unlock,stopAll,setEnabled,setVolume,playApplause,playCheer,playCorrect,playDuelCorrect,playWrong,playEncouragement,playVictory,playCountdown,playEntrance,playRandom,get enabled(){return enabled},get volume(){return volume},get unlocked(){return unlocked},files:applauseFiles.slice()};
})();
