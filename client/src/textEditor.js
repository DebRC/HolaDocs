import React, { useCallback, useEffect, useState } from 'react'
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
    return <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#808080' }}>
                <h1 style={{ fontFamily: '"Roboto", sans-serif', fontSize: '24px', cursor: 'pointer' }} onClick={handleGoToRoot}>HolaDocs</h1>
                {isLoggedIn && <button onClick={handleLogout} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Logout</button>}
                {!isLoggedIn && <button onClick={handleLogin} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Login</button>}

            </div>
    <div className="editor" ref={wrapperRef}></div>
    </>
}