/**
 * Converts a Tiptap HTML string to Markdown.
 * Note: For a professional app, you'd typically use a library like 'turndown'.
 * Since we don't have it yet, we'll use a robust regex-based approach for common elements.
 */
export const convertHtmlToMarkdown = (title: string, html: string): string => {
  let md = `# ${title}\n\n`;
  console.log(html);
  

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      const type = el.getAttribute("data-type");

      // 1) Your custom widget
      if (type === "code-block-widget") {
  const code = (el.getAttribute("data-code") ?? el.getAttribute("code") ?? "").toString();

  const lang =
    el.getAttribute("data-language") ??
    el.getAttribute("language") ??
    "javascript";

  const decodedCode = code
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return `\n\`\`\`${lang}\n${decodedCode}\n\`\`\`\n\n`;
}


      // 1b) Tiptap default rendering for code blocks: <pre><code>...</code></pre>
      if (el.tagName === "PRE") {
        const codeEl = el.querySelector("code");
        const codeText = codeEl?.textContent ?? el.textContent ?? "";
        const lang =
          el.getAttribute("data-language") ||
          el.getAttribute("data-lang") ||
          codeEl?.getAttribute("data-language") ||
          "javascript";

        // Trim to avoid extra blank lines inside the fence
        return `\n\`\`\`${lang}\n${codeText.replace(/\n$/, "")}\n\`\`\`\n\n`;
      }

      if (el.tagName === "CODE") {
        // Sometimes code appears without PRE wrapper (depends on editor setup)
        const text = el.textContent ?? "";
        return `\n\`\`\`javascript\n${text.replace(/\n$/, "")}\n\`\`\`\n\n`;
      }

      // 2) Custom drawing widget
      if (type === "drawing-widget") {
        const url = el.getAttribute("data-url");
        return url ? `\n![Drawing](${url})\n\n` : "";
      }

      // 3) Process children first
      let inner = "";
      el.childNodes.forEach((child) => {
        inner += processNode(child);
      });
      inner = inner.trim();

      // 4) Standard tags
      switch (el.tagName) {
        case "H1":
          return `# ${inner}\n\n`;
        case "H2":
          return `## ${inner}\n\n`;
        case "H3":
          return `### ${inner}\n\n`;
        case "STRONG":
        case "B":
          return `**${inner}**`;
        case "EM":
        case "I":
          return `*${inner}*`;
        case "U":
          return `_${inner}_`;
        case "P":
          return inner ? `${inner}\n\n` : "";
        case "UL":
          return `\n${inner}\n`;
        case "OL":
          return `\n${inner}\n`;
        case "LI":
          return `- ${inner}\n`;
        case "BR":
          return `\n`;
        case "IMG":
          return `![Image](${el.getAttribute("src")})\n\n`;
        default:
          return inner;
      }
    }

    return "";
  };

  temp.childNodes.forEach((child) => {
    md += processNode(child);
  });

  return md.replace(/\n{3,}/g, "\n\n").trim();
};

/**
 * Downloads the content as a .md file
 */
export const downloadMarkdown = (filename: string, content: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: 'text/markdown' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Converts Markdown back to HTML (simplistic for now)
 * In a real app, use 'marked' or 'showdown' library.
 */
export const convertMarkdownToHtml = (markdown: string): string => {
  const md0 = markdown ?? "";

  // 1) Tokenize code fences first so blank lines inside code won't be split into <p>
  const codeWidgets: string[] = [];
  let md = md0.replace(/```(\w+)?\r?\n([\s\S]*?)```/g, (_m, lang, code) => {
    const language = (lang || "javascript").toString();
    const decoded = String(code ?? "").replace(/\r\n/g, "\n").replace(/\n$/, "");

    const encodedCode = decoded
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const widget = `<div data-type="code-block-widget" code="${encodedCode}" language="${language}"></div>`;
    const token = `__CODE_WIDGET_${codeWidgets.length}__`;
    codeWidgets.push(widget);
    return token;
  });

  // 2) Tokenize drawings and images too (optional but helps with edge cases)
  // Drawings: ![Drawing](url)
  const drawingWidgets: string[] = [];
  md = md.replace(/!\[Drawing\]\(([^)]+)\)/g, (_m, url) => {
    const safeUrl = String(url).replace(/"/g, "&quot;");
    const widget = `<div data-type="drawing-widget" data-url="${safeUrl}" data-width="700" data-height="350"></div>`;
    const token = `__DRAWING_WIDGET_${drawingWidgets.length}__`;
    drawingWidgets.push(widget);
    return token;
  });

  // Images: ![Image](url)
  const imageTokens: string[] = [];
  md = md.replace(/!\[Image\]\(([^)]+)\)/g, (_m, url) => {
    const safeUrl = String(url).replace(/"/g, "&quot;");
    const html = `<img src="${safeUrl}" alt="Image" />`;
    const token = `__IMAGE_WIDGET_${imageTokens.length}__`;
    imageTokens.push(html);
    return token;
  });

  // 3) Paragraphize (only non-token blocks)
  const blocks = md.split(/\n{2,}/);
  const htmlBlocks = blocks
    .map((raw) => {
      const block = raw.trim();
      if (!block) return "";

      const codeMatch = block.match(/^__CODE_WIDGET_(\d+)__$/);
      if (codeMatch) return codeWidgets[Number(codeMatch[1])] ?? "";

      const drawingMatch = block.match(/^__DRAWING_WIDGET_(\d+)__$/);
      if (drawingMatch) return drawingWidgets[Number(drawingMatch[1])] ?? "";

      const imageMatch = block.match(/^__IMAGE_WIDGET_(\d+)__$/);
      if (imageMatch) return imageTokens[Number(imageMatch[1])] ?? "";

      // If it already looks like HTML, keep it
      if (block.includes('data-type="') || block.startsWith("<h1") || block.startsWith("<h2") || block.startsWith("<h3") || block.startsWith("<img")) {
        return block;
      }

      if (block.startsWith("# ")) return `<h1>${block.slice(2)}</h1>`;
      if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith("### ")) return `<h3>${block.slice(4)}</h3>`;

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((line) => line.trim().startsWith("- "))
          .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${block}</p>`;
    })
    .filter(Boolean);

  return htmlBlocks.join("\n");
};
