import React from 'react'

export default function OtherMessage({message}) {
    return (
        <li className="clearfix">
            <div className="message-data">
                <span className="message-data-time">{message.timestamp.toDate().toLocaleString("pt-BR")}</span>
                <h4>{message.nameFrom}</h4>
            </div>
            <div className="message other-message">{message.message}</div>
        </li>
    )
}
