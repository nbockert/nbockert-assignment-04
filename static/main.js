document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';
    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
        resultsDiv.appendChild(docDiv);
    }
}

function displayChart(data) {
    // let chart = document.getElementById("similarity-chart");
    let docDiv = document.createElement('div');
    docDiv.style.display = 'none';
    // ctx = chart.getContext("2d");
    document.body.append(docDiv)
    // chart.appendChild(docDiv);
    var plotdata = [
        {
          x: data.indices,
          y: data.similarities,
          type: 'bar'
        }
      ];
      Plotly.newPlot(docDiv, plotdata).then(() => {
        // Get the SVG element from the temporary div
        const svgElement = docDiv.getElementsByTagName('svg')[0];
        
        // Serialize the SVG to a string
        const svgData = new XMLSerializer().serializeToString(svgElement);

        // Create a Blob from the SVG string
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        // Create an Image object and set its source to the Blob URL
        const img = new Image();
        img.onload = function() {
            // Get the canvas context
            const canvas = document.getElementById('similarity-chart');
            const ctx = canvas.getContext('2d');

            // Clear the canvas before drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Adjust dimensions as needed

            // Clean up the Blob URL and remove the temporary div
            URL.revokeObjectURL(url);
            document.body.removeChild(docDiv); // Remove the temporary div from the DOM
        };
        img.src = url; // Start loading the image from the Blob URL
    });
    
    // Input: data (object) - contains the following keys:
    //        - documents (list) - list of documents
    //        - indices (list) - list of indices   
    //        - similarities (list) - list of similarities
    // TODO: Implement function to display chart here
    //       There is a canvas element in the HTML file with the id 'similarity-chart'
}