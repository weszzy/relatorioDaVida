document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();
    handleFormSubmit();
});

document.getElementById('downloadReport').addEventListener('click', function () {
    downloadReportAsImage();
});

function handleFormSubmit() {
    const name = document.getElementById('name').value;
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const photo = document.getElementById('photo').files[0];

    if (photo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fetch('facts.json')
                .then(response => response.json())
                .then(data => {
                    generateReport(name, birthYear, e.target.result, data.facts);
                });
        };
        reader.readAsDataURL(photo);
    }
}

function generateReport(name, birthYear, photoSrc, facts) {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthYear;
    const livedDays = calculateLivedDays(currentDate, birthYear);

    const reportContent = `
        <div class="report-header">
            <div>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Idade:</strong> ${age} anos</p>
            </div>
            <img src="${photoSrc}" alt="Foto de ${name}">
        </div>
        <h3>Fatos Aleatórios:</h3>
        ${generateRandomFacts(facts, age, livedDays)}
    `;

    displayReport(reportContent);
}

function calculateLivedDays(currentDate, birthYear) {
    const birthDate = new Date(birthYear, 0, 1);
    return Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
}

function generateRandomFacts(facts, age, livedDays) {
    const randomTimes = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const factValues = {
        livedDays: livedDays,
        distanceWalked: age * 365 * 5,
        spidersSwallowed: age * 8,
        heartBeats: age * 365 * 24 * 60 * 70,
        hoursSlept: Math.floor(age * 365 * 8),
        timesFooled: randomTimes(0, 50),
        timesHeartBroken: randomTimes(0, 50),
        timesCursed: randomTimes(200, 200000)
    };

    return facts.map((fact, index) => {
        for (const key in factValues) {
            fact = fact.replace(`{${key}}`, factValues[key]);
        }
        return `<p>${index + 1}. ${fact}</p>`;
    }).join('<br>');
}

function displayReport(content) {
    const report = document.getElementById('report');
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = content;
    report.classList.remove('hidden');
    document.getElementById('downloadReport').classList.remove('hidden');
}

function downloadReportAsImage() {
    html2canvas(document.querySelector("#report")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'relatorio-de-vida.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
