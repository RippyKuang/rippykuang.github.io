import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/projects');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('hasGithub:')) return;
  
  const dateMatch = content.match(/date: "(.*?)"/);
  const baseDate = dateMatch ? dateMatch[1] : '2025-01-01';
  let start = '2023-01-01';
  
  const inject = `startDate: "${start}"\nendDate: "${baseDate}"\nhasGithub: true\nhasLiveDemo: true\n`;
  content = content.replace(/date: "(.*?)"\n/, `date: "$1"\n${inject}`);
  fs.writeFileSync(filePath, content);
});
console.log('Done!');
