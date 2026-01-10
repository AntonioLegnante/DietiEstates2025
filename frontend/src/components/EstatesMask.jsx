import { useState } from "react"
import axios from 'axios'
import imageCompression from "browser-image-compression";

async function compressImage(file) {
    const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (err) {
        console.error("Errore compressione:", err);
        return file;
    }
}

export function EstatesMask() {
    const [formData, setFormData] = useState({
        titolo: "",
        descrizione: "",
        citta: "",
        prezzo: "",
        dimensione: "",
        indirizzo: "",
        affitto: false,
        vendita: false,
        numeroStanze: "",
        piano: "",
        classeEnergetica: "",
        garage: false,
        numeroBagni: ""
    });

    const [file, setFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBooleanInputChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const compressed = await compressImage(selectedFile);

        setFile(compressed);
        setCoverPreview(URL.createObjectURL(compressed));
    };

    const handleGalleryChange = async (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 5 - galleryFiles.length;
        const newFiles = files.slice(0, remainingSlots);

        const compressedFiles = [];

        for (const file of newFiles) {
            const compressed = await compressImage(file);
            compressedFiles.push(compressed);
        }

        setGalleryFiles(prev => [...prev, ...compressedFiles]);

        compressedFiles.forEach(file => {
            const preview = URL.createObjectURL(file);
            setGalleryPreviews(prev => [...prev, preview]);
        });
    };

    const removeGalleryImage = (index) => {
        URL.revokeObjectURL(galleryPreviews[index]);
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            alert("Seleziona un'immagine di copertina!");
            return;
        }

        const data = new FormData();
        data.append("file", file);

        galleryFiles.forEach(galleryFile => {
            data.append("galleryImages", galleryFile);
        });

        data.append("titolo", formData.titolo);
        data.append("descrizione", formData.descrizione);
        data.append("prezzo", formData.prezzo);
        data.append("dimensione", formData.dimensione);
        data.append("citta", formData.citta);
        data.append("indirizzo", formData.indirizzo);
        data.append("affitto", formData.affitto);
        data.append("vendita", formData.vendita);
        data.append("numeroStanze", formData.numeroStanze || 0);
        data.append("piano", formData.piano);
        data.append("classeEnergetica", formData.classeEnergetica);
        data.append("garage", formData.garage);
        data.append("numeroBagni", formData.numeroBagni || 0);

        console.log("FormData prima dell'invio:", {
            numeroStanze: formData.numeroStanze,
            numeroBagni: formData.numeroBagni
        });

        axios.post(`${import.meta.env.VITE_API_URL}/api/immobili`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                console.log("Immobile creato:", res.data);
                alert("Immobile creato con successo!");

                setFormData({
                    titolo: "",
                    descrizione: "",
                    dimensione: "",
                    prezzo: "",
                    citta: "",
                    indirizzo: "",
                    affitto: false,
                    vendita: false,
                    numeroStanze: "",
                    piano: "",
                    classeEnergetica: "",
                    garage: false,
                    numeroBagni: ""
                });
                setFile(null);
                setCoverPreview(null);
                galleryPreviews.forEach(preview => URL.revokeObjectURL(preview));
                setGalleryFiles([]);
                setGalleryPreviews([]);
            })
            .catch(err => {
                console.error("Errore:", err);
                alert("Errore nella creazione dell'immobile");
            });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Inserisci Nuovo Immobile</h2>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">Titolo:</label>
                <input
                    type="text"
                    name="titolo"
                    value={formData.titolo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">Descrizione:</label>
                <textarea
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Prezzo (€):</label>
                    <input
                        type="number"
                        name="prezzo"
                        value={formData.prezzo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Dimensione (m²):</label>
                    <input
                        type="number"
                        name="dimensione"
                        value={formData.dimensione}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Città:</label>
                    <input
                        type="text"
                        name="citta"
                        value={formData.citta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Indirizzo:</label>
                    <input
                        type="text"
                        name="indirizzo"
                        value={formData.indirizzo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Tipo di annuncio:</h3>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="affitto"
                            checked={formData.affitto}
                            onChange={handleBooleanInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">Affitto</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="vendita"
                            checked={formData.vendita}
                            onChange={handleBooleanInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">Vendita</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="numeroStanze" className="block mb-2 font-semibold text-gray-700">
                        Numero stanze:
                    </label>
                    <input
                        id="numeroStanze"
                        name="numeroStanze"
                        type="number"
                        min="0"
                        value={formData.numeroStanze}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="numeroBagni" className="block mb-2 font-semibold text-gray-700">
                        Numero bagni:
                    </label>
                    <input
                        id="numeroBagni"
                        name="numeroBagni"
                        type="number"
                        min="0"
                        value={formData.numeroBagni}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="piano" className="block mb-2 font-semibold text-gray-700">
                        Piano:
                    </label>
                    <input
                        id="piano"
                        name="piano"
                        type="number"
                        value={formData.piano}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="classeEnergetica" className="block mb-2 font-semibold text-gray-700">
                        Classe energetica:
                    </label>
                    <select
                        id="classeEnergetica"
                        name="classeEnergetica"
                        value={formData.classeEnergetica}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Seleziona...</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="garage"
                            checked={formData.garage}
                            onChange={handleBooleanInputChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-semibold text-gray-700">Garage disponibile</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">Foto di copertina:</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
                {coverPreview && (
                    <div className="mt-4 max-w-md">
                        <img src={coverPreview} alt="Cover preview" className="w-full rounded-lg border-2 border-gray-300 shadow-md" />
                    </div>
                )}
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">
                    Gallery (max 5 foto)
                    <span className="ml-2 text-sm text-gray-500">{galleryFiles.length}/5</span>
                </label>
                <input
                    type="file"
                    onChange={handleGalleryChange}
                    accept="image/*"
                    multiple
                    disabled={galleryFiles.length >= 5}
                    className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                        {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img
                                    src={preview}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl active:scale-98"
            >
                Crea Immobile
            </button>
        </form>
    );
}