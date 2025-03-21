import { createContext, useState, useCallback } from "react";

export const TagsContext = createContext({
    tags: [],
    addTag: () => {},
    deleteTag: () => {},
    fetchTags: () => {},  
    updateTagColor: () => {},
    tagsOriginalState: [],
    addTagOriginalState: () => {},
});

export function TagsProvider({ children }) {
    const [tags, setTags] = useState([]);

    const [tagsOriginalState, setTagsOriginalState] = useState([])

    const addTag = (newTag) => {
        setTags((prevTags) => [...prevTags, newTag]);
    };

    const addTagOriginalState = (newTagState) => {
        setTagsOriginalState((prevTagsStates) => [...prevTagsStates, newTagState]);
    };
    
    const deleteTag = (tagId) =>{
        setTags((prevTags) => prevTags.filter(tag => tag.tagId !== tagId));
    }

    const updateTagColor = (tagId, newColor) => {
        setTags((prevTags) =>
          prevTags.map((tag) =>
            tag.tagId == tagId ? { ...tag, tagColor: newColor } : tag
          )
        );
      };

      const fetchTags = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tags/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tags');
            }

            const data = await response.json();
            console.log(data)
            const formattedTags = data.tags.map((tag) => ({
                tagName: tag.tag,
                tagColor: tag.color,
                tagId: tag.id,
                isChecked: tag.ischecked
            }));

            const formattedTagsState = data.tags.map((tag) => ({
                tagId: tag.id,
                isChecked: tag.ischecked
            }))

            setTagsOriginalState((prevTagsState) => {
                const newTagsState = formattedTagsState.filter(
                    (tag) => !prevTagsState.some((existingTagState) => existingTagState.tagId == tag.tagId)
                );
                return [...prevTagsState, ...newTagsState];
            })

            setTags((prevTags) => {
                const newTags = formattedTags.filter(
                    (tag) => !prevTags.some((existingTag) => existingTag.tagId == tag.tagId)
                );
                return [...prevTags, ...newTags];
            });

            console.log('Fetched Tags:', formattedTags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }, []); // Dependencies should be empty for a stable function reference

    return (
        <TagsContext.Provider value={{ tags, addTag, fetchTags, deleteTag, updateTagColor, tagsOriginalState, addTagOriginalState }}>
            {children}
        </TagsContext.Provider>
    );
}
