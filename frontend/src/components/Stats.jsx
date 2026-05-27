import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DADOS_ESTATISTICAS = [
  { ano: "2020", total: 101 },
  { ano: "2021", total: 25 },
  { ano: "2022", total: 20 },
  { ano: "2023", total: 45 },
  { ano: "2024", total: 60 },
  { ano: "2025", total: 54 },
];

function Stats() {
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const [lang, setLang] = useState(() => localStorage.getItem('preferredLang') || 'pt');

  // Escuta alteração global de idioma para redesenhar
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail && e.detail.lang) {
        setLang(e.detail.lang);
      }
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  // Escuta alteração de tema (Dark Mode) para redesenhar com novas cores de fonte
  useEffect(() => {
    // Usamos um MutationObserver no documentElement para detectar alteração de tema (data-theme)
    const observer = new MutationObserver(() => {
      desenharGraficos();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [lang]);

  // Função para carregar as traduções e desenhar os gráficos
  const desenharGraficos = async () => {
    let tituloBarras = "Investigações Concluídas";
    let tituloDonut = "Investigações com Parceiros";

    try {
      const response = await fetch(`/lang/${lang}.json`);
      if (response.ok) {
        const trans = await response.json();
        if (trans.grafico_barras_titulo) tituloBarras = trans.grafico_barras_titulo;
        if (trans.grafico_donut_titulo) tituloDonut = trans.grafico_donut_titulo;
      }
    } catch (err) {
      console.warn("Erro ao obter traduções para gráficos:", err);
    }

    // Desenha o gráfico de barras
    desenharBarChart(tituloBarras);
    // Desenha o gráfico donut
    desenharDonutChart(tituloDonut);
  };

  // Efeito principal de desenho usando IntersectionObserver (desenha quando visível, igual ao vanilla original)
  useEffect(() => {
    const elementoAlvo = document.getElementById('graficos-holder');
    if (!elementoAlvo) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          desenharGraficos();
        }
      });
    });

    observer.observe(elementoAlvo);
    return () => observer.disconnect();
  }, [lang]);

  // Lógica D3 para o Gráfico de Barras
  const desenharBarChart = (titulo) => {
    if (!barChartRef.current) return;
    const container = d3.select(barChartRef.current);
    container.selectAll("*").remove();

    const largura = 400;
    const altura = 300;
    const larguraBarra = 50;
    const espacoEntreBarras = 10;

    // Detectar cores do tema atual das variáveis CSS
    const textThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000000';
    const accentThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#1B8572';

    const svg = container
      .append("svg")
      .attr("width", largura)
      .attr("height", altura + 25)
      .style("background", "transparent");

    // Adiciona as barras
    svg.selectAll("rect")
      .data(DADOS_ESTATISTICAS)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", accentThemeColor)
      .attr("x", (d, i) => i * (larguraBarra + espacoEntreBarras))
      .attr("width", larguraBarra)
      .attr("y", altura)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", d => altura - d.total)
      .attr("height", d => d.total);

    // Adiciona os valores por cima das barras
    svg.selectAll(".label-valor")
      .data(DADOS_ESTATISTICAS)
      .enter()
      .append("text")
      .text(d => d.total)
      .attr("x", (d, i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra / 2)
      .attr("y", d => altura - d.total - 5)
      .attr("text-anchor", "middle")
      .attr("fill", textThemeColor)
      .style("font-size", "12px")
      .style("opacity", 0)
      .transition()
      .delay(1200)
      .style("opacity", 1);

    // Adiciona a legenda de cada ano no rodapé do gráfico
    svg.selectAll(".label-ano")
      .data(DADOS_ESTATISTICAS)
      .enter()
      .append("text")
      .text(d => d.ano)
      .attr("x", (d, i) => i * (larguraBarra + espacoEntreBarras) + larguraBarra / 2)
      .attr("y", altura + 20)
      .attr("text-anchor", "middle")
      .attr("fill", accentThemeColor)
      .style("font-size", "14px")
      .style("font-weight", "bold");

    // Adiciona o título do gráfico
    svg.append("text")
      .attr("class", "h2")
      .attr("x", '50%')
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", textThemeColor)
      .style("font-size", "22px")
      .style("font-weight", "bold")
      .text(titulo);
  };

  // Lógica D3 para o Gráfico Donut
  const desenharDonutChart = (titulo) => {
    if (!donutChartRef.current) return;
    const container = d3.select(donutChartRef.current);
    container.selectAll("*").remove();

    const largura = 500;
    const altura = 350;
    const margem = 40;

    const raioExterno = Math.min(largura, altura) / 2 - margem;
    const raioInterno = raioExterno * 0.65;

    const textThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#333333';

    const svg = container
      .append("svg")
      .attr("width", largura)
      .attr("height", altura + 30)
      .style("background", "transparent")
      .append("g")
      .attr("transform", `translate(${largura / 2}, ${(altura / 2) + 20})`);

    const coresModernas = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD", "#D4A5A5"];
    const cores = d3.scaleOrdinal()
      .domain(DADOS_ESTATISTICAS.map(d => d.ano))
      .range(coresModernas);

    const pie = d3.pie()
      .value(d => d.total)
      .sort(null)
      .padAngle(0.05);

    const arcLabels = d3.arc()
      .innerRadius(raioExterno * 1.2)
      .outerRadius(raioExterno * 1.2);

    const arc = d3.arc()
      .innerRadius(raioInterno)
      .outerRadius(raioExterno)
      .cornerRadius(10);

    const fatias = svg.selectAll("fatias")
      .data(pie(DADOS_ESTATISTICAS))
      .enter()
      .append("g");

    fatias.append("path")
      .attr("fill", d => cores(d.data.ano))
      .style("filter", "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))")
      .transition()
      .duration(1200)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t));
        };
      });

    fatias.append("text")
      .html(d => `<tspan font-weight="bold">${d.data.ano}</tspan>: ${d.data.total}`)
      .attr("transform", d => `translate(${arcLabels.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", textThemeColor)
      .style("font-size", "13px")
      .style("opacity", 0)
      .transition()
      .delay(1200)
      .duration(600)
      .style("opacity", 1);

    const valorTotal = d3.sum(DADOS_ESTATISTICAS, d => d.total);

    // Texto no Centro (Valor Total)
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -5)
      .attr("fill", textThemeColor)
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text(valorTotal)
      .transition()
      .delay(1000)
      .duration(800)
      .style("opacity", 1);

    // Texto no Centro (Legenda "Total")
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 20)
      .attr("fill", textThemeColor)
      .style("font-size", "12px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "2px")
      .style("opacity", 0)
      .text("Total")
      .transition()
      .delay(1200)
      .duration(800)
      .style("opacity", 1);

    // Título do Gráfico Donut
    svg.append("text")
      .attr("class", "h2")
      .attr("x", 0)
      .attr("y", -(altura / 2) + 5)
      .attr("text-anchor", "middle")
      .attr("fill", textThemeColor)
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(titulo);
  };

  return (
    <section id="dados" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="investigacoes_subtitle">Investigações</span>
          <h2 data-i18n="investigacoes_title">As nossas Investigações</h2>
        </div>
        
        {/* Gráficos D3.js */}
        <div id="graficos-holder" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px', minHeight: '350px' }}>
          <div id="grafico-barras" ref={barChartRef} style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <p style={{ color: '#666', fontStyle: 'italic', padding: '40px' }}>A carregar Gráfico de Barras...</p>
          </div>
          <div id="grafico-donut" ref={donutChartRef} style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <p style={{ color: '#666', fontStyle: 'italic', padding: '40px' }}>A carregar Gráfico Donut...</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
