import React from 'react'

export default function ChatAnnouncement({name, img, owner=""}) {
    return (
        <li className="clearfix">
            <img src={img} alt="avatar" />
            <div className="about">
                <div className="name">{name}</div>
                <div className="status"> <i className="fa fa-circle offline"></i> left 7 mins ago </div>
            </div>
        </li>

    )
}
