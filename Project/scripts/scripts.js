document.addEventListener("DOMContentLoaded", () => {
    const startYear = 1982;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - startYear;

    const counter = document.getElementById('years');
    let count = 0;

    const interval = setInterval(() => {
        if (count < yearsInBusiness) {
        count++;
        counter.textContent = count;
        } else {
            clearInterval(interval);
        }
    }, 50);
});
