const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {}
  return null;
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function initData() {
  const existing = loadData();
  if (existing && existing.groups && existing.groups.length > 0) return existing;

  const groups = [
    { id:1, name:'执行制作组', progress:0, todos:[
      {id:1,text:'集中验收舞美、服装、道具、灯光、音响五大设计线条的最终成果',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:2,text:'全体同学参与经费使用方案的讨论与审批',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:3,text:'反馈剧组排练进度',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:4,text:'完成全剧完整连排，检验各场次之间的衔接流畅度',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()},
      {id:5,text:'全面排查排练中暴露的表演、调度、技术配合等各类问题',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()},
      {id:6,text:'为下周启动的技术合成做好充分准备',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:2, name:'导演组', progress:0, todos:[
      {id:7,text:'集中验收舞美、服装、道具、灯光、音响五大设计线条的最终成果',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:8,text:'全体同学参与经费使用方案的讨论与审批',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:9,text:'反馈剧组排练进度',priority:'normal',week:'第十周',done:false,created_at:new Date().toISOString()},
      {id:10,text:'完成全剧完整连排，检验各场次之间的衔接流畅度',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()},
      {id:11,text:'全面排查排练中暴露的表演、调度、技术配合等各类问题',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()},
      {id:12,text:'为下周启动的技术合成做好充分准备',priority:'normal',week:'第十二周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:3, name:'舞美和道具设计组', progress:0, todos:[
      {id:13,text:'舞台美术设计方案本周内定稿，确定制作/采购方案',priority:'normal',week:'第四周',done:false,created_at:new Date().toISOString()},
      {id:14,text:'结合演出场地现场测量舞台美术制作方案',priority:'normal',week:'第四周',done:false,created_at:new Date().toISOString()},
      {id:15,text:'反馈剧组排练进度',priority:'normal',week:'第四周',done:false,created_at:new Date().toISOString()},
      {id:16,text:'道具清单完成终审，明确每件道具的落实方式和时间节点',priority:'normal',week:'第六周',done:false,created_at:new Date().toISOString()},
      {id:17,text:'确定代用道具，确保排练不受道具缺位影响',priority:'normal',week:'第六周',done:false,created_at:new Date().toISOString()},
      {id:18,text:'反馈剧组排练进度',priority:'normal',week:'第六周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:4, name:'舞台监督', progress:0, todos:[], notes:[] },
    { id:5, name:'服化组', progress:0, todos:[
      {id:19,text:'服装设计方案本周内定稿，确定制作/采购方案',priority:'normal',week:'第五周',done:false,created_at:new Date().toISOString()},
      {id:20,text:'结合演员身形完成试装安排与尺寸记录',priority:'normal',week:'第五周',done:false,created_at:new Date().toISOString()},
      {id:21,text:'反馈剧组排练进度',priority:'normal',week:'第五周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:6, name:'灯光组', progress:0, todos:[
      {id:22,text:'各组灯光设计方案在本周内完成评审与定稿',priority:'normal',week:'第九周',done:false,created_at:new Date().toISOString()},
      {id:23,text:'确认灯光设备清单与实验室现有设备的匹配度',priority:'normal',week:'第九周',done:false,created_at:new Date().toISOString()},
      {id:24,text:'反馈剧组排练进度',priority:'normal',week:'第九周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:7, name:'音效组', progress:0, todos:[
      {id:25,text:'各组音响设计方案在本周内完成评审与定稿',priority:'normal',week:'第八周',done:false,created_at:new Date().toISOString()},
      {id:26,text:'反馈剧组排练进度',priority:'normal',week:'第八周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:8, name:'宣传组', progress:0, todos:[
      {id:27,text:'宣传视觉体系（主视觉、海报、推文模板）定稿',priority:'normal',week:'第十一周',done:false,created_at:new Date().toISOString()},
      {id:28,text:'宣传预热活动方案以及大致预算费用',priority:'normal',week:'第十一周',done:false,created_at:new Date().toISOString()},
      {id:29,text:'反馈剧组排练进度',priority:'normal',week:'第十一周',done:false,created_at:new Date().toISOString()}
    ], notes:[] },
    { id:9, name:'财务组', progress:0, todos:[], notes:[] },
    { id:10, name:'演员', progress:0, todos:[], notes:[] },
    { id:11, name:'后勤部', progress:0, todos:[], notes:[] }
  ];

  const data = { groups };
  saveData(data);
  return data;
}

let appData = initData();

function broadcast() { io.emit('data-update', loadData()); }

app.get('/api/data', (req, res) => res.json(loadData()));

app.post('/api/progress/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { progress } = req.body;
  const data = loadData();
  const g = data.groups.find(x => x.id === id);
  if (!g) return res.status(404).json({error:'not found'});
  g.progress = progress;
  g.updated_at = new Date().toISOString();
  saveData(data);
  broadcast();
  res.json({success:true});
});

app.post('/api/todo/toggle/:id', (req, res) => {
  const tid = parseInt(req.params.id);
  const data = loadData();
  for (const g of data.groups) {
    const t = g.todos.find(x => x.id === tid);
    if (t) { t.done = !t.done; saveData(data); broadcast(); return res.json({success:true}); }
  }
  res.status(404).json({error:'not found'});
});

app.post('/api/todo', (req, res) => {
  const { group_id, text, priority, week } = req.body;
  const data = loadData();
  const g = data.groups.find(x => x.id === group_id);
  if (!g) return res.status(404).json({error:'not found'});
  const maxId = data.groups.reduce((m, gr) => Math.max(m, ...gr.todos.map(t => t.id)), 0);
  g.todos.push({ id: maxId+1, text, priority: priority||'normal', week: week||'', done:false, created_at: new Date().toISOString() });
  saveData(data);
  broadcast();
  res.json({success:true});
});

app.delete('/api/todo/:id', (req, res) => {
  const tid = parseInt(req.params.id);
  const data = loadData();
  for (const g of data.groups) {
    const idx = g.todos.findIndex(t => t.id === tid);
    if (idx !== -1) { g.todos.splice(idx, 1); saveData(data); broadcast(); return res.json({success:true}); }
  }
  res.status(404).json({error:'not found'});
});

app.post('/api/note', (req, res) => {
  const { group_id, text } = req.body;
  const data = loadData();
  const g = data.groups.find(x => x.id === group_id);
  if (!g) return res.status(404).json({error:'not found'});
  const maxId = data.groups.reduce((m, gr) => Math.max(m, ...gr.notes.map(n => n.id)), 0);
  g.notes.push({ id: maxId+1, text, created_at: new Date().toISOString() });
  saveData(data);
  broadcast();
  res.json({success:true});
});

app.delete('/api/note/:id', (req, res) => {
  const nid = parseInt(req.params.id);
  const data = loadData();
  for (const g of data.groups) {
    const idx = g.notes.findIndex(n => n.id === nid);
    if (idx !== -1) { g.notes.splice(idx, 1); saveData(data); broadcast(); return res.json({success:true}); }
  }
  res.status(404).json({error:'not found'});
});

io.on('connection', (socket) => {
  socket.emit('data-update', loadData());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🎭 Server running on port ${PORT}`));
