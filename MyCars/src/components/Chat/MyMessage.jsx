import React from 'react'

export default function MyMessage({message}) {
    return (
        <li className="clearfix">
            <div className="message-data text-end">
                <h4>Você</h4>
                <span className="message-data-time">{message.timestamp.toDate().toLocaleString("pt-BR")}</span>
            </div>
            <div className="message my-message float-right"> {message.message}</div>
        </li>
    )
}
