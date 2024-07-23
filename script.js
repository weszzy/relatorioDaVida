document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const photo = document.getElementById('photo').files[0];
    
    if (photo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoSrc = e.target.result;
            generateReport(name, age, photoSrc);
        };
        reader.readAsDataURL(photo);
    }
});

document.getElementById('downloadReport').addEventListener('click', function() {
    downloadReportAsImage();
});

function generateReport(name, age, photoSrc) {
    const reportContent = document.getElementById('reportContent');
    const report = document.getElementById('report');

    const birthYear = new Date().getFullYear() - age;
    const currentDate = new Date();
    const livedDays = Math.floor((currentDate - new Date(birthYear, 0, 1)) / (1000 * 60 * 60 * 24));

    const randomFacts = generateRandomFacts(name, age);

    reportContent.innerHTML = `
        <img src="${photoSrc}" alt="Foto de ${name}">
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Idade:</strong> ${age} anos</p>
        <p><strong>Tempo vivido:</strong> ${livedDays} dias</p>
        <h3>Fatos Aleatórios:</h3>
        ${randomFacts}
    `;

    report.classList.remove('hidden');
    document.getElementById('downloadReport').classList.remove('hidden');
}

function generateRandomFacts(name, age) {
    const spidersSwallowedPerYear = 8;
    const totalSpidersSwallowed = age * spidersSwallowedPerYear;
    
    const brainStorageCapacityPB = 2.5; // Total capacity in Petabytes
    const averageMemoryUsedPerYear = brainStorageCapacityPB / 80; // Assuming average lifespan of 80 years
    const totalMemoryUsed = (age * averageMemoryUsedPerYear).toFixed(2); // Memory used so far in Petabytes

    const randomTimes = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const facts = [
        `Você já viveu aproximadamente ${age * 365 * 24 * 60} minutos.`,
        `Você nasceu no ano de ${new Date().getFullYear() - age}.`,
        `Se você andar 5 km por dia, já andou cerca de ${age * 365 * 5} km na vida.`,
        `Você já engoliu aproximadamente ${totalSpidersSwallowed} aranhas em sua vida.`,
        `Seus batimentos cardíacos já ultrapassaram ${age * 365 * 24 * 60 * 70} batidas, considerando uma média de 70 batidas por minuto.`,
        `Você já dormiu cerca de ${Math.floor(age * 365 * 8)} horas, considerando uma média de 8 horas de sono por noite.`,
        `Você já usou aproximadamente ${totalMemoryUsed} PB de memória do seu cérebro, considerando uma capacidade total de 2.5 PB.`,
        `Você já foi feito de otário ${randomTimes(0, 50)} vezes.`,
        `Já quebraram seu coração ${randomTimes(0, 50)} vezes.`,
        `Você já falou palavrão ${randomTimes(200, 200000)} vezes.`
    ];

    return facts.map((fact, index) => `<p>${index + 1}. ${fact}</p>`).join('<br>');
}

function downloadReportAsImage() {
    html2canvas(document.querySelector("#report")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'relatorio-de-vida.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
