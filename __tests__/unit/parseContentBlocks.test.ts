import { parseContentBlocks } from '@/lib/parseContentBlocks';

describe('parseContentBlocks', () => {
  it('should properly split content with all three headings present', () => {
    const content = `
      Block 1
      This is the content for block 1.
      It can span multiple lines.
      
      Block 2
      This is the content for block 2.
      More content here.
      
      Block 3
      This is the content for block 3.
      Final content here.
    `;

    const result = parseContentBlocks(content);

    expect(result.block1).toContain('This is the content for block 1');
    expect(result.block1).toContain('It can span multiple lines');
    expect(result.block2).toContain('This is the content for block 2');
    expect(result.block2).toContain('More content here');
    expect(result.block3).toContain('This is the content for block 3');
    expect(result.block3).toContain('Final content here');
  });

  it('should handle extra whitespace and newlines', () => {
    const content = `
      
      
      Block 1
      
      
      Content for block 1 with lots of spaces.
      
      
      
      Block 2
      
      
      Content for block 2.
      
      
      Block 3
      
      
      Content for block 3.
      
      
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1 with lots of spaces.');
    expect(result.block2.trim()).toBe('Content for block 2.');
    expect(result.block3.trim()).toBe('Content for block 3.');
  });

  it('should handle case-insensitive headings', () => {
    const content = `
      BLOCK 1
      Content 1
      
      block 2
      Content 2
      
      BlOcK 3
      Content 3
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
  });

  it('should handle headings with extra spaces', () => {
    const content = `
      Block  1
      Content 1
      
      Block    2
      Content 2
      
      Block 3
      Content 3
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
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
  });

  it('should handle missing Block 2', () => {
    const content = `
      Block 1
      Content for block 1
      
      Block 3
      Content for block 3
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1');
    expect(result.block2).toBe('');
    expect(result.block3.trim()).toBe('Content for block 3');
  });

  it('should handle missing Block 3', () => {
    const content = `
      Block 1
      Content for block 1
      
      Block 2
      Content for block 2
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content for block 1');
    expect(result.block2.trim()).toBe('Content for block 2');
    expect(result.block3).toBe('');
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
  });

  it('should handle Windows line endings (CRLF)', () => {
    const content = "Block 1\r\nContent 1\r\n\r\nBlock 2\r\nContent 2\r\n\r\nBlock 3\r\nContent 3";

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
  });

  it('should handle old Mac line endings (CR)', () => {
    const content = "Block 1\rContent 1\r\rBlock 2\rContent 2\r\rBlock 3\rContent 3";

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
  });

  it('should handle empty content', () => {
    const content = '';

    const result = parseContentBlocks(content);

    expect(result.block1).toBe('');
    expect(result.block2).toBe('');
    expect(result.block3).toBe('');
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
    `;

    const result = parseContentBlocks(content);

    expect(result.block1.trim()).toBe('Content 1');
    expect(result.block2.trim()).toBe('Content 2');
    expect(result.block3.trim()).toBe('Content 3');
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
  });

  describe('AI text normalization', () => {
    it('should remove escaped \\n characters and replace with spaces', () => {
      const content = `
        Block 1
        Content with\\nescaped\\nnewlines
        
        Block 2
        More\\ncontent\\nhere
        
        Block 3
        Final\\ncontent
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain('\\n');
      expect(result.block1).toContain('Content with escaped newlines');
      expect(result.block2).not.toContain('\\n');
      expect(result.block3).not.toContain('\\n');
    });

    it('should remove real newlines and replace with spaces', () => {
      const content = `Block 1
Content
with
real
newlines

Block 2
More
content

Block 3
Final
content`;

      const result = parseContentBlocks(content);

      // Should not contain multiple consecutive words without spaces
      expect(result.block1).toContain('Content with real newlines');
      expect(result.block2).toContain('More content');
      expect(result.block3).toContain('Final content');
    });

    it('should remove leading and trailing quotes', () => {
      const content = `
        Block 1
        "This content has quotes"
        
        Block 2
        ""Content with double quotes""
        
        Block 3
        "Final content"
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toMatch(/^"/);
      expect(result.block1).not.toMatch(/"$/);
      expect(result.block1).toContain('This content has quotes');
      
      expect(result.block2).toContain('Content with double quotes');
      expect(result.block3).toContain('Final content');
    });

    it('should remove trailing "} pattern', () => {
      const content = `
        Block 1
        Content for block 1"}
        
        Block 2
        Content for block 2"}
        
        Block 3
        Content for block 3"}
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain('"}');
      expect(result.block1).toContain('Content for block 1');
      
      expect(result.block2).not.toContain('"}');
      expect(result.block2).toContain('Content for block 2');
      
      expect(result.block3).not.toContain('"}');
      expect(result.block3).toContain('Content for block 3');
    });

    it('should remove trailing " } pattern with space', () => {
      const content = `
        Block 1
        Content for block 1" }
        
        Block 2
        Content for block 2" }
        
        Block 3
        Content for block 3" }
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain('" }');
      expect(result.block1).not.toContain('"}');
      expect(result.block1).toContain('Content for block 1');
      
      expect(result.block2).not.toContain('" }');
      expect(result.block2).not.toContain('"}');
      expect(result.block2).toContain('Content for block 2');
      
      expect(result.block3).not.toContain('" }');
      expect(result.block3).not.toContain('"}');
      expect(result.block3).toContain('Content for block 3');
    });

    it('should remove } " pattern (reverse order)', () => {
      const content = `
        Block 1
        Content for block 1} "
        
        Block 2
        Content for block 2} "
        
        Block 3
        Content for block 3} "
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain('} "');
      expect(result.block1).not.toContain('}"');
      expect(result.block1).toContain('Content for block 1');
      
      expect(result.block2).not.toContain('} "');
      expect(result.block2).not.toContain('}"');
      expect(result.block2).toContain('Content for block 2');
      
      expect(result.block3).not.toContain('} "');
      expect(result.block3).not.toContain('}"');
      expect(result.block3).toContain('Content for block 3');
    });

    it('should remove "} pattern anywhere in content', () => {
      const content = `
        Block 1
        Some content"} with pattern in middle
        
        Block 2
        Another"}example"}here
        
        Block 3
        Final"}content
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain('"}');
      expect(result.block2).not.toContain('"}');
      expect(result.block3).not.toContain('"}');
    });

    it('should collapse multiple spaces into single space', () => {
      const content = `
        Block 1
        Content    with     multiple      spaces
        
        Block 2
        More      content       here
        
        Block 3
        Final         content
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toMatch(/\s{2,}/);
      expect(result.block1).toContain('Content with multiple spaces');
      
      expect(result.block2).not.toMatch(/\s{2,}/);
      expect(result.block2).toContain('More content here');
      
      expect(result.block3).not.toMatch(/\s{2,}/);
      expect(result.block3).toContain('Final content');
    });

    it('should handle metadata markers with escaped newlines', () => {
      const content = `
        Block 1
        : Odds Data\\nSome content\\nwith escaped newlines
        
        Block 2
        : Fighters Data\\nMore\\ncontent
        
        Block 3
        : Sentiment Analysis\\nFinal content"}
      `;

      const result = parseContentBlocks(content);

      expect(result.block1).not.toContain(': Odds Data');
      expect(result.block1).not.toContain('\\n');
      expect(result.block1).toContain('Some content with escaped newlines');
      
      expect(result.block2).not.toContain(': Fighters Data');
      expect(result.block2).not.toContain('\\n');
      
      expect(result.block3).not.toContain(': Sentiment Analysis');
      expect(result.block3).not.toContain('\\n');
      expect(result.block3).not.toContain('"}');
    });

    it('should produce clean single-line output with all normalizations', () => {
      const content = `
        Block 1
        : Odds Data\\n"This\\nis\\na\\ntest\\nwith   multiple    issues"}
        
        Block 2
        : Fighters Data\\n""Content\\nwith\\nall\\nproblems"}"}
        
        Block 3
        : Sentiment Analysis\\n"Final\\ncontent\\nhere"}
      `;

      const result = parseContentBlocks(content);

      // Block 1 checks
      expect(result.block1).not.toContain('\\n');
      expect(result.block1).not.toContain('\n');
      expect(result.block1).not.toContain('"}');
      expect(result.block1).not.toContain(': Odds Data');
      expect(result.block1).not.toMatch(/\s{2,}/);
      expect(result.block1).toContain('This is a test with multiple issues');
      
      // Block 2 checks
      expect(result.block2).not.toContain('\\n');
      expect(result.block2).not.toContain('\n');
      expect(result.block2).not.toContain('"}');
      expect(result.block2).not.toContain(': Fighters Data');
      expect(result.block2).not.toMatch(/\s{2,}/);
      
      // Block 3 checks
      expect(result.block3).not.toContain('\\n');
      expect(result.block3).not.toContain('\n');
      expect(result.block3).not.toContain('"}');
      expect(result.block3).not.toContain(': Sentiment Analysis');
      expect(result.block3).not.toMatch(/\s{2,}/);
      expect(result.block3).toContain('Final content here');
    });

    it('should handle real-world example with " } pattern', () => {
      const content = `
        Block 1
        Some odds analysis content here
        
        Block 2
        Some fighters analysis content here
        
        Block 3
        "Media and expert sentiment in the supplied material heavily favored Carlos Prates both before and after the contest with roughly sixty to seventy percent of narrative coverage framing him as the rising knockout specialist and a legitimate threat to Leon Edwards, common pre fight themes were Prates momentum, power, and stylistic upside while Edwards was framed as more vulnerable than in prior championship runs and carrying narrative baggage about recent setbacks, after the fight the tone became decisively pro Prates with many outlets describing a brutal knockout and questioning Edwards future standing, public perception mirrored that split with bettors and writers tilting toward Prates in the run up and celebrating his finishing result afterward, neutral takes were a minority and focused on tactical explanations and implications for rankings and future matchmaking" }
      `;

      const result = parseContentBlocks(content);

      // Block 3 should not contain " } at the end
      expect(result.block3).not.toContain('" }');
      expect(result.block3).not.toContain('"}');
      expect(result.block3).not.toContain('} "');
      expect(result.block3).not.toContain('}"');
      
      // Should contain the actual content
      expect(result.block3).toContain('Media and expert sentiment');
      expect(result.block3).toContain('Carlos Prates');
      expect(result.block3).toContain('Leon Edwards');
      
      // Should end cleanly without artifacts
      expect(result.block3).toMatch(/matchmaking$/);
    });
  });
});

