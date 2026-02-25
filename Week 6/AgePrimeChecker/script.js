// Age Calculator
function calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age;
}

// Prime Number Checker
function isPrime(number) {
    
    // Bonus: Validations checks
    if (number <= 1) return false;
    if (number === 2) return true;
    if (number % 2 === 0) return false;

    // Check odd numbers
    for (let i = 3; i * i <= number; i += 2) {
        if (number % i === 0) {
            return false;
        }
    }
    
    return true;
}

// Main function 
function checkAgePrime() {
    // Get the birth year from the input
    const birthYearInput = document.getElementById("birthYear").value;
    
    // Convert the number to a usable number
    const birthYear = Number(birthYearInput);
    
    if (!birthYearInput || isNaN(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
        alert("Please enter a valid birth year (between 1900 and current year).");
        return;
    }

    // Calculate age
    const age = calculateAge(birthYear);

    // Check if age is prime
    const primeStatus = isPrime(age) ? "is a Prime number." : "is not a Prime number.";

    // Show result in alert
    alert(
        "Your age is: " + age + "\n" +
        age + " " + primeStatus
    );
}