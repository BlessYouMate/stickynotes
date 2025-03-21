import pool from '../config/db.js';

const createTag = async (req, res) => {
    const { tag, color } = req.body;
    if (!tag) {
        return res.status(400).json({ error: 'tag is required, color is optional' });
    }

    try {
        if(!color){
            const result = await pool.query(
                'INSERT INTO tags (tag, isChecked) VALUES ($1, TRUE) RETURNING *',
                [tag]
            );
            res.json({ message: 'Tag created successfully', tag: result.rows[0] });
        }
        else{
            const result = await pool.query(
                'INSERT INTO tags (tag, color, isChecked) VALUES ($1, $2, TRUE) RETURNING *',
                [tag, color]
            );
            res.json({ message: 'Tag created successfully', tag: result.rows[0] });
        }
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
}; 

const delTag = async (req, res) => {
    const { tagId } = req.body;
    if (!tagId) {
        return res.status(400).json({ error: 'tagId is required' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM tags WHERE (id) = ($1);',
            [tagId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tag does not exist or user do ont have acces to it' });
        }

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllTags = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tags');
        res.json({message: "All tags of specified user", tags:result.rows});
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const editTagName = async (req, res) => {
    const { tagId, newTag } = req.body;
    if (!tagId || !newTag) {
        return res.status(400).json({ error: 'tagId and newTag are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tags SET tag = $1 WHERE id = $2 RETURNING *;',
            [newTag, tagId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tag does not exists or user do not have access to it' });
        }
        
        res.json({ message: 'Tag edited successfully', tag: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const editTagColor = async (req, res) => {
    const { tagId, newColor } = req.body;
    if (!tagId || !newColor) {
        return res.status(400).json({ error: 'tagId and newColor are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tags SET color = $1 WHERE id = $2 RETURNING *;',
            [newColor, tagId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tag does not exists or user do not have access to it' });
        }
        
        res.json({ message: 'Tag edited successfully', tag: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const changeTagState = async (req, res) => {
    const { tagId} = req.body;
    if (!tagId) {
        return res.status(400).json({ error: 'tagId is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE tags SET isChecked = NOT isChecked WHERE id = $1 RETURNING *;',
            [tagId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tag does not exists or user do not have access to it' });
        }
        
        res.json({ message: 'Tag checked successfully', tag: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export{ createTag, delTag, editTagName, editTagColor, getAllTags, changeTagState };