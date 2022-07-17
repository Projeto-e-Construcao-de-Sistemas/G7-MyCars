import React from 'react'

export default function ChatHeader({name, img, owner=""}) {
    return (
        <div className="chat-header clearfix">
            <div className="row">
                <div className="col-lg-6">
                    <a href="#" data-toggle="modal" data-target="#view_info">
                        <img src={img} alt="avatar" />
                    </a>
                    <div className="chat-about">
                        <h6 className="m-b-0">{name}</h6>
                        <small>{owner}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}
