import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import '../css/Dropzone.css'

const REQUIRED_COLUMNS = ['Order Date', 'Order Id', 'Listing Title', 'Order Price', 'Your Earnings']

function CsvUpload() {
    const [file, setFile] = useState([])
    const [error, setError] = useState(null)

    const onDrop = useCallback((files) => {
        setFile(files[0])
        setError(null)
        Papa.parse(files[0], {
            header: true,
            skipEmptyLines: true,
            beforeFirstChunk: (chunk) => {
                const lines = chunk.split('\n')
                const headerIndex = lines.findIndex(line => line.startsWith('Listing Date'))
                return lines.slice(headerIndex).join('\n')
            },
            complete: async (results) => {
                const columns = results.meta.fields
                const missing = REQUIRED_COLUMNS.filter(col => !columns.includes(col))
                if (missing.length > 0) {
                    setError(`Invalid CSV: missing columns: ${missing.join(', ')}`)
                    return
                }
                await fetch('/api/poshmark/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rows: results.data })
                })
            },
        })
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv']},
        maxFiles: 1 
    })

    return(
        <>
            <div {...getRootProps({
                className: `dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            )}
                >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here...</p>:
                        file.name ? <a>{file.name}</a> : <p>Drag the Poshmark CSV here, or click to select files</p>
                }
                {error && <p className="dropzone-error">{error}</p>}
            </div>
        </>
    )

}

export default CsvUpload