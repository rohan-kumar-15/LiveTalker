import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";


const socket = io('https://livetalker-server.onrender.com');

function Home(){
    const { selectedChat, user } = useSelector(state => state.userReducer);
    const [onlineUser, setOnlineUser] = useState([]);
    ////////////////////

useEffect(() => {
    if(user){
        socket.emit('join-room', user._id);
        socket.emit('user-login', user._id);

        const handleOnlineUsers = (onlineusers) => setOnlineUser(onlineusers);

        socket.on('online-users', handleOnlineUsers);
        socket.on('online-users-updated', handleOnlineUsers);

        const handleBeforeUnload = () => {
            socket.emit('user-offline', user._id);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            socket.emit('user-offline', user._id);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socket.off('online-users', handleOnlineUsers);
            socket.off('online-users-updated', handleOnlineUsers);
        };
    }
}, [user]); // Only user as dependency



    return (

        <div className="home-page">
            <Header socket={socket}></Header>
    <div className="main-content">
        <Sidebar socket = {socket} onlineUser={onlineUser}></Sidebar>
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
    </div>
</div>
    );
}
export default Home;