import { useState, useContext } from "react"
import Form from 'react-bootstrap/Form' 
import Button from 'react-bootstrap/Button'

import styles from "../../styles/Tags/FormAddTag.module.css";
import { TagsContext } from "../../resources/TagsContext";

export default function FormAddTag({ closeForm, addTag}){
    const { addTagOriginalState } = useContext(TagsContext);

    function generateRandomColor() {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return randomColor;
    }
    
    const [tag, setTagName] = useState("");
    const [color, setColor] = useState(generateRandomColor());

    const handleSumbit = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, 
              },
              body: JSON.stringify({tag, color})
        })
    

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.error);
            alert(`Failed to create tag: ${errorData.error}`);
            return;
        }
          
        const data = await response.json();
        console.log('Created Tag:', data.tag);

        addTag({tagName: tag, tagColor: color, tagId: data.tag.id, isChecked: data.tag.ischecked})
        addTagOriginalState({
            tagId: data.tag.id,
            IsChecked: data.tag.ischecked
        })
        resetForm()
    }

    function resetForm() {
        setTagName("");
    }

    return(
        <>
            <div className={styles.createTagContainer}>
                
                <Form method="post" className={styles.form}>
                    <h1>Create tag</h1>
                    <div className={styles.form_inputs}>
                        <label 
                            htmlFor="tagName">
                            Tag Name:
                        </label>
                        <br />
                        <input 
                            type="text" 
                            id="tagName" 
                            value={ tag }
                            onChange={ (e) => setTagName(e.target.value) }
                            placeholder="Work" 
                            name="tagName"
                            maxLength={19}>
                        </input>
                        <br/>
                        <label 
                            htmlFor="color">
                            Color:
                        </label>
                        <br/>
                        <input
                            type="color"
                            id="color"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value)
                            }}>
                            
                        </input>
                    </div>
                    
                    <br />
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
