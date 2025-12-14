/**
 * Formats plain text blog content into readable HTML with proper paragraphs
 * @param {string} content - The raw blog content
 * @returns {string} - Formatted HTML content
 */
export function formatBlogContent(content) {
  if (!content) return '';

  // If content already contains HTML tags, return as is
  if (content.includes('<p>') || content.includes('<h1>') || content.includes('<h2>')) {
    return content;
  }

  // Split by double line breaks to identify paragraphs
  const paragraphs = content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Process each paragraph
  const formattedParagraphs = paragraphs.map(paragraph => {
    // Check if it's a numbered list item (e.g., "1.", "2.", etc.)
    if (/^\d+\./.test(paragraph)) {
      return `<p class="mb-4"><strong>${paragraph}</strong></p>`;
    }

    // Replace single line breaks with <br> tags within paragraphs
    const formattedText = paragraph.replace(/\n/g, ' ');
    
    return `<p class="mb-6 text-lg leading-relaxed">${formattedText}</p>`;
  });

  return formattedParagraphs.join('\n');
}
