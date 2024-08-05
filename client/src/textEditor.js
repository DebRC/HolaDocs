import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const SAVE_INTERVAL_MS=2000
const SERVER_URI='http://localhost:3001'
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
    const { id: documentId } = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    useEffect(() => {
        const s = io(SERVER_URI)
        setSocket(s)
        return () => {
            s.disconnect()
        }
    }, [])

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false); // Show login dialog if not logged in
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (socket == null || quill == null) return
        socket.once('load-document', document => {
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document', documentId)
    }, [socket, quill, documentId])

    useEffect(() => {
        if (socket == null || quill == null) return
        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)
        return () => {
            clearInterval(interval)
        }
    }, [socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return
        const handler = (delta) => {
            quill.updateContents(delta)
        }

        socket.on('receive-changes', handler)

        return () => {
            socket.off('receive-changes', handler)
        }
    },[socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return
    
        const handler = (delta, oldDelta, source) => {
          if (source !== "user") return
          socket.emit("send-changes", delta)
        }
        quill.on("text-change", handler)
    
        return () => {
          quill.off("text-change", handler)
        }
      }, [socket, quill])

    const [fileName, setFileName] = useState('');

      useEffect(() => {
        const fetchTitle = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                const response = await axios.get(`http://localhost:3001/api/user/documents/title/${documentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFileName(response.data.title);
            } catch (error) {
                console.error('Error fetching title:', error);
            }
        };
    
        fetchTitle();
    }, [documentId]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, { theme: "snow" , modules: { toolbar: TOOLBAR_OPTIONS } })
        q.disable()
        q.setText("Loading...")
        setQuill(q)    
    }, [])

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    }
    function handleLogin() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const handleGoToRoot = () => {
        navigate('/');
        window.location.reload();
    }

    
    const handleFileNameChange = async (e) => {
        const newFileName = e.target.value;
        setFileName(newFileName);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/user/documents/rename', {
                _id: documentId,
                title: newFileName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    return <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#808080' }}>
                <h1 style={{ fontFamily: '"Roboto", sans-serif', fontSize: '24px', cursor: 'pointer' }} onClick={handleGoToRoot}>HolaDocs</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        value={fileName} 
                        onChange={handleFileNameChange} 
                        style={{ marginRight: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} 
                    />
                </div>
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Logout</button>
                ) : (
                    <button onClick={handleLogin} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Login</button>
                )}
            </div>
            <div className="editor" ref={wrapperRef}></div>
        </>
}