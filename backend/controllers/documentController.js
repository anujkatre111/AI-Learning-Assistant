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
        if(!req.file){
            return res.status(400).json({
                success:false,
                error:'No file uploaded',
                statusCode:400
            });
        }

        const {title} = req.body;

        if(!title){
            //Delete Uploaded file if no title provided
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success:false,
                error:'Please provide a title for the document',
                statusCode:400
            });
        }

        //Construct the URL of the uploaded file
        const baseURL = `http://localhost:${process.env.PORT || 8000}`;
        const fileURL = `${baseURL}/uploads/documents/${req.file.filename}`;

        //Create document record
        const document = await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileURL, //Store the URL instead of local path
             fileSize: req.file.size,
             status: 'processing'
        })

        //Process PDF in backgorund (in production use a queue like BULL)
        processPDF(document._id, req.file.path).catch(err=>{
            console.log('Error processing PDF:', err);
        })

        res.status(201).json({
            success: true,
            data: document,
            message: 'File uploaded successfully and is being processed'
        })

        
        
    }catch(error){
        //Clean up uploaded file in case of error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);
    }
}

//Helper Function to process PDF
const processPDF = async(documentId, filePath)=>{
    try{
        const { text } = await extractTextFromPDF(filePath);

        //Create Chunks
        const chunks = chunkText(text,500,50);l

        //Update document
        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });
        console.log(`Document ${documentId} processed successfully.`);
    }catch(error){
        console.error(`Error processing document ${documentId}:`, error);

        await Document.findByIdAndUpdate(documentId,{
            status: 'failed'
        }); 
    }
}
//Get all users documents
export const getDocuments = async(req,res,next)=>{
    try{
        const documents = await Document.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(req.user._id)}
            },
            {
                $lookup:{
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup:{
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'
                }
            },
            {
                $addFields: {
                    flashcardCount: {$size: '$flashcardSets'},
                    quizCount: {$size: '$quizzes'}
                }
            },
            {
                $project:{
                    extractedText:0,
                    chunks:0,
                    flashcardSets:0,
                    quizzes:0
                }
            },
            {
                $sort: { uploadDate: -1 }
            }
        ]);

        res.status(200).json({
            success:true,
            count: documents.length,
            data: documents
        });

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

//@desc Delete a document -> this code deletes a doc
//@route DELETE /api/documents/:id .
//@access Private access will be allowed
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
        //Clean up uploaded file in case some error has occured
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);
    }
}