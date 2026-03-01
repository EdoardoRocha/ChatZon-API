import mongoose from "mongoose";

const urlConnection = process.env.MONGO_URL

async function main() {
    await mongoose.connect(urlConnection)
    console.log("Conectou ao mongoose");
};

main().catch(err => console.log(err));

export default mongoose;