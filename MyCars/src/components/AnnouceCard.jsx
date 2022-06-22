import { faEdit, faLocationDot, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage'
import React from 'react'
import { Link } from 'react-router-dom'
import { db } from '../services/firebaseConfig'

export function AnnouceCard({ title, description, estado, price, yearFabrication, yearVehicle, quilometragem, imageUrl, editable = false, id }) {
    
    const storage = getStorage();

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    async function deleteAnnounce(){
        const imagesRef = ref(storage, `images/${id}/`);
        const imgList = await listAll(imagesRef);
        
        for(let i = 0; i<imgList.items.length; i++){
            await deleteObject(imgList.items[i]);
        }

        const announceDoc = doc(db, "announcement", id);
        await deleteDoc(announceDoc);
    }
    
    return (
        <div className='col'>
            <div className="card h-100">
                <img src={imageUrl} alt="" className='card-img-top' />
                 <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <h5>R$ {price}</h5>

                    <div className="row">
                        <small className="text-mutted col-sm-6 text-start">{yearFabrication}/{yearVehicle}</small>
                        <small className="text-mutted col-sm-6 text-end">{quilometragem} km</small>
                    </div>
                </div>
                <div className="card-footer">
                    {!editable ? (
                        <small className="text-mutted"> <FontAwesomeIcon icon={faLocationDot} /> {estado}</small>
                    ) : (
                        <div className="btn-group col-sm-12" role="group" aria-label="Basic mixed styles example">
                            <Link to={`${basePath}createAnnouncement/${id}`} className="btn btn-warning">
                                <FontAwesomeIcon icon={faEdit} style={{marginRight: "10%"}}/>
                                Editar
                                </Link>
                            <button type="button" className="btn btn-danger" onClick={deleteAnnounce}>
                                <FontAwesomeIcon icon={faTrashAlt} style={{marginRight: "10%"}}/>
                                Remover
                                </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
