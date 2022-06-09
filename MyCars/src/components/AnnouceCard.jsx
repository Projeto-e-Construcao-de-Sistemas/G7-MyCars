import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export function AnnouceCard({ title, description, estado, price, yearFabrication, yearVehicle, quilometragem }) {
    return (
        <div className='col'>
            <div className="card h-100">
                {/* <img src="" alt="" className='card-img-top'/> */}
                <svg className="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
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
                    <small className="text-mutted"> <FontAwesomeIcon icon={faLocationDot} /> {estado}</small>
                </div>
            </div>
        </div>
    )
}
