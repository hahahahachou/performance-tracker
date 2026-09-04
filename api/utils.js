// GitHub API 工具函数
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO; // hahahahachou/performance-tracker
const BRANCH = 'main';
const PATH = 'data/groups.json';

async function getData() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
    headers: { 'Authorization': `token ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
  });
  if (!res.ok) throw new Error('GitHub API error: ' + res.status);
  const data = await res.json();
  return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
}

async function saveData(content) {
  // 先获取当前文件的 sha
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
    headers: { 'Authorization': `token ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' }
  });
  const existing = await res.json();
  const sha = existing.sha;
  
  const body = JSON.stringify(content, null, 2);
  const res2 = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: 'Update groups data',
      content: Buffer.from(body).toString('base64'),
      sha: sha,
      branch: BRANCH
    })
  });
  if (!res2.ok) throw new Error('Save failed: ' + res2.status);
}

module.exports = { getData, saveData, PATH };
