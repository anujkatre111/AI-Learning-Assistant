import Document from "../models/Document";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF} from "../utils/pdfParser.js"
import { chunkText } from "../utils/textChunker.js"
import fs from "fs/promises";
import mongoose from "mongoose";

//@desc Upload a PDF document
//@route POST /api/documents/upload
//@access Private
export const uploadDocument = async(req,res,next)=>{
    try{


    }catch(error){
        //Clean up uploaded file in case of error
    if(req.file){
        await fs.unlink(req.file.path).catch(()=>{});
    }
        next(error);
    }
}

//Get all users documents
export const getDocuments = async(req,res,next)=>{
    try{
        
    }catch(error){
        next(error);
    }
}

//@desc get a single document with chunks
//@route GET /api/documents/:id 
//@access Private
export const getDocument = async(req,res,next)=>{
    try{

    }catch(error){
        next(error);
    } 
}

//@desc Delete a document
//@route DELETE /api/documents/:id
//@access Private
export const deleteDocument = async(req,res,next)=>{
    try{

    }catch(error){
        next(error);
    }
}

//@desc Update a document (replace file)    
//@route PUT /api/documents/:id
//@access Private
export const updateDocument = async(req,res,next)=>{
    try{

    }catch(error){
        //Clean up uploaded file in case of error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);
    }
}