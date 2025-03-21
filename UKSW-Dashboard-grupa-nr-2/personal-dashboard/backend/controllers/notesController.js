import pool from '../config/db.js';

const addNote = async (req, res) => {
    const { title, description, tagId } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'title and description are required, tagId is optional' });
    }

    try {
        if(!tagId){
            const result = await pool.query(
                'INSERT INTO notes (title, description) VALUES ($1, $2) RETURNING *',
                [title, description]
            );
            res.json({ message: 'Note created successfully', note: result.rows[0] });
        }
        else{
            const result = await pool.query(
                'INSERT INTO notes (title, description, tag_id) VALUES ($1, $2, $3) RETURNING *',
                [title, description, tagId]
            );
            res.json({ message: 'Note created successfully', note: result.rows[0] });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes;');
        res.json({message: "All notes of specified user", notes:result.rows});
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getAllNotesByTags = async (req, res) => {
    const { tagIds } = req.query;

    if (!tagIds) {
        return res.status(400).json({ error: 'tagIds are required' });
    }

    try {
        const query = `
            SELECT DISTINCT n.*
            FROM notes n
            JOIN tags t ON n.tag_id = t.id
            WHERE 
             n.tag_id = ANY($2::int[])
        `;
        const values = [tagIds];
        const { rows } = await pool.query(query, values);

        res.json({ notes: rows });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delNote = async (req, res) => {
    const { noteId } = req.body;
    if (!noteId) {
        return res.status(400).json({ error: 'noteId is required' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM notes WHERE (id) = ($1);',
            [noteId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Note does not exist or user do ont have acces to it' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const editNoteDesc = async (req, res) => {
    const { noteId, description } = req.body;
    if (!description || !noteId) {
        return res.status(400).json({ error: 'noteId and description are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE notes SET description = $1 WHERE id = $2 RETURNING *;',
            [description, noteId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note does not exists or user do not have access to it' });
        }

        res.json({ message: 'Note edited successfully', note: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const editNoteName = async (req, res) => {
    const { noteId, newTitle } = req.body;
    if (!noteId || !newTitle) {
        return res.status(400).json({ error: 'noteId and newTitle are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE notes SET title = $1 WHERE id = $2 RETURNING *;',
            [newTitle, noteId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note does not exists or user do not have access to it' });
        }
        
        res.json({ message: 'Note edited successfully', note: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const editNoteTag = async (req, res) => {
    const { noteId, newTagID } = req.body;
    if (!noteId) {
        return res.status(400).json({ error: 'noteId is required, newTagID is optional (if you leave it empty tag will be changed to null)' });
    }

    try {
        const result = await pool.query(
            'UPDATE notes SET tag_id = $1 WHERE id = $2 RETURNING *;',
            [newTagID, noteId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Note does not exists or user do not have access to it' });
        }
        
        res.json({ message: 'Note edited successfully', note: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export{ addNote, getAllNotes, delNote, editNoteDesc, editNoteName, editNoteTag, getAllNotesByTags };