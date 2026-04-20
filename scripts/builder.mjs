import fs from 'fs';
import path from 'path';

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
};

const files = getAllFiles('./src/posts');
const mockTags = ['React', 'TypeScript', 'Node.js', '架构', '思考', '日记', '算法', '前端', '后端', '读书', 'Python', 'Web3'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('tags:')) return; 

  const t1 = mockTags[Math.floor(Math.random() * mockTags.length)];
  let t2 = mockTags[Math.floor(Math.random() * mockTags.length)];
  while(t1 === t2) t2 = mockTags[Math.floor(Math.random() * mockTags.length)];

  const lines = content.split('\n');
  let newLines = [];
  let inserted = false;
  let inFrontmatter = false;
  for (let line of lines) {
    newLines.push(line);
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        if (!inserted) {
          newLines.pop();
          newLines.push(`tags: "${t1}, ${t2}"`);
          newLines.push(line);
          inserted = true;
        }
        inFrontmatter = false;
      }
    }
  }
  fs.writeFileSync(file, newLines.join('\n'), 'utf8');
});

const categories = ['算法', '系统设计', '工具', '随笔', '课程学习'];

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

for (let i = 1; i <= 25; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const t1 = mockTags[Math.floor(Math.random() * mockTags.length)];
  let t2 = mockTags[Math.floor(Math.random() * mockTags.length)];
  while(t1 === t2) t2 = mockTags[Math.floor(Math.random() * mockTags.length)];
  
  const date = randomDate(new Date(2025, 0, 1), new Date(2026, 4, 1));
  const dir = path.join('./src/posts', cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = `---
title: "批量自动测试文章 ${i}"
date: "${date}"
excerpt: "这是自动生成的大量测试文章之一，用于测试各种分页情况以及标签过滤情况。"
tags: "${t1}, ${t2}"
---
# 批量文章测试 ${i}

这是正文内容。我们在测试超过规定条数时的自动分页以及 Timeline 布局。
`;
  fs.writeFileSync(path.join(dir, `mock-post-${i}.md`), content, 'utf8');
}
console.log('Tags injected and 25 mock posts generated.');
