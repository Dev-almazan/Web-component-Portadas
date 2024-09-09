

class Portada extends HTMLElement{

    /*Escuchamos valores */
    static get observedAttributes() { return ["data-titulo", "data-categoria", "data-img", "data-pdf","data-primario","data-secundario"]; }

    static redirect(url) 
    { 
        window.location.href = url;
    }

    constructor(data) {
        super();
            this.datos = {
            titulo: this.getAttribute("data-titulo") || "",
            categoria: this.getAttribute("data-categoria") || "",
            img: this.getAttribute("data-img") || "",
            pdf: this.getAttribute("data-pdf") || "",
            color: this.getAttribute("data-primario") || "",
            colorb: this.getAttribute("data-secundario") || ""
            },
            this.resultados = data;
    }

    static actualizarValores(idComponente, datos) {
        let portada = document.getElementById(idComponente);
        portada.dataset.titulo = "Año " + datos[0] + " No. " + datos[1]
        portada.dataset.categoria = datos[2]
        portada.dataset.img = datos[3]
        portada.dataset.pdf = datos[4]
        portada.dataset.primario = datos[5]
        portada.dataset.secundario = datos[6]
    }

    static actualizar(idComponente, data, id) {

        const portada = data[1].results.filter(elemento => elemento.values.id_portada == id)
        const categorias = data[0].results.filter(elemento => elemento.values.categoria.name == portada[0].values.categoria.name)

        if (portada.length > 0 && categorias.length > 0) 
        {
            const colores = [categorias[0].values.color, categorias[0].values.color_secundario];
            /*Actualizamos portada */
            Portada.actualizarValores(idComponente,
                [portada[0].values.anio,
                portada[0].values.numero,
                portada[0].values.categoria.name,
                portada[0].values.portada.url,
                portada[0].values.url,
                colores[0],colores[1]])     
        }

    }

    /*Renderizamos cuando cambien  valores */
    attributeChangedCallback(name, old, newValue) {

        switch (name) {
            case "data-titulo":
                this.datos.titulo = newValue;
                break;
            case "data-categoria":
                this.datos.categoria = newValue;
                break;
            case "data-img":
                this.datos.img = newValue;
                break;
            case "data-pdf":
                this.datos.pdf = newValue;
                break;
            case "data-primario":
                this.datos.color= newValue;
            break;
            case "data-secundario":
                this.datos.colorb = newValue;
            break;
        }

            this.contenido();
       
    }


    contenido() {
        

        this.innerHTML = `<div>
                                    <img src="${this.datos.img}" style="border: 2px ${this.datos.color} solid ;" >
                        </div>
                        <div>
                                    <div style=" animation: displace 0.1s ease-in-out forwards;">
                                        <h2 style="color:${this.datos.color} ; opacity: .9;" >${this.datos.titulo} </h2>
                                        <h5 style="color:${this.datos.color} ; opacity: .9;" >${this.datos.categoria}</h5>
                                    </div>
                                    <div class="btn-pdf" style="background-color: ${this.datos.color} ; cursor: pointer !important;" onclick="Portada.redirect('${this.datos.pdf}')">
                                            <div style="border-right:2px ${this.datos.colorb}  solid ;">
                                                <h6>REVISTA COMPLETA</h6>
                                            </div>
                                            <div>
                                                    <img class="imgPdf" src="https://www.etac.edu.mx/hubfs/sitio-conexxion/Grupo%20358.svg" />
                                            </div>
                                    </div>
                        </div>`;
    }


}

class Articulo extends HTMLElement {


    constructor() {
        super();
        this.datos = {
            titulo: this.getAttribute("data-titulo") || "",
            autor: this.getAttribute("data-autor") || "",
            pdf: this.getAttribute("data-url") || "",
            color: this.getAttribute("data-color") || ""
        }
    }

    /*Escuchamos valores */

    static redirect(url) {
        window.location.href = url;
    }


    /*Renderizamos contenido*/
    connectedCallback() {
        this.contenido();
    }


