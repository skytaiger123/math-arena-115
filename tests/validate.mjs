import fs from 'node:fs';import vm from 'node:vm';
const code=fs.readFileSync(new URL('../dist/data/questions.js',import.meta.url),'utf8');const context={window:{}};vm.runInNewContext(code,context);const q=context.window.QUESTION_BANK;
const assert=(x,m)=>{if(!x)throw new Error(m)};
assert(Array.isArray(q),'題庫必須是陣列');assert(q.length>=48,`題數不足：${q.length}`);assert(new Set(q.map(x=>x.id)).size===q.length,'題目 ID 重複');
for(const item of q){for(const key of ['id','unit','difficulty','prompt','answer','explanation'])assert(item[key],`${item.id||'未知題'} 缺少 ${key}`);assert(/^[1-8]$/.test(item.unit),`${item.id} 單元錯誤`);assert(['easy','normal','hard'].includes(item.difficulty),`${item.id} 難度錯誤`)}
for(let u=1;u<=8;u++)for(const d of ['easy','normal','hard'])assert(q.some(x=>x.unit===String(u)&&x.difficulty===d),`第 ${u} 單元缺少 ${d}`);
for(const f of ['index.html','styles.css','app.js','data/questions.js'])assert(fs.existsSync(new URL('../dist/'+f,import.meta.url)),`缺少 ${f}`);
console.log(`✓ 題庫 ${q.length} 題、8 單元、3 難度與網站必要檔案皆通過檢查`);
