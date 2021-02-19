function AppClass(obj,List){
    for(let classe of List) {
        obj.classList.add(classe)
    }
}

function AppChildren(obj,List) {
    for(let ob of List) {
        obj.appendChild(ob)
    }
}


function NewSpan(text="",classList_=[],Children=[]) {
    let obj = document.createElement('span')
    obj.innerText = text
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewDiv(classList_=[],Children=[]) {
    let obj = document.createElement('div')
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewInput(classList_=[],Children=[]) {
    let obj = document.createElement('input')
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewINumber(classList_=[],Children=[]) {
    let obj = NewInput()
    obj.type = 'number'
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewCheckBox(classList_=[],Children=[]) {
    let obj = NewInput()
    obj.type = "checkbox"
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewIdate(classList_=[],Children=[]) {
    let obj = NewInput()
    obj.type = "date"
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewTextArea(classList_=[],Children=[]){
    let obj = document.createElement('textarea')
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewButton(classList_=[],Children=[],action = undefined,text=undefined) {
    let obj = document.createElement('button')
    if(action)
        obj.addEventListener(action.event,action.function)
    if(text)
        obj.textContent=text
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewImg(classList_=[],Children=[],src="") {
    let obj = document.createElement('img')
    obj.src=src
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewSelect(classList_=[],Children=[]) {
    let obj = document.createElement('select')
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewOption(classList_=[],Children=[],text="",value=undefined) {
    let obj = document.createElement('option')
    obj.value = (value)?value:text
    obj.text = text
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewH5(classList_=[],Children=[],text="") {
    let obj = document.createElement('h5')
    obj.innerText = text

    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewP(classList_=[],Children=[],text="") {
    let obj = document.createElement('p')
    obj.innerText = text

    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewA(classList_=[],Children=[],text="",href="") {
    let obj = document.createElement('a')
    obj.innerText = text 
    obj.href = href

    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewCard(classList_=[],Children=[],image="",name="", description="",id=0,auto_event = true,link=undefined){
    // let dropdown = NewButton(['btn','btn-info','dropdown-toggle'],[],undefined,"Description")
    // dropdown.setAttribute('data-toggle',"dropdown")

    let obj = NewDiv(['card','Manga_Block','m-2','border-primary'],[
        NewImg(['card-img-top','imgsize',"mt-1"],[],image),
        NewDiv(['card-body'],[
            NewH5(['card-title',"dinamic_font"],[],name)
        ]),
        // dropdown,
        // NewDiv([],[
        //     NewSpan(description,['dropdown-item'],[])
        // ])
    ])
    if(auto_event)
        obj.setAttribute('onclick',`AddAnime(event,${id})`)
    // obj.addEventListener('click',AddAnime)

    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

function NewCardResult(classList_=[],Children=[],image="",name="", result=0,link="") {
    let obj = NewDiv(['card','Manga_Block','mt-1','border-primary'],[
        NewImg(['card-img-top','imgsize',"mt-1"],[],image),
        NewDiv(['card-body'],[
            NewH5(['card-title',"dinamic_font"],[],name),
            NewH5(["dinamic_font"],[],"Pontuação:"+result),
            NewA([],[],"Ir para a página",link)
        ]),
    ])
    AppChildren(obj,Children)
    AppClass(obj,classList_)
    return obj
}

var Vars = {
    "Mangas" : [],
    "SelectedMangas": [],
    "Status": undefined,
    "config_Page" : {
        Max_in_Page : 90,
    },
    "linktomanga":(link) => {
        for(let i=0;i<Vars.Mangas.length;i++) {
            if (Vars.Mangas[i].link==link) {
                return Vars.Mangas[i]
            }
        }
        return null
    }
}

function AddAnime(event,id) {
    let pai = event.target
    if(pai.nodeName=="H5") {
        pai = pai.parentNode.parentNode
    }else
    pai = pai.parentNode
    if(pai.classList.contains("Mangas"))
        return
    let h5 = NewH5([],[],"ADICIONADO!")
    h5.style.color = "red"
    pai.appendChild(h5)
    pai.classList.add("bg-light")
    pai.classList.add("isSelected")
    if(Vars.SelectedMangas.indexOf(id)==-1)
        Vars.SelectedMangas.push(id)
    setCookie("MangaAnalizer",JSON.stringify(Vars.SelectedMangas),30)
    RenderSelected()
}

function find(name="") {
    let positions = []
    let found = false
    name = name.replace("/manga/","/pagina-manga/")
    for(let i=0;i<Vars.Mangas.length;i++) {
        if (Vars.Mangas[i].name.toLowerCase().indexOf(`${name.toLowerCase()}`) >= 0) {
            positions.push(i)
            found=true
            if(positions.length > Vars.config_Page.Max_in_Page)
                break
        }
        if(Vars.Mangas[i].link==name) {
            positions.push(i)
            found = true
        }
    }

    if(!found && (name.search("https://")>=0 || name.search("http://")>=0)) {
        if(name.search("unionmangas.top")>=0){
            alert("O link será processado pelo servidor")
            $.ajax({
                type: 'POST',
                url: '/proclink',
                data: JSON.stringify({link:name}),
                success: function(json) { 
                    Vars.Status = "OK"
                    Vars.Mangas.push(json[0])
                    Render([Vars.Mangas.length-1])
                },
                contentType: "application/json",
                dataType: 'json'
            });
        }else{
            alert("Opa Patraum encontramos um equivoco, o Link Precisa ser da unionmangas, https://unionmangas.top/")
        }
    }
    Render(positions)
}

let find_field = document.querySelector('.find_field')
function find_text_change() {
    find(find_field.value)
}

function getDegfaultVector() {
    let positions = []
    let init = Math.floor(Math.random()*(Vars.Mangas.length-Vars.config_Page.Max_in_Page))
    if(init<0) {
        init = 0
    }
    let max = init+Vars.config_Page.Max_in_Page;
    for(let i=init;i<max;i++) {
        positions.push(i)
    }
    return positions
}
function Render(list=getDegfaultVector()) {
    let MangasList = document.querySelector('.Mangas')
    MangasList.innerHTML=""
    for(let i of list) {
        let card = NewCard(["col-10","col-sm-5","col-md-5","col-lg-3"],[],Vars.Mangas[i].img,Vars.Mangas[i].name,Vars.Mangas[i].description,i)
        if(Vars.SelectedMangas.indexOf(i)>=0){
            card.classList.add("isSelected")
            card.classList.add("bg-light")
            let h5 = NewH5([],[],"ADICIONADO!")
            h5.style.color = "red"
            card.appendChild(h5)
        }
        MangasList.appendChild(card)
    }
}

function deleteSelectManga(event,id) {
    let newVet = []
    for (let i of Vars.SelectedMangas) {
        if(i!=id) {
            newVet.push(i)
        }
    }
    Vars.SelectedMangas = newVet
    setCookie("MangaAnalizer",JSON.stringify(Vars.SelectedMangas),30)
    RenderSelected()
}

function RenderSelected() {
    let SelectedView = document.querySelector('.Selected')
    SelectedView.innerHTML=""
    for(let i of Vars.SelectedMangas) {
        let card = NewCard(["col-10","col-sm-5","col-md-3","col-lg-2"],[],Vars.Mangas[i].img,Vars.Mangas[i].name,Vars.Mangas[i].description,i,false)
        card.setAttribute('data-id',i+"")
        card.addEventListener('click',deleteSelectManga.bind(null,event,i))
        SelectedView.appendChild(card)
    }
}

function Analize() {
    let links = []
    for(let i of Vars.SelectedMangas) {
        links.push(Vars.Mangas[i].link)
    }
    $.ajax({
        type: 'POST',
        url: '/analize',
        data: JSON.stringify({links:links}),
        success: function(json) { 
            $('#resultModal').modal('show')
            let Results = document.querySelector(".ResultsView")
            Results.innerHTML=""
            var chartData = []

            for(let i in json.MyTags) {
                chartData.push({
                    "x":i,
                    "value":`${json.MyTags[i]}`,
                })
            }

            var JsonChart = {
                "chart": {
                    "type": "pie",
                    "data": chartData,
                    "container": "Graphic"
                }
            }
			document.querySelector("#Graphic").innerHTML=""
            var chart = anychart.fromJson(JsonChart);
            chart.draw();

            for(let i of json.mangas.reverse()){
                let manga = Vars.linktomanga(i.link)
                Results.appendChild(NewCardResult(["col-10","col-sm-5","col-md-5","col-lg-3","m-3"],[],manga.img,manga.name,i.pontuation,manga.link))
            }
        },
        contentType: "application/json",
        dataType: 'json'
    });
}

window.onload = function(){
    $.getJSON("/getList", function( json ) {
        Vars.Status = "OK"
        Vars.Mangas = json
        document.querySelector('.addMangas').removeAttribute('disabled')
        let SelectedMangas = getCookie("MangaAnalizer")
        if(SelectedMangas==null){
            setCookie("MangaAnalizer",JSON.stringify(Vars.SelectedMangas),30)
            SelectedMangas = getCookie("MangaAnalizer")
        }
        Vars.SelectedMangas = JSON.parse(SelectedMangas)
        RenderSelected()
    });
}