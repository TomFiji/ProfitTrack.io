import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import '../css/Dropzone.css'
import {supabase} from './config/supabase.js'


function CsvUpload({ platformLabel, requiredColumns, headerMarker, endpoint }) {
    const [file, setFile] = useState([])
    const [parsedRows, setParsedRows] = useState(null)
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(null)

    const onDrop = useCallback((files) => {
        setFile(files[0])
        setError(null)
        setStatus(null)
        setParsedRows(null)
        Papa.parse(files[0], {
            header: true,
            skipEmptyLines: 'greedy',
            beforeFirstChunk: (chunk) => {
                const lines = chunk.split('\n')
                const headerIndex = lines.findIndex(line => line.startsWith(headerMarker))
                return lines.slice(headerIndex).join('\n')
            },
            complete: (results) => {
                console.log(results)
                const columns = results.meta.fields
                const missing = requiredColumns.filter(col => !columns.includes(col))
                if (missing.length > 0) {
                    setError(`Invalid CSV: missing columns: ${missing.join(', ')}`)
                    return
                }
                setParsedRows(results.data.slice(0, -1))
            },
        })
    }, [headerMarker, requiredColumns])

    const handleSubmit = async () => {
        if (!parsedRows) return
        setStatus('uploading')
        try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`

                },
                body: JSON.stringify({ rows: parsedRows })
            })
            if (!res.ok) throw new Error(`Server error: ${res.status}`)
            setStatus('success')
        } catch (err) {
            setError(err.message)
            setStatus(null)
        }
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv']},
    })

    return(
        <div style={{ width: '50%', margin: '0 auto' }}>
            <div {...getRootProps({
                className: `dropzone ${isDragActive ? 'dropzone-active' : ''}`}
            )}
                >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here...</p>:
                        file.name ? <a>{file.name}</a> : <p>Drag the {platformLabel} CSV here, or click to select files</p>
                }
                {error && <p className="dropzone-error">{error}</p>}
            </div>
            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={!parsedRows || status === 'uploading'}
                style={{ display: 'block', margin: '12px auto 0', width: '20%' }}
            >
                {status === 'uploading' ? 'Uploading...' : status === 'success' ? 'Uploaded!' : 'Submit'}
            </button>
        </div>
    )

}

export default CsvUpload