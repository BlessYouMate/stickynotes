import { createContext, useState, useCallback } from "react";

export const NotesContext = createContext({
    notes: [],
    addNote: () => {},
    deleteNote: () => {},
    fetchNotes: () => {},
    pushNote: () => {},
    
});

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);

    const addNote = (newNote) => {
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    const deleteNote = (noteId) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.noteId !== noteId));
    };

    const pushNote = (selectedNote) => {
        setNotes((prevNotes) => {
            const filteredNotes = prevNotes.filter(note => note.noteId !== selectedNote.noteId);
            return [...filteredNotes, selectedNote]; 
        });
    }

    const fetchNotes = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/notes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            
            const formattedNotes = data.notes.map((note) => {

                return {
                    title: note.title,
                    description: note.description,
                    noteId: note.id,
                    tagId: note.tag_id,
                    isVisible: false, 
                };
            });

            setNotes((prevNotes) => {
                const newNotes = formattedNotes.filter(
                    (note) => !prevNotes.some((existingNote) => existingNote.noteId === note.noteId)
                );
                return [...prevNotes, ...newNotes];
            });

            console.log('Fetched Notes:', formattedNotes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }, []); // Dependencies should be empty for a stable function reference

    return (
        <NotesContext.Provider value={{ notes, addNote, fetchNotes, deleteNote, pushNote }}>
            {children}
        </NotesContext.Provider>
    );
}
