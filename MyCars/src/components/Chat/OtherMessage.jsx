import React from 'react'

export default function OtherMessage(dateTime, message) {
    return (
        <li className="clearfix">
            <div className="message-data">
                <span className="message-data-time">10:12 AM, Today</span>
                <h4>Bernardo</h4>
            </div>
            <div className="message other-message">Are we meeting today?</div>
        </li>
    )
}
