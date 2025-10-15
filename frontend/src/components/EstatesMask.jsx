import { useState, useEffect } from "react"
import axios  from 'axios'

export function EstatesMask() {
    const [image, setImage] = useState("");
    /*useEffect(() => {
        axios.get("http://localhost:8081/images/a8b35354-6343-48a3-9f7c-d553cdfe5a54.webp")
            .then(response => {
                console.log(response.data)
                setImage(_ => response.data)
            });
    }, [])*/

    const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Crea FormData e aggiungi il file con il nome "file"
    const formData = new FormData();
    formData.append("file", file);
    
    axios.post("http://localhost:8080/api/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(res => {
        console.log("Upload riuscito:", res.data);
    })
    .catch(err => {
        console.error("Errore upload:", err);
    });
}

return (
    <>
        <input type="file" onChange={handleFileUpload} />
    </>
)
}