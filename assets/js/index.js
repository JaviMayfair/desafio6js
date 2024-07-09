const apiURL = "https://mindicador.cl/api/";

async function getIndicadores() {
    try {
        const res = await fetch(apiURL);
        const indicadores = await res.json();
        if (res.status == 500)
            throw indicadores.message
        return indicadores;
    }
    catch (e) {
        mensajeError(e)

    }
}

async function buscar() {
    try {
        let pesos = document.querySelector("#pesos").value
        let moneda = document.querySelector("#moneda").value
        let indicador = await getIndicadores()
        let valorIndicador = indicador[moneda].valor
        let total = Number(pesos) / valorIndicador
        let resultado = document.querySelector("#resultado")
        resultado.innerHTML = "Resultado: " + total
        renderGrafica(moneda);
    }
    catch (e) {
        mensajeError("Error en la Búsqueda");
    }
}
function mensajeError(error){
    let resultado = document.querySelector("#resultado")
    resultado.innerHTML = error
}
let boton = document.querySelector("#button")
boton.addEventListener("click", () => {
    buscar()
})

async function getMonedas(moneda) {
    const endpoint = apiURL + moneda;
    const res = await fetch(endpoint);
    const monedas = await res.json();
    return monedas;
}

function prepararConfiguracionParaLaGrafica(monedas) {
    const tipoDeGrafica = "line";
    let series = monedas.serie
    series = series.slice(0, 10)
    series = series.reverse()
    const fechas = series.slice(0, 10).map((serie) => new Date(serie.fecha).toLocaleDateString());
    const titulo = "Fechas";
    const colorDeLinea = "red";
    const valores = series.slice(0, 10).map((serie) => serie.valor);
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: fechas,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: valores
                }
            ]
        }
    };
    return config;
}
let myChart;
async function renderGrafica(moneda) {
    const monedas = await getMonedas(moneda);
    const config = prepararConfiguracionParaLaGrafica(monedas);
    const chartDOM = document.getElementById("myChart");
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(chartDOM, config);
}

