import express from 'express';
import dotenv from 'dotenv';
import notesRoutes from './routes/notes.js';
import tagsRoutes from './routes/tags.js'
import path from 'path';
import db from './config/db.js';
import cors from 'cors';

//Load from .env
dotenv.config({ path: './backend/.env' });

const app = express();

const allowedOrigins = [
    'https://client-stickynotes-production.up.railway.app',
    'http://localhost:5173',
]
app.use(cors({
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true,
}))
app.use(express.json());


app.use('/notes', notesRoutes);  // notes
app.use('/tags', tagsRoutes);  // tags

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../src/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../src/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});