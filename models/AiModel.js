export class AiModel {
  static QUIZ_PROMPT = `
    Create a quiz based on the provided course content. Generate 10 multiple-choice questions that test understanding of key concepts.
    
    Each question should:
    1. Be clear and unambiguous
    2. Have exactly 4 options
    3. Have exactly one correct answer
    4. Cover important concepts from the content
    5. Be challenging but fair
    
    Return the quiz in the following JSON format:
    [
      {
        "question": "Question text here?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "The correct option",
        "explanation": "Brief explanation of why this is correct"
      }
    ]
  `;

  static NOTES_PROMPT = `
    Create comprehensive study notes from the provided content. The notes should:
    1. Be well-structured with clear headings
    2. Include key concepts and definitions
    3. Use bullet points for clarity
    4. Include examples where appropriate
    5. Be easy to read and understand
  `;

  static FLASHCARD_PROMPT = `
    Create flashcards from the provided content. Each flashcard should:
    1. Have a clear question or term on the front
    2. Have a concise but complete answer on the back
    3. Focus on key concepts
    4. Be suitable for spaced repetition learning
    
    Return the flashcards in the following JSON format:
    [
      {
        "front": "Question or term",
        "back": "Answer or definition"
      }
    ]
  `;
} 