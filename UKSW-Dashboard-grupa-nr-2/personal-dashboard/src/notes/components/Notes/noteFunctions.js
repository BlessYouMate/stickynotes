export const handleEdit = (setIsEditing) => { 
    setIsEditing(true)
}

export const handeCancelEditing = (setTitleEdit, setDescriptionEdit, setTagIdEdit, setIsEditing, title, description, tagId) => {
    setTitleEdit(title)
    setDescriptionEdit(description)
    setTagIdEdit(tagId)
    setIsEditing(false)
}

export const handleTitleChange = (e, isEditing, setTitleEdit) => { 
    if(isEditing){
        setTitleEdit(e.target.value);
    }
}

export const handleDescriptionChange = (e, isEditing, setDescriptionEdit) => {
    if(isEditing){
        setDescriptionEdit(e.target.value);
    }
}

export const handleSave = (
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
  
    noteId, 
    setTitleEdit, 
    setDescriptionEdit) => {
        
    if(titleEdit != "" && descriptionEdit != ""){
        setTitle(titleEdit)
        setDescription(descriptionEdit)
    }
    if(titleEdit != title){
        handleSaveTitle(noteId, titleEdit)
    }

    if(descriptionEdit != description){
        handleSaveDescription(noteId, descriptionEdit)
    }

    if(tagIdEdit != tagId){
        handleSaveTag(noteId, tagIdEdit)
        setTagId(tagIdEdit)
        note.tagId = tagIdEdit
        console.log(note.tagId)
    }

    if(titleEdit == "" || descriptionEdit == ""){
        setTitleEdit(title)
        setDescriptionEdit(description)
    }

    setIsEditing(false)
}

export const changeIndexZ = (pushNote, selectedNote) => {
    pushNote(selectedNote)
}