import { generateFightMessage } from '@/lib/fight-message-generator';

describe('generateFightMessage', () => {
  it('should generate correct message format with two fighter names', () => {
    const result = generateFightMessage('Conor McGregor', 'Khabib Nurmagomedov');
    expect(result).toBe('Conor McGregor VS Khabib Nurmagomedov');
  });

  it('should handle fighter names with extra whitespace', () => {
    const result = generateFightMessage('  Jon Jones  ', '  Daniel Cormier  ');
    expect(result).toBe('Jon Jones VS Daniel Cormier');
  });

  it('should throw error when first fighter name is empty', () => {
    expect(() => generateFightMessage('', 'Fighter B')).toThrow('Both fighter names are required');
  });

  it('should throw error when second fighter name is empty', () => {
    expect(() => generateFightMessage('Fighter A', '')).toThrow('Both fighter names are required');
  });

  it('should throw error when both fighter names are empty', () => {
    expect(() => generateFightMessage('', '')).toThrow('Both fighter names are required');
  });

  it('should throw error when first fighter name is only whitespace', () => {
    expect(() => generateFightMessage('   ', 'Fighter B')).toThrow('Fighter names cannot be empty');
  });

  it('should throw error when second fighter name is only whitespace', () => {
    expect(() => generateFightMessage('Fighter A', '   ')).toThrow('Fighter names cannot be empty');
  });

  it('should handle single character names', () => {
    const result = generateFightMessage('A', 'B');
    expect(result).toBe('A VS B');
  });

  it('should handle names with special characters', () => {
    const result = generateFightMessage("Cain Velasquez", "Fabricio Werdum");
    expect(result).toBe('Cain Velasquez VS Fabricio Werdum');
  });

  it('should handle very long names', () => {
    const longName1 = 'Anderson "The Spider" Silva';
    const longName2 = 'Georges "Rush" St-Pierre';
    const result = generateFightMessage(longName1, longName2);
    expect(result).toBe(`${longName1} VS ${longName2}`);
  });
});

