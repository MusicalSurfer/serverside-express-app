const webObj = {
    mainProgram: () => {
        const caliberLinkButton = document.getElementById('caliberLink');
        caliberLinkButton.addEventListener('click', webObj.caliberLinkHandler);
    },
    caliberLinkHandler: () => {
        webObj.clearPage();
        fetch('https://eft-ballistics-deploy.onrender.com/eft/ballistics') // Returns a promise that either resolves or doesn't.
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('promise resolved');
                return response.json();
            })
            .then(data => {
                console.log(data);
                for (let caliber of data.data) {
                    const caliberID = caliber.id;
                    const resultDiv = document.getElementById('results');
                    const resultTitle = document.createElement('div');
                    resultTitle.className = 'result-title';
                    resultTitle.innerHTML = caliber.name;
                    resultTitle.addEventListener('click', () => webObj.roundLinkHandler(caliberID));
                    resultDiv.appendChild(resultTitle);
                }
            })
            .catch(error => {
                console.error(error);
            });
    },
    roundLinkHandler: (id) => {
        webObj.clearPage();
        console.log('id', id);
        fetch('https://eft-ballistics-deploy.onrender.com/eft/ballistics/caliber/' + id) // Returns a promise that either resolves or doesn't.
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('promise resolved');
                return response.json();
            })
            .then(data => {
                console.log(data.data);
                for (let round of data.data) {
                    const resultDiv = document.getElementById('results');
                    const resultCard = document.createElement('div');
                    resultCard.className = 'result-card';
                    resultCard.innerHTML = `
                        <div class="result-title">${round.name}</div>
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Damage</th>
                                <th scope="col">Penetration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <th scope="row">1</th>
                                <td>${round.dmg}</td>
                                <td>${round.penetration}</td>
                                </tr>
                            </tbody>
                        </table>
                    `
                    resultDiv.appendChild(resultCard);
                }
            })
            .catch(error => {
                // Display an error message if the request fails\
                console.error(error);
            });
    },

    clearPage: () => {
        const resultDiv = document.getElementById('results');
        resultDiv.innerHTML = '';
    }
}
webObj.mainProgram();