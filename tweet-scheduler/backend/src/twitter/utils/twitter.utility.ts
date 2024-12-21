export class TwitterUtility {
  static modifyTweet(content: string): string {
    const disallowedWords = ['spam', 'fake'];
    let modifiedContent = content;

    for (const word of disallowedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      modifiedContent = modifiedContent.replace(regex, '****');
    }

    // Example modification: add an emoji at the end
    return modifiedContent + ' 😊';
  }

  static validateTweet(content: string, history: Set<string>): boolean {
    const maxLength = 280;
    const disallowedWords = ['spam', 'fake'];
    
    if (content.length === 0) return false;
    if (content.length > maxLength) return false;
    if (history.has(content)) return false;
    for (const word of disallowedWords) {
      if (content.includes(word)) return false;
    }
    return true;
  }

  static logTweet(content: string): void {
    // Log the tweet content to the database or a file for debugging or audit purposes
    console.log(`Tweet logged: ${content}`);
  }
}