    static actualizar(idComponente,data,id) {

        const portada = data[1].results.filter(elemento => elemento.values.id_portada == id)
        const categorias = data[0].results.filter(elemento => elemento.values.categoria.name == portada[0].values.categoria.name)

        if (portada.length > 0 && categorias.length > 0) 
        {
            //Traemos articulos por categoria año y numero como filtros
            const articulos = data[2].results.filter(elemento => elemento.values.categoria.name == categorias[0].values.categoria.name && elemento.values.anio == portada[0].values.anio && elemento.values.numero == portada[0].values.numero)
            const colores = [categorias[0].values.color, categorias[0].values.color_secundario];
            const divArticulos = document.getElementById("articulosContainer");
            divArticulos.innerHTML = `<section><div><h5>ARTÍCULOS</h5></div><div><hr></div></section> `

            let index = 0;
            if (articulos.length > 0) {

                /*renderizamos en la seccion articulos componentes articulos */
                articulos.forEach(element => {
                    divArticulos.innerHTML += `
                                                            
                                                        <articulo-conexxion 
                                                            data-titulo="${element.values.name}"
                                                            data-autor="${element.values.autor}"
                                                            data-color="${colores[index % 2]}"
                                                            data-url="${element.values.archivo}">
                                                        </articulo-conexxion>
                                                            `
                    index++;
                });
            }
            else 
            {
                divArticulos.innerHTML += `<h3 style=" animation: displace 0.2s ease-in-out forwards;">No existen artículos disponibles para la siguiente revista</h3>`
            }
        }

    }

    contenido() {

        this.innerHTML = `  <article >
                                <div style=" animation: displace 0.4s ease-in-out forwards;">
                                    <h2 style="color:${this.datos.color}; opacity:.9;">${this.datos.titulo}</h2>
                                    <h3>${this.datos.autor}</h3>
                                </div>
                                <div>
                                    <button style="background-color: ${this.datos.color};" class="btn shadow-sm" onclick="Articulo.redirect('${this.datos.pdf}')">
                                            <img class="imgPdf" src="https://www.etac.edu.mx/hubfs/sitio-conexxion/Grupo%20358.svg" />
                                    </button>
                                </div>
                            </article>
                        `;
    }


}

class Indice extends HTMLElement {


    /*Escuchamos valores */
    static get observedAttributes() { return ["data-anterior", "data-siguiente", "data-color", "data-id"]; }

    constructor() {
        super();
        this.datos = {
            anterior: this.getAttribute("data-anterior")  || "",
            siguiente: this.getAttribute("data-siguiente") || "",
            color: this.getAttribute("data-color") || ""
        }
    }

    /*Escuchamos valores */

    static redirect(url) {
        window.location.href = url;
    }

   
    get labelAnterior() {
        const label = this.datos.anterior.split('idItem=');
        return label ;
    }

    get labelSiguiente() {
        const label = this.datos.siguiente.split('idItem=');
        return label;
    }

    get gridColumns(){
        
        let grid;

        if (this.datos.anterior == "default" || this.datos.siguiente == "default")
        {
            grid = "repeat(1,1fr)"; 
        }
        else
        {
            grid = "repeat(2,1fr)"; 
        }

        return grid;
    }

    static actualizarValores(idComponente,anterior,siguiente,color) {

        /*Actualizamos indice */
        document.getElementById(idComponente).dataset.anterior = anterior
        document.getElementById(idComponente).dataset.siguiente = siguiente
        document.getElementById(idComponente).dataset.color = color
        
    }


    static siguiente(datos, id) {
        let portada = datos.find(elemento => elemento.values.id_portada == id - 1);
        portada = portada ? `Año ${portada.values.anio} No. ${portada.values.numero} idItem=${portada.values.id_portada}` : 'default';
        return portada;
    }

    static anterior(datos, id) {
        let portada = datos.find(elemento => elemento.values.id_portada == id + 1);
        portada = portada ? `Año ${portada.values.anio} No. ${portada.values.numero} idItem=${portada.values.id_portada}` : 'default';
        return portada;
    }


    static actualizar(idComponente, data, id) {
        const portadaCategoria = data[1].results.filter(elemento => elemento.values.id_portada == id)
        const categorias = data[0].results.filter(elemento => elemento.values.categoria.name == portadaCategoria[0].values.categoria.name)
        const portadas = data[1].results.filter(elemento => elemento.values.categoria.name == portadaCategoria[0].values.categoria.name)

        if (categorias.length > 0) 
        {

            let portadaSiguiente = Indice.siguiente(portadas, parseInt(id));
            let portadaAnterior = Indice.anterior(portadas, parseInt(id));
            /*Actualizamos componente indice */
            Indice.actualizarValores("indiceContainer", portadaAnterior, portadaSiguiente, categorias[0].values.color);

            // Seleccionar todos los botones con la clase btn-pagina
            const botonesPaginas = document.querySelectorAll('.btn-pagina');

            // Iterar y agregar event listeners
            botonesPaginas.forEach(boton => {
                boton.addEventListener('click', (event) => {
                    //Actualizamos id
                    Hubspot.actualizarParametro('s', boton.dataset.pagina);
                    // Llamar a la función de actualización
                    Portada.actualizar("portadaContainer", data, boton.dataset.pagina);
                    Articulo.actualizar("articulosContainer", data, boton.dataset.pagina);
                    Indice.actualizar("indiceContainer", data, boton.dataset.pagina);
                });
            });

        }   

    }


