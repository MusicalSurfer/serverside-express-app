const webObj = {
    mainProgram: () => {
        const caliberLinkButton = document.getElementById('caliberLink');
        caliberLinkButton.addEventListener('click', webObj.caliberLinkHandler);
    },
    caliberLinkHandler: () => {
        fetch('https://eft-ballistics-deploy.onrender.com/eft/ballistics') // Returns a promise that either resolves or doesn't.
            .then(response => {
                // Check if the response status is 'ok' (200)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the JSON response
                console.log('promise resolved');
                return response.json();
            })
            .then(data => {
                // Display the data on the page.
                console.log(data);
                for (let caliber in data) {
                    const resultDiv = document.getElementById('results');
                    const resultTitle = document.createElement('div');
                    resultTitle.id = 'resultTitle';
                    resultTitle.textContent(data.name)
                    resultDiv.appendChild(resultTitle);
                }
            })
            .catch(error => {
                // Display an error message if the request fails\
                console.error(error);
            });
    }
}
webObj.mainProgram();