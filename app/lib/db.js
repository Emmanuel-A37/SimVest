import mongoose from 'mongoose';

const mongodb_uri = process.env.MONGO_URI;

 export const connect = () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState == 1){
        console.log("Already Connected");
        return;
    }

    if(connectionState == 2){
        console.log("Connecting...")
        return;
    }

    try {
        mongoose.connect(mongodb_uri);
    } catch (error) {
        throw new Error("error")
    }


}

