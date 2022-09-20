import React from 'react'
import styled from 'styled-components'
import { VscChromeClose } from 'react-icons/vsc';

const Popup = ({ open, setOpen, title, children }) => {
    return (
        <Container>
            <div className={`container ${open ? "open" : "close"}`}>
                <div className='popup-header'>
                    <div className='popup-title'>{title}</div>
                    <div className='close-btn'>
                        <VscChromeClose onClick={() => setOpen(false)} />
                    </div>
                </div>
                <div className='popup-main'>
                    {children}
                </div>
            </div>
        </Container>
    )
}
const Container = styled.div`
.container {
    display:flex;
    flex-direction:column;  
    width: 100%;
    height: 100vh;
    position:fixed;
    background-color:rgb(0,0,0,.75);
    transition: 0.5s ease-in-out;
    padding:1rem;
    overflow-y:auto;
}
.popup-header {
    display:flex;
    justify-content:space-between;
    .popup-title {
        font-size:1.4rem;
    }
    .close-btn {
        svg {
            width: 25px;
            height: 25px;
        }
        cursor: pointer;
    }
}
.popup-main {
    background-color:#000;
    padding:1rem;
    width: 100%;
    height:100%;
}
.open {opacity: 1 !important; z-index:50;}
.close {opacity:0!important; z-index:-5;}

.users {
    .inactive-accounts {
        .avatar {
            background-color:#727303;
            width: 4rem;
            height: 4rem;
            border-radius:50%;
        }
        @media (max-width: 425px) {
            .contributions {
                display:none;
            }
        }
    }
    .title {
        font-size:1.2rem;
        text-transform: uppercase;
        margin:1rem 0rem;
    }
    .avatar {
        img{
            height:4rem;
            max-inline-size: 100%;
        }
    }
    a {
        display:flex;
        align-items:center;
        justify-content:space-between;
        color:white;
        background-color:#0d1117;
        padding:1rem;
        border-radius:.3rem;
        margin-bottom:1rem;
        .left {
            display:flex;
            align-items:center;
            gap: .3rem;
        }
        .right {
            display:flex;
            .invite {
                display:flex;
                text-align:center;
                background-color:#727303;
                padding:.5rem .5rem;
                border-radius:1rem;
                margin-left:.5rem;
                z-index:10;
            }
        }
        .username {
            text-align:left;
        }
        .contributions {
            display:flex;
            align-items:center;
            gap: .3rem;
        }
        .contributions span {
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:50%;
            width:25px;
            height: 25px;
            background-color:#727303!important;
        }
    @media(min-width: 425px) {
        .contributions::after {
            content:' Contributions';
        }
    }
    }
    a:hover {
        background-color:#30363d;
        transition: all .5s;
    }

}
`;
export default Popup