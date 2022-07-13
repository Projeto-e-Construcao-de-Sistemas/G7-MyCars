import React from 'react'

export default function MyMessage(dateTime, message) {
    return (
        <li className="clearfix">
            <div className="message-data text-end">
                <h4>Você</h4>
                <span className="message-data-time">10:10 AM, Today</span>
            </div>
            <div className="message my-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
        </li>
    )
}
