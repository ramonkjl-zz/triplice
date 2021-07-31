import mongoose from 'mongoose'

const URI = process.env.MONGO_URI as string

const dbConnect = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        })
        console.log(`MongoDB is connected with success!`)
    } catch (error) {
        console.log(error)
    }
}

export { dbConnect }