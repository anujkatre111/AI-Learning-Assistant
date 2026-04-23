import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { normalizeApiError } from '../utils/apiError';

const getQuizzesForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch quizzes');
  }
};

const getQuizById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(id));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch quiz');
  }
};

const submitQuiz = async (id, answers) => {
  try {
    const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(id), { answers });
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to submit quiz');
  }
};

const getQuizResults = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(id));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch quiz results');
  }
};

const quizService = {
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
};

export default quizService;
