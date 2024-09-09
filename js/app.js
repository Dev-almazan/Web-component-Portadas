

/*Definimos componentes*/
customElements.define("portada-conexxion", Portada);
customElements.define("articulo-conexxion", Articulo)
customElements.define("indice-conexxion", Indice);   


//Validamos si contiene id de portada para renderizar contenido
let idItem = Hubspot.extraerUtm("s");
if(idItem == "default")
{
    idItem = 6; //valor por default portada
    /*Mandamos a llamar datos consumiendo 3 webhooks*/
    let api = new Hubspot("https://conecta.aliat.mx/api/hubspot/", "Bearer 2ee90da8");
    api.PromesaAll(["?hdb=conexxioncategorias&orden=hs_created_at", "?hdb=conexxionportadas&orden=hs_created_at", "?hdb=conexxionarticulos&orden=hs_created_at"], api.url, api.tsc)
        .then(resultados => {
            Portada.actualizar("portadaContainer", resultados, idItem);
            Articulo.actualizar("articulosContainer", resultados, idItem);
            Indice.actualizar("indiceContainer", resultados, idItem);
        })
        .catch(error => {
            console.error("Error en Promise.all:", error);
        });

}




