import CsvUpload from "../components/CsvUpload"
import '../css/Instructions.css'

function Poshmark(){
    return(
        <>
            <details>
                <summary>Instructions</summary>
                <div class="instructions-content">
                    <h3>Steps to Obtain the CSV Report</h3>
                    <ol>
                        <li>Log into your Poshmark account</li>
                        <li>Navigate to My Sales from your profile dropdown menu</li>
                        <li>Click on 'My Sales Report' in the left sidebar</li>
                        <li>Choose 'Year to Date' option in Sales Report</li>
                        <li>Click 'Email Report' and download the report from your inbox</li>
                        <li>Upload the report below</li>
                        <li>Click submit</li>
                    </ol>
                    <p><strong>Note:</strong> The report may take a few minutes to generate depending on the data size.</p>
                </div>
            </details>
            
    
            <CsvUpload />
        </>
    )
}

export default Poshmark