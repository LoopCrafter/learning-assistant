export const chunkText = (
  text: string,
  chunkSize = 300,
  overlapSize = 50,
  pageNumber = 0
): Array<{
  content: string;
  chunkIndex: number;
  pageNumber: number;
}> => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanedText = text
    .replace(/\r\n|\r/g, "\n")
    .replace(/\f/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

  const paragraphs = cleanedText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);

  const chunks: Array<{
    content: string;
    chunkIndex: number;
    pageNumber: number;
  }> = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  let chunkIndex = 0;
  const effectiveOverlap = Math.max(0, Math.min(overlapSize, chunkSize - 1));

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n").trim(),
          chunkIndex: chunkIndex++,
          pageNumber,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (
        let i = 0;
        i < paragraphWordCount;
        i += chunkSize - effectiveOverlap
      ) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        const chunkContent = chunkWords.join(" ").trim();
        if (chunkContent.length > 0) {
          chunks.push({
            content: chunkContent,
            chunkIndex: chunkIndex++,
            pageNumber,
          });
        }
      }
      continue;
    }

    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n").trim(),
        chunkIndex: chunkIndex++,
        pageNumber,
      });

      const currentText = currentChunk.join("\n\n").trim();
      const allWords = currentText.split(/\s+/);
      const overlapWords = allWords.slice(-effectiveOverlap);
      const overlapText = overlapWords.join(" ").trim();

      currentChunk = overlapText ? [overlapText] : [];
      currentWordCount = overlapText ? overlapWords.length : 0;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n").trim(),
      chunkIndex: chunkIndex++,
      pageNumber,
    });
  }

  if (chunks.length === 0) {
    const allwords = cleanedText.split(/\s+/);
    for (let i = 0; i < allwords.length; i += chunkSize - effectiveOverlap) {
      const chunkWords = allwords.slice(i, i + chunkSize);
      const chunkContent = chunkWords.join(" ").trim();
      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          chunkIndex: chunkIndex++,
          pageNumber,
        });
      }
    }
  }
  return chunks;
};

export const findRelevanceChunks = (
  chunks: Array<{
    content: string;
    chunkIndex: number;
    pageNumber: number;
    _id?: string;
  }>,
  query: string,
  maxChunk = 3
): Array<{
  content: string;
  chunkIndex: number;
  pageNumber: number;
  _id?: string;
}> => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  const stopWords = new Set([
    "the",
    "is",
    "in",
    "and",
    "to",
    "a",
    "of",
    "that",
    "it",
    "on",
    "for",
    "as",
    "with",
    "was",
    "at",
    "by",
    "an",
    "be",
    "this",
    "from",
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunk).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      ...(chunk._id && { _id: chunk._id }),
    }));
  }

  const scoredChunks = chunks.map((chunk) => {
    const chunkText = chunk.content.toLowerCase();
    const chunkWords = chunkText
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    let score = 0;
    let matches = 0;

    for (const qWord of queryWords) {
      if (chunkText.includes(qWord)) {
        matches++;
      }
    }
    score = matches / queryWords.length;

    const uniqueMatches = [...new Set(queryWords)].filter((qWord) =>
      chunkWords.some((cWord) => cWord === qWord)
    ).length;
    score += (uniqueMatches / queryWords.length) * 0.5;

    const intersection = queryWords.filter((word) =>
      chunkWords.includes(word)
    ).length;
    const union = new Set([...queryWords, ...chunkWords]).size;
    if (union > 0) {
      score += (intersection / union) * 0.5;
    }

    return { chunk, score };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunk)
    .map((item) => ({
      content: item.chunk.content,
      chunkIndex: item.chunk.chunkIndex,
      pageNumber: item.chunk.pageNumber,
      ...(item.chunk._id && { _id: item.chunk._id }),
    }));
};
