import CsvUpload from "../components/CsvUpload"
import '../css/Instructions.css'

function Poshmark(){
    return(
        <>
            <details style={{ width: '50%', margin: '20px auto' }}>
                <summary>Poshmark Instructions</summary>
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
            
    
            <CsvUpload
                platformLabel="Poshmark"
                requiredColumns={['Order Date', 'Order Id', 'Listing Title', 'Order Price', 'Your Earnings']}
                headerMarker="Listing Date"
                endpoint="/api/poshmark/upload"
            />

            <details style={{ width: '50%', margin: '20px auto' }}>
                <summary>Depop Instructions</summary>
                <div class="instructions-content">
                    <h3>Steps to Obtain the CSV Report</h3>
                    <ol>
                        <li>Log into your Depop account</li>
                        <li>Navigate to Your Selling Hub from your profile dropdown menu</li>
                        <li>Click on 'Stats' in the left sidebar</li>
                        <li>Click 'Download sales' option near the top right section of the page</li>
                        <li>Choose a 3 month span to download sales. Do this as many times as needed</li>
                        <li>Once you've downloaded all your sales, upload the reports below</li>
                        <li>Click submit</li>
                    </ol>
                    <p><strong>Note:</strong> The report may take a few minutes to generate depending on the data size.</p>
                </div>
            </details>
            
    
            <CsvUpload
                platformLabel="Depop"
                requiredColumns={['Date of sale', 'Description', 'Item price', 'Total', 'USPS Cost', 'Depop Payments fee', 'US Sales tax']}
                headerMarker="Date of sale"
                endpoint="/api/depop/upload"
            />
        </>
    )
}

export default Poshmark