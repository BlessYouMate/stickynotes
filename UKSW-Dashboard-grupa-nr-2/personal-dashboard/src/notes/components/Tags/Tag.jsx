import { useState, useContext } from "react";

import { TagsContext } from "../../resources/TagsContext";
import { NotesContext } from "../../resources/NotesContext";

import styles from "../../styles/Tags/Tag.module.css";

import Button from 'react-bootstrap/Button';
import { 
    handleDelete,
    handleSaveTagName,
    handleSaveTagColor
 } from "./tagsFetchFunctions";

const tagsToNull = async (noteId) => {
    const nullValue = null
    const response = await fetch('http://localhost:5000/notes/edit/tag', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    body: JSON.stringify({ noteId, nullValue }),
  })
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error:', errorData.error);
    alert(`Failed to edit note tag: ${errorData.error}`);
    
    return;
  }
  }

function Editing({ tag, initialTagName, initialTagColor, setTagName, setTagColor, setIsEditing }){

    const { tags, updateTagColor } = useContext(TagsContext);
    

    const [tagNameEdit, setTagNameEdit] = useState(initialTagName)
    const [tagColorEdit, setColorEdit] = useState(initialTagColor)

    const handleSave = () => {

        if(tagNameEdit == "" || tagColorEdit == ""){
            alert("Tag name can't be empty")
            setIsEditing(false)
            return
        }

        const thisTag = tags.find((t) => t.tagId == tag.tagId);

        if(initialTagName != tagNameEdit){
            handleSaveTagName(tag.tagId, tagNameEdit)
            setTagName(tagNameEdit)
            thisTag.tagName = tagNameEdit
        }

        if(initialTagColor != tagColorEdit){
            handleSaveTagColor(tag.tagId, tagColorEdit)
            setTagColor(tagColorEdit)
            updateTagColor(tag.tagId, tagColorEdit)
        }

        setIsEditing(false)
    }

    return(
        <>
            <input 
                type="text" 
                value={ tagNameEdit }
                onChange={ (e) => setTagNameEdit(e.target.value) }
                placeholder="Work" 
                name="tagName"
                maxLength={19}>
            </input>

            
            <div className={styles.colorAndButtons}>
                <input
                    style={{ backgroundColor: tag.tagColor,
                        width: "25px",
                        height: "25px", 
                        border: "2px solid black",
                        borderRadius: "5px"
                    }}
                    type="color"
                    value={ tagColorEdit }
                    onChange={(e) => {
                        setColorEdit(e.target.value)
                    }}>
                </input>
                <div className={styles.li_buttons}>
                    <Button
                        onClick={() => {setIsEditing(false)}}
                        className={styles.cancel_btn}>
                            <i className={`bi bi-x-octagon ${styles.cancel_icon}`}></i>
                    </Button>
                    <Button 
                        onClick={() => {handleSave()}}
                        className={styles.save_btn}>
                            <i className={`bi bi-floppy ${styles.save_icon}`}></i>
                    </Button>
                </div>
            </div>
            
            
        </>
    )
}


export default function Tag({ tag }){
    const [tagName, setTagName] = useState(tag.tagName)
    const [tagColor, setTagColor] = useState(tag.tagColor)
    const [isEditing, setIsEditing] = useState(false)
    const { deleteTag, tagsOriginalState } = useContext(TagsContext);
    const { notes } = useContext(NotesContext);

    
    return(
        <>
            
            <li key={tag.tagId}>
                {!isEditing && 
                <>
                    <input className={styles.checkbox} type="checkbox" id={tag.tagId} onChange={() => {tag.isChecked = !tag.isChecked}} defaultChecked={tag.isChecked}></input>
                    <label className={styles.checkboxLabel} htmlFor={tag.tagId}>{tagName}</label>
                    <div className={styles.colorAndButtons}>
                        <div className={styles.color}
                            style={{ backgroundColor: tagColor,
                                width: "25px",
                                height: "25px", 
                                border: "2px solid black",
                                borderRadius: "5px"
                            }}>
                        </div>
                        <div className={styles.li_buttons}>
                            <Button className={styles.delete_btn} onClick={() => { handleDelete(tag.tagId, deleteTag, notes, tagsToNull) }}><i className={`bi bi-trash ${styles.delete_icon}`}></i></Button>
                            <Button className={styles.edit_btn} onClick={() => {setIsEditing(true)}}><i className={`bi bi-pencil ${styles.edit_icon}`}></i></Button>
                        </div>
                    </div>
                </>}
                {isEditing && <Editing 
                tag={tag} 
                initialTagName={tagName} 
                initialTagColor={tagColor}
                setTagName={setTagName}
                setTagColor={setTagColor}
                setIsEditing={setIsEditing}
                ></Editing>}
            </li>
        </>
    )
}