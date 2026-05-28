import type { Block } from '../types';

export const convertToMarkdown = (title: string, blocks: Block[]): string => {
  let markdown = `# ${title}\n\n`;

  blocks.forEach(block => {
    switch (block.type) {
      case 'text':
        // Convert simple HTML tags back to Markdown
        let text = block.content
          .replace(/<b>(.*?)<\/b>/g, '**$1**')
          .replace(/<i>(.*?)<\/i>/g, '*$1*')
          .replace(/<u>(.*?)<\/u>/g, '_$1_')
          .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
          .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
          .replace(/<li>(.*?)<\/li>/g, '- $1')
          .replace(/<br>/g, '\n')
          .replace(/<[^>]*>/g, ''); // Strip remaining HTML
        markdown += `${text}\n\n`;
        break;
      
      case 'code':
        markdown += `\`\`\`${block.language || 'text'}\n${block.content}\n\`\`\`\n\n`;
        break;
      
      case 'image':
      case 'drawing':
        markdown += `![Embedded Content](${block.content})\n\n`;
        break;
    }
  });

  return markdown;
};

export const downloadMarkdown = (filename: string, content: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: 'text/markdown' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};