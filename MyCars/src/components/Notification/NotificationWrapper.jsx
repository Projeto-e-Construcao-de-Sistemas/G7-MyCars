import React from 'react'
import { useContext } from 'react';
import Notification from '../../components/Notification/Notification';
import { NotificationContext } from './NotificationContext';

export default function NotificationWrapper() {

    const { notifications, showNotification } = useContext(NotificationContext);

    showNotification();
   
    return (

        <div aria-live="polite" aria-atomic="true" className="position-relative">
            <div className="toast-container position-fixed bottom-0 end-0 p-3">

                {notifications.map((notification) => {
                    return <Notification title={notification.title} subtitle={notification.subtitle} message={notification.message} key={notification.id} id={notification.id} />
                })}
            </div>
        </div>

    )
}
