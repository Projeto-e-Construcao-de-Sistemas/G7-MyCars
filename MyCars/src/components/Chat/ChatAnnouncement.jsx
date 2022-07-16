import React from 'react'

export default function ChatAnnouncement({name, img, owner="", onClick, id = "", announcementId = ""}) {
    return (
        <li className={`clearfix ${announcementId}`} onClick={onClick} id={id}>
            <img src={img} alt="avatar"/>
            <div className="about">
                <div className="name">{name}</div>
                <div className="status"> <i className="fa fa-circle offline"></i>{owner} </div>
            </div>
        </li>

    )
}