    /*Renderizamos cuando cambien  valores */
    attributeChangedCallback(name, old, newValue) {

        switch (name) {
            case "data-anterior":
                this.datos.anterior = newValue;
                break;
            case "data-siguiente":
                this.datos.siguiente = newValue;
                break;
            case "data-color":
                this.datos.color = newValue;
                break;
        }
        this.contenido();
    }
    contenido() {


        this.innerHTML = `  
                            <style>.colorA{
                                color:${this.datos.color} !important;
                            } </style>    

                            <article style="border-top: 2px solid ${this.datos.color}; grid-template-columns:${this.gridColumns} !important; ">
                                <div style="border-right: 2px solid ${this.datos.siguiente !== 'default' ? this.datos.color : '#fff' } ;
                                ${this.labelAnterior == 'default' ? "display:none" : '' }
                                ">
                                    <h2 class="colorA">ANTERIOR</h2>
                                    <h3 class="colorA">${this.labelAnterior[0]}</h3>
                                    <svg  xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" class="btn-pagina" data-pagina="${this.labelAnterior[1]}"    >
                                    <path  d="M12,24A12,12,0,0,1,7.329.943a12,12,0,0,1,9.342,22.114A11.925,11.925,0,0,1,12,24ZM11.032,6.185a.964.964,0,0,0-.686.284L5.5,11.313a.971.971,0,0,0,0,1.371l0,0,4.844,4.844a.97.97,0,0,0,1.371-1.372L8.527,12.969h9.286a.969.969,0,1,0,0-1.938H8.524L11.718,7.84a.97.97,0,0,0-.686-1.655Z" fill="${this.datos.color}"/>
                                    </svg>
                                </div>
                                <div  style="${this.labelSiguiente == 'default' ? "display:none" : '' }">
                                    <h2 class="colorA">SIGUIENTE</h2>
                                    <h3 class="colorA">${this.labelSiguiente[0]}</h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"   class="btn-pagina" data-pagina="${this.labelSiguiente[1]}"   >
                                        <path  d="M12,0A12,12,0,0,0,7.329,23.057,12,12,0,0,0,16.671.943,11.925,11.925,0,0,0,12,0Zm-.968,17.815a.964.964,0,0,1-.686-.284L5.5,12.687a.971.971,0,0,1,0-1.371l0,0,4.844-4.844A.97.97,0,0,1,11.715,7.84L8.527,11.031h9.286a.969.969,0,1,1,0,1.938H8.524l3.194,3.191a.97.97,0,0,1-.686,1.655Z" transform="translate(24 24) rotate(180)" fill="${this.datos.color}"/>
                                    </svg>
                                </div>
                            </article>
                            
                        `;
    }


}

class Hubspot {



    constructor(urlApi, tsc) {
        this.url = urlApi,
            this.tsc = tsc
    }

        static eliminarPalabra(cadena, palabra) 
        {
        cadena = cadena.toLowerCase();
        palabra = palabra.toLowerCase();
        let indiceInicio = cadena.indexOf(palabra);
        return cadena.substring(indiceInicio);
        }

    /*Metodos que ocupamos en el formulario contienen toda la logica */


    static actualizarParametro(param, nuevoValor) {
    // Obtener la URL actual
    const url = new URL(window.location.href);

    // Establecer el nuevo valor del parámetro
    url.searchParams.set(param, nuevoValor);

    // Actualizar la URL del navegador
    window.history.pushState({}, '', url.toString());
}



  static async llamadaApiGet(parametros,url,tsc) {
        try {
            const respuesta = await fetch(url + parametros, {
                method: 'GET',
                headers: {
                    'Authorization': `${tsc}` + "-c02e-4c3d-9700-d6200016ee75",
                    'content-type': 'application/json'
                }
            });
            return await respuesta.json();
        }
        catch (error) {
            console.error("Error al hacer el conect a api ", error);
        }
    }

async PromesaAll(parametrosArray,url,tsc) {
    try {
        const resultados = await Promise.all(parametrosArray.map(parametros => Hubspot.llamadaApiGet(parametros,url,tsc)));
        return resultados;
    } catch (error) {
        console.error("Error en Promise.all:", error);
        throw error; 
    }
}

    static extraerUtm(utm) {
        const ulrparametrosz = window.location.search;
        const parametrosz = new URLSearchParams(ulrparametrosz);
        const utmPerformancez = parametrosz.get(utm) ? parametrosz.get(utm) : "default";
        return utmPerformancez;
    }


}




