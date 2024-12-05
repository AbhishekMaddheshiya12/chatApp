import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Chat", chatSchema);