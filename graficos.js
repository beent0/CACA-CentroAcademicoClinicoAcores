const dados = [
        { ano: "2020", total: 101 },
        { ano: "2021", total: 25 },
        { ano: "2022", total: 20 },
        { ano: "2023", total: 45 },
        { ano: "2024", total: 60 },
        { ano: "2025", total: 54},
    ];




//Grafico de barras com o D3
function criarGrafico(title, data, target){
    const largura = 500;
    const altura = 300;
    const larguraBarra = 50;
    const espacoEntreBarras = 10;

    const svg = d3.select(target)
        .append("svg")
        .attr("width", largura)
        .attr("height", altura + 25) 
        .style("background", "transparent");

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", 'var(--accent-color)')
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras))
        .attr("width", larguraBarra)
        .attr("y", altura)     
        .attr("height", 0)     
        .transition()          
        .duration(1000)       
        .delay((d, i) => i * 100) 
        .attr("y", d => altura - d.total) 
        .attr("height", d => d.total);

    
    svg.selectAll(".label-valor") 
        .data(data)
        .enter()
        .append("text")
        .text(d => d.total) 
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra/2)
        .attr("y", d => altura - d.total - 5)
        .attr("text-anchor", "middle") 
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("opacity", 0)
        .transition()
        .delay(1200) 
        .style("opacity", 1);

    svg.selectAll(".label-ano")
        .data(dados)
        .enter()
        .append("text")
        .text(d => d.ano)
        .attr("x", (d,i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra/2)
        .attr("y", altura + 25)
        .attr("text-anchor", "middle")
        .attr("fill", 'var(--accent-color)')
        .style("font-size", "14px")
        .style("font-weight", "bold");

    svg.append("text")
    .attr("class", "h2")
    .attr("x", 205)               
    .attr("y", 30)                        
    .attr("text-anchor", "middle")       
    .attr("fill", "var(--text-color)")                
    .style("font-size", "25px")           
    .style("font-weight", "bold")
    .text(title);
}

const titulo1="Investigações Concluidas"
const titulo2="Investigações com Parcerias"
const div= '#grafico'
criarGrafico(titulo1, dados, div);
criarGrafico(titulo2 , dados, div);
criarGrafico("ola" , dados, div);
