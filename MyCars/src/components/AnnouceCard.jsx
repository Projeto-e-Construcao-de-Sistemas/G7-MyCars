import { faCheck, faEdit, faHeart, faLocationDot, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage'
import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../context/authenticationContext'
import { db } from '../services/firebaseConfig'

export function AnnouceCard({ title, description, estado, price, yearFabrication, yearVehicle, quilometragem, imageUrl, editable = false, id, isFavorite = false, finalizado = false, handleClick = () => { } }) {

    const storage = getStorage();

    // const baseUrl = process.env.PUBLIC_URL + "/";
    // const enviromnent = process.env.NODE_ENV;
    // const basePath = (enviromnent === "production") ? baseUrl : "/";

    const basePath = "/";

    const [didLoad, setLoad] = useState(false);
    const [favorited, setFavorited] = useState(isFavorite);

    const imgStyle = didLoad ? {} : { visibility: 'hidden' };
    const spinnerStyle = !didLoad ? { marginTop: '30%', marginBottom: '30%' } : { visibility: 'hidden' };

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    async function deleteAnnounce() {
        const imagesRef = ref(storage, `images/${id}/`);
        const imgList = await listAll(imagesRef);

        for (let i = 0; i < imgList.items.length; i++) {
            await deleteObject(imgList.items[i]);
        }

        const announceDoc = doc(db, "announcement", id);
        await deleteDoc(announceDoc);
    }

    async function finishAnnounce() {
        if(finalizado) return;
        const announceDoc = doc(db, "announcement", id);

        await updateDoc(announceDoc, {
            anuncioFinalizado: true
        });

    }

    async function toggleFavorite() {
        setFavorited(!favorited);

        const userDataRef = doc(db, 'users', userLogado.uid);
        if (favorited) {
            await updateDoc(userDataRef, {
                favorites: arrayRemove(id)
            });
        } else {
            await updateDoc(userDataRef, {
                favorites: arrayUnion(id)
            });
        }
    }


    return (
        <div className='col'>
            <div className="card h-100">
                <img src={imageUrl} alt="" className='card-img-top' onLoad={() => setLoad(true)} style={imgStyle} />

                <div className="text-center card-img-top" style={spinnerStyle}>
                    <div className="  spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div className="card-body">
                    <Link to={`${basePath}annoucement/${id}`}><h5 className="card-title">{title}</h5></Link>
                    <p className="card-text">{description}</p>
                    <h5>R$ {price}</h5>

                    <div className="row">
                        <small className="text-mutted col-sm-6 text-start">{yearFabrication}/{yearVehicle}</small>
                        <small className="text-mutted col-sm-6 text-end">{quilometragem} km</small>
                    </div>
                </div>
                <div className="card-footer">
                    {!editable ? (
                        <div className='row'>
                            <small className="col-10 text-mutted" style={{ marginTop: '10px' }}> <FontAwesomeIcon icon={faLocationDot} /> {estado}</small>
                            {signed && <button className='btn btn-default col-2 align-self-end' id={id} onClick={(e) => { toggleFavorite(e); handleClick(e); }}><FontAwesomeIcon icon={(favorited) ? faHeart : faHeartRegular} /></button>}
                        </div>
                    ) : (
                        <>
                            <div className="row col-sm-12 " style={{ margin: 'auto' }}>
                                <button type="button" className="btn btn-primary" disabled={finalizado} onClick={finishAnnounce}>
                                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: "10%" }} />
                                    {(finalizado) ? "Anúncio finalizado!" : "Finalizar anúncio"}
                                </button>
                            </div>
                            <div className="row">

                                <div className="btn-group col-sm-12 pt-1" role="group" aria-label="Basic mixed styles example">
                                    <Link to={`${basePath}createAnnouncement/${id}`} className="btn btn-warning">
                                        <FontAwesomeIcon icon={faEdit} style={{ marginRight: "10%" }} />
                                        Editar
                                    </Link>
                                    <button type="button" className="btn btn-danger" onClick={deleteAnnounce}>
                                        <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "10%" }} />
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
