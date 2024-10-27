const Bundels = [
    {
        id : 1,
        amount : 4000,
        name : "Bundle A",
        ROI : 250,
    },
    {
        id : 2,
        amount : 8000,
        name : "Bundle B",
        ROI : 450,
    },
]

exports.checkBundles = (id) => {
    return Bundels.find(bundle => bundle.id === id);
}

exports.joursEntreDates = (date1, date2) => {
    const dateDebut = new Date(date1);
    const dateFin = new Date(date2);
    const differenceTemps = Math.abs(dateFin - dateDebut); // Différence en millisecondes
    const differenceJours = Math.ceil(differenceTemps / (1000 * 60 * 60 * 24)); // Conversion en jours
    return differenceJours;
}