import { useState } from "react"
import Form from 'react-bootstrap/Form' 
import Button from 'react-bootstrap/Button'

import ShowTags from "../Tags/ShowTags";

import styles from "../../styles/Notes/FormAddNote.module.css"

import { useContext } from "react";
import { NotesContext } from "../../resources/NotesContext";
import { TagsContext } from "../../resources/TagsContext";

export default function FormAddNote({ closeForm}){

    const {addNote} = useContext(NotesContext)
    const { tags } = useContext(TagsContext)

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagId, setTagId] = useState("null")

    const handleSumbit = async () => {
        const tagValue = tagId === "null" ? null : parseInt(tagId, 10); 
        const selectedTag = tags.find((tag) => tag.tagId == tagValue);
    
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, description, tagId: tagValue }),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            alert(`Failed to create note: ${errorData.error}`);
            return;
        }
    
        const data = await response.json();
        console.log('Created Note:', data.note);
        
        addNote({
            title,
            description,
            noteId: data.note.id,
            tagId: tagValue,
            isVisible: selectedTag ? selectedTag.isChecked : true,
        });
        resetForm();
    };

    function resetForm() {
        setTitle("");
        setDescription("");
    }

    return(
        <>
            <div className={styles.create_note_container}>
                
                <Form method="post" className={styles.form}>
                    <h1>Create note</h1>
                    <div className={styles.form_inputs}>
                        <label 
                            htmlFor="title">
                            Title:
                        </label>
                        <br />
                        <input 
                            type="text" 
                            id="title" 
                            value={ title }
                            onChange={ (e) => setTitle(e.target.value) }
                            placeholder="Do laundry" 
                            name="title">
                        </input>
                        <br />
                        <br />
                        <label 
                            htmlFor="desc">
                                Description: 
                        </label>
                        <br />
                        <textarea 
                            name="description" 
                            id="desc" 
                            value={ description }
                            onChange={ (e) => setDescription(e.target.value) }
                            placeholder="Do it quick">
                        </textarea>   
                    </div>
                    <label htmlFor="tags">Choose a tag:</label><br/>
                    <select id="tags" onChange={(e) => setTagId(e.target.value)}>
                        <option value="">null</option>
                        <ShowTags inNoteForm={true}></ShowTags>
                    </select>
                    <br/><br />
                    <div className={styles.form_btns}>
                        <Button className={styles.create_btn} type="submit" onClick={ e => {
                            e.preventDefault();
                            handleSumbit();
                        } }>
                            Create</Button>
                        <Button className={styles.cancel_btn} onClick={ e => {
                            e.preventDefault();
                            closeForm(); 
                        }}>
                            Cancel
                        </Button>
                    </div>
                    
                </Form>
            </div>
        </>
    )
}