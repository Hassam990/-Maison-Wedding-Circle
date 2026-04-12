const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/Events Adorn By Pervaiz/g, "Maison Wedding Circle");
  content = content.replace(/Events Adorn/g, "Maison Wedding Circle");
  content = content.replace(/EABP/g, "MWC");
  content = content.replace(/eventsadorn\.com/g, "maisonweddingcircle.com");
  content = content.replace(/eventsadorn/g, "maisonweddingcircle");
  
  // Specific entity fixes
  if (f.includes("contact\\page.tsx") || f.includes("contact/page.tsx")) {
    content = content.replace("you're looking", "you&apos;re looking");
    content = content.replace("you're a vendor", "you&apos;re a vendor");
    content = content.replace("we'd love", "we&apos;d love");
  }
  if (f.includes("plan\\page.tsx") || f.includes("plan/page.tsx")) {
    content = content.replace("we'll help", "we&apos;ll help");
    content = content.replace("You're all set", "You&apos;re all set");
  }
  if (f.includes("for-vendors\\page.tsx") || f.includes("for-vendors/page.tsx")) {
    content = content.replace('"Verified" Gold', '&quot;Verified&quot; Gold');
  }
  if (f.includes("for-couples\\page.tsx") || f.includes("for-couples/page.tsx")) {
    content = content.replace("Editor's Picks", "Editor&apos;s Picks");
  }
  if (f.includes("app\\page.tsx") || f.includes("app/page.tsx")) {
    content = content.replace("we'll personally", "we&apos;ll personally");
    // Also remove unused Link in page.tsx
    content = content.replace('import Link from "next/link";\r\n', "");
    content = content.replace('import Link from "next/link";\n', "");
  }
  
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log("Rebranding & ESLint fixes completed successfully");
