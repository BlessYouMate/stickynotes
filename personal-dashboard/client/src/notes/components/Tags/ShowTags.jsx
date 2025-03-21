import Tag from "./Tag";
import { useContext } from "react";
import { TagsContext } from "../../resources/TagsContext";

export default function ShowTags({ inNoteForm}){
    const { tags } = useContext(TagsContext)
    return inNoteForm ? (
        <>
            {tags.map((tag) => (
                <option key={tag.tagId} value={tag.tagId}>
                    {tag.tagName}
                </option>
            ))}
        </>
    ) : (
        <>
            {tags.map((tag) => (
                <Tag tag={tag} key={tag.tagId}/>
            ))}
        </>
    );
}