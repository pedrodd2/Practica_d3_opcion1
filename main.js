const width = 800
const height = 400

const margin = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10,
}

const svg = d3.select("div#chart").append("svg").attr("width",width).attr("height",height).attr("style","background: url('v748-toon-103.jpg')")
const elementGroup = svg.append("g").attr("id","elementGroup")
    .attr("transform",`translate(${margin.left},${margin.top})`)
const axisGroup = svg.append("g").attr("id","axisGroup")

const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
    .attr("transform",`translate(${margin.left},${height-margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
    .attr("transform",`translate(${margin.left},${margin.top})`)

const x = d3.scaleBand().range([0,width - margin.left - margin.right]).padding(0.1)
const y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])// ojo rango invertido
y.domain([0, 5])
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y).ticks(5)


svg.append("g")
  .attr("class", "grid")
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .attr("stroke-width", 0.3)
  .attr("fill", "none")
  .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(""))


function num_mund(anyo) {
    d3.csv("WorldCup.csv").then(data => {
        data.map(d => d.Year = +d.Year)
        
        
        
        let nest = d3.nest()
            .key(d => d.Winner)
            .entries(data)
            
            // console.log(nest[0].values[1].Year)
    
        for (const i in nest) {
            cont=0
            for (j in nest[i].values) {
                aux = nest[i].values[j].Year
                if (aux <= anyo) {
                    cont = cont +1
                }
            }
            nest[i].values = cont
        }
        

        x.domain(data.map(d => d.Winner))
        
    
        xAxisGroup.call(xAxis)   
        yAxisGroup.call(yAxis)

        var elements = elementGroup.selectAll("rect").data(nest)
        for (const i in nest) {
            elements.enter().append("rect")
                // .attr("fill", "red")
                .attr("class", nest[i].key)
                .attr("x",x(nest[i].key))
                .attr("width",x.bandwidth())
                .attr("height",height - margin.top -margin.bottom -y(nest[i].values))
                .attr("y",y(nest[i].values))
        }

       
        document.getElementById("labelSlider").innerHTML = `Suma de ganadores hasta el año ${anyo}`

    })

}

num_mund(2022)



// escuchando al slider?
d3.select("#mySlider").on("change", function(d){
    d3.selectAll("rect").remove()
    selectedValue = this.value
    num_mund(selectedValue)
  })

