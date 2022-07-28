import { Toast } from "bootstrap";
import { createContext, useEffect, useState } from "react";

import io from 'socket.io-client';

export const socket = io("http://127.0.0.1:3001");

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    function showNotification() {
        const toastElList = [].slice.call(document.querySelectorAll('.toast'));
        toastElList.map(function (toastEl) {
            return new Toast(toastEl).show()
        })

        toastElList.forEach((toastElement) => {
            toastElement.addEventListener('hidden.bs.toast', () => {
                notifications.pop(toastElement.id);
            });
        });
    }


    function createNotification(title, subtitle, message) {

        const notificationsInfos = [...notifications];
        const notificationInfo = {
            title,
            subtitle,
            message,
            id: notificationsInfos.length
        }

        notificationsInfos.push(notificationInfo);

        setNotifications(notificationsInfos);
    }

    function sendNotificationSocket(title, subtitle, message, idTo){
        socket.emit("notification", {title, subtitle, message, idTo});
    }

    useEffect(() => {
        showNotification();

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('notification', (data) => {
            if(userLogado === null) return;
            
            const {title, subtitle, message, idTo} = data;
            
            if(userLogado.uid === idTo) createNotification(title, subtitle, message);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };

    }, [showNotification, createNotification, userLogado])


    return (
        <NotificationContext.Provider
            value={{
                notifications,
                createNotification,
                showNotification,
                sendNotificationSocket
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
} 