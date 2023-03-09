document.querySelector(".delete").addEventListener("dblclick", deleteParticipants)

let participants

function showInput(event) {
    document.querySelector(".list li:last-child").textContent = event.target.value
}

function buildList (participants) {
    const fragment = new DocumentFragment
    for (participant of participants) {
        const li = document.createElement("li")
        li.textContent = participant
        fragment.appendChild(li)
    }
    document.querySelector(".list").appendChild(fragment)
    createInput()
}

async function getParticipants() {
    const response = await fetch("http://127.0.0.1:8000", {
        method: "POST", 
        body: JSON.stringify({function: "getParticipants"})
    })
    participants = await response.json()
    buildList(participants)
}

getParticipants()

async function addParticipant() {
    const input = document.querySelector("input").value
    document.querySelector(".input").remove()
    const li = document.createElement("li")
    li.textContent = input
    document.querySelector(".list").appendChild(li)
    createInput()  
    await fetch("http://127.0.0.1:8000", {
        method: "POST", 
        body: JSON.stringify({function: "addParticipant", name: `${input}`})
    })  
}

async function deleteParticipants() {
    document.querySelector(".list").textContent = ""
    createInput()
    await fetch("http://127.0.0.1:8000", {
        method: "POST",
        body: JSON.stringify({function: "deleteParticipants"})
    })
}

function createInput() {
    const newinput = document.createElement("input")
    newinput.setAttribute("class", "input")
    newinput.setAttribute("placeholder", "e.g. Stein en Hugo")
    document.querySelector(".list").appendChild(newinput)
    setTimeout(() => newinput.classList.add("appeared"), 10)
    document.querySelector(".input").addEventListener("change", addParticipant)
    document.querySelector(".input").addEventListener("change", rotateLogo)
}

function rotateLogo() {
    document.querySelector(".site-name").classList.add("rotate")
    setTimeout(() => document.querySelector(".site-name").classList.remove("rotate"), 1000)
}