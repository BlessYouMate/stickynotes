import { useContext, useEffect, useState } from "react";
import AddNoteButton from "./components/Notes/AddNoteButton";
import ShowNotes from "./components/Notes/ShowNotes";

import { TagsList } from "./components/Tags/TagsList";
import { TagsContext } from "./resources/TagsContext";
import { NotesContext } from "./resources/NotesContext";

import styles from "../notes/styles/NotesPage.module.css";
import Button from 'react-bootstrap/Button';

export default function NotesPage() {
    const { fetchTags } = useContext(TagsContext);
    const { fetchNotes } = useContext(NotesContext);

    // State to track if tags are fully fetched
    const [tagsLoaded, setTagsLoaded] = useState(false);
    const [notesLoaded, setNotesLoaded] = useState(false);

    useEffect(() => {
        // Fetch tags and set `tagsLoaded` to true when done
        const fetchAllTags = async () => {
            console.log("Fetching tags...");
            await fetchTags(); // Wait for fetchTags to complete
            setTagsLoaded(true); // Mark tags as loaded
        };
        fetchAllTags();
    }, [fetchTags]);

    useEffect(() => {
        // Only fetch notes when tags are fully loaded
        const fetchAllNotes = async () => {
            if (tagsLoaded) {
                console.log("Fetching notes...");
                await fetchNotes(); // Wait for fetchNotes to complete
                setNotesLoaded(true)
            }
        };
        fetchAllNotes();
    }, [tagsLoaded, fetchNotes]); // Runs only when tagsLoaded changes

    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <div className={styles.buttons}>
                    <Button
                        className={styles.homepage_btn}
                        onClick={() => { location.href = "/" }}
                    >
                        <i className={`bi bi-house ${styles.homepage_icon}`}></i>
                    </Button>
                    <br /><br />
                    <AddNoteButton />
                </div>
                <TagsList className={styles.tagsList} />
            </div>
            {/* ShowNotes only runs when tags are loaded */}
            {notesLoaded ? <ShowNotes /> : <p>Loading notes...</p>}
        </div>
    );
}
