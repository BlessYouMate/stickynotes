export const handleSaveTitle = async (noteId, newTitle) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/edit/title`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      body: JSON.stringify({ noteId, newTitle }),
  })

  if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error);
      alert(`Failed to edit note: ${errorData.error}`);
    
      return;
    }
}

export const handleSaveDescription = async (noteId, description) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/edit/desc`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      body: JSON.stringify({ noteId, description }),
  })

  if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error);
      alert(`Failed to edit note: ${errorData.error}`);
      
      return;
    }
}

export const handleSaveTag = async (noteId, newTagID) => {
  if(newTagID == ""){
    newTagID = null
  }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/edit/tag`, {
  method: 'PUT',
  headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
  body: JSON.stringify({ noteId, newTagID }),
})

if (!response.ok) {
  const errorData = await response.json();
  console.error('Error:', errorData.error);
  alert(`Failed to edit note tag: ${errorData.error}`);
  
  return false;
}
return true
}

export const handleDelete = async (noteId, deleteNote) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      body: JSON.stringify({ noteId }),
  })

  if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error);
      alert(`Failed to delete note: ${errorData.error}`);
      return;
    }
    deleteNote(noteId)
}

