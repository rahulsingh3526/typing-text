// Categories for different types of texts
export const categories = {
  TECHNOLOGY: 'technology',
  SCIENCE: 'science',
  LITERATURE: 'literature',
  BUSINESS: 'business',
  MOTIVATION: 'motivation',
  LIFE_LESSONS: 'life_lessons',
  NATURE: 'nature'
};

const meaningfulTexts = {
  [categories.TECHNOLOGY]: [
    "artificial intelligence is transforming the way we interact with technology",
    "cloud computing has revolutionized modern business infrastructure",
    "cybersecurity is becoming increasingly important in our digital world",
    "the internet of things connects our everyday devices to make life easier",
    "blockchain technology offers new possibilities for secure transactions"
  ],
  
  [categories.SCIENCE]: [
    "the human brain processes millions of signals every second",
    "quantum physics challenges our understanding of reality",
    "climate change requires immediate global attention and action",
    "space exploration continues to reveal mysteries of our universe",
    "renewable energy sources are crucial for sustainable development"
  ],
  
  [categories.LITERATURE]: [
    "reading regularly improves vocabulary and critical thinking skills",
    "great writers observe the world with remarkable attention to detail",
    "storytelling has been a fundamental part of human culture",
    "poetry expresses complex emotions through carefully chosen words",
    "classic literature offers timeless insights into human nature"
  ],
  
  [categories.BUSINESS]: [
    "effective leadership requires clear communication and vision",
    "innovation drives competitive advantage in modern markets",
    "customer satisfaction is essential for sustainable business growth",
    "strategic planning helps organizations achieve long term goals",
    "successful entrepreneurs identify opportunities in challenging situations"
  ],
  
  [categories.MOTIVATION]: [
    "persistence and determination are keys to achieving your goals",
    "every challenge presents an opportunity for personal growth",
    "success comes from continuous learning and adaptation",
    "small daily improvements lead to remarkable long term results",
    "believing in yourself is the first step toward achieving dreams"
  ],
  
  [categories.LIFE_LESSONS]: [
    "kindness and empathy make the world a better place for everyone",
    "patience and perseverance overcome the greatest challenges",
    "true friendship is built on trust and mutual understanding",
    "learning from mistakes is essential for personal development",
    "maintaining balance in life leads to lasting happiness"
  ],
  
  [categories.NATURE]: [
    "biodiversity is essential for maintaining healthy ecosystems",
    "oceans regulate climate and support countless forms of life",
    "forests play a crucial role in maintaining earth's atmosphere",
    "every species contributes to the balance of nature",
    "conservation efforts protect our natural heritage"
  ]
};

export const generateText = (category?: string): string => {
  // Select a category randomly if none specified
  const selectedCategory = category || 
    Object.values(categories)[Math.floor(Math.random() * Object.values(categories).length)];
  
  const texts = meaningfulTexts[selectedCategory];
  const randomIndex = Math.floor(Math.random() * texts.length);
  
  // Ensure text is properly formatted
  return texts[randomIndex]
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

export const getAvailableCategories = (): string[] => {
  return Object.values(categories);
}; 