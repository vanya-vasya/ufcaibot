import { parseContentBlocks } from '@/lib/parseContentBlocks';

describe('parseContentBlocks', () => {
  it('should properly split content with all four headings present', () => {
    const content = `
      Block 1
      This is the content for block 1.
      It can span multiple lines.
      
      Block 2
      This is the content for block 2.
      More content here.
      
      Block 3
      This is the content for block 3.
      More content in block 3.
      
      Block 4
      This is the content for block 4.
      Final content here.
    `;

    const result = parseContentBlocks(content);

    expect(result.block1).toContain('This is the content for block 1');
    expect(result.block1).toContain('It can span multiple lines');
    expect(result.block2).toContain('This is the content for block 2');
    expect(result.block2).toContain('More content here');
    expect(result.block3).toContain('This is the content for block 3');
    expect(result.block3).toContain('More content in block 3');
    expect(result.block4).toContain('This is the content for block 4');
    expect(result.block4).toContain('Final content here');
  });

  it('should handle extra whitespace and newlines', () => {
    const content = `
      
      
      Block 1
      
      
      Content for block 1 with lots of spaces.
      
      
      
      Block 2
      
      
      Content for block 2.
      
      
      Block 3
      
      
      Content for block 3.
      
      
      Block 4
      
      
      Content for block 4.
      
      
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1 with lots of spaces.');
    expect(result.block2.trim()).toBe('Content for block 2.');
    expect(result.block3.trim()).toBe('Content for block 3.');
    expect(result.block4.trim()).toBe('Content for block 4.');
  });

  it('should handle case-insensitive headings', () => {
    const content = `
      BLOCK 1
      Content 1
      
      block 2
      Content 2
      
      BlOcK 3
      Content 3
      
      BLOCK 4
      Content 4
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
    expect(result.block4.trim()).toBe('Content 4');
  });

  it('should handle headings with extra spaces', () => {
    const content = `
      Block  1
      Content 1
      
      Block    2
      Content 2
      
      Block 3
      Content 3
      
      Block     4
      Content 4
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
    expect(result.block4.trim()).toBe('Content 4');
  });

  it('should return empty blocks when no headings are present', () => {
    const content = `
      This is some random content
      without any block headings.
      Just plain text.
    `;

    const result = parseContentBlocks(content);

    expect(result.block1).toBe('');
    expect(result.block2).toBe('');
    expect(result.block3).toBe('');
    expect(result.block4).toBe('');
  });

  it('should handle missing Block 2 and 3', () => {
    const content = `
      Block 1
      Content for block 1
      
      Block 4
      Content for block 4
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1');
    expect(result.block2).toBe('');
    expect(result.block3).toBe('');
    expect(result.block4.trim()).toBe('Content for block 4');
  });

  it('should handle missing Block 4', () => {
    const content = `
      Block 1
      Content for block 1
      
      Block 2
      Content for block 2
      
      Block 3
      Content for block 3
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1');
    expect(result.block2.trim()).toBe('Content for block 2');
    expect(result.block3.trim()).toBe('Content for block 3');
    expect(result.block4).toBe('');
  });

  it('should handle only Block 1', () => {
    const content = `
      Block 1
      Content for block 1 only
      More content here
    `;

    const result = parseContentBlocks(content);

    expect(result.block1).toContain('Content for block 1 only');
    expect(result.block1).toContain('More content here');
    expect(result.block2).toBe('');
    expect(result.block3).toBe('');
    expect(result.block4).toBe('');
  });

  it('should handle Windows line endings (CRLF)', () => {
    const content = "Block 1\r\nContent 1\r\n\r\nBlock 2\r\nContent 2\r\n\r\nBlock 3\r\nContent 3\r\n\r\nBlock 4\r\nContent 4";

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
    expect(result.block4.trim()).toBe('Content 4');
  });

  it('should handle old Mac line endings (CR)', () => {
    const content = "Block 1\rContent 1\r\rBlock 2\rContent 2\r\rBlock 3\rContent 3\r\rBlock 4\rContent 4";

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
    expect(result.block4.trim()).toBe('Content 4');
  });

  it('should handle empty content', () => {
    const content = '';

    const result = parseContentBlocks(content);

    expect(result.block1).toBe('');
    expect(result.block2).toBe('');
    expect(result.block3).toBe('');
    expect(result.block4).toBe('');
  });

  it('should handle content with block headings in the middle of text', () => {
    const content = `
      Some intro text
      Block 1
      Content 1
      Block 2
      Content 2
      Block 3
      Content 3
      Block 4
      Content 4
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
    expect(result.block4.trim()).toBe('Content 4');
  });

  it('should handle multiline content in each block', () => {
    const content = `
      Block 1
      First line of block 1
      Second line of block 1
      Third line of block 1
      
      Block 2
      First line of block 2
      Second line of block 2
      
      Block 3
      First line of block 3
      Second line of block 3
      Third line of block 3
      
      Block 4
      First line of block 4
      Second line of block 4
    `;

    const result = parseContentBlocks(content);

    expect(result.block1).toContain('First line of block 1');
    expect(result.block1).toContain('Second line of block 1');
    expect(result.block1).toContain('Third line of block 1');
    
    expect(result.block2).toContain('First line of block 2');
    expect(result.block2).toContain('Second line of block 2');
    
    expect(result.block3).toContain('First line of block 3');
    expect(result.block3).toContain('Second line of block 3');
    expect(result.block3).toContain('Third line of block 3');
    
    expect(result.block4).toContain('First line of block 4');
    expect(result.block4).toContain('Second line of block 4');
  });
});

