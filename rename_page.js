import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import open from 'open';

const pagesDir = 'src/pages';

// Function to get the next number based on the last file
function getNextNumber(files) {
  // Filter only numbered .md files (format: #####.md)
  const numberedFiles = files.filter(file => /^\d{5}\.md$/.test(file));
  
  if (numberedFiles.length === 0) {
    return '00000';
  }

  // Sort files in ascending order and get the last one
  const lastFile = numberedFiles.sort().pop();
  // Extract the number and increment it
  const currentNum = parseInt(lastFile.slice(0, 5));
  const nextNum = (currentNum + 1).toString().padStart(5, '0');
  
  return nextNum;
}

// Main function
async function copyAndRename() {
  try {
    // Read the directory
    const files = await readdir(pagesDir, { withFileTypes: true });
    
    // Get the next number
    const nextNum = getNextNumber(files.map(file => file.name));
    
    // Source and destination paths
    const sourcePath = join(pagesDir, 'zzzzz.md');
    const destPath = join(pagesDir, `${nextNum}.md`);
    
    // Copy the file
    const content = await readFile(sourcePath);
    await writeFile(destPath, content);
    
    console.log(`Successfully copied zzzzz.md to ${nextNum}.md`);

    // Open the new file in the default editor
    await open(destPath);
    console.log(`Opened ${nextNum}.md in editor`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Execute the function
copyAndRename(); 