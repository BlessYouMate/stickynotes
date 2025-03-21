import { useState, useContext } from "react"
import  FormAddTag  from "./FormAddTag";
import styles from "../../styles/Tags/TagsList.module.css";
import Button from 'react-bootstrap/Button';

import { TagsContext } from "../../resources/TagsContext";
import { NotesContext } from "../../resources/NotesContext";

import { handleChangeTagState } from "./tagsFetchFunctions";

import ShowTags from "./ShowTags";

export function TagsList() {

    const { addTag, tags, tagsOriginalState } = useContext(TagsContext);
    const { notes, pushNote } = useContext(NotesContext);

    const [showForm, setShowForm] = useState(false)

    const [isVisible, setIsVisible] = useState(false)

    const toggleTagsList = () => {
        setIsVisible((prev) => {
            return !prev;
        });
    }

    const AddTagForm = () => {
        setShowForm(true);
    }

    const handleApplyFilters = () => {
       
        // Compare current tags with their original state
        tags.forEach((checkingTag) => {
            const tagOriginalState = tagsOriginalState.find(
                (tagState) => tagState.tagId == checkingTag.tagId
            );
            
    
            if (tagOriginalState) {
                // Only perform action if there's an actual change
                if (checkingTag.isChecked != tagOriginalState.isChecked) {
                    handleChangeTagState(checkingTag.tagId)
                    tagOriginalState.isChecked = checkingTag.isChecked
                }
            } 
            
        });

      
        notes.forEach((note) => {
            const tag = tags.find((tag) => tag.tagId == note.tagId);
            const isChecked = tag ? tag.isChecked : true; // Default to visible if no tag is associated
            pushNote({ ...note, isVisible: isChecked });
        });

    }

    return(
        <>
        <div
        className={styles.tags_container}>
            {!isVisible && (
                 <Button 
                    type="button"
                    className={styles.showTagsBtn}
                    onClick={toggleTagsList}>
                    <i className={`bi bi-bookmark ${styles.tags_icon}`}></i> 
                </Button>
            )}

            
                <div
                className={`${styles.tags_list} ${isVisible ? styles.show : ""}`}>
                    <Button className={styles.close_btn} onClick={toggleTagsList}><i className={`bi bi-arrow-bar-right ${styles.close_icon}`}></i></Button><br/><br/>
                    <Button className={styles.add_btn} onClick={AddTagForm}><i className={`bi bi-plus-lg ${styles.add_icon}`}></i></Button>
                    {showForm && <FormAddTag closeForm={() => setShowForm(false)} addTag={addTag} />}
                    <ul style={
                        showForm ? {maxHeight: "45vh"} : {maxHeight: "70vh"}
                    }>
                        
                        <ShowTags inNoteForm={false}></ShowTags>
                    </ul>
                    <Button 
                    className={styles.tags_filter_btn}
                    onClick={handleApplyFilters}>
                        Apply filters
                    </Button>
                </div>
            
        </div>
        </>
    )
}