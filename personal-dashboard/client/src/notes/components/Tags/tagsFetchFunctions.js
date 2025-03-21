export const handleDelete = async (tagId, deleteTag, notes, tagsToNull) => {
  try {
      // Wait for all notes to be updated to have tagId = null
      await Promise.all(
          notes.map(async (note) => {
              console.log("tagid sprawnanej notki", note.tagId, "usuwany tagid", tagId)
              if (note.tagId == tagId) {
                  
                  await tagsToNull(note.noteId); // Ensure the note is updated
                  console.log("beofre",note.tagId)
                  note.tagId = null; // Update the local state
                  console.log("after",note.tagId)
              }
          })
      );

      // Proceed to delete the tag only after all updates are successful
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ tagId }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error:', errorData.error);
          alert(`Failed to delete tag: ${errorData.error}`);
          return;
      }

      // Remove the tag from the local state
      deleteTag(tagId);
  } catch (error) {
      console.error('Error updating notes to null or deleting tag:', error);
      alert('An error occurred while deleting the tag. Please try again.');
  }
};


  export const handleSaveTagName = async (tagId, newTag) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/edit/tag`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        body: JSON.stringify({ tagId, newTag }),
    })

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        alert(`Failed to edit tag: ${errorData.error}`);
      
        return;
      }
}


export const handleSaveTagColor = async (tagId, newColor) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/edit/color`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      body: JSON.stringify({ tagId, newColor }),
  })

  if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error);
      alert(`Failed to edit tag color: ${errorData.error}`);
    
      return;
    }
}

export const handleChangeTagState = async (tagId) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/edit/isChecked`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                  },
                body: JSON.stringify({ tagId }),
            })
          
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                alert(`Failed to edit tag state: ${errorData.error}`);
                
                return;
              }
          }