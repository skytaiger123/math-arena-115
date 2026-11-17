import fs from 'node:fs';import vm from 'node:vm';
const code=fs.readFileSync(new URL('../dist/data/questions.js',import.meta.url),'utf8');const context={window:{}};vm.runInNewContext(code,context);const q=context.window.QUESTION_BANK;
const assert=(x,m)=>{if(!x)throw new Error(m)};
assert(Array.isArray(q),'題庫必須是陣列');assert(q.length>=128,`題數不足：${q.length}`);assert(new Set(q.map(x=>x.id)).size===q.length,'題目 ID 重複');
for(const item of q){for(const key of ['id','unit','difficulty','prompt','answer','explanation'])assert(item[key],`${item.id||'未知題'} 缺少 ${key}`);assert(/^[1-8]$/.test(item.unit),`${item.id} 單元錯誤`);assert(['easy','normal','hard'].includes(item.difficulty),`${item.id} 難度錯誤`)}
for(let u=1;u<=8;u++)for(const d of ['easy','normal','hard'])assert(q.some(x=>x.unit===String(u)&&x.difficulty===d),`第 ${u} 單元缺少 ${d}`);
for(let u=1;u<=8;u++)for(const d of ['normal','hard'])assert(q.filter(x=>x.unit===String(u)&&x.difficulty===d).length>=7,`第 ${u} 單元 ${d} 未達 7 題`);
for(const f of ['index.html','styles.css','app.js','sound-manager.js','data/questions.js'])assert(fs.existsSync(new URL('../dist/'+f,import.meta.url)),`缺少 ${f}`);
for(let i=1;i<=3;i++){const f=`assets/audio/applause/applause-0${i}.mp3`,url=new URL('../dist/'+f,import.meta.url);assert(fs.existsSync(url),`缺少 ${f}`);assert(fs.statSync(url).size>1000,`${f} 檔案異常`)}
{const f='assets/audio/countdown/countdown-10-to-1.mp3',url=new URL('../dist/'+f,import.meta.url);assert(fs.existsSync(url),`缺少 ${f}`);assert(fs.statSync(url).size>1000,`${f} 檔案異常`)}
const app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert(app.includes('remaining===10'),'缺少倒數 10 秒音效規則');assert(app.includes('correctStreak%3===0'),'缺少連續答對 3 題規則');assert(app.includes('autoSound'),'缺少教師自動音效設定');
assert(app.includes("state.sound&&window.SoundFX&&state.mode==='duel')SoundFX.playDuelCorrect()"),'閃電擂台答對未直接綁定指定鼓掌聲');
assert(app.includes("state.sound&&window.SoundFX&&state.mode==='treasure')SoundFX.playTreasureCorrect()"),'數學寶箱王答對未直接綁定指定鼓掌聲');
assert(app.includes('SoundFX.playTimerStart()'),'開始計時未綁定提示音');assert(app.includes('state.remaining===10&&state.sound&&window.SoundFX)SoundFX.playCountdown()'),'最後 10 秒未綁定逐秒倒數音檔');
assert(app.includes('state.timerDeadline=Date.now()+state.remaining*1000'),'計時器未使用絕對時間校正');
assert(app.includes('if(state.sound&&window.SoundFX)SoundFX.playWrong()'),'答錯未直接播放溫和鼓勵聲');
const sounds=fs.readFileSync(new URL('../dist/sound-manager.js',import.meta.url),'utf8');assert(sounds.includes('a.duration/10'),'倒數音檔未依精確時長校準為 10 秒');assert(sounds.includes('offset*rate'),'暫停續播位置未按播放倍率校正');
assert(app.includes("state.mode==='boss'&&state.bossHp===0&&state.players.every(x=>x.judged==='correct')"),'魔王團隊勝利未要求三人全部答對');assert(app.includes('SoundFX.playBossVictory()'),'魔王團隊勝利未綁定專用歡呼');
assert(app.includes("subtle.digest('SHA-256'"),'教師密碼未使用 SHA-256 雜湊保存');assert(app.includes("upper:/[A-Z]/")&&app.includes("lower:/[a-z]/")&&app.includes("number:/\\d/")&&app.includes("symbol:/[^A-Za-z0-9\\s]/"),'密碼未完整檢查大小寫、數字與符號');assert(app.includes("configureAuth(localStorage.getItem(PASSWORD_KEY)?'unlock':'setup')"),'網站載入時未啟動密碼鎖');
assert(app.includes('state.treasureCount')&&app.includes('Array.from({length:state.treasureCount}'),'寶箱王未建立1至20號參與者');assert(app.includes('state.lastScores')&&app.includes('showScoreQuery'),'寶箱王未保存或提供累積分數查詢');assert(app.includes('finishEarly')&&app.includes('showResults(true)'),'寶箱王缺少提前結束結算');
assert(app.includes("$('#treasurePlayerPicker').onchange")&&app.includes('state.groupIndex=index'),'寶箱王缺少每回合1至20號手動挑選');assert(app.includes('roundJudged')&&app.includes("state.roundJudged[p.name]=p.judged"),'寶箱王未記錄同一回合各號碼判分');assert(app.includes("treasure?'下一回合（換題）"),'寶箱王換號碼與換題操作未分開');
assert(app.includes("state.mode==='boss'?'沒關係，再努力，你一定可以！'"),'魔王模式答錯未顯示再努力鼓勵');
assert(sounds.includes('function playBossVictory(){stopAll();playFile(true,2,true)}'),'魔王勝利未使用第三個原始音檔');assert(sounds.includes("speak('沒關係，再接再厲，繼續努力，你一定可以！'"),'答錯再努力語音內容遺失');
console.log(`✓ 題庫 ${q.length} 題、8 單元、3 難度、智慧音效規則與 4 個 MP3 皆通過檢查`);
