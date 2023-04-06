import React, {useState} from "react";
import {dbService, storageService} from "../fbase";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want delete this nweet?");
        if (ok) {
            await deleteDoc(doc(dbService, "nweets", `${nweetObj.id}`));
            const desertRef = ref(storageService, nweetObj.attachmentUrl);
            await deleteObject(desertRef);
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        await updateDoc(NweetTextRef, {
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (e) => {
        const {
            target: {value},
        } = e;
        setNewNweet(value);
    };
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit yout nweet" value={newNweet} required
                                   onChange={onChange}/>
                            <input type="submit" value="Update value"/>
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && (
                            <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt=""/>
                        )}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Nweet</button>
                                <button onClick={toggleEditing}>Edit Nweet</button>
                            </>
                        )}
                    </>
                )}
        </div>
    )
}

export default Nweet;