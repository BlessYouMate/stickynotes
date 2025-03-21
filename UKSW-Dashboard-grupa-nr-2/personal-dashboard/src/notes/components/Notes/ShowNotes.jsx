import Note from "./Note"
import { useState, useEffect } from "react";
import { useContext } from "react";
import { NotesContext } from "../../resources/NotesContext";

export default function ShowNotes(){
    const {notes} = useContext(NotesContext)
    const [vw, setVw] = useState(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
    const [vh, setVh] = useState(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))
    
    useEffect(() => {
    // This logic is here to prevent blocking notes if screen gets bigger
        const handleResize = () => {
            setVw(window.innerWidth);
            setVh(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
    
        return () => {
            
            window.removeEventListener("resize", handleResize);
        };
    }, []); // Empty dependency array ensures this effect runs only once on page load

    return (
        <div className="notes-list">
                {notes.map((note) => (
                    <Note
                        note={note}
                        vh = {vh} 
                        vw = {vw}
                        key={note.noteId} 
                    />
                ))
               }
        </div>
    )
}