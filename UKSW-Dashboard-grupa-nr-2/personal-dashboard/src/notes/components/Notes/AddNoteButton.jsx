import { useState } from "react";
import  FormAddNote  from "./FormAddNote";
import Button from 'react-bootstrap/Button';
import styles from "../../styles/NotesPage.module.css"

export default function AddNoteButton() {
    const [showForm, setShowForm] = useState(false);
    
    return (
        <div>
            <Button 
                className={styles.add_note_btn}
                onClick={() => setShowForm(true)}
                
            >
                <i className={`bi bi-plus ${styles.add_note_icon}`}></i> 
            </Button>
            {showForm && <FormAddNote closeForm={() => setShowForm(false)} />}
        </div>
    );
}