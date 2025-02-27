import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing the Markdown files
const pagesDir = path.join(__dirname, 'src', 'pages');

// Get all .md files in the directory
const mdFiles = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.md'));

console.log(`Found ${mdFiles.length} Markdown files`);

let modifiedCount = 0;

// Process each file
mdFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has the layout
  if (content.includes('layout: ../layouts/MarkdownLayout.astro')) {
    console.log(`${file} already has the layout specified`);
    return;
  }
  
  // Regular expression to match YAML frontmatter between --- markers
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    // Frontmatter exists, add layout to it
    const frontmatter = match[1];
    const layoutLine = 'layout: ../layouts/MarkdownLayout.astro';
    
    // Check if the layout is already in the frontmatter with different spacing/format
    if (frontmatter.match(/layout\s*:\s*\.\.\/layouts\/MarkdownLayout\.astro/)) {
      console.log(`${file} already has the layout specified (different format)`);
      return;
    }
    
    // Insert layout line at the beginning of the frontmatter
    const updatedFrontmatter = layoutLine + '\n' + frontmatter;
    content = content.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---`);
  } else {
    // No frontmatter found, add it with the layout
    content = `---\nlayout: ../layouts/MarkdownLayout.astro\n---\n\n${content}`;
  }
  
  // Write the modified content back to the file
  fs.writeFileSync(filePath, content);
  modifiedCount++;
  console.log(`Added layout to ${file}`);
});

console.log(`\nCompleted! Added layout to ${modifiedCount} files.`); 