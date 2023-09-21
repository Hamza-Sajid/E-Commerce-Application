// Importing express
import express from 'express';
// Importing the controller 
import { getUser, getComments, getStarRating, postComment } from './userController';
// Importing authentication middleware
import verifyToken from '../../util/verifyToken';

const userRoutes = express.Router();

// Verify token [JWT]
userRoutes.get('', verifyToken, getUser);

// Comments API

userRoutes.post("/comment", postComment)

userRoutes.get("/comment/:productId", getComments)

userRoutes.get("/comment/star/:productId", getStarRating)

export default userRoutes;