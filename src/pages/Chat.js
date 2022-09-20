import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Repos from '../components/Repos';
import Welcome from '../components/Welcome';
import { getContributedReposRoute, getGithubMeRoute, host } from '../utils/APIRoutes';
import ChatContainer from './../components/ChatContainer';
import { io } from 'socket.io-client';

const Chat = () => {
    const socket = useRef();
    const navigate = useNavigate();
    const [repos, setRepos] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadedRepos, setIsLoadedRepos] = useState(false);
    const [reposToggle, setReposToggle] = useState(true);
    useEffect(() => {
        async function getGithubUser() {
            const getUser = await axios.get(getGithubMeRoute, { withCredentials: true })
                .then((res) => res.data);
            if (getUser.status === false) return navigate("/login")
            setCurrentUser(getUser.user)
            setIsLoaded(true);
        }
        getGithubUser()
    }, []);
    useEffect(() => {
        async function getRepos() {
            if (currentUser) {
                if (currentUser.user.isAvatarImageSet) {
                    setIsLoadedRepos(true);
                    const { data } = await axios.get(`${getContributedReposRoute}/${currentUser.user.username}`,
                        { withCredentials: true });
                    socket.current = io(host);
                    socket.current.emit("add-repo", data[0]?.repo.id);
                    setRepos(data)
                    setIsLoadedRepos(false);
                } else {
                    navigate("/setAvatar");
                }
            }
        }
        getRepos();
    }, [currentUser]);
    function handleChatChange(chat) {
        setCurrentChat(chat);
    }
    return (
        <Container>
            <div className='container'>
                <Repos isLoadedRepos={isLoadedRepos} repos={repos} reposToggle={reposToggle} setReposToggle={setReposToggle} currentUser={currentUser} changeChat={handleChatChange} />
                <div className={`wrapper ${reposToggle ? "small" : "large"}`}>
                    <main>
                        {isLoaded && currentChat === undefined ? (
                            <Welcome currentUser={currentUser} reposToggle={reposToggle} setReposToggle={setReposToggle} />
                        ) : (
                            <>
                                {currentChat && (
                                    <ChatContainer reposToggle={reposToggle} setReposToggle={setReposToggle} currentChat={currentChat} currentUser={currentUser} socket={socket} />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.div`
height:100vh;
width:100vw;
overflow:hidden;
background-color:#010409;
nav {
    color:white;
}
.container {
    display:flex;
    height:100vh;
    width:100vw;
}
.wrapper {
    width:calc(100% - 320px);
    margin-left:auto;
    transition: all .5s;
}
.large {
    width:100%;
}
`;

export default Chat