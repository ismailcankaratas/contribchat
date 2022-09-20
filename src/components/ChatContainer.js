import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute, gellAllMessagesRoute, getUserImageRoute } from '../utils/APIRoutes';
import ReactTimeAgo from 'react-time-ago'
import { RiMenu2Line } from 'react-icons/ri';
import { HiUsers } from 'react-icons/hi';
import Popup from './Popup';

const ChatContainer = ({ reposToggle, setReposToggle, currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [usersPopup, setUsersPopup] = useState(false);
    const scrollRef = useRef();
    useEffect(() => {
        async function getMessages() {
            const response = await axios.post(gellAllMessagesRoute, {
                from: currentUser.user._id,
                to: currentChat.repo.id
            })
            setMessages(response.data)
        }
        if (currentChat) {
            getMessages();
        }
    }, [currentChat]);

    async function handleSendMsg(msg) {
        const message = await axios.post(sendMessageRoute, {
            from: currentUser.user._id,
            to: currentChat.repo.id,
            message: msg
        });
        socket.current.emit("send-msg", message.data)

        const mesgs = [...messages];
        mesgs.push({ fromSelf: true, message: message.data.message });
        setMessages(mesgs);
    }
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage(msg)
            });
        }
    }, []);
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages]);
    return (
        <>
            <Popup open={usersPopup} setOpen={setUsersPopup} title={"Contributors List " + currentChat.contributors.length}>
                <div className='users'>
                    {currentChat.contributors.map((contributor, index) => (
                        <div className='user' key={contributor.id}>
                            {contributor.isAccount && (
                                <div className='active-accounts'>
                                    <a href={contributor.html_url} target="_blank">
                                        <div className='left'>
                                            <div className='avatar'>
                                                <img src={`data:image/svg+xml;base64,${contributor.user.avatarImage}`} alt="avatar" />
                                            </div>
                                            <div className='username'>{contributor.login}</div>
                                        </div>
                                        <div className='right'>
                                            <div className='contributions'><span>{contributor.contributions}</span></div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className='title'>
                        inactive accounts
                    </div>

                    {currentChat.contributors.map((contributor, index) => (
                        <div className='user' key={contributor.id}>
                            {!contributor.isAccount && (
                                <div className='inactive-accounts'>
                                    <a href={contributor.html_url} target="_blank">
                                        <div className='left'>
                                            <div className='avatar'></div>
                                            <div className='username'>{contributor.login}</div>
                                        </div>
                                        <div className='right'>
                                            <div onClick={() => alert("!")} className='invite'>Davet et</div>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Popup>
            <Container>
                <div className='chat-messages'>
                    <div className='chat-header'>
                        <div className='repo-details'>
                            {!reposToggle ? (
                                <div className='menuIcon' onClick={() => setReposToggle(!reposToggle)}>
                                    <RiMenu2Line />
                                </div>
                            ) : ""}
                            <div className='username'>
                                <h3>{currentChat.repo.name}</h3>
                                <div>{currentChat.contributors.length} people contributed</div>
                            </div>
                        </div>
                        <div className='menuIcon users' onClick={() => setUsersPopup(true)} >
                            <HiUsers />
                        </div>
                    </div>
                    {
                        messages.map((msg, index) => {
                            return (
                                <div key={index} ref={scrollRef}>
                                    <div className={`message ${msg.fromSelf ? "sended" : "recieved"}`}>
                                        <a href={`https://github.com/${msg.message.sender.username}`} target="_blank" className='avatar'>
                                            <img src={`data:image/svg+xml;base64,${msg.message.sender.avatarImage}`} alt="avatar" />
                                            <div className='username'>
                                                {msg.fromSelf ? "You" : msg.message.sender.username}
                                                <div className='time-ago'>
                                                    <ReactTimeAgo date={Date.parse(msg.message.createdAt)} /> gönderildi.
                                                </div>
                                            </div>
                                        </a>
                                        <div className='content'>
                                            <p>
                                                {msg.message.message.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
            </Container>
        </>
    )
}

const Container = styled.div`
height:100vh;
display:flex;
flex-direction:column;
justify-content:space-between;
gap:.1rem;
overflow:hidden;
.invisible {
    display:none;
}
.chat-header {
    display:flex;
    position:fixed;
    top:0;
    width: 100%;
    background-color:#010409;
    justify-content:space-between;
    align-items:center;
    padding: 1rem 2rem;
    padding-bottom:.5rem;
    border-bottom:1px solid #30363d; 
    .repo-details {
        display:flex;
        align-items:center;
        gap:1rem;
        .username {
            h3 {
                color: white;
            }
        }
    }
    .menuIcon {
            display:flex;
            align-items:center;
            justify-content:center;
            width: 50px;
            height: 50px;
            background-color:#161b22;
            border-radius:50%;
            cursor: pointer;
        }
        .menuIcon svg {
            width:25px;
            height: 25px;
        }
}
.chat-messages {
    position:relative;
    display:flex;
    height:100%;
    flex-direction:column;
    gap:1rem;
    overflow:auto;
    padding-top:5rem;
    @media (max-width: 768px) { 
        padding-top:10rem;
    }
    &::-webkit-scrollbar{
    width: .2rem;
    &-thumb {
        background-color:#ffffff39;
        width: .1rem;
        border-radius:1rem;
    }
}
.sended {
    .avatar {
        flex-direction:row-reverse;
    }
    .username {
        text-align:right;
    }
    
    .content {
            background-color:#727303;
            border-top-right-radius:.1rem!important;
            border-top-left-radius:1rem!important;
    }
}
    .message {
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        padding:0rem 1rem;
        .avatar {
            display:flex;
            align-items:center;
            gap:.3rem;
            img{
                height: 3rem;
            }
            .username {
                display:flex;
                flex-direction:column;
                gap:.3rem;
                color:white;
            }
        }
        .content {
            max-width:40%;
            padding:1rem;
            overflow-wrap:break-word;
            font-size:1.1rem;
            border-radius:1rem;
            border-top-left-radius:.1rem;
            color:#fff;
            margin:.3rem 0rem;
            @media (max-width: 768px) {
                max-width:80%;
            }
        }
        .time-ago {
            color:#ccc;
        }
    }
    .sended {
        align-items:flex-end;
        .content {
            background-color:#727303;
            margin-right:3rem;
        }
    }
    .recieved {
        justify-content:flex-start;
        .content {
            background-color:#4c4c01;
            margin-left:3rem;
        }
    }
}

`;

export default ChatContainer