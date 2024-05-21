function App() {
    const [countryData, setCountryData] = React.useState([]);
    const [datatype, setDatatype] = React.useState("casesPerOneMillion");

    React.useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://disease.sh/v3/covid-19/countries?sort=${datatype}`);
            const data = await response.json();
            setCountryData(data);
        }
        fetchData();
    }, [datatype]);

    return (
        <div>
            <h1>Covid Stats</h1>
            <select
                name="datatype"
                id="datatype"
                onChange={(e) => setDatatype(e.target.value)}
                value={datatype}
            >
                <option value="casesPerOneMillion">Cases per One Million</option>
                <option value="cases">Total Cases</option>
                <option value="deaths">Total Deaths</option>
                <option value="tests">Total Tests</option>
                <option value="deathsPerOneMillion">Deaths per One Million</option>
            </select>
            <div className="visHolder">
                <BarChart
                    data={countryData}
                    height={500}
                    widthOfBar={5}
                    width={countryData.length * 5}
                    dataType={datatype}
                />
            </div>
        </div>
    );
}

function BarChart({ data, height, width, widthOfBar, dataType }) {
    React.useEffect(() => {
        createBarChart();
    }, [data]);

    const createBarChart = () => {
        const countryData = data.map((country) => country[dataType]);
        const countries = data.map((country) => country.country);

        d3.select(".visHolder svg").remove(); // Clear previous SVG

        let svg = d3.select(".visHolder").append("svg").attr("width", width).attr("height", height);

        let tooltip = d3
            .select(".visHolder")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "lightgray")
            .style("padding", "5px")
            .style("border-radius", "5px");

        const dataMax = d3.max(countryData);
        const yScale = d3.scaleLinear().domain([0, dataMax]).range([0, height]);

        svg.selectAll("rect")
            .data(countryData)
            .enter()
            .append("rect")
            .style("fill", (d, i) => (i % 2 === 0 ? "#9595ff" : "#44ff44"))
            .attr("x", (d, i) => i * widthOfBar)
            .attr("y", (d) => height - yScale(d))
            .attr("height", (d) => yScale(d))
            .attr("width", widthOfBar)
            .on("mouseover", function (event, d) {
                const [x, y] = d3.pointer(event);
                tooltip
                    .style("opacity", 0.9)
                    .html(countries[countryData.indexOf(d)] + `<br/> ${dataType}: ` + d)
                    .style("left", x + 20 + "px")
                    .style("top", y - 20 + "px");
            })
            .on("mouseout", () => tooltip.style("opacity", 0));
    };

    return <></>;
}

ReactDOM.render(<App />, document.getElementById("root"));
