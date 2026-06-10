const form = document.getElementById("reservation-form");

// Campos
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const date = document.getElementById("date");
const time = document.getElementById("time");
const people = document.getElementById("people");

// Simulação de horários já ocupados
const bookedTimes = ["18:00", "19:30", "21:00"];

// --------------------
// ERROS VISUAIS
// --------------------
function setError(input, message) {
    const field = input.parentElement;

    let error = field.querySelector(".error-msg");

    if (!error) {
        error = document.createElement("div");
        error.classList.add("error-msg");
        field.appendChild(error);
    }

    error.textContent = message;

    input.classList.add("invalid");
    input.classList.remove("valid");
}

function clearError(input) {
    const field = input.parentElement;

    const error = field.querySelector(".error-msg");
    if (error) error.remove();

    input.classList.remove("invalid");
    input.classList.add("valid");
}

// --------------------
// VALIDAÇÃO POR CAMPO
// --------------------
function validateField(input) {

    const value = input.value.trim();

    switch (input.id) {

        case "name":
            if (!value) setError(input, "Nome obrigatório");
            else clearError(input);
            break;

        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) setError(input, "Email obrigatório");
            else if (!emailRegex.test(value)) setError(input, "Email inválido");
            else clearError(input);
            break;

        case "phone":
            if (!value) setError(input, "Telefone obrigatório");
            else clearError(input);
            break;

        case "date":
            if (!value) {
                setError(input, "Data obrigatória");
            } else {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const selected = new Date(value + "T00:00:00");

                if (selected < today) {
                    setError(input, "Não pode ser data passada");
                } else {
                    clearError(input);
                }
            }
            break;

        case "time":
            if (!value) {
                setError(input, "Horário obrigatório");
            } else {
                const [h, m] = value.split(":").map(Number);
                const minutes = h * 60 + m;

                const open = 15 * 60;
                const close = 23 * 60;

                if (minutes < open || minutes > close) {
                    setError(input, "Funcionamento: 15h às 23h");
                }
                else if (bookedTimes.includes(value)) {
                    setError(input, "Horário já reservado");
                }
                else {
                    clearError(input);
                }
            }
            break;

        case "people":
            if (!value) setError(input, "Selecione uma opção");
            else clearError(input);
            break;
    }
}

// --------------------
// VALIDAÇÃO EM TEMPO REAL
// --------------------
[name, email, phone, date, time, people].forEach((field) => {
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("change", () => validateField(field));
});

// --------------------
// SUBMIT FINAL
// --------------------
form.addEventListener("submit", function (e) {
    e.preventDefault();

    [name, email, phone, date, time, people].forEach(validateField);

    const invalidFields = document.querySelectorAll(".invalid");

    if (invalidFields.length > 0) {

        // 🔴 auto-scroll até o primeiro erro
        invalidFields[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert("Corrija os erros antes de continuar!");
        return;
    }

    alert("Reserva realizada com sucesso!");
    form.reset();

    // limpa estilos após reset
    document.querySelectorAll(".valid").forEach(el => el.classList.remove("valid"));
});