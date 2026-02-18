import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards =  async (documentId, options) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {documentId, ...options});
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const generateQuiz =  async (documentId, options) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {documentId, ...options});
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const generateSummary =  async (documentId) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId});
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const chat =  async (documentId, message) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {documentId, question: message});//removed history from payload
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const explainConcept =  async (documentId, concept) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId, concept});//removed history from payload
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const getChatHistory =  async (documentId) => {
    try{
        const response = await axiosInstance.post(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    }catch(error){
        throw error.response?.data || { message: "An unknown error occured" }
    }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
}

export default aiService;