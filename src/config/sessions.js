import session from "express-session";
import MongoStore from "connect-mongo";

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        secure: false, //will be changed to true upon deployment
    }
})

export default sessionConfig