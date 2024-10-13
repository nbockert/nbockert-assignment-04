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
        // Input: data (object) - contains the following keys:
    //        - documents (list) - list of documents
    //        - indices (list) - list of indices   
    //        - similarities (list) - list of similarities
    // TODO: Implement function to display chart here
    //       There is a canvas element in the HTML file with the id 'similarity-chart'
    
    let graphDiv = document.getElementById('graph');
    let docDiv = document.createElement('div');
    // graphDiv.innerHTML = `<strong id="graph_title">Cosine Similarity of the Top 5 Most Relevant Documents</strong>`;
    
    let formattedIndices = data.indices.map(index => `doc ${index}`);
    var plotdata = [
        {
          x: formattedIndices,
          y: data.similarities,
          type: 'bar',
          marker: {
            color: 'rgb(8, 68, 94)',  // Custom color with transparency
            line: {
                color: 'rgb(8, 108, 150)',  // Outline color
                width: 1.5  // Outline width
            }
        }

        }
      ];
      var layout = {
        title:{
            text: 'Cosine Similarity of the Top 5 Most Relevant Documents',
            font: {
                family: "Arial Black, sans-serif",
                size: 20,
                color: '#08445e',
            },
            x: 0.5,  // Align the title to the center
            xanchor: 'center'  // Ensures it is truly centered
        },
        paper_bgcolor: 'rgb(244, 244, 249)',  // Background color for the entire graph
        plot_bgcolor: 'rgb(244, 244, 249)',  
        xaxis: {
            title: 'Document', // Label for the x-axis
        },
        yaxis: {
            title: 'Cosign Similarity', // Label for the y-axis
            range: [0, 1.0] // Set y-axis range from 0 to max similarity
        }
    };
      Plotly.newPlot(docDiv, plotdata,layout);
      graphDiv.appendChild(docDiv);
    

}