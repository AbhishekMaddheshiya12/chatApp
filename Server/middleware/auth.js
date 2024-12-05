import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "No token provided plz login"
        })
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        if(err){
            return res.status(401).json({
                success:false,
                message:"Invalid or expired token"
            })
        }

        console.log(decoded);
        req.user = decoded;
        next();
    })
}

export default authMiddleware;