import fs from 'fs';
import path from 'path';

// Generate new categories to trigger pagination
const newCategories = ['Database', 'Machine Learning', 'Web3', 'Mobile Dev', 'Security', 'Data Science', 'Cloud'];
newCategories.forEach((cat, index) => {
  const dir = path.join('./src/posts', cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const content = `---
title: "Introduction to ${cat}"
date: "2026-03-${String(index + 1).padStart(2, '0')}"
excerpt: "Mock category post for testing pagination in ${cat}."
tags: "mock, testing"
---
# ${cat} Post
`;
  fs.writeFileSync(path.join(dir, `mock-${cat.replace(/\s+/g, '-')}.md`), content, 'utf8');
});

console.log(`${newCategories.length} new mock categories generated.`);

// Generate new projects to trigger pagination
const dirProjects = './src/projects';
if (!fs.existsSync(dirProjects)) fs.mkdirSync(dirProjects, { recursive: true });

for (let i = 1; i <= 10; i++) {
  const content = `---
title: "Awesome Project ${i}"
date: "2025-01-${String(i).padStart(2, '0')}"
excerpt: "This is a mock project used to test pagination on the Projects page."
repo: "https://github.com/mock/project-${i}"
link: "https://project-${i}.example.com"
---
# Awesome Project ${i}
This project is awesome.
`;
  fs.writeFileSync(path.join(dirProjects, `mock-project-${i}.md`), content, 'utf8');
}

console.log('10 mock projects generated.');
