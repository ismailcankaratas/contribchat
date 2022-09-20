import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';

const ChatInput = ({ handleSendMsg }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick = (event, emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
        setShowEmojiPicker(!showEmojiPicker);
    }

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    }


    return (
        <Container>
            <div className='button-container'>
                <div className='emoji'>
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                    {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                </div>
            </div>
            <form className='input-container' onSubmit={sendChat}>
                <input type="text" placeholder='Type your message here' value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button type='submit'>
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}

const Container = styled.div`
display:flex;
align-items:center;
width: 100%;
background-color:#161b22;
padding:1rem;
.button-container {
    display:flex;
    align-items:center;
    color:white;
    gap:1rem;
    .emoji-picker-react .active-category-indicator-wrapper .active-category-indicator {
        background-color: #ffff00c8;
    }
    .emoji {
        position:relative;
        svg {
            font-size:2.5rem;
            color: #ffff00c8;
            cursor: pointer;
            left:0rem;
            top:-1.3rem;
            position:absolute;
        }
        .emoji-picker-react {
            position:absolute;
            top:-350px;
            background-color:#0d1117;
            box-shadow:0 5px 10px #0d1117;
            border-color:#727303;
            .emoji-scroll-wrapper::-webkit-scrollbar {
                background-color:#0d1117;
                width:5px;
                &-thumb {
                    background-color:#0d1117
                }
            }
            .emoji-categories {
                button {
                    filter:contrast(0);
                }
            }
            .emoji-search {
                background-color: transparent;
                border-color:#ffff00c8;
                color:white;
            }
            .emoji-group::before {
                background-color:#0d1117;
            }
        }
    }
}
.input-container {
    width: 100%;
    border-radius:2rem;
    display:flex;
    align-items:center;
    gap:.8rem;
    background-color:#ffffff34;
    input {
        width:100%;
        height:60%;
        background-color:transparent;
        color:white;
        border:none;
        padding-left:3rem;
        font-size:1.2rem;
        &::selection {
            background-color:#b2b100;
        }
        &:focus {
            outline:none;
        }
    }
    button {
        padding: .3rem 2rem;
        border-radius:2rem;
        justify-content:center;
        align-items:center;
        background-color:#b2b100;
        border:none;
        cursor: pointer;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            padding:.3rem 1rem;
            svg {
                font-size: 1rem;
            }
        } 
        svg {
            font-size:2rem;
            color:white;
        }
    }
}
`;

export default ChatInput