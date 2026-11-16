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
console.log(`✓ 題庫 ${q.length} 題、8 單元、3 難度、智慧音效規則與 4 個 MP3 皆通過檢查`);
