import mongoose from 'mongoose';


 const mongodb_uri = process.env.MONGO_URI;


 export const connect = async () => {
    console.log("Loaded MONGO_URI from .env: ", process.env.MONGO_URI);

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
       await mongoose.connect(mongodb_uri);
    } catch (error) {
        throw new Error( error.message)
    }





}

