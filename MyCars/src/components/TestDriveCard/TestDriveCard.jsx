import { faBan, faCheck, faEdit, faLocationDot, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage'
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../services/firebaseConfig'

export function TestDriveCard({ title, solicitanteName, dateTime, imageUrl, id, onUpdate}) {

    const storage = getStorage();

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const [didLoad, setLoad] = useState(false);

    const imgStyle = didLoad ? {} : { visibility: 'hidden' };
    const spinnerStyle = !didLoad ? { marginTop: '30%', marginBottom: '30%' } : { visibility: 'hidden' };

    async function approveTestDrive(){
        const testDriveDoc = doc(db, "testsDrive", id);

        await updateDoc(testDriveDoc, {
            approved: true
        })

        onUpdate();
    }

    async function declineTestDrive(){
        const testDriveDoc = doc(db, "testsDrive", id);

        await updateDoc(testDriveDoc, {
            declined: true
        });
        onUpdate();
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
                    <h5 className="card-title">Veículo: {title}</h5>
                    <p><b>Solicitante:</b> {solicitanteName}</p>
                    <p><b>Data e horário:</b>{dateTime}</p>
                </div>
                <div className="card-footer">

                    <div className="btn-group col-sm-12" role="group" aria-label="Basic mixed styles example">
                        <button type="button" className="btn btn-success" onClick={approveTestDrive}>
                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "10%" }} />
                            Aprovar
                        </button>
                        <button type="button" className="btn btn-danger" onClick={declineTestDrive}>
                            <FontAwesomeIcon icon={faBan} style={{ marginRight: "10%" }} />
                            Recusar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
