import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse';
import { useCallback } from 'react';

function CsvUpload({onDataParsed}) {

    const onDrop = useCallback((files) => {
        Papa.parse(files[0], {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                onDataParsed(results.data);
            },
        })

    }, [onDataParsed])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv']},
        maxFiles: 1 
    })

    return(
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here...</p>:
                        <p>Drag the Poshmark CSV here, or click to select files</p>
                }
            </div>
        </>
    )

}

export default CsvUpload