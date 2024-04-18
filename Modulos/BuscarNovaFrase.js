export async function buscarNovaFrase() {
    const termoPesquisa = document.getElementById('termoPesquisa').value;

    try {
        const response = await fetch(`https://back-end-api-frases.vercel.app/buscar-frases?termo=${encodeURIComponent(termoPesquisa)}`, { mode: 'cors' });
        const data = await response.json();
        //console.log(response);

        if (data.frases && data.frases.length > 0) {
            const novaFrase = data.frases[Math.floor(Math.random() * data.frases.length)];
            document.getElementById('frase').innerText = novaFrase;
        } else {
            document.getElementById('frase').innerText = 'Nenhuma frase encontrada.';
        }
    } catch (error) {
        console.error('Erro ao buscar nova frase:', error);
        document.getElementById('frase').innerText = 'Erro ao buscar nova frase.';
    }
}