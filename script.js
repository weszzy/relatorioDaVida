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
                    generateReport(name, birthYear, e.target.result, data);
                });
        };
        reader.readAsDataURL(photo);
    }
}

function generateReport(name, birthYear, photoSrc, data) {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthYear;
    const livedDays = calculateLivedDays(currentDate, birthYear);

    // Gerar avaliação musical
    const musicalTaste = generateMusicalTasteRating(data.musicalTasteRatings);

    const reportContent = `
        <div class="report-header">
            <div>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Idade:</strong> ${age} anos</p>
            </div>
            <img src="${photoSrc}" alt="Foto de ${name}">
        </div>
        <h3>Fatos Aleatórios:</h3>
        ${generateRandomFacts(data.facts, age, livedDays, musicalTaste)}
    `;

    displayReport(reportContent);
}

function calculateLivedDays(currentDate, birthYear) {
    const birthDate = new Date(birthYear, 0, 1);
    return Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
}

function generateRandomFacts(facts, age, livedDays, musicalTaste) {
    const randomTimes = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const factValues = {
        livedDays: livedDays,
        distanceWalked: age * 365 * 5,
        spidersSwallowed: age * 8,
        heartBeats: age * 365 * 24 * 60 * 70,
        hoursSlept: Math.floor(age * 365 * 8),
        timesFooled: randomTimes(0, 50),
        timesHeartBroken: randomTimes(0, 50),
        timesCursed: randomTimes(200, 200000),
        musicalTaste: musicalTaste
    };

    return facts.map((fact, index) => {
        for (const key in factValues) {
            fact = fact.replace(`{${key}}`, factValues[key]);
        }
        return `<p>${index + 1}. ${fact}</p>`;
    }).join('<br>');
}

function generateMusicalTasteRating(ratings) {
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return ratings[randomIndex];
}

function displayReport(content) {
    const report = document.getElementById('report');
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = content;
    report.classList.remove('hidden');
    document.getElementById('downloadReport').classList.remove('hidden');
}

function downloadReportAsImage() {
    html2canvas(document.querySelector("#report"), {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
        logging: true,
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'relatorio-de-vida.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch(err => {
        console.error("Erro ao gerar imagem:", err);
    });
}
