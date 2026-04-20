import fs from 'fs';
import path from 'path';

const categories = ['算法', '系统设计', '工具', '随笔', '课程学习'];

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

console.log("Generating dummy files with specific tag 'React' to trigger Tag pagination...");

for (let i = 1; i <= 10; i++) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const date = randomDate(new Date(2025, 0, 1), new Date(2026, 4, 1));
  const dir = path.join('./src/posts', cat);
  
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = `---
title: "React 深度解析与测试 ${i}"
date: "${date}"
excerpt: "这篇测试文章专门使用 React 标签生成，用来测试技术栈 Tag 跳转后的页码跳转情况。"
tags: "React, Frontend"
---
# React 深度解析与测试 ${i}

测试 Tag 超过规定条数时的自动分页展示情况。
`;
  fs.writeFileSync(path.join(dir, `mock-tag-test-${i}.md`), content, 'utf8');
}
console.log('10 React posts generated.');
