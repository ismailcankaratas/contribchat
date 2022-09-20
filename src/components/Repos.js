import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Logo from '../assets/githubLogoWhite.png'
import Banana from '../assets/banana.png'
import { VscChromeClose } from 'react-icons/vsc';
import Logout from './Logout';
import loader from '../assets/loader.gif'

const Repos = ({ isLoadedRepos, reposToggle, setReposToggle, repos, currentUser, changeChat }) => {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentUserBanana, setCurrentUserBanana] = useState(undefined);
    const [currentUserSelected, setCurrentUserSelected] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.user.avatarImage);
            setCurrentUserName(currentUser.user.username);
            setCurrentUserBanana(currentUser.user.banana)
        }
    }, [currentUser]);

    const changeCurrentChat = (index, repo) => {
        setCurrentUserSelected(index);
        changeChat(repo);
        setReposToggle(false);
    }
    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <>
                        <Container>
                            <div className={`menu ${reposToggle ? "open" : "close"}`}>
                                <div className='brand'>
                                    <img src={Logo} alt="Logo" />
                                    <h3>
                                        ContribChat
                                        <a href='https://github.com/'>For Github</a>
                                    </h3>
                                    <div className='menuIcon'>
                                        <VscChromeClose onClick={() => setReposToggle(!reposToggle)} />
                                    </div>
                                </div>
                                <div className='repos'>
                                    <h4>Repositories you contribute</h4>
                                    {isLoadedRepos == true ? (
                                        <img src={loader} alt="loader" className='loader' />
                                    ) :
                                        repos.length == 0 ?
                                            <span className='notRepo'>Repository you contributed to was not found 🤷‍♂️</span>
                                            :
                                            repos.map((repo, index) => {
                                                return (
                                                    <div className={`repo ${index === currentUserSelected ? "selected" : ""}`}
                                                        onClick={() => changeCurrentChat(index, repo)} key={index}>
                                                        {/* <div className='avatar'>
                                                    <img src={`data:image/svg+xml;base64,${repo.avatarImage}`} alt="avatar" />
                                                </div> */}
                                                        <div className='reponame'>
                                                            <div>{repo.contributors.length}</div>
                                                            <h3>
                                                                {repo.repo.name}
                                                                <span className='repoOwner'>{repo.repo.owner.login}</span>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }

                                    <div className='current-user'>
                                        <div className='avatar'>
                                            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                                        </div>
                                        <div className='username'>
                                            <h1>{currentUserName}</h1>
                                            <p className='banana'>
                                                <span>{currentUserBanana}</span>
                                                <img src={Banana} alt="Banana" />
                                            </p>
                                        </div>
                                        <Logout />
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </>
                )
            }
        </>
    )
}
const Container = styled.div`
.menu {
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    overflow:hidden;
    background-color:#0d1117;

    position: fixed;
    width: 320px;
    height: 100vh;
    transition: all .5s;
}
.close {
    margin-left:-320px;
}
.brand {
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:1rem;
    padding-bottom:0;
    img {
        height: 2rem;
        margin-right:.5rem;
    }
    h3 {
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;
        color:white;
        text-transform: uppercase;
        a {
            font-size:.5rem;
            background-color:#727303;
            padding: 0.5rem;;
            border-radius:1rem;
            margin-left:.3rem;
            color:white;
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
        }
        .menuIcon svg {
            width:25px;
            height: 25px;
            fill:white!important;
        }
}
.repos {
    display:flex;
    position: relative;
    height: 100%;
    padding-bottom:6rem;
    flex-direction:column;
    align-items:center;
    gap: .8rem;
    margin-top:1rem;
    overflow:hidden;
    overflow-y:auto;
    &::-webkit-scrollbar {
        width:.2rem;
        &-thumb {
            background-color:#ffffff39;
            width: .1rem;
            border-radius:1rem;
        }
    }
    h4 {
        color:#CCC;
        font-size:.7rem;
        text-transform:uppercase;
    }
    .notRepo {
        color:#CCC;
        text-align:center;
        margin-top:2rem;
    }
    .repo {
        background-color: #ffffff39;
        min-height:5rem;
        width: 90%;
        cursor: pointer;
        border-radius:.2rem;
        padding: .4rem;
        gap:1rem;
        align-items:center;
        display:flex;
        transition: .5s ease-in-out;  
        .avatar {
            img{
                height: 3rem;
            }
        }
        .reponame {
            display:flex;
            align-items:center;
            gap:.5rem;
            h3 {
                display:flex;
            flex-direction:column;
                color:white; 
                .repoOwner {
                    font-size:.7rem; 
                    color:#ccc;
                }
                .repoOwner::before {
                    content:'Owner '
                }
            }
            div {
                color:white;
                background-color:#727303;
                width:25px;
                height:25px;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:50%;
            }
        }
    }
    .selected {
        background-color:#727303;
    }
}
.current-user {
    display:flex;
    width: 320px;
    background-color:#161b22;
    position:fixed;
    bottom:0;
    justify-content:space-around;
    align-items:center;
    padding:.5rem .2rem;
    .avatar {
        img{
            height:4rem;
            max-inline-size: 100%;
        }
    }
    .username{
        h1 {
            color:white;
            font-size:1.5rem;
        }
        p {
            display: flex;
            align-items:center;
            padding-top:.5rem;
            span {
                color:white;
                font-size:1rem;
                padding-right:.5rem;
            }
            img {
                width: 25px;
                height: 25px;
            }
        }
    }
}

`;

export default Repos