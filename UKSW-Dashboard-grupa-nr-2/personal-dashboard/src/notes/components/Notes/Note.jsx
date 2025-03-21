import { useState, useRef, useEffect, useContext } from "react";
import styles from "../../styles/Notes/Note.module.css"
import Button from 'react-bootstrap/Button';
import ShowTags from "../Tags/ShowTags";

import { TagsContext } from "../../resources/TagsContext.jsx";
import { NotesContext } from "../../resources/NotesContext.jsx";

import {
    handleTitleChange,
    handleDescriptionChange,
    handleEdit,
    handeCancelEditing,
    handleSave,
    changeIndexZ,
} from "./noteFunctions.js";

import {
    handleSaveTitle,
    handleSaveDescription,
    handleDelete,
    handleSaveTag,

} from "./noteFetchFunctions.js"

function Editing({handeCancelEditing, handleSave}){
    return(
        <>
        <div className={styles.edit_btns}> 
            <Button 
                onClick={handeCancelEditing}
                className={styles.cancel_btn}>
                     <i className={`bi bi-x-octagon ${styles.icon_cancel}`}></i>
            </Button>
            <Button 
                onClick={handleSave}
                className={styles.save_btn}>
                    <i className={`bi bi-floppy ${styles.icon_save}`}></i>
            </Button>
            
        </div>
        </>

    )   
}

function Viewing({handleDelete, handleEdit}){
    return(
        <>
        <div className={styles.view_btns}>
            <Button 
                onClick={handleDelete}
                className={styles.del_btn}>
                    <i className={`bi bi-trash ${styles.icon_trash}`}></i>
            </Button>
            

            <Button 
               onClick={handleEdit}
                className={styles.edit_btn}>
                   <i className={`bi bi-pencil ${styles.icon_edit}`}></i>
            </Button>
        </div>
        </>
    )
}

export default function Note({ note, vh, vw, isDraggable = true, onHomePage}){

    const [, forceUpdate] = useState(0); // Dummy state for triggering re-renders

    const {deleteNote, pushNote} = useContext(NotesContext)
    const {tags} = useContext(TagsContext)

    const [tagColor, setTagColor] = useState("#efcd45")
    
    const [title, setTitle] = useState(note.title)
    const [description, setDescription] = useState(note.description)
    const [tagId, setTagId] = useState(note.tagId)

    const [titleEdit, setTitleEdit] = useState(title)
    const [descriptionEdit, setDescriptionEdit] = useState(description)
    const [tagIdEdit, setTagIdEdit] = useState(tagId)

    const [isEditing, setIsEditing] = useState(false)

    const [position, setPosition] = useState(
        isDraggable
        ? { top: Math.floor(Math.random() * (vh-200)), left: Math.floor(Math.random() * (vw-200)) }
    : { top: 0, left: 0 });

    const noteRef = useRef(null);
    
    const handleMouseDown = (e) => {
        if (!isDraggable) return;
        if(!isEditing){
            e.preventDefault(); // prevent text selection
        }
        const startX = e.clientX;
        const startY = e.clientY;

        const startTop = position.top;
        const startLeft = position.left;

        const handleMouseMove = (moveEvent) => {
            let newTop = startTop + (moveEvent.clientY - startY);
            let newLeft = startLeft + (moveEvent.clientX - startX);

            // Check if the note is going out of bounds and adjust the position
            if (newTop < 0) {
                newTop = 0;
            } else if (newTop > vh - noteRef.current.offsetHeight) {
                newTop = vh - noteRef.current.offsetHeight;
            }

            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft > vw - noteRef.current.offsetWidth) {
                newLeft = vw - noteRef.current.offsetWidth;
            }
            setPosition({ top: newTop, left: newLeft });
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        const findTagColor = () => {
            const tag = tags.find((tag) => tag.tagId == tagId);    
            if (tag) {
                // Update the state with the tag's color
                setTagColor(tag.tagColor);
            } else {
                setTagColor("#efcd45"); // Default color
            }
        };

        // Call the function when `tags` or `tagId` changes
        findTagColor();
    }, [tags, tagId]); // Dependencies ensure this effect re-runs when `tags` or `tagId` changes

    useEffect(() =>{
        const setVisibility = () => {
            if(note.tagId == null){
                note.isVisible = true
            }
            const tag = tags.find((tag) => tag.tagId == tagId);
            if(tag){
                note.isVisible = tag.isChecked
            }
            forceUpdate(); // Trigger re-render
        }
        setVisibility()
    }, [])
    

    return(
        <>
            <div ref={noteRef}
            className={styles.note}

            style={{
                ...(isDraggable
                    ? {
                          position: "fixed",
                          top: `${position.top}px`,
                          left: `${position.left}px`,
                      }
                    : { position: "relative" }),
                    ...(onHomePage ? { } : (note.isVisible ? {} : { display: "none" })),
            }}

            onMouseDown={(event) => {
                // Trigger changeIndexZ when clicking anywhere on the note except buttons
                if (!event.target.closest("button")) {
                    handleMouseDown(event); // Handle drag behavior
                    changeIndexZ(pushNote, note); // Update z-index
                }
            }}
           >    
                <div className={styles.tag_indication_container}>
                    {!isEditing &&  
                    <div className={styles.tag_indication}
                        style={{backgroundColor: tagColor}}>
                    </div>
                
                    }

                    {isEditing &&
                        <select
                        id="tags"
                        onChange={(e) => setTagIdEdit(e.target.value)} // Update the local state for editing
                        value={tagIdEdit}
                    >
                        <option value="">null</option>
                        <ShowTags inNoteForm={true} />
                    </select>
                    }
                   
                </div>
                
                <textarea
                    className={styles.note_title}
                    value={isEditing ? titleEdit : title}
                    onChange={(e) => handleTitleChange(e, isEditing, setTitleEdit)}> 
                </textarea>

                <textarea
                    className={styles.note_description}
                    value={isEditing ? descriptionEdit : description}
                    onChange={(e) => handleDescriptionChange(e, isEditing, setDescriptionEdit)}>
                </textarea>

                {!isEditing && 
                    <Viewing 
                        handleDelete={() => handleDelete(note.noteId, deleteNote)} 
                        handleEdit={() => handleEdit(setIsEditing)} >
                    </Viewing>
                }
                
                {isEditing &&
                
                <Editing handeCancelEditing={() => handeCancelEditing(setTitleEdit, setDescriptionEdit, setTagId, setIsEditing, title, description, tagId)}
                         handleSave={() => {
                            handleSave(
                                note,
                                tagIdEdit,
                                tagId,
                                handleSaveTag,
                                setTagId,

                                setTitle, 
                                setDescription, 
                                
                                handleSaveTitle, 
                                handleSaveDescription, 
                                
                                setIsEditing, 
                                titleEdit, 
                                descriptionEdit, 
                                 
                                title, 
                                description, 
                                 
                                note.noteId, 
                                setTitleEdit, 
                                setDescriptionEdit)} 
                        }
                         >
                </Editing>
                }
            </div>
        </>
    )
}