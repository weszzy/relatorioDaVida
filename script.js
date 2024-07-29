document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    handleFormSubmit();
});

document.getElementById('downloadReport').addEventListener('click', function() {
    downloadReportAsImage();
});

function handleFormSubmit() {
    const name = document.getElementById('name').value;
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const photo = document.getElementById('photo').files[0];

    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            generateReport(name, birthYear, e.target.result);
        };
        reader.readAsDataURL(photo);
    }
}

function generateReport(name, birthYear, photoSrc) {
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
        ${generateRandomFacts(name, age, livedDays)}
    `;

    displayReport(reportContent);
}

function calculateLivedDays(currentDate, birthYear) {
    const birthDate = new Date(birthYear, 0, 1);
    return Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
}

function generateRandomFacts(name, age, livedDays) {
    const randomTimes = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const facts = [
        `Tu já viveu aproximadamente ${livedDays} dias.`,
        `Se tu andou pelo menos 5 km por dia até agora, já deve ter andado cerca de ${age * 365 * 5} km na vida.`,
        `Tu já engoliu aproximadamente ${age * 8} aranhas na sua vida.`,
        `Teus batimentos cardíacos já ultrapassaram ${age * 365 * 24 * 60 * 70} batidas! *considerando uma média de 70 batidas por minuto.*`,
        `Tu já dormiu cerca de ${Math.floor(age * 365 * 8)} horas! *considerando uma média de 8 horas de sono por noite.*`,
        `Você já foi feito de otário ${randomTimes(0, 50)} vezes.`,
        `Já quebraram seu coração ${randomTimes(0, 50)} vezes.`,
        `Você já falou palavrão ${randomTimes(200, 200000)} vezes.`
    ];

    return facts.map((fact, index) => `<p>${index + 1}. ${fact}</p>`).join('<br>');
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