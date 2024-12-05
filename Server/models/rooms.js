import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type:String,
    },
    members: {
        type: [mongoose.Types.ObjectId],
    },
    messages: [{
        type:mongoose.Types.ObjectId,
        ref:"Chat"
    }],
});

export default mongoose.model("Room", roomSchema);