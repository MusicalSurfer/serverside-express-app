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
                    resultDiv.innerHTML = `<a class="result-title" href=#>${caliber.name}</a>`
                    resultTitle.addEventListener('click', () => webObj.roundLinkHandler(caliberID));
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
                let count = 1;
                for (let round of data.data) {
                    const resultDiv = document.getElementById('results');
                    const resultCard = document.createElement('div');
                    resultCard.className = 'result-card';
                    resultCard.innerHTML = `
                        <div class="round-title">${round.name}</div>
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
                                <th scope="row">${count}</th>
                                <td>${round.dmg}</td>
                                <td>${round.penetration}</td>
                                </tr>
                            </tbody>
                        </table>
                    `
                    resultDiv.appendChild(resultCard);
                    count++;
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