/**
 * Splits a given text into chunks for better AI processing.
 * @params {string} Text - full text to chunk
 * @params {number} chunkSize - size of each chunk
 * @params {number} overlap - Number of words to overlap between chunks
 * @returns {Array<content: string, chunkIndex: number, pageNumber: number>}
 */

import { text } from "stream/consumers";

export const chunkText = {text, chunkSize = 500, overlap = 50} => {
    if(!text || text.trim().length === 0){
        return [];
    }

    //Clean text while preserving pragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n/g, '\n')
        .replace(/ \n/g, '\n')
        .trim();


    //Try to split by paragraphs (single or double new lines)
    const paragraphs = cleanedText.split(/\n+/).filter(p=>p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs){
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount

    //If single chunk size exceeds chunkSize, split it by words
    if(paragraphWordCount > chunkSize){
        if(currentChunk.length > 0){
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            currentChunk = [];
            currentWordCount = 0;
        }
        //Split large paragraph into word-based chunks
        for(let i = 0; i<paragraphWords.length; i += (chunkSize - overlap)){
            const chunkWords = paragraphWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            if(i + chunkSize >= paragraphWords.length) break;
        }
        continue;
    }

    
    //If adding this paragraph exceeds chunk size, save current chunk
    if(currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0){
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
        //Create overlap from previous chunks
        const previousChunkText = currentChunk.join(' ');
        const prevWords = previousChunkText.split(/\s+/);
        const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

        currentChunk = [overlapText, paragraph.trim()];
        currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    }else{
        //Add Paragraph to current Chunk
        currentChunk.push(paragraph.trim());
        currentWordCount += paragraphWordCount;
    }

    //Add Last Chunk
    if(currentChunk.length > 0){
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    //Falback if no chunks created and split by words
    if(chunks.length === 0 && cleanedText.length > 0){
        const allWords = cleanedText.split(/\s+/);
        for(let i = 0; i < allWords.length; i += (chunkSize - overlap)){
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            if(i + chunkSize >= allWords.length) break;
        }
    }
    return chunks;

    }
};


/** 
 * Find relevant chunks based on the keywords matching
 * @params {Array<Object>} chunks - Array of chunks
 * @params {string} query - Search query
 * @params {number} maxChunks - Maximum chunks to return
 * @return {Array<Object>}
 * */ 

export const findRelevantChunks = (chunks, query, maxchunks = 5) =>{
    if(!chunks || chunks.length === 0 || !query ){
        return [];
    }

    //Common stop words to exclude
    const stopWords = new Set([
        'the', 'is', 'in', 'and', 'to', 'a', 'of', 'that', 'it', 'on', 'for', 'as', 'with', 'was', 'at', 'by', 'an', 'be', 'this', 'from', 'or', 'are'
    ])

    //Extract and clean query words
    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w=>w.length > 2 && !stopWords.has(w));

    if(queryWords.length === 0){
        //Return clean chunks object without Mongoose metadata
    }
    
}